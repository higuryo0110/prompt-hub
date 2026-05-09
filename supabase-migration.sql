-- プロンプトシェア マネタイズ対応マイグレーション
-- Supabase Dashboard > SQL Editor で実行してください

-- ① profiles テーブルにプレミアム・売上管理列を追加
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS is_premium boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS premium_until timestamptz,
  ADD COLUMN IF NOT EXISTS stripe_customer_id text,
  ADD COLUMN IF NOT EXISTS total_earnings integer DEFAULT 0;

-- ② subscriptions テーブル（月額サブスクリプション管理）
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  stripe_subscription_id text NOT NULL UNIQUE,
  stripe_customer_id text NOT NULL,
  status text NOT NULL,
  price_id text,
  current_period_end timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Users can view own subscriptions"
  ON subscriptions FOR SELECT USING (auth.uid() = user_id);

-- ③ prompts テーブルに price 列を追加（有料プロンプト販売）
ALTER TABLE prompts
  ADD COLUMN IF NOT EXISTS price integer;

-- ④ prompt_purchases テーブル（有料プロンプト購入履歴）
CREATE TABLE IF NOT EXISTS prompt_purchases (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  prompt_id uuid REFERENCES prompts(id) ON DELETE CASCADE NOT NULL,
  buyer_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  seller_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  amount integer NOT NULL,
  platform_fee integer NOT NULL,
  creator_earning integer NOT NULL,
  stripe_session_id text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(prompt_id, buyer_id)
);
ALTER TABLE prompt_purchases ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Users can view own purchases"
  ON prompt_purchases FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

-- ⑤ affiliate_clicks テーブル（アフィリエイトクリック計測）
CREATE TABLE IF NOT EXISTS affiliate_clicks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  affiliate_id text NOT NULL,
  ref text,
  user_agent text,
  clicked_at timestamptz DEFAULT now()
);
ALTER TABLE affiliate_clicks ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Allow insert for all"
  ON affiliate_clicks FOR INSERT WITH CHECK (true);

-- ⑥ newsletter_subscribers テーブル（メルマガ登録）
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL UNIQUE,
  subscribed_at timestamptz DEFAULT now(),
  is_active boolean DEFAULT true
);
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Allow insert for all"
  ON newsletter_subscribers FOR INSERT WITH CHECK (true);

-- ⑦ クリエイター売上加算用のRPC関数
CREATE OR REPLACE FUNCTION add_creator_earning(user_id uuid, amount integer)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE profiles SET total_earnings = COALESCE(total_earnings, 0) + amount WHERE id = user_id;
END;
$$;
