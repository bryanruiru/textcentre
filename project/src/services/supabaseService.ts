import { supabase } from '../lib/supabase';
import { UserUsage } from '../types';

// Helper to convert between snake_case DB fields and camelCase frontend types
const mapDbToUserUsage = (dbUsage: any): UserUsage => ({
  booksRead: dbUsage.books_read || 0,
  booksLimit: dbUsage.books_limit || 5,
  previewsViewed: dbUsage.previews_viewed || 0,
  previewsLimit: dbUsage.previews_limit || 10,
  aiQueriesUsed: dbUsage.ai_queries_used || 0,
  aiQueriesLimit: dbUsage.ai_queries_limit || 5,
  lastResetDate: dbUsage.last_reset_date || new Date().toISOString()
});

const mapUserUsageToDb = (usage: UserUsage) => ({
  books_read: usage.booksRead,
  books_limit: usage.booksLimit,
  previews_viewed: usage.previewsViewed,
  previews_limit: usage.previewsLimit,
  ai_queries_used: usage.aiQueriesUsed,
  ai_queries_limit: usage.aiQueriesLimit,
  last_reset_date: usage.lastResetDate
});

// User usage tracking
export const getUserUsage = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('usage_this_month')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    
    return data?.usage_this_month ? mapDbToUserUsage(data.usage_this_month) : null;
  } catch (error) {
    console.error('Error getting user usage:', error);
    return null;
  }
};

export const incrementUsage = async (
  userId: string, 
  type: 'booksRead' | 'previewsViewed' | 'aiQueriesUsed'
) => {
  try {
    // First get current usage
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('usage_this_month')
      .eq('id', userId)
      .single();
    
    if (userError) throw userError;
    
    // Initialize default usage if not exists
    const defaultDbUsage = {
      books_read: 0,
      books_limit: 5,
      previews_viewed: 0,
      previews_limit: 10,
      ai_queries_used: 0,
      ai_queries_limit: 5,
      last_reset_date: new Date().toISOString()
    };
    
    const currentDbUsage = userData?.usage_this_month || defaultDbUsage;
    
    // Map to our frontend type
    const currentUsage = mapDbToUserUsage(currentDbUsage);
    
    // Increment the specified counter
    const updatedUsage = {
      ...currentUsage,
      [type]: (currentUsage[type] || 0) + 1
    };
    
    // Map back to DB format
    const updatedDbUsage = mapUserUsageToDb(updatedUsage);
    
    // Update in database
    const { error: updateError } = await supabase
      .from('users')
      .update({ usage_this_month: updatedDbUsage })
      .eq('id', userId);
    
    if (updateError) throw updateError;
    
    return updatedUsage;
  } catch (error) {
    console.error(`Error incrementing ${type}:`, error);
    return null;
  }
};

export const checkUsageLimits = async (
  userId: string, 
  type: 'booksRead' | 'previewsViewed' | 'aiQueriesUsed'
) => {
  try {
    const usage = await getUserUsage(userId);
    if (!usage) return true; // Allow if we can't check
    
    // Map the type to its corresponding limit field
    const limitMap = {
      booksRead: 'booksLimit',
      previewsViewed: 'previewsLimit',
      aiQueriesUsed: 'aiQueriesLimit'
    };
    
    const limitField = limitMap[type] as keyof UserUsage;
    // Convert both to numbers to ensure proper comparison
    const currentUsage = Number(usage[type]);
    const usageLimit = Number(usage[limitField]);
    return currentUsage < usageLimit;
  } catch (error) {
    console.error('Error checking usage limits:', error);
    return true; // Allow if we can't check
  }
};

export const resetMonthlyUsage = async (userId: string) => {
  try {
    // Get current usage to preserve limits
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('usage_this_month')
      .eq('id', userId)
      .single();
    
    if (userError) throw userError;
    
    const currentDbUsage = userData?.usage_this_month || {
      books_limit: 5,
      previews_limit: 10,
      ai_queries_limit: 5
    };
    
    // Reset counters but keep limits
    const resetDbUsage = {
      books_read: 0,
      books_limit: currentDbUsage.books_limit,
      previews_viewed: 0,
      previews_limit: currentDbUsage.previews_limit,
      ai_queries_used: 0,
      ai_queries_limit: currentDbUsage.ai_queries_limit,
      last_reset_date: new Date().toISOString()
    };
    
    // Update in database
    const { error: updateError } = await supabase
      .from('users')
      .update({ usage_this_month: resetDbUsage })
      .eq('id', userId);
    
    if (updateError) throw updateError;
    
    return mapDbToUserUsage(resetDbUsage);
  } catch (error) {
    console.error('Error resetting monthly usage:', error);
    return null;
  }
};

