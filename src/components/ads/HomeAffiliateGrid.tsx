import { ExternalLink, Sparkles } from 'lucide-react'

type GridAd = {
  id: string
  name: string
  tagline: string
  description: string
  cta: string
  urlEnvKey: string
  fallbackUrl: string
  gradient: string
  badge?: string
}

const GRID_ADS: GridAd[] = [
  {
    id: 'chatgpt',
    name: 'ChatGPT Plus',
    tagline: 'OpenAI公式 最新GPT-4o',
    description: 'GPT-4o搭載。画像生成・分析・コーディングが月$20で使い放題。',
    cta: 'Plus に申し込む',
    urlEnvKey: 'NEXT_PUBLIC_AFF_CHATGPT',
    fallbackUrl: 'https://chat.openai.com',
    gradient: 'from-emerald-700 to-green-900',
    badge: '人気',
  },
  {
    id: 'claude',
    name: 'Claude Pro',
    tagline: 'Anthropic製 最高峰AI',
    description: '長文・コード・分析が得意。GPT-4より賢いと話題のAI。',
    cta: 'Claude Proを試す',
    urlEnvKey: 'NEXT_PUBLIC_AFF_CLAUDE',
    fallbackUrl: 'https://claude.ai',
    gradient: 'from-orange-700 to-rose-900',
  },
  {
    id: 'notion',
    name: 'Notion AI',
    tagline: 'AIメモ・ドキュメント管理',
    description: 'AIがノートを要約・翻訳。チームの生産性を10倍に。無料プランあり。',
    cta: '無料で始める',
    urlEnvKey: 'NEXT_PUBLIC_AFF_NOTION',
    fallbackUrl: 'https://www.notion.so/ja-jp',
    gradient: 'from-slate-600 to-slate-900',
    badge: '無料あり',
  },
  {
    id: 'midjourney',
    name: 'Midjourney',
    tagline: 'AI画像生成No.1',
    description: 'テキストから超高品質な画像を生成。月$10〜。クリエイター必須ツール。',
    cta: '画像生成を始める',
    urlEnvKey: 'NEXT_PUBLIC_AFF_MIDJOURNEY',
    fallbackUrl: 'https://www.midjourney.com',
    gradient: 'from-blue-700 to-indigo-900',
  },
]

function getUrl(ad: GridAd): string {
  const env = process.env[ad.urlEnvKey]
  return env && !env.includes('YOUR_') && env.startsWith('http') ? env : ad.fallbackUrl
}

export default function HomeAffiliateGrid() {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
        <span className="text-xs font-semibold text-muted-foreground tracking-widest uppercase">PR・おすすめAIツール</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {GRID_ADS.map(ad => (
          <a
            key={ad.id}
            href={`/api/affiliate/click?id=${ad.id}&placement=home-grid&url=${encodeURIComponent(getUrl(ad))}`}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className={`relative block rounded-xl overflow-hidden bg-gradient-to-br ${ad.gradient}
                        border border-white/10 hover:border-white/25 transition-all duration-200
                        hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30 no-underline p-4`}
          >
            {ad.badge && (
              <span className="absolute top-2.5 right-2.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full
                               bg-yellow-400 text-yellow-900 leading-none">
                {ad.badge}
              </span>
            )}
            <p className="text-[9px] text-white/50 font-semibold uppercase tracking-widest mb-0.5">{ad.tagline}</p>
            <p className="text-sm font-bold text-white mb-1">{ad.name}</p>
            <p className="text-[11px] text-white/65 leading-relaxed mb-3">{ad.description}</p>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-white
                             bg-white/20 rounded-lg px-2.5 py-1">
              {ad.cta}
              <ExternalLink className="w-2.5 h-2.5" />
            </span>
          </a>
        ))}
      </div>
    </div>
  )
}
