import type { Genre } from '@/types'

export const GENRES: Genre[] = [
  { id: 1, slug: 'business', name: '業務委託', icon: 'Briefcase', color: 'text-blue-400' },
  { id: 2, slug: 'app-dev', name: 'アプリ制作', icon: 'Code2', color: 'text-violet-400' },
  { id: 3, slug: 'image-gen', name: '画像生成', icon: 'ImageIcon', color: 'text-pink-400' },
  { id: 4, slug: 'writing', name: 'ライティング', icon: 'PenLine', color: 'text-emerald-400' },
  { id: 5, slug: 'marketing', name: 'マーケティング', icon: 'TrendingUp', color: 'text-orange-400' },
  { id: 6, slug: 'analysis', name: 'データ分析', icon: 'BarChart3', color: 'text-cyan-400' },
  { id: 7, slug: 'education', name: '教育・学習', icon: 'GraduationCap', color: 'text-yellow-400' },
  { id: 8, slug: 'other', name: 'その他', icon: 'Sparkles', color: 'text-slate-400' },
]

export const AI_MODELS = [
  'GPT-4o', 'GPT-4', 'GPT-3.5', 'Claude 3.5 Sonnet', 'Claude 3 Opus',
  'Gemini 1.5 Pro', 'Midjourney', 'DALL-E 3', 'Stable Diffusion', 'その他',
]