// Referral system
export const generateReferralCode = async (userId: string) => {
  try {
    // Get user info to create a personalized code
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('full_name')
      .eq('id', userId)
      .single();
    
    if (userError) throw userError;
    
    // Generate a unique code based on name and random numbers
    const name = userData?.full_name?.split(' ')[0] || 'friend';
    const randomPart = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const referralCode = `${name}${randomPart}`;
    
    // Save the code to user profile
    const { error: updateError } = await supabase
      .from('users')
      .update({ referral_code: referralCode })
      .eq('id', userId);
    
    if (updateError) throw updateError;
    
    return referralCode;
  } catch (error) {
    console.error('Error generating referral code:', error);
    return null;
  }
};

export const getReferralCode = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('referral_code')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    
    // If user doesn't have a code yet, generate one
    if (!data?.referral_code) {
      return generateReferralCode(userId);
    }
    
    return data.referral_code;
  } catch (error) {
    console.error('Error getting referral code:', error);
    return null;
  }
};

export const trackReferral = async (referralCode: string, newUserId: string) => {
  try {
    // Find the referrer by code
    const { data: referrerData, error: referrerError } = await supabase
      .from('users')
      .select('id, referral_count')
      .eq('referral_code', referralCode)
      .single();
    
    if (referrerError || !referrerData) return false;
    
    // Update the new user with referrer info
    const { error: updateUserError } = await supabase
      .from('users')
      .update({ referred_by: referrerData.id })
      .eq('id', newUserId);
    
    if (updateUserError) throw updateUserError;
    
    // Create a record in the referrals table
    const { error: createReferralError } = await supabase
      .from('referrals')
      .insert({
        referrer_id: referrerData.id,
        referred_id: newUserId,
        status: 'pending',
        reward_given: false
      });
    
    if (createReferralError) throw createReferralError;
    
    // Increment referral count for referrer
    const { error: updateReferrerError } = await supabase
      .from('users')
      .update({ 
        referral_count: (referrerData.referral_count || 0) + 1 
      })
      .eq('id', referrerData.id);
    
    if (updateReferrerError) throw updateReferrerError;
    
    return true;
  } catch (error) {
    console.error('Error tracking referral:', error);
    return false;
  }
};

export const completeReferral = async (referredUserId: string) => {
  try {
    // Find the referral record
    const { data: referralData, error: referralError } = await supabase
      .from('referrals')
      .select('id, referrer_id, status, reward_given')
      .eq('referred_id', referredUserId)
      .eq('status', 'pending')
      .single();
    
    if (referralError || !referralData) return false;
    
    // Update referral status to completed
    const { error: updateReferralError } = await supabase
      .from('referrals')
      .update({ 
        status: 'completed',
        reward_given: true
      })
      .eq('id', referralData.id);
    
    if (updateReferralError) throw updateReferralError;
    
    // Grant reward to referrer (e.g., extend subscription, add premium days)
    // This would depend on your reward strategy
    
    return true;
  } catch (error) {
    console.error('Error completing referral:', error);
    return false;
  }
};

// Subscription management
export const getUserSubscription = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select(`
        *,
        subscription_plans(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error getting user subscription:', error);
    return null;
  }
};

export const getSubscriptionPlans = async () => {
  try {
    const { data, error } = await supabase
      .from('subscription_plans')
      .select('*')
      .order('price', { ascending: true });
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error getting subscription plans:', error);
    return [];
  }
};

export const cancelSubscription = async (userId: string, cancelImmediately = false) => {
  try {
    const { data: subscriptionData, error: subError } = await supabase
      .from('subscriptions')
      .select('id, stripe_subscription_id')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();
    
    if (subError || !subscriptionData) return false;
    
    // This would typically call a serverless function to handle Stripe API call
    // For now, we'll just update the database
    const { error: updateError } = await supabase
      .from('subscriptions')
      .update({ 
        status: cancelImmediately ? 'canceled' : 'cancelling',
        cancel_at_period_end: !cancelImmediately
      })
      .eq('id', subscriptionData.id);
    
    if (updateError) throw updateError;
    
    // If cancelling immediately, update user premium status
    if (cancelImmediately) {
      const { error: userUpdateError } = await supabase
        .from('users')
        .update({ is_premium: false })
        .eq('id', userId);
      
      if (userUpdateError) throw userUpdateError;
    }
    
    return true;
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    return false;
  }
};
