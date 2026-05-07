-- プロンプトシェア マネタイズ対応マイグレーション
-- Supabase Dashboard > SQL Editor で実行してください

-- 1. profiles テーブルにプレミアム関連列を追加
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS is_premium boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS premium_until timestamptz,
  ADD COLUMN IF NOT EXISTS stripe_customer_id text;

-- 2. subscriptions テーブルを作成
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

-- 3. RLS設定
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Users can view own subscriptions"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- 4. サービスロールはすべての操作を許可（Webhookで使用）
CREATE POLICY IF NOT EXISTS "Service role full access on subscriptions"
  ON subscriptions FOR ALL
  USING (true);
