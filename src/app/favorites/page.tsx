import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import PromptCard from '@/components/prompts/PromptCard'
import type { PromptWithDetails } from '@/types'
import { Heart } from 'lucide-react'

export default async function FavoritesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data } = await supabase
    .from('favorites')
    .select(`prompt:prompts(*, genre:genres(*), profile:profiles(*), favorites(count))`)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const prompts: PromptWithDetails[] = (data ?? [])
    .map((item: Record<string, unknown>) => {
      const p = item.prompt as Record<string, unknown>
      if (!p) return null
      return {
        ...(p as unknown as PromptWithDetails),
        favorite_count: Array.isArray(p.favorites)
          ? (p.favorites[0] as { count: number })?.count ?? 0
          : 0,
        is_favorited: true,
      }
    })
    .filter(Boolean) as PromptWithDetails[]

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center gap-3 mb-8">
        <Heart className="w-6 h-6 text-pink-400 fill-pink-400" />
        <div>
          <h1 className="text-3xl font-bold">お気に入り</h1>
          <p className="text-muted-foreground mt-1">{prompts.length} 件のプロンプトをお気に入り済み</p>
        </div>
      </div>

      {prompts.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-border rounded-2xl">
          <Heart className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">お気に入りに追加したプロンプトはまだありません</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {prompts.map(prompt => (
            <PromptCard key={prompt.id} prompt={prompt} />
          ))}
        </div>
      )}
    </div>
  )
}
