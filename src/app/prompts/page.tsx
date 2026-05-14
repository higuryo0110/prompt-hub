import React from 'react'
import { createClient } from '@/lib/supabase/server'
import PromptCard from '@/components/prompts/PromptCard'
import AdBanner from '@/components/ads/AdBanner'
import AffiliateSidebar from '@/components/ads/AffiliateSidebar'
import A8Banner from '@/components/ads/A8Banner'
import type { PromptWithDetails } from '@/types'
import { GENRES, CATEGORY_GROUPS } from '@/lib/genres'
import { SITE_URL, SITE_NAME } from '@/lib/constants'
import { Suspense } from 'react'
import { Search, Clock, Heart, Copy, LayoutGrid } from 'lucide-react'
import * as Icons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AIプロンプト一覧 | カテゴリ・人気順で探す',
  description:
    'ChatGPT・Claude・Gemini・Midjourney対応の高品質AIプロンプトを一覧で探せます。業務効率化・アプリ開発・画像生成・ライティングなど8カテゴリから検索。コピペで即利用可能。',
  keywords: ['AIプロンプト 一覧', 'プロンプト 検索', 'ChatGPT プロンプト', 'Claude プロンプト', 'プロンプト集'],
  openGraph: {
    title: 'AIプロンプト一覧 | カテゴリ・人気順で探す',
    description: 'ChatGPT・Claude・Gemini対応の高品質AIプロンプトを一覧で探せます。',
    url: `${SITE_URL}/prompts`,
    type: 'website',
  },
  alternates: { canonical: `${SITE_URL}/prompts` },
}

const PAGE_SIZE = 24

type Props = {
  searchParams: Promise<{ genre?: string; q?: string; sort?: string; page?: string }>
}

const SORT_OPTIONS = [
  { value: 'new',     label: '新着順',     icon: Clock },
  { value: 'likes',   label: 'いいね順',   icon: Heart },
  { value: 'popular', label: 'コピー数順', icon: Copy },
]

