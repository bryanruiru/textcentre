import { supabase } from './lib/supabase';
import { Book, UserProfile, SubscriptionPlan } from './types';

// Base API URL for backend services
const API_URL = import.meta.env.VITE_API_URL || 'https://api.textcentre.com';

// User Profile API
export const getUserProfile = async (): Promise<{ user: UserProfile }> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not found');
    }
    
    const { data: profile, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();
      
    if (error) throw error;
    
    // Get user's reading stats
    const { data: stats, error: statsError } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', user.id)
      .single();
      
    if (statsError && statsError.code !== 'PGRST116') { // PGRST116 is 'not found'
      console.error('Error fetching user stats:', statsError);
    }
    
    // Get subscription details if user is premium
    let subscription = null;
    if (profile.is_premium) {
      const { data: sub, error: subError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();
        
      if (!subError) {
        subscription = sub;
      }
    }
    
    return {
      user: {
        ...profile,
        stats: stats || {
          totalBooks: 0,
          readingTime: 0,
          completedBooks: 0
        },
        subscription
      }
    };
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    throw error;
  }
};

export const updateUserProfile = async (updates: Partial<UserProfile>): Promise<{ user: UserProfile }> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Remove nested objects that should be updated separately
    const { stats, subscription, ...profileUpdates } = updates;
    
    const { data, error } = await supabase
      .from('users')
      .update(profileUpdates)
      .eq('id', user.id)
      .select()
      .single();
      
    if (error) throw error;
    
    return await getUserProfile();
  } catch (error) {
    console.error('Error in updateUserProfile:', error);
    throw error;
  }
};

// Premium Subscription API
export const getSubscriptionPlans = async (): Promise<SubscriptionPlan[]> => {
  try {
    const { data: plans, error } = await supabase
      .from('subscription_plans')
      .select('*')
      .order('price');
      
    if (error) throw error;
    
    return plans || [];
  } catch (error) {
    console.error('Error in getSubscriptionPlans:', error);
    throw error;
  }
};

export const createCheckoutSession = async (priceId: string): Promise<{ url: string }> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Create a checkout session with Stripe
    const response = await fetch(`${API_URL}/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await supabase.auth.getSession().then(res => res.data.session?.access_token)}`
      },
      body: JSON.stringify({
        priceId,
        userId: user.id,
        customerEmail: user.email,
        successUrl: `${window.location.origin}/payment/success`,
        cancelUrl: `${window.location.origin}/payment/cancel`
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create checkout session');
    }
    
    const session = await response.json();
    return { url: session.url };
  } catch (error) {
    console.error('Error in createCheckoutSession:', error);
    throw error;
  }
};

// This is a mock implementation for development
// In production, this would be handled by a webhook from Stripe
export const upgradeToPremium = async (): Promise<void> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Update user to premium
    const { error: userError } = await supabase
      .from('users')
      .update({ is_premium: true })
      .eq('id', user.id);
      
    if (userError) throw userError;
    
    // Create subscription record
    const now = new Date();
    const renewalDate = new Date();
    renewalDate.setFullYear(now.getFullYear() + 1); // 1 year subscription
    
    const { error: subError } = await supabase
      .from('subscriptions')
      .upsert({
        user_id: user.id,
        plan_id: 'premium-annual', // Default plan
        status: 'active',
        current_period_start: now.toISOString(),
        current_period_end: renewalDate.toISOString(),
        cancel_at_period_end: false
      });
      
    if (subError) throw subError;
  } catch (error) {
    console.error('Error in upgradeToPremium:', error);
    throw error;
  }
};

export const cancelSubscription = async (): Promise<void> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // In a real implementation, this would call Stripe to cancel the subscription
    // For now, we'll just mark it to cancel at period end
    
    const { error: subError } = await supabase
      .from('subscriptions')
      .update({ 
        cancel_at_period_end: true,
        status: 'cancelling'
      })
      .eq('user_id', user.id);
      
    if (subError) throw subError;
  } catch (error) {
    console.error('Error in cancelSubscription:', error);
    throw error;
  }
};

// Books API
export const getBooks = async (category?: string, limit = 20): Promise<Book[]> => {
  try {
    let query = supabase
      .from('books')
      .select('*')
      .limit(limit);
      
    if (category) {
      query = query.eq('category', category);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error in getBooks:', error);
    throw error;
  }
};

export const getBookById = async (id: string): Promise<Book> => {
  try {
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error in getBookById:', error);
    throw error;
  }
};

export const getUserBooks = async (): Promise<Book[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not found');
    }
    
    const { data, error } = await supabase
      .from('user_books')
      .select(`
        book_id,
        progress,
        is_favorite,
        last_read,
        books (*)
      `)
      .eq('user_id', user.id);
      
    if (error) throw error;
    
    // Transform the data to match the Book type
    return data.map((item: any) => ({
      ...item.books,
      progress: item.progress,
      isFavorite: item.is_favorite,
      lastRead: item.last_read
    }));
  } catch (error) {
    console.error('Error in getUserBooks:', error);
    throw error;
  }
};
