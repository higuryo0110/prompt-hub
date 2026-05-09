import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import FavoriteButton from '@/components/prompts/FavoriteButton'
import CopyButton from '@/components/prompts/CopyButton'
import PurchaseButton from '@/components/prompts/PurchaseButton'
import PremiumBadge from '@/components/ui/PremiumBadge'
import AffiliateSidebar from '@/components/ads/AffiliateSidebar'
import Link from 'next/link'
import { GENRES } from '@/lib/genres'
import * as Icons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Bot, User, Calendar, Copy, Pencil, Trash2, Lock } from 'lucide-react'
import { deletePrompt } from '@/lib/actions/prompts'
import type { Metadata } from 'next'

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ purchased?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = await createClient()
  const { id } = await params
  const { data } = await supabase.from('prompts').select('title,description').eq('id', id).single()
  const title = data?.title ?? 'プロンプト詳細'
  const description = data?.description || `${title} - プロンプトシェアで公開されているAIプロンプトです。`
  return {
    title,
    description,
    openGraph: { title, description, type: 'article' },
    twitter: { card: 'summary', title, description },
    alternates: { canonical: `https://prompt-share-rosy.vercel.app/prompts/${id}` },
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

  const [{ count: favCount }, { data: myFav }, { data: myPurchase }] = await Promise.all([
    supabase.from('favorites').select('*', { count: 'exact', head: true }).eq('prompt_id', id),
    user ? supabase.from('favorites').select('*').eq('prompt_id', id).eq('user_id', user.id).maybeSingle() : Promise.resolve({ data: null }),
    // 購入済みチェック (prompt_purchasesテーブルが存在する場合)
    (async () => {
      if (!user || !prompt.price) return { data: null }
      try {
        return await supabase.from('prompt_purchases').select('id').eq('prompt_id', id).eq('buyer_id', user.id).maybeSingle()
      } catch { return { data: null } }
    })(),
  ])

  const genre = GENRES.find(g => g.id === prompt.genre_id)
  const IconComponent = genre ? (Icons[genre.icon as keyof typeof Icons] as LucideIcon) : null
  const isOwner = user?.id === prompt.user_id
  const isPaid = !!prompt.price
  const hasPurchased = isOwner || !!myPurchase || justPurchased
  const showFullContent = !isPaid || hasPurchased

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-6">
        <Link href="/prompts" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          ← プロンプト一覧へ戻る
        </Link>
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
                  {prompt.profile?.is_premium && <PremiumBadge size="xs" />}
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
                  <div className="flex flex-wrap gap-3">
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

                  <div className="flex flex-wrap gap-3">
                    <FavoriteButton
                      promptId={prompt.id}
                      initialFavorited={!!myFav}
                      initialCount={favCount ?? 0}
                      isLoggedIn={!!user}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* サイドバー */}
        <div className="hidden lg:block w-64 shrink-0 sticky top-24">
          <AffiliateSidebar placement="prompt-detail" />
        </div>
      </div>
    </div>
  )
}