async function PromptList({ genre, q, sort, page }: { genre?: string; q?: string; sort?: string; page?: number }): Promise<React.ReactElement> {
  const supabase = await createClient()
  const currentPage = page ?? 1
  const offset = (currentPage - 1) * PAGE_SIZE

  let countQuery = supabase.from('prompts').select('*', { count: 'exact', head: true }).eq('is_public', true)
  let query = supabase
    .from('prompts')
    .select(`*, genre:genres(*), profile:profiles!prompts_user_id_fkey(*)`)
    .eq('is_public', true)

  if (genre && genre !== 'all') {
    const g = GENRES.find(x => x.slug === genre)
    if (g) {
      query = query.eq('genre_id', g.id)
      countQuery = countQuery.eq('genre_id', g.id)
    }
  }
  if (q) {
    query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%`)
    countQuery = countQuery.or(`title.ilike.%${q}%,description.ilike.%${q}%`)
  }

  if (sort === 'popular') {
    query = query.order('copy_count', { ascending: false })
  } else if (sort === 'likes') {
    query = query.order('favorite_count', { ascending: false })
  } else {
    query = query.order('created_at', { ascending: false })
  }

  const [{ data }, { count }] = await Promise.all([
    query.range(offset, offset + PAGE_SIZE - 1),
    countQuery,
  ])

  const total = count ?? 0
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

  const totalPages = Math.ceil(total / PAGE_SIZE)

  const withAds: React.ReactNode[] = []
  prompts.forEach((prompt, index) => {
    withAds.push(
      <PromptCard
        key={prompt.id}
        prompt={prompt}
        rank={sort !== 'new' && sort !== undefined && currentPage === 1 && index < 3 ? index + 1 : undefined}
      />
    )
    if (index === 11) {
      withAds.push(
        <div key={`ad-${index}`} className="col-span-full">
          <AdBanner slot="1234567890" format="horizontal" className="max-w-2xl mx-auto" />
        </div>
      )
    }
  })

  const buildPageUrl = (p: number, params: { genre?: string; q?: string; sort?: string }) => {
    const merged = new URLSearchParams()
    if (params.genre && params.genre !== 'all') merged.set('genre', params.genre)
    if (params.q) merged.set('q', params.q)
    if (params.sort && params.sort !== 'new') merged.set('sort', params.sort)
    if (p > 1) merged.set('page', String(p))
    const qs = merged.toString()
    return `/prompts${qs ? `?${qs}` : ''}`
  }

  return (
    <>
      <p className="text-sm text-muted-foreground mb-4">
        {total}件中 {offset + 1}〜{Math.min(offset + PAGE_SIZE, total)}件を表示
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {withAds}
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          {currentPage > 1 && (
            <a href={buildPageUrl(currentPage - 1, { genre, q, sort })}
              className="px-4 py-2 rounded-xl border border-border bg-card text-sm hover:border-violet-500/50 transition-colors">
              ← 前へ
            </a>
          )}
          {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
            const p = i + 1
            return (
              <a key={p} href={buildPageUrl(p, { genre, q, sort })}
                className={`w-9 h-9 rounded-xl border text-sm flex items-center justify-center transition-colors
                  ${p === currentPage
                    ? 'bg-gradient-to-r from-violet-600 to-cyan-600 border-transparent text-white'
                    : 'border-border bg-card hover:border-violet-500/50'}`}>
                {p}
              </a>
            )
          })}
          {currentPage < totalPages && (
            <a href={buildPageUrl(currentPage + 1, { genre, q, sort })}
              className="px-4 py-2 rounded-xl border border-border bg-card text-sm hover:border-violet-500/50 transition-colors">
              次へ →
            </a>
          )}
        </div>
      )}
    </>
  )
}

export default async function PromptsPage({ searchParams }: Props) {
  const params = await searchParams
  const genre = params.genre ?? 'all'
  const q = params.q ?? ''
  const sort = params.sort ?? 'new'
  const page = Math.max(1, parseInt(params.page ?? '1', 10))

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

      {/* ── ジャンルフィルター（階層型） ── */}
      <div className="mb-8">
        <p className="text-xs text-muted-foreground mb-2 font-medium">ジャンル</p>
        {/* すべてボタン */}
        <div className="flex flex-wrap gap-2 mb-3">
          <a
            href={buildUrl({ genre: 'all' })}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium
                        transition-all duration-200 border no-underline
                        ${genre === 'all'
                ? 'bg-gradient-to-r from-violet-600 to-cyan-600 border-transparent text-white shadow-lg shadow-violet-500/25'
                : 'bg-card border-border text-muted-foreground hover:border-violet-500/50 hover:text-foreground'
              }`}
          >
            <LayoutGrid className={`w-3.5 h-3.5 ${genre === 'all' ? 'text-white' : 'text-slate-300'}`} />
            すべて
          </a>
        </div>
        {/* 大カテゴリ → 小カテゴリ */}
        <div className="space-y-2">
          {CATEGORY_GROUPS.map(group => {
            const GroupIcon = Icons[group.icon as keyof typeof Icons] as LucideIcon
            const hasActive = group.genreSlugs.includes(genre)
            return (
              <div key={group.slug}>
                <div className="flex items-center gap-1.5 mb-1">
                  {GroupIcon && <GroupIcon className={`w-3.5 h-3.5 ${group.color}`} />}
                  <span className={`text-xs font-semibold ${hasActive ? 'text-violet-300' : 'text-muted-foreground'}`}>
                    {group.name}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 ml-5">
                  {group.genreSlugs.map(slug => {
                    const g = GENRES.find(x => x.slug === slug)
                    if (!g) return null
                    const isActive = genre === slug
                    return (
                      <a
                        key={slug}
                        href={buildUrl({ genre: slug })}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-200 border no-underline
                                    ${isActive
                            ? 'bg-violet-600/30 border-violet-500/50 text-violet-300'
                            : 'bg-card border-border text-muted-foreground hover:border-violet-500/50 hover:text-foreground'
                          }`}
                      >
                        {g.name}
                      </a>
                    )
                  })}
                </div>
              </div>
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
            key={`${genre}-${q}-${sort}-${page}`}
            fallback={
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-card border border-border rounded-2xl h-56 animate-pulse" />
                ))}
              </div>
            }
          >
            <PromptList genre={genre} q={q} sort={sort} page={page} />
          </Suspense>
          {/* プロンプト一覧下部 リーダーボード2 */}
          <div className="mt-8">
            <A8Banner size="leaderboard2" />
          </div>
          <div className="mt-6 flex flex-wrap gap-4 justify-center">
            <A8Banner size="rect" />
            <A8Banner size="rect3" />
            <A8Banner size="rect4" />
          </div>
        </div>

        {/* サイドバー（デスクトップのみ） */}
        <div className="hidden xl:block w-64 shrink-0 sticky top-24 space-y-4">
          <AffiliateSidebar placement="prompt-list" />
          <div className="flex flex-col gap-2 items-center pt-2">
            <A8Banner size="small" />
            <A8Banner size="small2" />
          </div>
        </div>
      </div>
    </div>
  )
}
