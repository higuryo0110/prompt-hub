import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import FavoriteButton from '@/components/prompts/FavoriteButton'
import CopyButton from '@/components/prompts/CopyButton'
import PurchaseButton from '@/components/prompts/PurchaseButton'
import PromptCard from '@/components/prompts/PromptCard'
import ShareButtons from '@/components/prompts/ShareButtons'
import AffiliateSidebar from '@/components/ads/AffiliateSidebar'
import AffiliateStrip from '@/components/ads/AffiliateStrip'
import A8Banner from '@/components/ads/A8Banner'
import Link from 'next/link'
import { GENRES } from '@/lib/genres'
import { SITE_URL, SITE_NAME } from '@/lib/constants'
import * as Icons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Bot, User, Calendar, Copy, Pencil, Trash2, Lock, ChevronRight } from 'lucide-react'
import { deletePrompt } from '@/lib/actions/prompts'
import type { Metadata } from 'next'
import type { PromptWithDetails } from '@/types'

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ purchased?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = await createClient()
  const { id } = await params
  const { data } = await supabase
    .from('prompts')
    .select('title,description,ai_model')
    .eq('id', id)
    .single()
  const title = data?.title ?? 'プロンプト詳細'
  const aiModel = data?.ai_model ?? 'AI'
  const description =
    data?.description ||
    `${title} - ${aiModel}用の高品質AIプロンプト。${SITE_NAME}で無料公開中。コピー&ペーストで即利用可能。`
  return {
    title,
    description,
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      type: 'article',
      url: `${SITE_URL}/prompts/${id}`,
      siteName: SITE_NAME,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${SITE_NAME}`,
      description,
    },
    alternates: { canonical: `${SITE_URL}/prompts/${id}` },
  }
}

export default async function PromptDetailPage({ params, searchParams }: Props) {
  const supabase = await createClient()
  const { id } = await params
  const sp = await searchParams
  const justPurchased = sp.purchased === '1'

  const { data: prompt } = await supabase
    .from('prompts')
    .select(`*, genre:genres(*), profile:profiles!prompts_user_id_fkey(*)`)
    .eq('id', id)
    .single()

  if (!prompt) notFound()

  const { data: { user } } = await supabase.auth.getUser()

  const [{ count: favCount }, { data: myFav }, { data: myPurchase }, relatedRes] = await Promise.all([
    supabase.from('favorites').select('*', { count: 'exact', head: true }).eq('prompt_id', id),
    user ? supabase.from('favorites').select('*').eq('prompt_id', id).eq('user_id', user.id).maybeSingle() : Promise.resolve({ data: null }),
    (async () => {
      if (!user || !prompt.price) return { data: null }
      try {
        return await supabase.from('prompt_purchases').select('id').eq('prompt_id', id).eq('buyer_id', user.id).maybeSingle()
      } catch { return { data: null } }
    })(),
    // 関連プロンプト: 同じジャンルの人気プロンプト（自分以外）
    supabase
      .from('prompts')
      .select('*, genre:genres(*), profile:profiles!prompts_user_id_fkey(*), favorites(count)')
      .eq('is_public', true)
      .eq('genre_id', prompt.genre_id)
      .neq('id', id)
      .order('copy_count', { ascending: false })
      .limit(6),
  ])

  const genre = GENRES.find(g => g.id === prompt.genre_id)
  const IconComponent = genre ? (Icons[genre.icon as keyof typeof Icons] as LucideIcon) : null
  const isOwner = user?.id === prompt.user_id
  const isPaid = !!prompt.price
  const hasPurchased = isOwner || !!myPurchase || justPurchased
  const showFullContent = !isPaid || hasPurchased

  const relatedPrompts: PromptWithDetails[] = ((relatedRes?.data ?? []) as Record<string, unknown>[]).map((p) => ({
    ...(p as unknown as PromptWithDetails),
    favorite_count: Array.isArray(p.favorites)
      ? (p.favorites[0] as { count: number })?.count ?? 0
      : 0,
  }))

  // 構造化データ: HowTo + BreadcrumbList
  const howToJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: prompt.title,
    description: prompt.description || prompt.title,
    totalTime: 'PT1M',
    estimatedCost: { '@type': 'MonetaryAmount', currency: 'JPY', value: prompt.price || 0 },
    tool: prompt.ai_model ? [{ '@type': 'HowToTool', name: prompt.ai_model }] : undefined,
    author: {
      '@type': 'Person',
      name: prompt.profile?.username || '匿名',
    },
    datePublished: prompt.created_at,
    dateModified: prompt.updated_at,
    publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: 'プロンプトをコピー',
        text: 'このページの「コピー」ボタンをクリックしてプロンプトをクリップボードに保存します。',
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: `${prompt.ai_model || 'AI'}に貼り付け`,
        text: `${prompt.ai_model || 'ChatGPT・Claudeなどお好みのAI'}のチャット画面にプロンプトをペーストして送信します。`,
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: '結果を活用',
        text: 'AIから返ってきた結果をそのまま、または微調整して業務・創作に活用します。',
      },
    ],
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'ホーム', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'プロンプト一覧', item: `${SITE_URL}/prompts` },
      ...(genre
        ? [{ '@type': 'ListItem' as const, position: 3, name: genre.name, item: `${SITE_URL}/categories/${genre.slug}` }]
        : []),
      {
        '@type': 'ListItem' as const,
        position: genre ? 4 : 3,
        name: prompt.title,
        item: `${SITE_URL}/prompts/${id}`,
      },
    ],
  }

  const shareUrl = `${SITE_URL}/prompts/${id}`
  const shareText = `${prompt.title} | ${SITE_NAME}\n${prompt.description ?? ''}`.slice(0, 200)

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* パンくず */}
      <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-4 flex-wrap" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-foreground transition-colors">ホーム</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/prompts" className="hover:text-foreground transition-colors">プロンプト一覧</Link>
        {genre && (
          <>
            <ChevronRight className="w-3 h-3" />
            <Link href={`/categories/${genre.slug}`} className="hover:text-foreground transition-colors">
              {genre.name}
            </Link>
          </>
        )}
        <ChevronRight className="w-3 h-3" />
        <span className="text-foreground line-clamp-1">{prompt.title}</span>
      </nav>

      {/* リーダーボード広告 */}
      <div className="mb-6">
        <A8Banner size="leaderboard" />
      </div>

      {justPurchased && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-sm text-emerald-400">
          購入ありがとうございます！プロンプトの全文が表示されています。
        </div>
      )}

      {/* 2カラムレイアウト */}
      <div className="flex gap-8 items-start">
        {/* メインコンテンツ */}
        <div className="flex-1 min-w-0">
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="p-8 border-b border-border">
              <div className="flex flex-wrap gap-2 mb-4">
                {genre && (
                  <Badge variant="outline" className={`${genre.color} border-current/30 bg-current/10`}>
                    {IconComponent && <IconComponent className="w-3 h-3 mr-1" />}
                    {genre.name}
                  </Badge>
                )}
                {prompt.ai_model && (
                  <Badge variant="outline" className="text-muted-foreground">
                    <Bot className="w-3 h-3 mr-1" />{prompt.ai_model}
                  </Badge>
                )}
                {isPaid && (
                  <Badge className="bg-yellow-400/15 text-yellow-400 border border-yellow-400/30">
                    ¥{(prompt.price as number).toLocaleString()}
                  </Badge>
                )}
              </div>

              <h1 className="text-2xl md:text-3xl font-bold mb-3">{prompt.title}</h1>
              {prompt.description && (
                <p className="text-muted-foreground mb-6">{prompt.description}</p>
              )}

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  {prompt.profile?.username ?? '匿名'}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(prompt.created_at).toLocaleDateString('ja-JP')}
                </span>
                <span className="flex items-center gap-1.5">
                  <Copy className="w-3.5 h-3.5 text-violet-400" />
                  {prompt.copy_count} コピー
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              {showFullContent ? (
                <>
                  <div className="bg-muted rounded-xl p-6 mb-6 border border-border">
                    <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-foreground/90 break-words">
                      {prompt.content}
                    </pre>
                  </div>
                  <div className="flex flex-wrap gap-3 mb-4">
                    <CopyButton promptId={prompt.id} content={prompt.content} />
                    <FavoriteButton
                      promptId={prompt.id}
                      initialFavorited={!!myFav}
                      initialCount={favCount ?? 0}
                      isLoggedIn={!!user}
                    />
                    {isOwner && (
                      <>
                        <Link href={`/prompts/${prompt.id}/edit`}>
                          <Button variant="outline" size="sm" className="gap-2">
                            <Pencil className="w-4 h-4" /> 編集
                          </Button>
                        </Link>
                        <form action={deletePrompt.bind(null, prompt.id)}>
                          <Button variant="outline" size="sm" type="submit"
                            className="gap-2 border-destructive/50 text-destructive hover:bg-destructive/10">
                            <Trash2 className="w-4 h-4" /> 削除
                          </Button>
                        </form>
                      </>
                    )}
                  </div>
                  <ShareButtons url={shareUrl} text={shareText} title={prompt.title} />
                </>
              ) : (
                /* 有料プロンプト - プレビュー + 購入ゲート */
                <>
                  <div className="relative mb-6">
                    <div className="bg-muted rounded-xl p-6 border border-border">
                      <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-foreground/90 break-words line-clamp-3">
                        {prompt.content}
                      </pre>
                    </div>
                    {/* ブラーオーバーレイ */}
                    <div className="absolute bottom-0 left-0 right-0 h-20 rounded-b-xl
                                    bg-gradient-to-t from-card to-transparent" />
                  </div>

                  <div className="bg-muted/30 border border-border rounded-xl p-6 text-center mb-6">
                    <Lock className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
                    <p className="font-semibold mb-1">このプロンプトは有料コンテンツです</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      購入するとプロンプトの全文が表示されます。一度購入すれば永久に閲覧可能です。
                    </p>
                    <PurchaseButton
                      promptId={prompt.id}
                      price={prompt.price as number}
                      isLoggedIn={!!user}
                    />
                  </div>

                  <div className="flex flex-wrap gap-3 mb-4">
                    <FavoriteButton
                      promptId={prompt.id}
                      initialFavorited={!!myFav}
                      initialCount={favCount ?? 0}
                      isLoggedIn={!!user}
                    />
                  </div>
                  <ShareButtons url={shareUrl} text={shareText} title={prompt.title} />
                </>
              )}
            </div>
          </div>
        </div>

        {/* サイドバー */}
        <div className="hidden lg:block w-64 shrink-0 sticky top-24 space-y-4">
          <AffiliateSidebar placement="prompt-detail" />
          <div className="flex flex-col gap-3 items-center pt-1">
            <A8Banner size="rect" />
            <A8Banner size="rect2" />
          </div>
        </div>
      </div>

      {/* プロンプト下部 横長バナー広告 */}
      <div className="mt-6 max-w-4xl">
        <AffiliateStrip promptId={id} />
      </div>

      {/* 関連プロンプト（内部リンク強化 + SEO） */}
      {relatedPrompts.length > 0 && (
        <section className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">
              {genre ? `関連する${genre.name}プロンプト` : '関連プロンプト'}
            </h2>
            {genre && (
              <Link href={`/categories/${genre.slug}`}>
                <Button variant="ghost" size="sm" className="text-muted-foreground">
                  もっと見る
                </Button>
              </Link>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {relatedPrompts.map(p => <PromptCard key={p.id} prompt={p} />)}
          </div>
        </section>
      )}
    </div>
  )
}
