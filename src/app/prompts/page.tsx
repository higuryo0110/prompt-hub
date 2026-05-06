import { createClient } from '@/lib/supabase/server'
import PromptCard from '@/components/prompts/PromptCard'
import GenreFilter from '@/components/prompts/GenreFilter'
import SortFilter from '@/components/prompts/SortFilter'
import SearchBox from '@/components/prompts/SearchBox'
import type { PromptWithDetails } from '@/types'
import { GENRES } from '@/lib/genres'
import { Suspense } from 'react'
import { TrendingUp, Heart, Search } from 'lucide-react'

type Props = {
  searchParams: Promise<{ genre?: string; q?: string; sort?: string }>
}

async function PromptList({ genre, q, sort }: { genre?: string; q?: string; sort?: string }) {
  const supabase = await createClient()

  let query = supabase
    .from('prompts')
    .select(`*, genre:genres(*), profile:profiles!prompts_user_id_fkey(*)`)
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
  } else if (sort === 'likes') {
    query = query.order('favorite_count', { ascending: false })
  } else {
    query = query.order('created_at', { ascending: false })
  }

  const { data, error } = await query.limit(48)

  if (error) console.error('PromptList error:', error)

  const prompts: PromptWithDetails[] = (data ?? []).map((p: Record<string, unknown>) => ({
    ...(p as unknown as PromptWithDetails),
    favorite_count: (p.favorite_count as number) ?? 0,
  }))

  if (prompts.length === 0) {
    return (
      <div className="text-center py-24 text-muted-foreground">
        <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
        <p className="text-lg mb-2">プロンプトが見つかりませんでした</p>
        <p className="text-sm">別のキーワードやジャンルで試してみてください</p>
      </div>
    )
  }

  return (
    <>
      <p className="text-sm text-muted-foreground mb-4">{prompts.length}件のプロンプト</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {prompts.map((prompt, index) => (
          <PromptCard
            key={prompt.id}
            prompt={prompt}
            rank={sort !== 'new' && index < 3 ? index + 1 : undefined}
          />
        ))}
      </div>
    </>
  )
}

async function RankingTop3({ sort }: { sort: string }) {
  const supabase = await createClient()
  const orderCol = sort === 'popular' ? 'copy_count' : 'favorite_count'
  const { data } = await supabase
    .from('prompts')
    .select('id, title, copy_count, favorite_count')
    .eq('is_public', true)
    .order(orderCol, { ascending: false })
    .limit(3)

  if (!data?.length) return null

  const medals = ['🥇', '🥈', '🥉']

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
      {data.map((p, i) => (
        <a key={p.id} href={`/prompts/${p.id}`}
           className="bg-card border border-border rounded-xl p-4 flex items-center gap-3
                      hover:border-violet-500/50 transition-colors no-underline">
          <span className="text-2xl">{medals[i]}</span>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate text-foreground">{p.title}</p>
            <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Heart className="w-3 h-3 text-pink-400" />{p.favorite_count}
              </span>
              <span className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-violet-400" />{p.copy_count}
              </span>
            </div>
          </div>
        </a>
      ))}
    </div>
  )
}

export default async function PromptsPage({ searchParams }: Props) {
  const params = await searchParams
  const genre = params.genre
  const q = params.q
  const sort = params.sort ?? 'new'

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">プロンプトを探す</h1>
        <p className="text-muted-foreground">厳選されたAIプロンプトを発見してください</p>
      </div>

      {/* ランキングTOP3（いいね順・コピー数順のみ表示） */}
      {(sort === 'likes' || sort === 'popular') && (
        <div className="mb-6">
          <p className="text-sm font-semibold mb-3 flex items-center gap-1.5">
            {sort === 'likes'
              ? <><Heart className="w-4 h-4 text-pink-400" />いいねランキング TOP3</>
              : <><TrendingUp className="w-4 h-4 text-violet-400" />コピー数ランキング TOP3</>
            }
          </p>
          <RankingTop3 sort={sort} />
        </div>
      )}

      {/* 検索・ソート */}
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <Suspense fallback={<div className="h-9 w-64 bg-card border border-border rounded-lg animate-pulse" />}>
            <SearchBox />
          </Suspense>
          <SortFilter current={sort} genre={genre} q={q} />
        </div>
        {q && (
          <p className="text-sm text-muted-foreground flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5" />
            「<strong className="text-foreground">{q}</strong>」の検索結果
          </p>
        )}
        <Suspense fallback={<div className="h-8 bg-card rounded-full animate-pulse w-full max-w-lg" />}>
          <GenreFilter />
        </Suspense>
      </div>

      {/* プロンプト一覧 - keyでsort変更時に必ず再レンダリング */}
      <Suspense
        key={`${genre ?? 'all'}-${q ?? ''}-${sort}`}
        fallback={
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl h-56 animate-pulse" />
            ))}
          </div>
        }
      >
        <PromptList genre={genre} q={q} sort={sort} />
      </Suspense>
    </div>
  )
}
