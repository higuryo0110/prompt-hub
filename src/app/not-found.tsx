import Link from 'next/link'
import { GENRES } from '@/lib/genres'
import { CATEGORY_META } from '@/lib/constants'
import { Home, Search, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ページが見つかりません (404)',
  robots: { index: false, follow: true },
}

export default function NotFound() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-24 text-center">
      <p className="text-7xl font-black text-violet-500/30 mb-4">404</p>
      <h1 className="text-2xl font-bold mb-3">ページが見つかりません</h1>
      <p className="text-muted-foreground mb-8">
        お探しのページは移動または削除された可能性があります。
      </p>

      <div className="flex justify-center gap-3 mb-12">
        <Link href="/">
          <Button variant="outline" className="gap-2">
            <Home className="w-4 h-4" /> トップページ
          </Button>
        </Link>
        <Link href="/prompts">
          <Button className="gap-2 bg-gradient-to-r from-violet-600 to-cyan-600 border-0">
            <Search className="w-4 h-4" /> プロンプトを探す
          </Button>
        </Link>
      </div>

      <section>
        <h2 className="text-lg font-bold mb-4">カテゴリから探す</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {GENRES.map(g => {
            const m = CATEGORY_META[g.slug]
            return (
              <Link key={g.slug} href={`/categories/${g.slug}`}>
                <div className="group bg-card border border-border rounded-xl p-4 flex items-center gap-3
                                hover:border-violet-500/50 transition-all duration-200 hover:-translate-y-0.5">
                  <span className="text-2xl">{m?.emoji ?? '✨'}</span>
                  <span className="font-medium text-sm group-hover:text-violet-300 transition-colors">
                    {g.name}
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}
