-- Create subscription_plans table
CREATE TABLE IF NOT EXISTS subscription_plans (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  interval TEXT NOT NULL CHECK (interval IN ('month', 'year')),
  features JSONB NOT NULL DEFAULT '[]',
  is_popular BOOLEAN DEFAULT FALSE,
  stripe_price_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id TEXT NOT NULL REFERENCES subscription_plans(id),
  status TEXT NOT NULL CHECK (status IN ('active', 'trialing', 'past_due', 'canceled', 'cancelling')),
  current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  cancel_at_period_end BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  stripe_subscription_id TEXT,
  stripe_customer_id TEXT,
  UNIQUE(user_id)
);

-- Create user_stats table
CREATE TABLE IF NOT EXISTS user_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  total_books INTEGER NOT NULL DEFAULT 0,
  completed_books INTEGER NOT NULL DEFAULT 0,
  reading_time INTEGER NOT NULL DEFAULT 0, -- in minutes
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Insert default subscription plans
INSERT INTO subscription_plans (id, name, description, price, interval, features, is_popular)
VALUES
  ('premium-monthly', 'Premium Monthly', 'Full access to TextCentre with monthly billing', 9.99, 'month', 
   '["Unlimited access to all books", "Exclusive audiobooks", "AI-powered features", "Offline reading"]', FALSE),
  ('premium-annual', 'Premium Annual', 'Full access to TextCentre with annual billing (save 16%)', 99.99, 'year', 
   '["Unlimited access to all books", "Exclusive audiobooks", "AI-powered features", "Offline reading", "Priority support"]', TRUE);

-- Create RLS policies
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to subscription_plans" ON subscription_plans
  FOR SELECT USING (true);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow users to view their own subscriptions" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow users to view their own stats" ON user_stats
  FOR SELECT USING (auth.uid() = user_id);

-- Create function to update user premium status when subscription changes
CREATE OR REPLACE FUNCTION update_user_premium_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status IN ('active', 'trialing') THEN
    UPDATE public.users SET is_premium = TRUE WHERE id = NEW.user_id;
  ELSE
    UPDATE public.users SET is_premium = FALSE WHERE id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update user premium status
CREATE TRIGGER update_user_premium_status_trigger
AFTER INSERT OR UPDATE ON subscriptions
FOR EACH ROW
EXECUTE FUNCTION update_user_premium_status();
