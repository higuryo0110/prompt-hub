-- ============================================================
-- PromptHub スキーマ定義
-- Supabase SQL Editor でこのファイルを実行してください
-- ============================================================

-- プロファイル（auth.usersと紐付け）
CREATE TABLE profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username    TEXT UNIQUE NOT NULL,
  avatar_url  TEXT,
  bio         TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- ジャンルマスタ
CREATE TABLE genres (
  id    SERIAL PRIMARY KEY,
  slug  TEXT UNIQUE NOT NULL,
  name  TEXT NOT NULL,
  icon  TEXT,
  color TEXT
);

-- ジャンル初期データ
INSERT INTO genres (slug, name, icon, color) VALUES
  ('business',  '業務委託',     'Briefcase',    'text-blue-400'),
  ('app-dev',   'アプリ制作',   'Code2',        'text-violet-400'),
  ('image-gen', '画像生成',     'ImageIcon',    'text-pink-400'),
  ('writing',   'ライティング', 'PenLine',      'text-emerald-400'),
  ('marketing', 'マーケティング','TrendingUp',  'text-orange-400'),
  ('analysis',  'データ分析',   'BarChart3',    'text-cyan-400'),
  ('education', '教育・学習',   'GraduationCap','text-yellow-400'),
  ('other',     'その他',       'Sparkles',     'text-slate-400');

-- プロンプト本体
CREATE TABLE prompts (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  genre_id     INTEGER NOT NULL REFERENCES genres(id),
  title        TEXT NOT NULL,
  description  TEXT,
  content      TEXT NOT NULL,
  ai_model     TEXT,
  is_public    BOOLEAN DEFAULT true,
  copy_count   INTEGER DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT now(),
  updated_at   TIMESTAMPTZ DEFAULT now()
);

-- お気に入り
CREATE TABLE favorites (
  user_id    UUID REFERENCES profiles(id) ON DELETE CASCADE,
  prompt_id  UUID REFERENCES prompts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, prompt_id)
);

-- インデックス
CREATE INDEX idx_prompts_genre_id   ON prompts(genre_id);
CREATE INDEX idx_prompts_user_id    ON prompts(user_id);
CREATE INDEX idx_prompts_created_at ON prompts(created_at DESC);
CREATE INDEX idx_prompts_copy_count ON prompts(copy_count DESC);
CREATE INDEX idx_favorites_prompt   ON favorites(prompt_id);

-- コピーカウントをインクリメントするRPC関数
CREATE OR REPLACE FUNCTION increment_copy_count(prompt_id UUID)
RETURNS void AS $$
  UPDATE prompts SET copy_count = copy_count + 1 WHERE id = prompt_id;
$$ LANGUAGE sql;

-- ============================================================
-- Row Level Security
-- ============================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompts  ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- profiles: 誰でも閲覧可、本人のみ編集可
CREATE POLICY "profiles_select" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update" ON profiles FOR UPDATE USING (auth.uid() = id);

-- prompts: 公開は誰でも閲覧可、自分のものは全操作可
CREATE POLICY "prompts_public_select" ON prompts FOR SELECT USING (is_public = true);
CREATE POLICY "prompts_own_select"    ON prompts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "prompts_insert" ON prompts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "prompts_update" ON prompts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "prompts_delete" ON prompts FOR DELETE USING (auth.uid() = user_id);

-- favorites: 本人のみ全操作可、件数はanonymousにも見せる
CREATE POLICY "favorites_select" ON favorites FOR SELECT USING (true);
CREATE POLICY "favorites_insert" ON favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "favorites_delete" ON favorites FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- 新規ユーザー登録時に profiles を自動作成するTrigger
-- ============================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, username)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
