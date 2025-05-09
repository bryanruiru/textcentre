import express from 'express';
import Stripe from 'stripe';
import pool from '../db';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create checkout session
router.post('/create-checkout-session', async (req, res) => {
  try {
    const { type, userId, planId, successUrl, cancelUrl } = req.body;

    // 1. Validate user
    const user = await pool.query('SELECT id FROM users WHERE id = $1', [userId]);
    if (!user.rows.length) {
      return res.status(400).json({ error: 'User not found' });
    }

    // 2. Get plan details
    const plan = await pool.query(
      'SELECT stripe_price_id FROM subscription_plans WHERE id = $1', 
      [planId]
    );
    
    if (!plan.rows.length) {
      return res.status(400).json({ error: 'Plan not found' });
    }

    // 3. Create Stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price: plan.rows[0].stripe_price_id,
        quantity: 1,
      }],
      mode: 'subscription',
      success_url: successUrl.replace('{CHECKOUT_SESSION_ID}', '{CHECKOUT_SESSION_ID}'),
      cancel_url: cancelUrl,
      client_reference_id: userId,
      metadata: {
        plan_id: planId,
        user_id: userId,
        type: type
      }
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    console.error('Checkout session error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
