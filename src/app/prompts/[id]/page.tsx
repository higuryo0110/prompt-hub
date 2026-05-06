import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import FavoriteButton from '@/components/prompts/FavoriteButton'
import CopyButton from '@/components/prompts/CopyButton'
import Link from 'next/link'
import { GENRES } from '@/lib/genres'
import * as Icons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Bot, User, Calendar, Copy, Pencil, Trash2 } from 'lucide-react'
import { deletePrompt } from '@/lib/actions/prompts'
import type { Metadata } from 'next'

type Props = { params: Promise<{ id: string }> }

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

export default async function PromptDetailPage({ params }: Props) {
  const supabase = await createClient()
  const { id } = await params

  const { data: prompt } = await supabase
    .from('prompts')
    .select(`*, genre:genres(*), profile:profiles!prompts_user_id_fkey(*)`)
    .eq('id', id)
    .single()

  if (!prompt) notFound()

  const { data: { user } } = await supabase.auth.getUser()

  const [{ count: favCount }, { data: myFav }] = await Promise.all([
    supabase.from('favorites').select('*', { count: 'exact', head: true }).eq('prompt_id', id),
    user ? supabase.from('favorites').select('*').eq('prompt_id', id).eq('user_id', user.id).maybeSingle() : Promise.resolve({ data: null }),
  ])

  const genre = GENRES.find(g => g.id === prompt.genre_id)
  const IconComponent = genre ? (Icons[genre.icon as keyof typeof Icons] as LucideIcon) : null
  const isOwner = user?.id === prompt.user_id

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-6">
        <Link href="/prompts" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          ← プロンプト一覧へ戻る
        </Link>
      </div>

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
        </div>
      </div>
    </div>
  )
}
