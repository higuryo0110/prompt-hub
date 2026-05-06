'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Clock, TrendingUp, Heart } from 'lucide-react'

const SORT_OPTIONS = [
  { value: 'new',     label: '新着順',     icon: Clock },
  { value: 'popular', label: 'コピー数順', icon: TrendingUp },
  { value: 'likes',   label: 'いいね順',   icon: Heart },
]

export default function SortFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const current = searchParams.get('sort') ?? 'new'

  const handleSelect = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === 'new') {
      params.delete('sort')
    } else {
      params.set('sort', value)
    }
    router.push(`/prompts?${params.toString()}`)
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground whitespace-nowrap">並び順:</span>
      <div className="flex gap-1.5">
        {SORT_OPTIONS.map(({ value, label, icon: Icon }) => {
          const isActive = current === value
          return (
            <button
              key={value}
              onClick={() => handleSelect(value)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
                          transition-all duration-200 border
                          ${isActive
                  ? 'bg-gradient-to-r from-violet-600 to-cyan-600 border-transparent text-white shadow-lg shadow-violet-500/25'
                  : 'bg-card border-border text-muted-foreground hover:border-violet-500/50 hover:text-foreground'
                }`}
            >
              <Icon className="w-3 h-3" />
              {label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
