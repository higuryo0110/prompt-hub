'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Search, Trophy, Heart, PenSquare, User } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

const TABS = [
  { href: '/prompts', icon: Search, label: '探す' },
  { href: '/rankings', icon: Trophy, label: 'ランキング' },
  { href: '/prompts/new', icon: PenSquare, label: '投稿', accent: true },
  { href: '/favorites', icon: Heart, label: 'お気に入り', auth: true },
  { href: '/dashboard', icon: User, label: 'マイページ', auth: true },
]

export default function BottomNav() {
  const pathname = usePathname()
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setLoggedIn(!!session?.user)
    })
    return () => subscription.unsubscribe()
  }, [])

  const visibleTabs = TABS.map(tab => {
    if (tab.auth && !loggedIn) {
      if (tab.href === '/favorites') return { ...tab, href: '/login', label: 'お気に入り' }
      if (tab.href === '/dashboard') return { ...tab, href: '/login', label: 'ログイン' }
    }
    return tab
  })

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around h-14">
        {visibleTabs.map(tab => {
          const Icon = tab.icon
          const isActive = pathname === tab.href || (tab.href !== '/' && pathname.startsWith(tab.href))

          if (tab.accent) {
            return (
              <Link key={tab.href} href={tab.href} className="flex flex-col items-center gap-0.5 -mt-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-r from-violet-600 to-cyan-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-[10px] text-muted-foreground">{tab.label}</span>
              </Link>
            )
          }

          return (
            <Link key={tab.href} href={tab.href} className="flex flex-col items-center gap-0.5 py-1 px-3">
              <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-violet-400' : 'text-muted-foreground'}`} />
              <span className={`text-[10px] transition-colors ${isActive ? 'text-violet-400 font-medium' : 'text-muted-foreground'}`}>
                {tab.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
