import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import PromptCard from '@/components/prompts/PromptCard'
import { Button } from '@/components/ui/button'
import { GENRES } from '@/lib/genres'
import { CATEGORY_META, SITE_URL, SITE_NAME } from '@/lib/constants'
import A8Banner from '@/components/ads/A8Banner'
import { ArrowRight, ChevronRight } from 'lucide-react'
import * as Icons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { PromptWithDetails } from '@/types'
import type { Metadata } from 'next'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return GENRES.map(g => ({ slug: g.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const meta = CATEGORY_META[slug]
  const genre = GENRES.find(g => g.slug === slug)
  if (!meta || !genre) return { title: 'カテゴリが見つかりません' }

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    openGraph: {
      title: `${meta.title} | ${SITE_NAME}`,
      description: meta.description,
      type: 'website',
      url: `${SITE_URL}/categories/${slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${meta.title} | ${SITE_NAME}`,
      description: meta.description,
    },
    alternates: { canonical: `${SITE_URL}/categories/${slug}` },
  }
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params
  const meta = CATEGORY_META[slug]
  const genre = GENRES.find(g => g.slug === slug)
  if (!meta || !genre) notFound()

  const supabase = await createClient()
  const { data: rawPrompts } = await supabase
    .from('prompts')
    .select('*, genre:genres(*), profile:profiles!prompts_user_id_fkey(*), favorites(count)')
    .eq('is_public', true)
    .eq('genre_id', genre.id)
    .order('copy_count', { ascending: false })
    .limit(48)

  const prompts: PromptWithDetails[] = (rawPrompts ?? []).map((p: Record<string, unknown>) => ({
    ...(p as unknown as PromptWithDetails),
    favorite_count: Array.isArray(p.favorites)
      ? (p.favorites[0] as { count: number })?.count ?? 0
      : 0,
  }))

  const IconComponent = Icons[genre.icon as keyof typeof Icons] as LucideIcon

  // 構造化データ
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'ホーム', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'カテゴリ', item: `${SITE_URL}/prompts` },
      { '@type': 'ListItem', position: 3, name: genre.name, item: `${SITE_URL}/categories/${slug}` },
    ],
  }
  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: meta.title,
    description: meta.description,
    url: `${SITE_URL}/categories/${slug}`,
    isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: SITE_URL },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: prompts.length,
      itemListElement: prompts.slice(0, 20).map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `${SITE_URL}/prompts/${p.id}`,
        name: p.title,
      })),
    },
  }

  // 関連カテゴリ（自分以外の上位3つ）
  const relatedCats = GENRES.filter(g => g.slug !== slug).slice(0, 7)

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />

      {/* パンくず */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-foreground transition-colors">ホーム</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/prompts" className="hover:text-foreground transition-colors">プロンプト一覧</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-foreground">{genre.name}</span>
      </nav>

      {/* ヘッダー */}
      <header className="mb-10">
        <div className={`inline-flex items-center gap-3 mb-4`}>
          <div className={`w-12 h-12 rounded-2xl bg-card border border-border flex items-center justify-center ${genre.color}`}>
            <span className="text-2xl">{meta.emoji}</span>
          </div>
          <div className="text-sm text-muted-foreground font-medium">カテゴリ</div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">{meta.title}</h1>
        <p className="text-lg text-muted-foreground mb-4 max-w-3xl">{meta.description}</p>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">{meta.longDescription}</p>
      </header>

      {/* プロンプト一覧 */}
      {prompts.length === 0 ? (
        <div className="text-center py-24 bg-card border border-border rounded-2xl">
          {IconComponent && <IconComponent className={`w-12 h-12 mx-auto mb-4 ${genre.color} opacity-50`} />}
          <p className="text-lg mb-2 font-medium">このカテゴリのプロンプトはまだありません</p>
          <p className="text-sm text-muted-foreground mb-6">最初の投稿者になりませんか？</p>
          <Link href="/prompts/new">
            <Button className="bg-gradient-to-r from-violet-600 to-cyan-600 border-0">
              プロンプトを投稿する <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">人気の{genre.name}プロンプト（{prompts.length}件）</h2>
            <Link href={`/prompts?genre=${slug}&sort=new`}>
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                新着順で見る <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-12">
            {prompts.map(p => <PromptCard key={p.id} prompt={p} />)}
          </div>
        </>
      )}

      {/* 広告 */}
      <div className="my-8 flex flex-wrap gap-4 justify-center">
        <A8Banner size="rect5" />
        <A8Banner size="rect6" />
        <A8Banner size="rect3" />
      </div>
      <div className="mb-8">
        <A8Banner size="leaderboard3" />
      </div>

      {/* SEO本文 — カテゴリの活用法ガイド */}
      <section className="bg-card border border-border rounded-2xl p-8 mb-12">
        <h2 className="text-2xl font-bold mb-4">{genre.name}プロンプトの使い方ガイド</h2>
        <div className="space-y-4 text-sm text-foreground/85 leading-relaxed">
          <p>
            <strong className="text-foreground">{genre.name}カテゴリ</strong>のプロンプトは、
            ChatGPT・Claude・Geminiといった主要なLLMにそのままコピー&ペーストすることで、
            すぐに業務や創作に活用できる形で設計されています。
          </p>
          <p>
            それぞれのプロンプトは、<strong>役割設定 → 入力フォーマット → 思考プロセス → 出力フォーマット → 制約条件</strong>
            の構造で書かれており、AIから一貫した高品質なアウトプットを引き出せます。
            プロンプトエンジニアリングの基本である「指示の明確化」「文脈の付与」「出力フォーマットの指定」を取り入れているため、
            初心者でも上級者と同じ結果を得ることができます。
          </p>
          <p>
            気に入ったプロンプトはお気に入り登録（ログイン必要）でいつでも呼び出せます。
            <Link href="/signup" className="text-violet-400 hover:underline">無料アカウント登録</Link>
            で利用可能になります。
          </p>
        </div>
      </section>

      {/* 広告2 */}
      <div className="mb-8">
        <A8Banner size="leaderboard" />
      </div>

      {/* 関連カテゴリ */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-6">他のカテゴリも見る</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {relatedCats.map(g => {
            const m = CATEGORY_META[g.slug]
            return (
              <Link key={g.slug} href={`/categories/${g.slug}`}>
                <div className="group bg-card border border-border rounded-xl p-4 flex items-center gap-3
                                hover:border-violet-500/50 transition-all duration-200 hover:-translate-y-0.5">
                  <span className="text-2xl">{m?.emoji ?? '✨'}</span>
                  <span className="font-medium text-sm group-hover:text-violet-300 transition-colors">
                    {g.name}
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}
