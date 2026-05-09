import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PenSquare, Copy, Heart, Pencil, Trash2, Bot } from 'lucide-react'
import { GENRES } from '@/lib/genres'
import { deletePrompt } from '@/lib/actions/prompts'
import type { Prompt } from '@/types'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: profile }, { data: prompts }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('prompts').select('*, favorites(count)').eq('user_id', user.id).order('created_at', { ascending: false }),
  ])

  const totalFavorites = (prompts ?? []).reduce((acc, p) => {
    const count = Array.isArray(p.favorites) ? (p.favorites[0] as { count: number })?.count ?? 0 : 0
    return acc + count
  }, 0)
  const totalCopies = (prompts ?? []).reduce((acc, p: Prompt) => acc + (p.copy_count ?? 0), 0)

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">マイページ</h1>
          <p className="text-muted-foreground">@{profile?.username ?? user.email}</p>
        </div>
        <Link href="/prompts/new">
          <Button className="bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 border-0">
            <PenSquare className="w-4 h-4 mr-2" />
            新規投稿
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        {[
          { label: '投稿数', value: prompts?.length ?? 0, icon: PenSquare, color: 'text-violet-400' },
          { label: 'お気に入り数', value: totalFavorites, icon: Heart, color: 'text-pink-400' },
          { label: 'コピー数', value: totalCopies, icon: Copy, color: 'text-cyan-400' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-card border border-border rounded-xl p-5 text-center">
            <Icon className={`w-5 h-5 ${color} mx-auto mb-2`} />
            <div className="text-2xl font-bold">{value}</div>
            <div className="text-xs text-muted-foreground mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Prompts */}
      <div>
        <h2 className="text-xl font-semibold mb-4">投稿したプロンプト</h2>
        {!prompts || prompts.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-border rounded-2xl">
            <p className="text-muted-foreground mb-4">まだプロンプトを投稿していません</p>
            <Link href="/prompts/new">
              <Button variant="outline">最初のプロンプトを投稿する</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {prompts.map((prompt: Prompt & { favorites: unknown }) => {
              const genre = GENRES.find(g => g.id === prompt.genre_id)
              const favCount = Array.isArray(prompt.favorites)
                ? (prompt.favorites[0] as { count: number })?.count ?? 0
                : 0
              return (
                <div key={prompt.id}
                  className="bg-card border border-border rounded-xl p-4 flex items-center gap-4 hover:border-violet-500/30 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Link href={`/prompts/${prompt.id}`}
                        className="font-medium hover:text-violet-300 transition-colors truncate">
                        {prompt.title}
                      </Link>
                      {genre && <Badge variant="outline" className={`${genre.color} border-current/30 bg-current/10 text-xs shrink-0`}>{genre.name}</Badge>}
                      {prompt.ai_model && <Badge variant="outline" className="text-muted-foreground text-xs shrink-0"><Bot className="w-3 h-3 mr-1" />{prompt.ai_model}</Badge>}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Heart className="w-3 h-3 text-pink-400" />{favCount}</span>
                      <span className="flex items-center gap-1"><Copy className="w-3 h-3 text-violet-400" />{prompt.copy_count}</span>
                      <span>{new Date(prompt.created_at).toLocaleDateString('ja-JP')}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Link href={`/prompts/${prompt.id}/edit`}>
                      <Button variant="ghost" size="sm"><Pencil className="w-3.5 h-3.5" /></Button>
                    </Link>
                    <form action={deletePrompt.bind(null, prompt.id)}>
                      <Button variant="ghost" size="sm" type="submit" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </form>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
