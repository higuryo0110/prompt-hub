'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Lock } from 'lucide-react'
import Link from 'next/link'

type Props = {
  promptId: string
  price: number
  isLoggedIn: boolean
}

export default function PurchaseButton({ promptId, price, isLoggedIn }: Props) {
  const [loading, setLoading] = useState(false)

  const handlePurchase = async () => {
    if (!isLoggedIn) return
    setLoading(true)
    try {
      const res = await fetch('/api/stripe/prompt-purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promptId }),
      })
      const { url, error } = await res.json()
      if (error) {
        alert(error)
        return
      }
      if (url) window.location.href = url
    } finally {
      setLoading(false)
    }
  }

  if (!isLoggedIn) {
    return (
      <Link href="/login">
        <Button className="w-full bg-gradient-to-r from-violet-600 to-cyan-600 border-0 py-6">
          <Lock className="w-4 h-4 mr-2" />
          ログインして購入（¥{price.toLocaleString()}）
        </Button>
      </Link>
    )
  }

  return (
    <Button
      onClick={handlePurchase}
      disabled={loading}
      className="w-full bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 border-0 py-6 text-base font-bold"
    >
      <ShoppingCart className="w-5 h-5 mr-2" />
      {loading ? '処理中...' : `¥${price.toLocaleString()} で購入してプロンプトを見る`}
    </Button>
  )
}
