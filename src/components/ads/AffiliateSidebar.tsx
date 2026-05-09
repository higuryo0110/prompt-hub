import { ExternalLink, Sparkles } from 'lucide-react'

type AffiliateAd = {
  id: string
  name: string
  tagline: string
  description: string
  cta: string
  url: string
  gradient: string
  badge?: string
}

const ADS: AffiliateAd[] = [
  {
    id: 'notion',
    name: 'Notion AI',
    tagline: 'AIメモ・ドキュメント管理',
    description: 'AIがノートを要約・翻訳。チームの生産性を10倍に。',
    cta: '無料で試す',
    url: 'https://affiliate.notion.so/prompt-share',
    gradient: 'from-slate-700 to-slate-900',
    badge: '人気No.1',
  },
  {
    id: 'canva',
    name: 'Canva Pro',
    tagline: 'AI搭載デザインツール',
    description: 'AIで画像生成・デザイン自動化。¥1,700/月〜。',
    cta: '30日無料体験',
    url: 'https://www.canva.com/affiliates/prompt-share',
    gradient: 'from-purple-700 to-indigo-900',
    badge: 'お試し無料',
  },
  {
    id: 'gamma',
    name: 'Gamma',
    tagline: 'AIプレゼン自動生成',
    description: 'テキストを入力するだけで美しいスライドを自動生成。',
    cta: '無料で生成する',
    url: 'https://gamma.app?ref=promptshare',
    gradient: 'from-violet-700 to-pink-900',
  },
  {
    id: 'perplexity',
    name: 'Perplexity Pro',
    tagline: 'AI検索エンジン',
    description: '広告なし、引用付きの高精度AI検索。月$20→$5割引。',
    cta: '割引で始める',
    url: 'https://perplexity.ai?ref=promptshare',
    gradient: 'from-cyan-700 to-teal-900',
    badge: '20%OFF',
  },
]

function buildClickUrl(ad: AffiliateAd, ref: string) {
  return `/api/affiliate/click?id=${ad.id}&ref=${ref}&url=${encodeURIComponent(ad.url)}`
}

export default function AffiliateSidebar({ ref = 'sidebar' }: { ref?: string }) {
  return (
    <aside className="w-full space-y-3">
      <div className="flex items-center gap-1.5 mb-2">
        <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
        <span className="text-xs font-medium text-muted-foreground">PR・スポンサー</span>
      </div>

      {ADS.map((ad) => (
        <a
          key={ad.id}
          href={buildClickUrl(ad, ref)}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className={`block relative rounded-xl overflow-hidden bg-gradient-to-br ${ad.gradient}
                      border border-white/10 hover:border-white/20 transition-all duration-200
                      hover:-translate-y-0.5 hover:shadow-lg group no-underline`}
        >
          <div className="p-4">
            {ad.badge && (
              <span className="absolute top-2.5 right-2.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full
                               bg-yellow-400 text-yellow-900">
                {ad.badge}
              </span>
            )}
            <p className="text-[10px] text-white/50 font-medium uppercase tracking-wide mb-0.5">{ad.tagline}</p>
            <p className="text-sm font-bold text-white mb-1">{ad.name}</p>
            <p className="text-xs text-white/70 leading-relaxed mb-3">{ad.description}</p>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-white
                             bg-white/15 hover:bg-white/25 rounded-lg px-3 py-1.5 transition-colors">
              {ad.cta}
              <ExternalLink className="w-3 h-3" />
            </span>
          </div>
        </a>
      ))}

      {/* スポンサー枠募集 */}
      <a
        href="mailto:higuryo0110@gmail.com?subject=スポンサー広告掲載のご相談&body=プロンプトシェアへの広告掲載を希望します。"
        className="block p-3 rounded-xl border border-dashed border-border text-center
                   text-xs text-muted-foreground hover:text-foreground hover:border-violet-500/50
                   transition-all no-underline"
      >
        広告掲載のご相談はこちら →
      </a>
    </aside>
  )
}
