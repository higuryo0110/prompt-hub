'use client'

import { Button } from '@/components/ui/button'
import { Share2, Link as LinkIcon } from 'lucide-react'
import { toast } from 'sonner'

type Props = {
  url: string
  text: string
  title: string
}

export default function ShareButtons({ url, text, title }: Props) {
  const tweetText = encodeURIComponent(`${text}\n\n#プロンプトシェア #AI #プロンプト`)
  const tweetUrl = `https://twitter.com/intent/tweet?text=${tweetText}&url=${encodeURIComponent(url)}`
  const lineUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}`
  const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
  const hatebuUrl = `https://b.hatena.ne.jp/entry/${url.replace(/^https?:\/\//, '')}`

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      toast.success('リンクをコピーしました')
    } catch {
      toast.error('コピーできませんでした')
    }
  }

  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url })
      } catch {
        // user canceled
      }
    } else {
      copyLink()
    }
  }

  return (
    <div className="border-t border-border pt-4">
      <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1.5">
        <Share2 className="w-3.5 h-3.5" />
        このプロンプトをシェア
      </p>
      <div className="flex flex-wrap gap-2">
        <a
          href={tweetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-black text-white hover:bg-neutral-800 transition-colors"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          X (Twitter)
        </a>
        <a
          href={lineUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors"
        >
          LINE
        </a>
        <a
          href={fbUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        >
          Facebook
        </a>
        <a
          href={hatebuUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-cyan-700 text-white hover:bg-cyan-800 transition-colors"
        >
          はてブ
        </a>
        <Button variant="outline" size="sm" onClick={copyLink} className="gap-1.5 h-[30px] text-xs">
          <LinkIcon className="w-3.5 h-3.5" />
          リンクをコピー
        </Button>
        <Button variant="outline" size="sm" onClick={nativeShare} className="gap-1.5 h-[30px] text-xs md:hidden">
          <Share2 className="w-3.5 h-3.5" />
          シェア
        </Button>
      </div>
    </div>
  )
}
