import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import PromptCard from '@/components/prompts/PromptCard'
import { Button } from '@/components/ui/button'
import { SITE_URL, SITE_NAME } from '@/lib/constants'
import { Trophy, Flame, Sparkles, ChevronRight } from 'lucide-react'
import type { PromptWithDetails } from '@/types'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'プロンプトランキング | 人気・新着・週間トップ',
  description:
    'プロンプトシェアで人気のAIプロンプトTOP30。週間・月間・全期間のランキング、新着順の最新プロンプトを一覧。コピー数・お気に入り順で並び替え可。',
  keywords: ['プロンプト ランキング', '人気 プロンプト', 'AI プロンプト 人気', '週間 ランキング'],
  openGraph: {
    title: 'プロンプトランキング | 人気のAIプロンプトTOP30',
    description: 'プロンプトシェアの人気プロンプトをランキング形式で紹介',
    url: `${SITE_URL}/rankings`,
    type: 'website',
  },
  alternates: { canonical: `${SITE_URL}/rankings` },
}

type Props = { searchParams: Promise<{ tab?: string }> }

export default async function RankingsPage({ searchParams }: Props) {
  const { tab } = await searchParams
  const activeTab = tab ?? 'all'

  const supabase = await createClient()

  // 期間フィルタ
  const now = new Date()
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()

  let query = supabase
    .from('prompts')
    .select('*, genre:genres(*), profile:profiles!prompts_user_id_fkey(*), favorites(count)')
    .eq('is_public', true)
    .order('copy_count', { ascending: false })

  if (activeTab === 'week') {
    query = query.gte('created_at', weekAgo)
  } else if (activeTab === 'month') {
    query = query.gte('created_at', monthAgo)
  } else if (activeTab === 'new') {
    query = supabase
      .from('prompts')
      .select('*, genre:genres(*), profile:profiles!prompts_user_id_fkey(*), favorites(count)')
      .eq('is_public', true)
      .order('created_at', { ascending: false })
  }

  const { data: rawPrompts } = await query.limit(30)
  const prompts: PromptWithDetails[] = (rawPrompts ?? []).map((p: Record<string, unknown>) => ({
    ...(p as unknown as PromptWithDetails),
    favorite_count: Array.isArray(p.favorites)
      ? (p.favorites[0] as { count: number })?.count ?? 0
      : 0,
  }))

  const tabs = [
    { id: 'all', label: '全期間', icon: Trophy },
    { id: 'month', label: '月間', icon: Flame },
    { id: 'week', label: '週間', icon: Flame },
    { id: 'new', label: '新着', icon: Sparkles },
  ]

  // 構造化データ
  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `プロンプトランキング (${tabs.find(t => t.id === activeTab)?.label})`,
    numberOfItems: prompts.length,
    itemListElement: prompts.slice(0, 20).map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${SITE_URL}/prompts/${p.id}`,
      name: p.title,
    })),
  }
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'ホーム', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'ランキング', item: `${SITE_URL}/rankings` },
    ],
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-foreground transition-colors">ホーム</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-foreground">ランキング</span>
      </nav>

      <header className="mb-10">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-yellow-500/15 border border-yellow-500/30 flex items-center justify-center">
            <Trophy className="w-6 h-6 text-yellow-400" />
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">プロンプトランキング TOP30</h1>
        <p className="text-muted-foreground max-w-2xl">
          {SITE_NAME}で最もコピーされているプロンプトをランキング形式で発表。
          週間・月間・全期間で切り替えてトレンドをチェック。
        </p>
      </header>

      {/* タブ */}
      <div className="flex gap-2 flex-wrap mb-8">
        {tabs.map(t => {
          const Icon = t.icon
          const isActive = activeTab === t.id
          return (
            <Link
              key={t.id}
              href={t.id === 'all' ? '/rankings' : `/rankings?tab=${t.id}`}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border ${
                isActive
                  ? 'bg-gradient-to-r from-violet-600 to-cyan-600 text-white border-transparent shadow-md shadow-violet-500/30'
                  : 'bg-card text-muted-foreground border-border hover:text-foreground hover:border-violet-400/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {t.label}
            </Link>
          )
        })}
      </div>

      {/* ランキング */}
      {prompts.length === 0 ? (
        <div className="text-center py-24 bg-card border border-border rounded-2xl">
          <Trophy className="w-12 h-12 mx-auto mb-4 text-yellow-400 opacity-50" />
          <p className="text-lg mb-2 font-medium">この期間のプロンプトはまだありません</p>
          <Link href="/prompts/new">
            <Button className="mt-4 bg-gradient-to-r from-violet-600 to-cyan-600 border-0">
              プロンプトを投稿する
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {prompts.map((p, i) => (
            <Link key={p.id} href={`/prompts/${p.id}`}>
              <div className="group flex gap-4 items-center bg-card border border-border rounded-xl p-4 hover:border-violet-500/50 transition-all hover:-translate-y-0.5 mb-2">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-black flex-shrink-0
                  ${i === 0 ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-400/30' : ''}
                  ${i === 1 ? 'bg-slate-400/20 text-slate-300 border border-slate-400/30' : ''}
                  ${i === 2 ? 'bg-orange-700/20 text-orange-400 border border-orange-700/30' : ''}
                  ${i > 2 ? 'bg-muted text-muted-foreground' : ''}
                `}
                >
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-bold text-base mb-1 group-hover:text-violet-300 transition-colors line-clamp-1">
                    {p.title}
                  </h2>
                  {p.description && (
                    <p className="text-xs text-muted-foreground line-clamp-1">{p.description}</p>
                  )}
                  <div className="flex gap-3 mt-1.5 text-xs text-muted-foreground">
                    {p.genre && (
                      <span className="text-violet-400">{p.genre.name}</span>
                    )}
                    {p.ai_model && <span>{p.ai_model}</span>}
                    <span>コピー {p.copy_count}回</span>
                    <span>❤️ {p.favorite_count}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-12 text-center">
        <Link href="/prompts">
          <Button variant="outline" className="border-violet-500/40 hover:bg-violet-500/10">
            すべてのプロンプトを見る <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
