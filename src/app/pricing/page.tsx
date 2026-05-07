'use client'

import { useState } from 'react'
import { Check, Zap, Crown, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PLANS } from '@/lib/stripe'

export default function PricingPage() {
  const [loading, setLoading] = useState(false)

  const handleUpgrade = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/stripe/checkout', { method: 'POST' })
      if (res.status === 401) {
        window.location.href = '/login?redirect=/pricing'
        return
      }
      const { url } = await res.json()
      if (url) window.location.href = url
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-violet-500/20 text-violet-300 border-violet-500/30">
            <Sparkles className="w-3 h-3 mr-1" />
            料金プラン
          </Badge>
          <h1 className="text-4xl font-bold mb-4">
            <span className="gradient-text">プロンプトシェア</span> を
            <br />最大限に活用しよう
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            プレミアムプランで投稿数制限なし・広告なし・プレミアムバッジを取得
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Free Plan */}
          <div className="bg-card border border-border rounded-2xl p-8 flex flex-col">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-muted-foreground" />
                <h2 className="text-xl font-bold">{PLANS.free.name}</h2>
              </div>
              <div className="flex items-end gap-1 mt-4">
                <span className="text-4xl font-black">¥0</span>
                <span className="text-muted-foreground mb-1">/月</span>
              </div>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {PLANS.free.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="w-4 h-4 text-muted-foreground/50 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>

            <Button variant="outline" className="w-full" disabled>
              現在のプラン
            </Button>
          </div>

          {/* Premium Plan */}
          <div className="relative bg-card border-2 border-violet-500/60 rounded-2xl p-8 flex flex-col
                          shadow-[0_0_30px_rgba(139,92,246,0.15)]">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
              <Badge className="bg-gradient-to-r from-violet-600 to-cyan-600 text-white border-0 px-4 py-1">
                おすすめ
              </Badge>
            </div>

            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-5 h-5 text-yellow-400" />
                <h2 className="text-xl font-bold">{PLANS.premium.name}</h2>
              </div>
              <div className="flex items-end gap-1 mt-4">
                <span className="text-4xl font-black gradient-text">¥{PLANS.premium.price.toLocaleString()}</span>
                <span className="text-muted-foreground mb-1">/月</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">いつでもキャンセル可能</p>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {PLANS.premium.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-violet-400 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>

            <Button
              onClick={handleUpgrade}
              disabled={loading}
              className="w-full bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 border-0 text-white font-bold py-6"
            >
              {loading ? '処理中...' : 'プレミアムにアップグレード'}
            </Button>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-20 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">よくある質問</h2>
          <div className="space-y-6">
            {[
              { q: 'いつでもキャンセルできますか？', a: 'はい。いつでもキャンセル可能です。キャンセル後も期間終了まで引き続きプレミアム機能をご利用いただけます。' },
              { q: '支払い方法は？', a: 'クレジットカード・デビットカードに対応しています（Visa・Mastercard・American Express等）。' },
              { q: 'フリープランで投稿数を超えたらどうなりますか？', a: '月3件の投稿を超えると新規投稿ができなくなります。プレミアムにアップグレードすると無制限に投稿できます。' },
              { q: 'プレミアムバッジとは？', a: 'プレミアム会員にはプロフィールと投稿カードに金色のバッジが表示され、信頼性が増します。' },
            ].map(({ q, a }) => (
              <div key={q} className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-semibold mb-2">{q}</h3>
                <p className="text-muted-foreground text-sm">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
