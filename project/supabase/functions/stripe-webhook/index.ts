import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.39.3';
import Stripe from 'npm:stripe@14.14.0';
import { handleSubscriptionUpdated, handleSubscriptionDeleted, handleTrialWillEnd } from './subscription-handlers.ts';

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
    const signature = req.headers.get('stripe-signature');
    if (!signature) {
      return new Response('No signature', { status: 400 });
    }

    const body = await req.text();
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        webhookSecret!
      );
    } catch (err) {
      return new Response(`Webhook Error: ${err.message}`, { status: 400 });
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = session.metadata?.userId;
        const bookId = session.metadata?.bookId;
        const planId = session.metadata?.planId;
        const interval = session.metadata?.interval;

        if (bookId) {
          // Handle book purchase
          await supabase.from('payments').insert({
            user_id: userId,
            book_id: bookId,
            amount: session.amount_total! / 100,
            currency: session.currency,
            stripe_payment_id: session.payment_intent,
            status: 'completed'
          });

          await supabase.from('user_books').insert({
            user_id: userId,
            book_id: bookId,
          });
        } else if (session.mode === 'subscription') {
          // Get subscription details from Stripe
          const subscription = await stripe.subscriptions.retrieve(session.subscription);
          
          // Calculate period dates
          const periodStart = new Date(subscription.current_period_start * 1000).toISOString();
          const periodEnd = new Date(subscription.current_period_end * 1000).toISOString();
          
          // Calculate trial information
          const trialStart = subscription.trial_start 
            ? new Date(subscription.trial_start * 1000).toISOString() 
            : null;
          const trialEnd = subscription.trial_end 
            ? new Date(subscription.trial_end * 1000).toISOString() 
            : null;
          
          // Update user premium status
          await supabase
            .from('users')
            .update({ 
              is_premium: true,
              stripe_customer_id: subscription.customer
            })
            .eq('id', userId);

          // Record subscription in database
          await supabase
            .from('subscriptions')
            .insert({
              user_id: userId,
              plan_id: planId,
              stripe_subscription_id: subscription.id,
              stripe_customer_id: subscription.customer,
              status: subscription.status,
              current_period_start: periodStart,
              current_period_end: periodEnd,
              cancel_at_period_end: subscription.cancel_at_period_end,
              trial_start: trialStart,
              trial_end: trialEnd,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });
          
          // If this was a referral signup, complete the referral
          const { data: userData } = await supabase
            .from('users')
            .select('referred_by')
            .eq('id', userId)
            .single();
            
          if (userData?.referred_by) {
            // Update referral status
            await supabase
              .from('referrals')
              .update({ 
                status: 'completed',
                reward_given: true,
                updated_at: new Date().toISOString()
              })
              .eq('referrer_id', userData.referred_by)
              .eq('referred_id', userId);
          }
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        await supabase.from('subscriptions')
          .update({
            status: subscription.status,
            current_period_start: new Date(subscription.current_period_start * 1000),
            current_period_end: new Date(subscription.current_period_end * 1000),
            cancel_at_period_end: subscription.cancel_at_period_end
          })
          .eq('stripe_subscription_id', subscription.id);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const { data: subscriptionData } = await supabase
          .from('subscriptions')
          .select('user_id')
          .eq('stripe_subscription_id', subscription.id)
          .single();

        if (subscriptionData) {
          await supabase.from('users')
            .update({ is_premium: false })
            .eq('id', subscriptionData.user_id);

          await supabase.from('subscriptions')
            .update({ status: 'cancelled' })
            .eq('stripe_subscription_id', subscription.id);
        }
        break;
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});