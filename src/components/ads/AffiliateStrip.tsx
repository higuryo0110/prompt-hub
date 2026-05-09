import { ExternalLink } from 'lucide-react'

type StripAd = {
  id: string
  name: string
  description: string
  cta: string
  urlEnvKey: string
  fallbackUrl: string
  accentColor: string
}

const STRIP_ADS: StripAd[] = [
  {
    id: 'notion-strip',
    name: 'Notion AI',
    description: 'このプロンプトをNotionで整理・管理しよう',
    cta: '無料で使い始める →',
    urlEnvKey: 'NEXT_PUBLIC_AFF_NOTION',
    fallbackUrl: 'https://www.notion.so/ja-jp',
    accentColor: 'border-slate-500/40 bg-slate-800/50',
  },
  {
    id: 'canva-strip',
    name: 'Canva Pro',
    description: 'AIプロンプトで生成した画像をCanvaで編集・デザイン',
    cta: '30日無料体験 →',
    urlEnvKey: 'NEXT_PUBLIC_AFF_CANVA',
    fallbackUrl: 'https://www.canva.com/ja_jp/',
    accentColor: 'border-purple-500/40 bg-purple-900/30',
  },
  {
    id: 'gamma-strip',
    name: 'Gamma',
    description: 'プロンプトを貼り付けるだけで美しいスライドを自動生成',
    cta: '無料で試す →',
    urlEnvKey: 'NEXT_PUBLIC_AFF_GAMMA',
    fallbackUrl: 'https://gamma.app',
    accentColor: 'border-violet-500/40 bg-violet-900/30',
  },
]

function getUrl(ad: StripAd): string {
  const env = process.env[ad.urlEnvKey]
  return env && !env.includes('YOUR_') && env.startsWith('http') ? env : ad.fallbackUrl
}

export default function AffiliateStrip({ promptId }: { promptId: string }) {
  const ad = STRIP_ADS[promptId.charCodeAt(0) % STRIP_ADS.length]

  return (
    <a
      href={`/api/affiliate/click?id=${ad.id}&placement=prompt-bottom&url=${encodeURIComponent(getUrl(ad))}`}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className={`flex items-center justify-between gap-4 p-4 rounded-xl border ${ad.accentColor}
                  hover:opacity-90 transition-opacity no-underline group mt-8`}
    >
      <div>
        <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">PR</span>
        <p className="text-sm font-semibold text-foreground">{ad.name}</p>
        <p className="text-xs text-muted-foreground">{ad.description}</p>
      </div>
      <span className="text-xs font-semibold text-violet-400 group-hover:text-violet-300 whitespace-nowrap flex items-center gap-1 shrink-0">
        {ad.cta}
        <ExternalLink className="w-3 h-3" />
      </span>
    </a>
  )
}
