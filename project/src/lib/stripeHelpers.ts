import { supabase } from './supabase';

// Function to create a subscription without payment (for free trials)
export const createFreeTrialSubscription = async (userId: string, planId: string, trialDays: number) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('User not authenticated');
    }
    
    // Check if user already has a subscription
    const { data: existingSubscription } = await supabase
      .from('subscriptions')
      .select('id')
      .eq('user_id', userId)
      .in('status', ['active', 'trialing'])
      .single();
      
    if (existingSubscription) {
      throw new Error('User already has an active subscription');
    }
    
    // Get plan details
    const { data: plan } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('id', planId)
      .single();
      
    if (!plan) {
      throw new Error('Subscription plan not found');
    }
    
    // Calculate trial period dates
    const now = new Date();
    const trialEnd = new Date(now.getTime() + trialDays * 24 * 60 * 60 * 1000);
    
    // Create serverless function to handle free trial creation in Stripe
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-free-trial`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`
      },
      body: JSON.stringify({
        userId,
        planId,
        trialDays
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create free trial');
    }
    
    const { subscriptionId, customerId } = await response.json();
    
    // Create subscription record
    await supabase
      .from('subscriptions')
      .insert({
        user_id: userId,
        plan_id: planId,
        stripe_subscription_id: subscriptionId,
        stripe_customer_id: customerId,
        status: 'trialing',
        current_period_start: now.toISOString(),
        current_period_end: trialEnd.toISOString(),
        cancel_at_period_end: false,
        trial_start: now.toISOString(),
        trial_end: trialEnd.toISOString()
      });
    
    // Update user premium status
    await supabase
      .from('users')
      .update({ is_premium: true })
      .eq('id', userId);
      
    return { 
      success: true, 
      trialEnd: trialEnd.toISOString(),
      subscriptionId
    };
  } catch (error: any) {
    console.error('Error creating free trial:', error);
    return { success: false, error: error.message || 'Unknown error occurred' };
  }
};

// Function to get all available subscription plans
export const getSubscriptionPlans = async (interval: 'month' | 'year' = 'month') => {
  try {
    const { data, error } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('interval', interval)
      .order('price', { ascending: true });
      
    if (error) throw error;
    
    return { success: true, plans: data };
  } catch (error: any) {
    console.error('Error getting subscription plans:', error);
    return { success: false, plans: [], error: error.message || 'Unknown error occurred' };
  }
};

// Function to cancel a subscription
export const cancelSubscription = async (userId: string, cancelImmediately = false) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('User not authenticated');
    }
    
    const { data: subscriptionData, error: subError } = await supabase
      .from('subscriptions')
      .select('id, stripe_subscription_id')
      .eq('user_id', userId)
      .in('status', ['active', 'trialing'])
      .single();
    
    if (subError || !subscriptionData) {
      throw new Error('No active subscription found');
    }
    
    // Call Stripe API through serverless function to cancel subscription
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/cancel-subscription`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`
      },
      body: JSON.stringify({
        subscriptionId: subscriptionData.stripe_subscription_id,
        cancelImmediately
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to cancel subscription');
    }
    
    // Update subscription status in database
    await supabase
      .from('subscriptions')
      .update({ 
        status: cancelImmediately ? 'canceled' : 'cancelling',
        cancel_at_period_end: !cancelImmediately
      })
      .eq('id', subscriptionData.id);
    
    // If cancelling immediately, update user premium status
    if (cancelImmediately) {
      await supabase
        .from('users')
        .update({ is_premium: false })
        .eq('id', userId);
    }
    
    return { success: true };
  } catch (error: any) {
    console.error('Error cancelling subscription:', error);
    return { success: false, error: error.message || 'Unknown error occurred' };
  }
};

// Function to update a subscription (change plan)
export const updateSubscription = async (userId: string, newPlanId: string) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('User not authenticated');
    }
    
    // Get current subscription
    const { data: subscriptionData, error: subError } = await supabase
      .from('subscriptions')
      .select('id, stripe_subscription_id')
      .eq('user_id', userId)
      .in('status', ['active', 'trialing'])
      .single();
    
    if (subError || !subscriptionData) {
      throw new Error('No active subscription found');
    }
    
    // Get new plan details
    const { data: planData, error: planError } = await supabase
      .from('subscription_plans')
      .select('stripe_price_id')
      .eq('id', newPlanId)
      .single();
    
    if (planError || !planData) {
      throw new Error('Subscription plan not found');
    }
    
    // Call Stripe API through serverless function to update subscription
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/update-subscription`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`
      },
      body: JSON.stringify({
        subscriptionId: subscriptionData.stripe_subscription_id,
        newPriceId: planData.stripe_price_id
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update subscription');
    }
    
    // Update subscription in database
    await supabase
      .from('subscriptions')
      .update({ plan_id: newPlanId })
      .eq('id', subscriptionData.id);
    
    return { success: true };
  } catch (error: any) {
    console.error('Error updating subscription:', error);
    return { success: false, error: error.message || 'Unknown error occurred' };
  }
};
