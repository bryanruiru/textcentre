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

    const { sessionId } = await req.json();
    if (!sessionId) {
      throw new Error('Session ID is required');
    }

    // Retrieve and validate the session
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    // Verify session belongs to the authenticated user
    if (session.metadata?.userId !== user.id) {
      throw new Error('Invalid session');
    }

    // Check payment status
    const isValid = session.payment_status === 'paid';

    if (isValid) {
      // Update payment status in database
      const { error: updateError } = await supabase
        .from('payments')
        .update({ status: 'completed' })
        .eq('stripe_payment_id', session.payment_intent);

      if (updateError) {
        console.error('Payment update error:', updateError);
      }

      // If this was a subscription payment, update user's premium status
      if (session.metadata?.type === 'subscription') {
        const { error: userError } = await supabase
          .from('users')
          .update({ is_premium: true })
          .eq('id', user.id);

        if (userError) {
          console.error('User update error:', userError);
        }
      }
    }

    return new Response(
      JSON.stringify({ valid: isValid }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Validation error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: error.message === 'Unauthorized' ? 401 : 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});