import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.39.3';
import Stripe from 'npm:stripe@14.14.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
});

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') || '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const { userId, planId, trialDays } = await req.json();
    
    if (!userId || !planId || !trialDays) {
      throw new Error('Missing required parameters');
    }
    
    // Verify user matches authenticated user or is admin
    if (userId !== user.id && user.app_metadata?.role !== 'admin') {
      throw new Error('Unauthorized');
    }
    
    // Get user data
    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(userId);
    if (userError || !userData.user?.email) {
      throw new Error('User not found');
    }
    
    // Get plan details
    const { data: planData, error: planError } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('id', planId)
      .single();
      
    if (planError || !planData) {
      throw new Error('Subscription plan not found');
    }
    
    // Check if user already has an active subscription
    const { data: existingSubscription } = await supabase
      .from('subscriptions')
      .select('id')
      .eq('user_id', userId)
      .in('status', ['active', 'trialing'])
      .single();
      
    if (existingSubscription) {
      throw new Error('User already has an active subscription');
    }
    
    // Create or get Stripe customer
    let customerId;
    const { data: customerData } = await supabase
      .from('users')
      .select('stripe_customer_id')
      .eq('id', userId)
      .single();
      
    if (customerData?.stripe_customer_id) {
      customerId = customerData.stripe_customer_id;
    } else {
      // Create new customer
      const customer = await stripe.customers.create({
        email: userData.user.email,
        metadata: { userId }
      });
      
      customerId = customer.id;
      
      // Update user with customer ID
      await supabase
        .from('users')
        .update({ stripe_customer_id: customerId })
        .eq('id', userId);
    }
    
    // Create subscription with trial
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: planData.stripe_price_id }],
      trial_period_days: trialDays,
      metadata: { userId, planId }
    });
    
    return new Response(
      JSON.stringify({
        success: true,
        subscriptionId: subscription.id,
        customerId: customerId,
        trialEnd: subscription.trial_end
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
