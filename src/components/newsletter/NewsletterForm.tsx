'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Mail, CheckCircle } from 'lucide-react'

export default function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setStatus('loading')

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()

      if (res.ok) {
        setStatus('success')
        setMessage(data.message === 'すでに登録済みです' ? 'すでに登録済みです' : '登録完了！毎週金曜に注目プロンプトをお届けします。')
      } else {
        setStatus('error')
        setMessage(data.error ?? '登録に失敗しました')
      }
    } catch {
      setStatus('error')
      setMessage('エラーが発生しました')
    }
  }

  if (status === 'success') {
    return (
      <div className="flex items-center gap-2 text-sm text-emerald-400">
        <CheckCircle className="w-4 h-4" />
        {message}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 flex-wrap">
      <div className="relative flex-1 min-w-[200px]">
        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="メールアドレスを入力"
          className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-card border border-border text-sm
                     text-foreground placeholder:text-muted-foreground
                     focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
          required
        />
      </div>
      <Button
        type="submit"
        disabled={status === 'loading'}
        className="bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 border-0"
      >
        {status === 'loading' ? '登録中...' : '無料で登録'}
      </Button>
      {status === 'error' && <p className="w-full text-xs text-destructive">{message}</p>}
    </form>
  )
}
