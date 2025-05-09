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
    const { userId, bookId, type } = await req.json();

    if (!userId) {
      throw new Error('User ID is required');
    }

    let session;

    if (type === 'subscription') {
      const { planId, interval = 'month', trialDays, successUrl, cancelUrl } = await req.json();
      
      // Get user email
      const { data: userData, error: userError } = await supabase.auth.admin.getUserById(userId);
      if (userError || !userData.user?.email) {
        throw new Error('User not found');
      }
      
      // Get price ID from subscription plan
      let priceId;
      if (planId) {
        const { data: planData, error: planError } = await supabase
          .from('subscription_plans')
          .select('stripe_price_id')
          .eq('id', planId)
          .eq('interval', interval)
          .single();
          
        if (planError || !planData) {
          throw new Error('Subscription plan not found');
        }
        
        priceId = planData.stripe_price_id;
      } else {
        // Fallback to default price ID if no plan specified
        priceId = interval === 'month' 
          ? Deno.env.get('STRIPE_PREMIUM_MONTHLY_PRICE_ID')
          : Deno.env.get('STRIPE_PREMIUM_ANNUAL_PRICE_ID');
      }
      
      // Create checkout session options
      const sessionOptions: any = {
        payment_method_types: ['card'],
        mode: 'subscription',
        customer_email: userData.user.email,
        metadata: { userId, planId, interval },
        line_items: [{
          price: priceId,
          quantity: 1,
        }],
        success_url: successUrl || `${req.headers.get('origin')}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: cancelUrl || `${req.headers.get('origin')}/payment/cancel`,
      };
      
      // Add trial period if specified
      if (trialDays && trialDays > 0) {
        sessionOptions.subscription_data = {
          trial_period_days: trialDays
        };
      }
      
      // Create subscription checkout
      session = await stripe.checkout.sessions.create(sessionOptions);
    } else if (type === 'book' && bookId) {
      // Get book details
      const { data: book } = await supabase
        .from('books')
        .select('title, price')
        .eq('id', bookId)
        .single();

      if (!book) {
        throw new Error('Book not found');
      }

      // Create one-time payment checkout
      session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        customer_email: (await supabase.auth.admin.getUserById(userId)).data.user?.email,
        metadata: { userId, bookId },
        line_items: [{
          price_data: {
            currency: 'usd',
            product_data: {
              name: book.title,
            },
            unit_amount: Math.round(book.price * 100),
          },
          quantity: 1,
        }],
        success_url: `${req.headers.get('origin')}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.get('origin')}/payment/cancel`,
      });
    } else {
      throw new Error('Invalid checkout type');
    }

    return new Response(JSON.stringify({ sessionId: session.id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});