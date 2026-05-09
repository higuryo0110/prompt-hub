import React from 'react'
import { createClient } from '@/lib/supabase/server'
import PromptCard from '@/components/prompts/PromptCard'
import AdBanner from '@/components/ads/AdBanner'
import AffiliateSidebar from '@/components/ads/AffiliateSidebar'
import A8Banner from '@/components/ads/A8Banner'
import type { PromptWithDetails } from '@/types'
import { GENRES } from '@/lib/genres'
import { Suspense } from 'react'
import { Search, Clock, Heart, Copy, LayoutGrid } from 'lucide-react'
import * as Icons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type Props = {
  searchParams: Promise<{ genre?: string; q?: string; sort?: string }>
}

const SORT_OPTIONS = [
  { value: 'new',     label: '新着順',     icon: Clock },
  { value: 'likes',   label: 'いいね順',   icon: Heart },
  { value: 'popular', label: 'コピー数順', icon: Copy },
]

async function PromptList({ genre, q, sort }: { genre?: string; q?: string; sort?: string }): Promise<React.ReactElement> {
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

  const { data } = await query.limit(48)

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

  const withAds: React.ReactNode[] = []
  prompts.forEach((prompt, index) => {
    withAds.push(
      <PromptCard
        key={prompt.id}
        prompt={prompt}
        rank={sort !== 'new' && sort !== undefined && index < 3 ? index + 1 : undefined}
      />
    )
    if (index === 7 || index === 19) {
      withAds.push(
        <div key={`ad-${index}`} className="col-span-full">
          <AdBanner slot="1234567890" format="horizontal" className="max-w-2xl mx-auto" />
        </div>
      )
    }
  })

  return (
    <>
      <p className="text-sm text-muted-foreground mb-4">{prompts.length}件のプロンプト</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {withAds}
      </div>
    </>
  )
}

export default async function PromptsPage({ searchParams }: Props) {
  const params = await searchParams
  const genre = params.genre ?? 'all'
  const q = params.q ?? ''
  const sort = params.sort ?? 'new'

  const buildUrl = (overrides: Record<string, string>) => {
    const merged = { genre, q, sort, ...overrides }
    const p = new URLSearchParams()
    if (merged.genre && merged.genre !== 'all') p.set('genre', merged.genre)
    if (merged.q) p.set('q', merged.q)
    if (merged.sort && merged.sort !== 'new') p.set('sort', merged.sort)
    const qs = p.toString()
    return `/prompts${qs ? `?${qs}` : ''}`
  }

  const allGenres = [
    { id: 0, slug: 'all', name: 'すべて', icon: 'LayoutGrid', color: 'text-slate-300' },
    ...GENRES,
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">プロンプトを探す</h1>
        <p className="text-muted-foreground">厳選されたAIプロンプトを発見してください</p>
      </div>

      {/* リーダーボード広告 */}
      <div className="mb-6">
        <A8Banner size="leaderboard" />
      </div>

      {/* ── 検索バー ── */}
      <form method="GET" action="/prompts" className="relative max-w-xl mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="タイトル・説明・プロンプト内容で検索..."
          className="w-full pl-9 pr-24 py-2.5 rounded-xl bg-card border border-border text-sm
                     text-foreground placeholder:text-muted-foreground
                     focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
        />
        {sort !== 'new' && <input type="hidden" name="sort" value={sort} />}
        {genre !== 'all' && <input type="hidden" name="genre" value={genre} />}
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 text-xs font-medium
                     rounded-lg bg-violet-600 hover:bg-violet-500 text-white transition-colors"
        >
          検索
        </button>
      </form>

      {/* ── 並び順タブ ── */}
      <div className="mb-6">
        <p className="text-xs text-muted-foreground mb-2 font-medium">並び順</p>
        <div className="flex gap-2 flex-wrap">
          {SORT_OPTIONS.map(({ value, label, icon: Icon }) => {
            const isActive = sort === value
            return (
              <a
                key={value}
                href={buildUrl({ sort: value })}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
                            transition-all duration-200 border no-underline
                            ${isActive
                    ? 'bg-gradient-to-r from-violet-600 to-cyan-600 text-white border-transparent shadow-md shadow-violet-500/30'
                    : 'bg-card text-muted-foreground border-border hover:text-foreground hover:border-violet-400/50'
                  }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </a>
            )
          })}
        </div>
      </div>

      {/* ── ジャンルフィルター ── */}
      <div className="mb-8">
        <p className="text-xs text-muted-foreground mb-2 font-medium">ジャンル</p>
        <div className="flex flex-wrap gap-2">
          {allGenres.map(g => {
            const IconComponent = Icons[g.icon as keyof typeof Icons] as LucideIcon
            const isActive = genre === g.slug
            return (
              <a
                key={g.slug}
                href={buildUrl({ genre: g.slug })}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium
                            transition-all duration-200 border no-underline
                            ${isActive
                    ? 'bg-gradient-to-r from-violet-600 to-cyan-600 border-transparent text-white shadow-lg shadow-violet-500/25'
                    : 'bg-card border-border text-muted-foreground hover:border-violet-500/50 hover:text-foreground'
                  }`}
              >
                {IconComponent && <IconComponent className={`w-3.5 h-3.5 ${isActive ? 'text-white' : g.color}`} />}
                {g.name}
              </a>
            )
          })}
        </div>
      </div>

      {/* ── 検索中ラベル ── */}
      {q && (
        <p className="text-sm text-muted-foreground mb-4 flex items-center gap-1.5">
          <Search className="w-3.5 h-3.5" />
          「<strong className="text-foreground">{q}</strong>」の検索結果
          <a href={buildUrl({ q: '' })} className="ml-1 text-violet-400 hover:text-violet-300 text-xs">クリア</a>
        </p>
      )}

      {/* ── プロンプト一覧 + サイドバー ── */}
      <div className="flex gap-8 items-start">
        <div className="flex-1 min-w-0">
          <Suspense
            key={`${genre}-${q}-${sort}`}
            fallback={
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-card border border-border rounded-2xl h-56 animate-pulse" />
                ))}
              </div>
            }
          >
            <PromptList genre={genre} q={q} sort={sort} />
          </Suspense>
        </div>

        {/* サイドバー（デスクトップのみ） */}
        <div className="hidden xl:block w-64 shrink-0 sticky top-24 space-y-4">
          <AffiliateSidebar placement="prompt-list" />
          <div className="flex flex-col gap-2 items-center pt-2">
            <A8Banner size="small" />
          </div>
        </div>
      </div>
    </div>
  )
}
