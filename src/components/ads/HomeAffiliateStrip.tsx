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
    id: 'canva-home',
    name: 'Canva Pro',
    description: 'AIプロンプトで生成したアイデアをCanvaで即デザイン。30日間無料体験あり。',
    cta: '30日無料体験 →',
    urlEnvKey: 'NEXT_PUBLIC_AFF_CANVA',
    fallbackUrl: 'https://www.canva.com/ja_jp/',
    accentColor: 'border-purple-500/40 bg-purple-900/30',
  },
  {
    id: 'gamma-home',
    name: 'Gamma',
    description: 'プロンプトをGammaに貼るだけで美しいスライドを自動生成。無料で試せます。',
    cta: '無料で試す →',
    urlEnvKey: 'NEXT_PUBLIC_AFF_GAMMA',
    fallbackUrl: 'https://gamma.app',
    accentColor: 'border-violet-500/40 bg-violet-900/30',
  },
  {
    id: 'perplexity-home',
    name: 'Perplexity Pro',
    description: '広告なし・引用付きの高精度AI検索。プロンプトと組み合わせると最強。',
    cta: '割引で始める →',
    urlEnvKey: 'NEXT_PUBLIC_AFF_PERPLEXITY',
    fallbackUrl: 'https://perplexity.ai',
    accentColor: 'border-cyan-500/40 bg-cyan-900/30',
  },
]

function getUrl(ad: StripAd): string {
  const env = process.env[ad.urlEnvKey]
  return env && !env.includes('YOUR_') && env.startsWith('http') ? env : ad.fallbackUrl
}

export default function HomeAffiliateStrip() {
  const ad = STRIP_ADS[Math.floor(Date.now() / (1000 * 60 * 60 * 6)) % STRIP_ADS.length]

  return (
    <a
      href={`/api/affiliate/click?id=${ad.id}&placement=home-strip&url=${encodeURIComponent(getUrl(ad))}`}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className={`flex items-center justify-between gap-4 p-4 rounded-xl border ${ad.accentColor}
                  hover:opacity-90 transition-opacity no-underline group`}
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
