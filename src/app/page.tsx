import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import PromptCard from '@/components/prompts/PromptCard'
import NewsletterForm from '@/components/newsletter/NewsletterForm'
import { GENRES } from '@/lib/genres'
import { ArrowRight, Zap, Users, TrendingUp, Mail } from 'lucide-react'
import type { PromptWithDetails } from '@/types'
import * as Icons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'プロンプトシェア',
  alternateName: 'PromptShare',
  url: 'https://prompt-share-rosy.vercel.app',
  description: 'プロンプトシェアは、業務委託・アプリ制作・画像生成・ライティングなど、あらゆるジャンルのAIプロンプトを無料で共有・発見できるプロンプト共有サービスです。',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://prompt-share-rosy.vercel.app/prompts?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
}

export default async function HomePage() {
  const supabase = await createClient()

  const { data: prompts } = await supabase
    .from('prompts')
    .select(`*, genre:genres(*), profile:profiles!prompts_user_id_fkey(*), favorites(count)`)
    .eq('is_public', true)
    .order('created_at', { ascending: false })
    .limit(8)

  const popularPrompts = await supabase
    .from('prompts')
    .select(`*, genre:genres(*), profile:profiles!prompts_user_id_fkey(*), favorites(count)`)
    .eq('is_public', true)
    .order('copy_count', { ascending: false })
    .limit(4)

  const formatPrompts = (data: Record<string, unknown>[] | null): PromptWithDetails[] =>
    (data ?? []).map(p => ({
      ...(p as unknown as PromptWithDetails),
      favorite_count: Array.isArray(p.favorites)
        ? (p.favorites[0] as { count: number })?.count ?? 0
        : 0,
    }))

  const latestPrompts = formatPrompts(prompts as unknown as Record<string, unknown>[])
  const topPrompts = formatPrompts(popularPrompts.data as unknown as Record<string, unknown>[])

  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Hero */}
      <section className="relative overflow-hidden py-24 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-950/30 via-background to-background" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute top-10 right-1/4 w-64 h-64 bg-cyan-600/10 rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/30
                          rounded-full px-4 py-1.5 text-sm text-violet-300 mb-6">
            <Zap className="w-3.5 h-3.5" />
            AIプロンプト共有サービス「プロンプトシェア」
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            最高の
            <span className="gradient-text">プロンプト</span>
            <br />を、あなたの手に
          </h1>
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
            プロンプトシェアは、業務委託・アプリ制作・画像生成など、あらゆるジャンルの厳選AIプロンプトを
            無料で発見・共有・お気に入り登録できるプロンプト共有サービスです。
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/prompts">
              <Button size="lg" className="bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 border-0 h-12 px-8">
                プロンプトを探す
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="lg" variant="outline" className="h-12 px-8 border-border hover:border-violet-500/50">
                無料で始める
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap gap-8 justify-center mt-14 text-sm text-muted-foreground">
            {[
              { icon: Zap, label: '高品質プロンプト', value: '1,000+' },
              { icon: Users, label: '登録ユーザー', value: '500+' },
              { icon: TrendingUp, label: '月間コピー数', value: '10,000+' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-violet-400" />
                <span className="text-foreground font-semibold">{value}</span>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Genres */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">ジャンルから探す</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {GENRES.map(genre => {
              const IconComponent = Icons[genre.icon as keyof typeof Icons] as LucideIcon
              return (
                <Link key={genre.slug} href={`/prompts?genre=${genre.slug}`}>
                  <div className="group bg-card border border-border rounded-xl p-4 flex items-center gap-3
                                  hover:border-violet-500/50 transition-all duration-200 hover:-translate-y-0.5 card-glow">
                    <div className={`w-9 h-9 rounded-lg bg-muted flex items-center justify-center ${genre.color}`}>
                      {IconComponent && <IconComponent className="w-4 h-4" />}
                    </div>
                    <span className="font-medium text-sm group-hover:text-violet-300 transition-colors">
                      {genre.name}
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Popular */}
      {topPrompts.length > 0 && (
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">🔥 人気のプロンプト</h2>
              <Link href="/prompts?sort=popular">
                <Button variant="ghost" size="sm" className="text-muted-foreground">
                  すべて見る <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {topPrompts.map(prompt => (
                <PromptCard key={prompt.id} prompt={prompt} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest */}
      {latestPrompts.length > 0 && (
        <section className="py-16 px-4 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">✨ 新着プロンプト</h2>
              <Link href="/prompts">
                <Button variant="ghost" size="sm" className="text-muted-foreground">
                  すべて見る <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {latestPrompts.map(prompt => (
                <PromptCard key={prompt.id} prompt={prompt} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* メルマガ登録 */}
      <section className="py-16 px-4 border-t border-border">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-12 h-12 rounded-2xl bg-violet-500/15 flex items-center justify-center mx-auto mb-4">
            <Mail className="w-6 h-6 text-violet-400" />
          </div>
          <h2 className="text-2xl font-bold mb-2">週刊AIプロンプト通信</h2>
          <p className="text-muted-foreground mb-6">
            毎週金曜日に厳選プロンプト5選と最新AIトレンドをお届けします。登録無料・いつでも解除可能。
          </p>
          <NewsletterForm />
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-gradient-to-r from-violet-900/40 to-cyan-900/40 border border-violet-500/20
                          rounded-3xl p-12">
            <h2 className="text-3xl font-bold mb-4">あなたのプロンプトを共有しよう</h2>
            <p className="text-muted-foreground mb-8">
              作成したプロンプトを公開して、コミュニティに貢献しましょう。
            </p>
            <Link href="/signup">
              <Button size="lg" className="bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 border-0 h-12 px-8">
                今すぐ無料登録
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
