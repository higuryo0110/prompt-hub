'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Crown, Settings } from 'lucide-react'

export default function UpgradeButton({ isManage = false }: { isManage?: boolean }) {
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    setLoading(true)
    try {
      const endpoint = isManage ? '/api/stripe/portal' : '/api/stripe/checkout'
      const res = await fetch(endpoint, { method: 'POST' })
      const { url } = await res.json()
      if (url) window.location.href = url
    } finally {
      setLoading(false)
    }
  }

  if (isManage) {
    return (
      <Button variant="outline" size="sm" onClick={handleClick} disabled={loading}>
        <Settings className="w-3.5 h-3.5 mr-1.5" />
        {loading ? '処理中...' : 'サブスクリプション管理'}
      </Button>
    )
  }

  return (
    <Button
      onClick={handleClick}
      disabled={loading}
      className="bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 border-0 shrink-0"
    >
      <Crown className="w-4 h-4 mr-2" />
      {loading ? '処理中...' : 'アップグレード ¥980/月'}
    </Button>
  )
}
