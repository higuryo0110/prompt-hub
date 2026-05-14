import type { Genre } from '@/types'

export const GENRES: Genre[] = [
  // 仕事・ビジネス
  { id: 1,  slug: 'business',       name: '一般業務',             icon: 'Briefcase',        color: 'text-blue-400' },
  { id: 9,  slug: 'medical',        name: '医療・ヘルスケア',     icon: 'Stethoscope',      color: 'text-red-400' },
  { id: 10, slug: 'legal',          name: '法務・コンプライアンス', icon: 'Scale',           color: 'text-amber-400' },
  { id: 11, slug: 'finance',        name: '金融・会計',           icon: 'Landmark',         color: 'text-green-400' },
  { id: 12, slug: 'hr',             name: '人事・採用',           icon: 'UserPlus',         color: 'text-indigo-400' },
  { id: 13, slug: 'sales',          name: '営業・顧客対応',       icon: 'Handshake',        color: 'text-teal-400' },
  { id: 16, slug: 'consulting',     name: 'コンサルティング',     icon: 'MessageSquare',    color: 'text-sky-400' },
  { id: 17, slug: 'real-estate',    name: '不動産',               icon: 'Building2',        color: 'text-stone-400' },
  { id: 18, slug: 'food-service',   name: '飲食・サービス',       icon: 'UtensilsCrossed',  color: 'text-rose-400' },
  // 開発・エンジニアリング
  { id: 2,  slug: 'app-dev',        name: 'アプリ・Web開発',      icon: 'Code2',            color: 'text-violet-400' },
  { id: 6,  slug: 'analysis',       name: 'データ分析',           icon: 'BarChart3',        color: 'text-cyan-400' },
  { id: 19, slug: 'infrastructure', name: 'インフラ・DevOps',     icon: 'Server',           color: 'text-gray-400' },
  { id: 20, slug: 'ai-ml',          name: 'AI・機械学習',         icon: 'Brain',            color: 'text-purple-400' },
  { id: 21, slug: 'mobile',         name: 'モバイル開発',         icon: 'Smartphone',       color: 'text-blue-300' },
  // クリエイティブ
  { id: 3,  slug: 'image-gen',      name: '画像生成',             icon: 'ImageIcon',        color: 'text-pink-400' },
  { id: 4,  slug: 'writing',        name: 'ライティング',         icon: 'PenLine',          color: 'text-emerald-400' },
  { id: 14, slug: 'design',         name: 'デザイン',             icon: 'Palette',          color: 'text-fuchsia-400' },
  { id: 22, slug: 'video',          name: '動画・映像',           icon: 'Video',            color: 'text-red-400' },
  { id: 23, slug: 'music',          name: '音楽・音声',           icon: 'Music',            color: 'text-purple-300' },
  // マーケティング
  { id: 5,  slug: 'marketing',      name: 'マーケティング戦略',   icon: 'TrendingUp',       color: 'text-orange-400' },
  { id: 24, slug: 'sns',            name: 'SNS運用',             icon: 'Share2',           color: 'text-pink-300' },
  { id: 25, slug: 'seo',            name: 'SEO・コンテンツ',     icon: 'Search',           color: 'text-green-300' },
  { id: 26, slug: 'ads',            name: '広告運用',             icon: 'Megaphone',        color: 'text-amber-300' },
  // 学習・教育
  { id: 7,  slug: 'education',      name: '教育・学習',           icon: 'GraduationCap',    color: 'text-yellow-400' },
  { id: 27, slug: 'language',       name: '語学・英語',           icon: 'Globe',            color: 'text-blue-300' },
  { id: 28, slug: 'certification',  name: '資格・試験',           icon: 'Award',            color: 'text-yellow-300' },
  { id: 29, slug: 'research',       name: '研究・論文',           icon: 'BookOpen',         color: 'text-indigo-300' },
  // ライフスタイル
  { id: 15, slug: 'lifestyle',      name: '暮らし・趣味',         icon: 'Home',             color: 'text-lime-400' },
  { id: 30, slug: 'cooking',        name: '料理・グルメ',         icon: 'ChefHat',          color: 'text-orange-300' },
  { id: 31, slug: 'travel',         name: '旅行・おでかけ',       icon: 'Plane',            color: 'text-sky-300' },
  { id: 32, slug: 'health',         name: '健康・フィットネス',   icon: 'HeartPulse',       color: 'text-red-300' },
  { id: 33, slug: 'parenting',      name: '子育て・育児',         icon: 'Baby',             color: 'text-pink-200' },
  { id: 8,  slug: 'other',          name: 'その他',               icon: 'Sparkles',         color: 'text-slate-400' },
]

export type CategoryGroup = {
  slug: string
  name: string
  icon: string
  emoji: string
  color: string
  genreSlugs: string[]
}

export const CATEGORY_GROUPS: CategoryGroup[] = [
  {
    slug: 'work',
    name: '仕事・ビジネス',
    icon: 'Briefcase',
    emoji: '💼',
    color: 'text-blue-400',
    genreSlugs: ['business', 'medical', 'legal', 'finance', 'hr', 'sales', 'consulting', 'real-estate', 'food-service'],
  },
  {
    slug: 'dev',
    name: '開発・エンジニアリング',
    icon: 'Code2',
    emoji: '⚡',
    color: 'text-violet-400',
    genreSlugs: ['app-dev', 'analysis', 'infrastructure', 'ai-ml', 'mobile'],
  },
  {
    slug: 'creative',
    name: 'クリエイティブ',
    icon: 'Palette',
    emoji: '🎨',
    color: 'text-pink-400',
    genreSlugs: ['image-gen', 'writing', 'design', 'video', 'music'],
  },
  {
    slug: 'marketing',
    name: 'マーケティング',
    icon: 'TrendingUp',
    emoji: '📈',
    color: 'text-orange-400',
    genreSlugs: ['marketing', 'sns', 'seo', 'ads'],
  },
  {
    slug: 'learning',
    name: '学習・教育',
    icon: 'GraduationCap',
    emoji: '📚',
    color: 'text-yellow-400',
    genreSlugs: ['education', 'language', 'certification', 'research'],
  },
  {
    slug: 'life',
    name: 'ライフスタイル',
    icon: 'Heart',
    emoji: '🏠',
    color: 'text-lime-400',
    genreSlugs: ['lifestyle', 'cooking', 'travel', 'health', 'parenting', 'other'],
  },
]

export const AI_MODELS = [
  'GPT-4o', 'GPT-4', 'GPT-3.5', 'Claude Opus 4.7', 'Claude 3.5 Sonnet',
  'Gemini 1.5 Pro', 'Midjourney', 'DALL-E 3', 'Stable Diffusion', 'その他',
]
