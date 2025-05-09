# TextCentre Freemium Model Deployment Guide

This guide will help you deploy the Supabase Edge Functions and set up the necessary environment variables for the TextCentre freemium model.

## Prerequisites

1. Install the Supabase CLI if you haven't already:
   ```bash
   npm install -g supabase
   ```

2. Log in to your Supabase account:
   ```bash
   supabase login
   ```

3. Link your project:
   ```bash
   supabase link --project-ref your-project-ref
   ```
   Replace `your-project-ref` with your Supabase project reference ID.

## Deploy Edge Functions

Navigate to your project directory and deploy the Edge Functions:

```bash
cd project
supabase functions deploy create-checkout
supabase functions deploy create-free-trial
supabase functions deploy cancel-subscription
supabase functions deploy update-subscription
supabase functions deploy stripe-webhook
```

## Set Environment Variables

Set the required environment variables for your Edge Functions:

```bash
supabase secrets set STRIPE_SECRET_KEY=your_stripe_secret_key
supabase secrets set STRIPE_PREMIUM_MONTHLY_PRICE_ID=your_stripe_monthly_price_id
supabase secrets set STRIPE_PREMIUM_ANNUAL_PRICE_ID=your_stripe_annual_price_id
supabase secrets set STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

## Configure Stripe Webhooks

1. Go to your Stripe Dashboard > Developers > Webhooks
2. Add a new endpoint with the URL: `https://<your-project-ref>.supabase.co/functions/v1/stripe-webhook`
3. Add the following events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.paid`
   - `invoice.payment_failed`

## Create Subscription Plans

Add your subscription plans to the `subscription_plans` table in Supabase:

1. Go to your Supabase Dashboard > Table Editor
2. Select the `subscription_plans` table
3. Add the following records:

| id | name | description | price_monthly | price_annual | stripe_price_id_monthly | stripe_price_id_annual | features | active |
|----|------|-------------|--------------|-------------|------------------------|----------------------|----------|--------|
| 1 | Premium | Full access to TextCentre | 999 | 9990 | your_stripe_monthly_price_id | your_stripe_annual_price_id | ["unlimited_books", "premium_books", "audiobooks", "ai_features", "offline_reading"] | true |

## Test the Freemium Flow

1. Sign up as a new user
2. Verify that the free tier limitations are applied
3. Try upgrading to Premium
4. Verify that the trial period is applied correctly
5. Test the subscription management features

## Responsive Design Updates

We've enhanced the following components for better mobile responsiveness:

1. UsageLimits component
2. ReferralProgram component
3. PricingPage component

These improvements ensure a better experience on mobile devices with:
- Flexible layouts that adapt to different screen sizes
- Improved touch targets for better usability
- Optimized spacing and typography for smaller screens
- Responsive navigation and UI elements

## Next Steps

1. Monitor subscription events in Stripe Dashboard
2. Set up email notifications for subscription events
3. Implement additional premium features as needed
4. Consider adding more subscription tiers in the future
