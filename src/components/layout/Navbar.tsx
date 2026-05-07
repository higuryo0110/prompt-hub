'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Zap, PenSquare, Heart, LayoutDashboard, LogIn, LogOut, User, Crown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import { signOut } from '@/lib/actions/auth'

export default function Navbar() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [loaded, setLoaded] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const supabase = createClient()
    // onAuthStateChange は INITIAL_SESSION イベントで即座に現在の認証状態を返す
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
      setLoaded(true)
    })
    return () => subscription.unsubscribe()
  }, [])

  return (
    <header className="sticky top-0 z-50 glass border-b border-border">
      <nav className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="gradient-text">プロンプトシェア</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          <Link href="/prompts">
            <Button variant={pathname.startsWith('/prompts') ? 'secondary' : 'ghost'} size="sm">
              探す
            </Button>
          </Link>
          <Link href="/pricing">
            <Button variant={pathname === '/pricing' ? 'secondary' : 'ghost'} size="sm"
                    className={pathname !== '/pricing' ? 'text-yellow-400 hover:text-yellow-300' : ''}>
              <Crown className="w-4 h-4 mr-1" />
              プレミアム
            </Button>
          </Link>
          {loaded && user && (
            <>
              <Link href="/favorites">
                <Button variant={pathname === '/favorites' ? 'secondary' : 'ghost'} size="sm">
                  <Heart className="w-4 h-4 mr-1" />
                  お気に入り
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant={pathname === '/dashboard' ? 'secondary' : 'ghost'} size="sm">
                  <LayoutDashboard className="w-4 h-4 mr-1" />
                  マイページ
                </Button>
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          {!loaded ? (
            // 認証状態が確定するまでスケルトン表示（ちらつき防止）
            <div className="flex items-center gap-2">
              <div className="h-7 w-16 rounded-md bg-muted animate-pulse" />
              <div className="h-7 w-14 rounded-md bg-muted animate-pulse" />
            </div>
          ) : user ? (
            <>
              <Link href="/prompts/new">
                <Button size="sm" className="bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 border-0">
                  <PenSquare className="w-4 h-4 mr-1" />
                  投稿する
                </Button>
              </Link>
              <form action={signOut}>
                <Button variant="ghost" size="sm" type="submit">
                  <LogOut className="w-4 h-4" />
                </Button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  <LogIn className="w-4 h-4 mr-1" />
                  ログイン
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm" className="bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 border-0">
                  <User className="w-4 h-4 mr-1" />
                  登録
                </Button>
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
