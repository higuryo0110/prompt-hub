import { createClient } from '@/lib/supabase/server'
import PromptCard from '@/components/prompts/PromptCard'
import GenreFilter from '@/components/prompts/GenreFilter'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import type { PromptWithDetails } from '@/types'
import { GENRES } from '@/lib/genres'
import { Suspense } from 'react'

type Props = {
  searchParams: Promise<{ genre?: string; q?: string; sort?: string }>
}

async function PromptList({ genre, q, sort }: { genre?: string; q?: string; sort?: string }) {
  const supabase = await createClient()

  let query = supabase
    .from('prompts')
    .select(`*, genre:genres(*), profile:profiles(*), favorites(count)`)
    .eq('is_public', true)

  if (genre && genre !== 'all') {
    const g = GENRES.find(x => x.slug === genre)
    if (g) query = query.eq('genre_id', g.id)
  }
  if (q) {
    query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%,content.ilike.%${q}%`)
  }

  if (sort === 'popular') {
    query = query.order('copy_count', { ascending: false })
  } else {
    query = query.order('created_at', { ascending: false })
  }

  const { data } = await query.limit(48)

  const prompts: PromptWithDetails[] = (data ?? []).map((p: Record<string, unknown>) => ({
    ...(p as unknown as PromptWithDetails),
    favorite_count: Array.isArray(p.favorites)
      ? (p.favorites[0] as { count: number })?.count ?? 0
      : 0,
  }))

  if (prompts.length === 0) {
    return (
      <div className="text-center py-24 text-muted-foreground">
        <p className="text-lg mb-2">プロンプトが見つかりませんでした</p>
        <p className="text-sm">条件を変えて検索してみてください</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {prompts.map(prompt => (
        <PromptCard key={prompt.id} prompt={prompt} />
      ))}
    </div>
  )
}

export default async function PromptsPage({ searchParams }: Props) {
  const params = await searchParams
  const { genre, q, sort } = params

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">プロンプトを探す</h1>
        <p className="text-muted-foreground">厳選されたAIプロンプトを発見してください</p>
      </div>

      <div className="flex flex-col gap-6 mb-8">
        <form method="get" className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            name="q"
            defaultValue={q}
            placeholder="プロンプトを検索..."
            className="pl-9 bg-card border-border focus:border-violet-500"
          />
          {genre && <input type="hidden" name="genre" value={genre} />}
        </form>

        <Suspense>
          <GenreFilter />
        </Suspense>
      </div>

      <Suspense fallback={
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-2xl h-56 animate-pulse" />
          ))}
        </div>
      }>
        <PromptList genre={genre} q={q} sort={sort} />
      </Suspense>
    </div>
  )
}
