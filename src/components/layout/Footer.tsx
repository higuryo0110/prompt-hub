/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import A8Banner from '@/components/ads/A8Banner'

export default function Footer() {
  return (
    <footer className="border-t border-border mt-12 py-10 px-4 bg-muted/20">
      <div className="max-w-7xl mx-auto">
        {/* A8.net バナー行 */}
        <div className="flex flex-wrap gap-3 items-center justify-center mb-8">
          <A8Banner size="small" />
          <A8Banner size="small2" />
          <A8Banner size="small" />
          <A8Banner size="small2" />
          <A8Banner size="small" />
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">プロンプトシェア</span>
            <span>— AIプロンプト共有サービス</span>
          </div>
          <div className="flex gap-4">
            <Link href="/prompts" className="hover:text-foreground transition-colors">プロンプト一覧</Link>
            <Link href="/prompts/new" className="hover:text-foreground transition-colors">投稿する</Link>
          </div>
          <p>© {new Date().getFullYear()} プロンプトシェア</p>
        </div>
      </div>
    </footer>
  )
}
