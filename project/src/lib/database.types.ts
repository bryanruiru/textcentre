export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string
          avatar_url: string | null
          is_premium: boolean
          created_at: string
          updated_at: string
          stripe_customer_id: string | null
          usage_this_month: {
            books_read: number
            books_limit: number
            previews_viewed: number
            previews_limit: number
            ai_queries_used: number
            ai_queries_limit: number
            last_reset_date: string
          } | null
          referral_code: string | null
          referral_count: number
          referred_by: string | null
        }
        Insert: {
          id: string
          email: string
          full_name: string
          avatar_url?: string | null
          is_premium?: boolean
          created_at?: string
          updated_at?: string
          stripe_customer_id?: string | null
          usage_this_month?: {
            books_read: number
            books_limit: number
            previews_viewed: number
            previews_limit: number
            ai_queries_used: number
            ai_queries_limit: number
            last_reset_date: string
          } | null
          referral_code?: string | null
          referral_count?: number
          referred_by?: string | null
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          avatar_url?: string | null
          is_premium?: boolean
          created_at?: string
          updated_at?: string
          stripe_customer_id?: string | null
          usage_this_month?: {
            books_read: number
            books_limit: number
            previews_viewed: number
            previews_limit: number
            ai_queries_used: number
            ai_queries_limit: number
            last_reset_date: string
          } | null
          referral_code?: string | null
          referral_count?: number
          referred_by?: string | null
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          plan_id: string
          status: 'active' | 'trialing' | 'past_due' | 'canceled' | 'cancelling'
          current_period_start: string
          current_period_end: string
          cancel_at_period_end: boolean
          trial_end: string | null
          trial_start: string | null
          created_at: string
          updated_at: string
          stripe_subscription_id: string
          stripe_customer_id: string
        }
        Insert: {
          id?: string
          user_id: string
          plan_id: string
          status: 'active' | 'trialing' | 'past_due' | 'canceled' | 'cancelling'
          current_period_start: string
          current_period_end: string
          cancel_at_period_end?: boolean
          trial_end?: string | null
          trial_start?: string | null
          created_at?: string
          updated_at?: string
          stripe_subscription_id: string
          stripe_customer_id: string
        }
        Update: {
          id?: string
          user_id?: string
          plan_id?: string
          status?: 'active' | 'trialing' | 'past_due' | 'canceled' | 'cancelling'
          current_period_start?: string
          current_period_end?: string
          cancel_at_period_end?: boolean
          trial_end?: string | null
          trial_start?: string | null
          created_at?: string
          updated_at?: string
          stripe_subscription_id?: string
          stripe_customer_id?: string
        }
      }
      subscription_plans: {
        Row: {
          id: string
          name: string
          description: string
          price: number
          interval: 'month' | 'year'
          features: string[]
          is_popular: boolean
          stripe_price_id: string
          trial_days: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          price: number
          interval: 'month' | 'year'
          features: string[]
          is_popular?: boolean
          stripe_price_id: string
          trial_days?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          price?: number
          interval?: 'month' | 'year'
          features?: string[]
          is_popular?: boolean
          stripe_price_id?: string
          trial_days?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      user_books: {
        Row: {
          id: string
          user_id: string
          book_id: string
          progress: number
          last_read: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          book_id: string
          progress?: number
          last_read?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          book_id?: string
          progress?: number
          last_read?: string
          created_at?: string
          updated_at?: string
        }
      }
      referrals: {
        Row: {
          id: string
          referrer_id: string
          referred_id: string
          status: 'pending' | 'completed'
          reward_given: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          referrer_id: string
          referred_id: string
          status?: 'pending' | 'completed'
          reward_given?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          referrer_id?: string
          referred_id?: string
          status?: 'pending' | 'completed'
          reward_given?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      chat_history: {
        Row: {
          id: string
          user_id: string
          content: string
          role: 'user' | 'assistant'
          timestamp: string
        }
        Insert: {
          id?: string
          user_id: string
          content: string
          role: 'user' | 'assistant'
          timestamp?: string
        }
        Update: {
          id?: string
          user_id?: string
          content?: string
          role?: 'user' | 'assistant'
          timestamp?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
  }
}
