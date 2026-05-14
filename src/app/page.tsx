import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import PromptCard from '@/components/prompts/PromptCard'
import NewsletterForm from '@/components/newsletter/NewsletterForm'
import AffiliateSidebar from '@/components/ads/AffiliateSidebar'
import HomeAffiliateGrid from '@/components/ads/HomeAffiliateGrid'
import HomeAffiliateStrip from '@/components/ads/HomeAffiliateStrip'
import A8Banner from '@/components/ads/A8Banner'
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from '@/lib/constants'
import { ArrowRight, Zap, TrendingUp, Mail } from 'lucide-react'
import type { PromptWithDetails } from '@/types'
import CategoryAccordion from '@/components/home/CategoryAccordion'

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  alternateName: 'PromptShare',
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${SITE_URL}/prompts?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'プロンプトシェアとは何ですか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'プロンプトシェアは、ChatGPT・Claude・Gemini・Midjourneyなど主要AIに対応した高品質プロンプトを無料で発見・共有できるプロンプト共有サービスです。業務委託・アプリ制作・画像生成・ライティング・マーケティング・データ分析・教育など8カテゴリのプロンプトを揃えています。',
      },
    },
    {
      '@type': 'Question',
      name: 'プロンプトシェアは無料で使えますか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'はい、無料で利用できます。プロンプトの閲覧・コピーは登録不要、お気に入り登録・プロンプト投稿は無料アカウント登録のみで利用できます。一部、有料プロンプト（クリエイターが価格設定したもの）もありますが、無料プロンプトだけで実務をカバーできる量を揃えています。',
      },
    },
    {
      '@type': 'Question',
      name: 'どのAIに対応していますか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'ChatGPT (GPT-4o, GPT-4, GPT-3.5)、Claude (Opus 4.7, 3.5 Sonnet, 3 Opus)、Gemini 1.5 Pro、Midjourney、DALL-E 3、Stable Diffusionなど主要なテキスト・画像生成AIに対応したプロンプトを掲載しています。',
      },
    },
    {
      '@type': 'Question',
      name: 'プロンプトはどのように使えばいいですか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '①プロンプト詳細ページで内容を確認、②「コピー」ボタンでクリップボードに保存、③お好みのAIチャット画面に貼り付けて送信、④必要に応じて変数（{業界}など）を自分用に書き換える、という流れで使えます。多くのプロンプトは役割設定・出力フォーマット指定済みで、コピペだけで即戦力です。',
      },
    },
    {
      '@type': 'Question',
      name: '自分のプロンプトを投稿できますか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'はい、無料アカウント登録後、誰でもプロンプトを投稿できます。クリエイターは有料プロンプトとして価格を設定することも可能で、購入のたびに収益を得られます。',
      },
    },
  ],
}

