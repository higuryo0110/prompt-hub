'use client'
export const dynamic = 'force-dynamic'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { signIn } from '@/lib/actions/auth'
import { Zap, Loader2 } from 'lucide-react'

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const result = await signIn(new FormData(e.currentTarget))
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500
                          flex items-center justify-center mx-auto mb-4">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold">おかえりなさい</h1>
          <p className="text-muted-foreground mt-1 text-sm">PromptHubにログイン</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-destructive/10 border border-destructive/50 text-destructive rounded-lg px-3 py-2 text-sm">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">メールアドレス</Label>
              <Input id="email" name="email" type="email" required
                placeholder="you@example.com"
                className="bg-muted border-border focus:border-violet-500" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">パスワード</Label>
              <Input id="password" name="password" type="password" required
                placeholder="••••••••"
                className="bg-muted border-border focus:border-violet-500" />
            </div>
            <Button type="submit" disabled={loading}
              className="w-full bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 border-0 h-10 mt-2">
              {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              ログイン
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-4">
          アカウントがない方は{' '}
          <Link href="/signup" className="text-violet-400 hover:text-violet-300">
            新規登録
          </Link>
        </p>
      </div>
    </div>
  )
}
