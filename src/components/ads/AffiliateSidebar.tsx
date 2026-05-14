import { ExternalLink, Sparkles } from 'lucide-react'
import A8Banner from './A8Banner'

type AffiliateAd = {
  id: string
  name: string
  tagline: string
  description: string
  cta: string
  urlEnvKey: string      // 環境変数のキー名（本番URLに差し替え）
  fallbackUrl: string    // ASP未登録時の公式サイトURL
  gradient: string
  badge?: string
  commission?: string    // 参考報酬単価
}

// ────────────────────────────────────────────────
// 広告リスト（A8.net等で取得したURLをVercel環境変数に設定）
// ────────────────────────────────────────────────
const ADS: AffiliateAd[] = [
  {
    id: 'notion',
    name: 'Notion AI',
    tagline: 'AIメモ・ドキュメント管理',
    description: 'AIがノートを要約・翻訳。チームの生産性を10倍に。無料プランあり。',
    cta: '無料で始める',
    urlEnvKey: 'NEXT_PUBLIC_AFF_NOTION',
    fallbackUrl: 'https://www.notion.so/ja-jp',
    gradient: 'from-slate-600 to-slate-900',
    badge: '人気No.1',
    commission: '¥2,000/件',
  },
  {
    id: 'canva',
    name: 'Canva Pro',
    tagline: 'AI搭載デザインツール',
    description: 'AI画像生成・デザイン自動化。30日間無料体験あり。',
    cta: '30日無料体験',
    urlEnvKey: 'NEXT_PUBLIC_AFF_CANVA',
    fallbackUrl: 'https://www.canva.com/ja_jp/',
    gradient: 'from-purple-700 to-indigo-900',
    badge: '30日無料',
    commission: '¥1,500/件',
  },
  {
    id: 'gamma',
    name: 'Gamma',
    tagline: 'AIプレゼン自動生成',
    description: 'テキストを入力するだけで美しいスライドを自動生成。無料プランあり。',
    cta: '無料で生成する',
    urlEnvKey: 'NEXT_PUBLIC_AFF_GAMMA',
    fallbackUrl: 'https://gamma.app',
    gradient: 'from-violet-700 to-pink-900',
    commission: '$10/件',
  },
  {
    id: 'perplexity',
    name: 'Perplexity Pro',
    tagline: 'AI検索エンジン',
    description: '広告なし・引用付きの高精度AI検索。月$20が割引で使える。',
    cta: '割引で始める',
    urlEnvKey: 'NEXT_PUBLIC_AFF_PERPLEXITY',
    fallbackUrl: 'https://perplexity.ai',
    gradient: 'from-cyan-700 to-teal-900',
    badge: '割引あり',
    commission: '$10/件',
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
    commission: '調査中',
  },
  {
    id: 'chatgpt',
    name: 'ChatGPT Plus',
    tagline: 'OpenAI公式 最新GPT-4o',
    description: 'GPT-4o搭載。画像生成・分析・コーディングが月$20で使い放題。',
    cta: 'Plus に申し込む',
    urlEnvKey: 'NEXT_PUBLIC_AFF_CHATGPT',
    fallbackUrl: 'https://chat.openai.com',
    gradient: 'from-emerald-700 to-green-900',
    commission: 'なし（直接PR）',
  },
  {
    id: 'copilot',
    name: 'GitHub Copilot',
    tagline: 'AIコーディングアシスタント',
    description: 'コードを自動補完・生成。個人¥1,200/月。30日無料体験あり。',
    cta: '30日無料体験',
    urlEnvKey: 'NEXT_PUBLIC_AFF_COPILOT',
    fallbackUrl: 'https://github.com/features/copilot',
    gradient: 'from-gray-700 to-gray-900',
    badge: '30日無料',
    commission: '¥2,000/件',
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
    commission: '調査中',
  },
]

function getAdUrl(ad: AffiliateAd): string {
  const envUrl = process.env[ad.urlEnvKey]
  if (envUrl && !envUrl.includes('YOUR_') && envUrl.startsWith('http')) {
    return envUrl
  }
  return ad.fallbackUrl
}

function buildClickUrl(ad: AffiliateAd, placement: string) {
  const targetUrl = getAdUrl(ad)
  return `/api/affiliate/click?id=${ad.id}&placement=${placement}&url=${encodeURIComponent(targetUrl)}`
}

export default function AffiliateSidebar({ placement = 'sidebar' }: { placement?: string }) {
  return (
    <aside className="w-full space-y-3">
      <div className="flex items-center gap-1.5 mb-3">
        <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
        <span className="text-xs font-semibold text-muted-foreground tracking-wide">PR・おすすめAIツール</span>
      </div>

      {ADS.map((ad) => (
        <a
          key={ad.id}
          href={buildClickUrl(ad, placement)}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className={`block relative rounded-xl overflow-hidden bg-gradient-to-br ${ad.gradient}
                      border border-white/10 hover:border-white/25 transition-all duration-200
                      hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30 no-underline`}
        >
          <div className="p-3.5">
            {ad.badge && (
              <span className="absolute top-2.5 right-2.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full
                               bg-yellow-400 text-yellow-900 leading-none">
                {ad.badge}
              </span>
            )}
            <p className="text-[9px] text-white/50 font-semibold uppercase tracking-widest mb-0.5">{ad.tagline}</p>
            <p className="text-sm font-bold text-white mb-1">{ad.name}</p>
            <p className="text-[11px] text-white/65 leading-relaxed mb-2.5">{ad.description}</p>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-white
                             bg-white/20 rounded-lg px-2.5 py-1 transition-colors">
              {ad.cta}
              <ExternalLink className="w-2.5 h-2.5" />
            </span>
          </div>
        </a>
      ))}

      {/* A8.net バナー広告 */}
      <div className="flex flex-col gap-2 items-center pt-1">
        <A8Banner size="rect" />
        <A8Banner size="rect2" />
        <A8Banner size="rect3" />
      </div>

      {/* スポンサー枠直接掲載 */}
      <a
        href="mailto:higuryo0110@gmail.com?subject=【プロンプトシェア】広告掲載のご相談&body=プロンプトシェアへの広告掲載を希望します。%0A%0A会社名：%0A商品名：%0A希望掲載期間：%0Aご予算：%0A%0Aよろしくお願いいたします。"
        className="block p-3 rounded-xl border border-dashed border-violet-500/30 text-center
                   text-xs text-violet-400 hover:text-violet-300 hover:border-violet-400/50
                   hover:bg-violet-500/5 transition-all no-underline"
      >
        ✉ 広告掲載のご相談はこちら
      </a>
    </aside>
  )
}