export default async function HomePage() {
  const supabase = await createClient()

  const [
    { data: prompts },
    popularPrompts,
    { count: _promptCount },
    { count: _userCount },
  ] = await Promise.all([
    supabase
      .from('prompts')
      .select(`*, genre:genres(*), profile:profiles!prompts_user_id_fkey(*), favorites(count)`)
      .eq('is_public', true)
      .order('created_at', { ascending: false })
      .limit(8),
    supabase
      .from('prompts')
      .select(`*, genre:genres(*), profile:profiles!prompts_user_id_fkey(*), favorites(count)`)
      .eq('is_public', true)
      .order('copy_count', { ascending: false })
      .limit(4),
    supabase.from('prompts').select('*', { count: 'exact', head: true }).eq('is_public', true),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
  ])

  const formatPrompts = (data: Record<string, unknown>[] | null): PromptWithDetails[] =>
    (data ?? []).map(p => ({
      ...(p as unknown as PromptWithDetails),
      favorite_count: Array.isArray(p.favorites)
        ? (p.favorites[0] as { count: number })?.count ?? 0
        : 0,
    }))

  const latestPrompts = formatPrompts(prompts as unknown as Record<string, unknown>[])
  const topPrompts = formatPrompts(popularPrompts.data as unknown as Record<string, unknown>[])
  void _promptCount
  void _userCount

  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      {/* Hero */}
      <section className="relative overflow-hidden py-24 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-950/30 via-background to-background" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute top-10 right-1/4 w-64 h-64 bg-cyan-600/10 rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/30
                          rounded-full px-4 py-1.5 text-sm text-violet-300 mb-6">
            <Zap className="w-3.5 h-3.5" />
            AIプロンプト共有サービス「プロンプトシェア」
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            最高の
            <span className="gradient-text">プロンプト</span>
            <br />を、あなたの手に
          </h1>
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
            プロンプトシェアは、業務委託・アプリ制作・画像生成など、あらゆるジャンルの厳選AIプロンプトを
            無料で発見・共有・お気に入り登録できるプロンプト共有サービスです。
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/prompts">
              <Button size="lg" className="bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 border-0 h-12 px-8">
                プロンプトを探す
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="lg" variant="outline" className="h-12 px-8 border-border hover:border-violet-500/50">
                無料で始める
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap gap-8 justify-center mt-14 text-sm text-muted-foreground">
            {[
              { icon: Zap, label: '完全無料', value: 'コピペで即利用' },
              { icon: TrendingUp, label: 'カテゴリ', value: '33分野対応' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-violet-400" />
                <span className="text-foreground font-semibold">{value}</span>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* リーダーボード広告（ヒーロー直下） */}
      <div className="px-4 pb-4 max-w-7xl mx-auto">
        <A8Banner size="leaderboard" />
      </div>

      {/* Genres - アコーディオン型カテゴリ */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">カテゴリから探す</h2>
            <p className="text-sm text-muted-foreground">
              カテゴリをタップして分野別のプロンプトを見つけましょう
            </p>
          </div>
          <CategoryAccordion />
        </div>
      </section>

      {/* リーダーボード広告2（ジャンル直下） */}
      <div className="px-4 py-4 max-w-7xl mx-auto">
        <A8Banner size="leaderboard2" />
      </div>

      {/* PR・おすすめAIツール（横並びグリッド） */}
      <section className="py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <HomeAffiliateGrid />
          {/* A8.net バナー */}
          <div className="mt-6 flex flex-wrap gap-3 items-center justify-center">
            <A8Banner size="small" />
            <A8Banner size="small2" />
            <A8Banner size="small" />
            <A8Banner size="small2" />
          </div>
        </div>
      </section>

      {/* Popular + Latest + Sidebar */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex gap-8 items-start">
          {/* メインコンテンツ */}
          <div className="flex-1 min-w-0">
            {/* Popular */}
            {topPrompts.length > 0 && (
              <section className="py-10">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold">🔥 人気のプロンプト</h2>
                  <Link href="/prompts?sort=popular">
                    <Button variant="ghost" size="sm" className="text-muted-foreground">
                      すべて見る <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4">
                  {topPrompts.map(prompt => (
                    <PromptCard key={prompt.id} prompt={prompt} />
                  ))}
                </div>
              </section>
            )}

            {/* 人気と新着の間のA8.net 300x250バナー */}
            <div className="py-6 border-t border-border">
              <A8Banner size="rect-both" />
            </div>

            {/* Latest */}
            {latestPrompts.length > 0 && (
              <section className="py-10 border-t border-border">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold">✨ 新着プロンプト</h2>
                  <Link href="/prompts">
                    <Button variant="ghost" size="sm" className="text-muted-foreground">
                      すべて見る <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4">
                  {latestPrompts.map(prompt => (
                    <PromptCard key={prompt.id} prompt={prompt} />
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* サイドバー（xl以上で表示） */}
          <div className="hidden xl:block w-64 shrink-0 sticky top-24 py-10">
            <AffiliateSidebar placement="home-sidebar" />
          </div>
        </div>
      </div>

      {/* PR横長バナー（新着とメルマガの間） */}
      <div className="max-w-4xl mx-auto px-4 pb-8">
        <HomeAffiliateStrip />
      </div>

      {/* メルマガ登録 */}
      <section className="py-16 px-4 border-t border-border">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-12 h-12 rounded-2xl bg-violet-500/15 flex items-center justify-center mx-auto mb-4">
            <Mail className="w-6 h-6 text-violet-400" />
          </div>
          <h2 className="text-2xl font-bold mb-2">週刊AIプロンプト通信</h2>
          <p className="text-muted-foreground mb-6">
            毎週金曜日に厳選プロンプト5選と最新AIトレンドをお届けします。登録無料・いつでも解除可能。
          </p>
          <NewsletterForm />
        </div>
      </section>

      {/* FAQ - SEOとUX両方の効果 */}
      <section className="py-16 px-4 border-t border-border bg-muted/20">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 text-center">よくある質問</h2>
          <p className="text-sm text-muted-foreground text-center mb-10">
            プロンプトシェアの使い方をまとめました
          </p>
          <div className="space-y-4">
            {faqJsonLd.mainEntity.map((q, i) => (
              <details
                key={i}
                className="group bg-card border border-border rounded-xl p-5 hover:border-violet-500/40 transition-colors"
              >
                <summary className="font-semibold cursor-pointer list-none flex items-center justify-between gap-3">
                  <span className="text-base">Q. {q.name}</span>
                  <span className="text-violet-400 text-xl group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-4 text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                  {q.acceptedAnswer.text}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-gradient-to-r from-violet-900/40 to-cyan-900/40 border border-violet-500/20
                          rounded-3xl p-12">
            <h2 className="text-3xl font-bold mb-4">あなたのプロンプトを共有しよう</h2>
            <p className="text-muted-foreground mb-8">
              作成したプロンプトを公開して、コミュニティに貢献しましょう。
            </p>
            <Link href="/signup">
              <Button size="lg" className="bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 border-0 h-12 px-8">
                今すぐ無料登録
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
