import { Clock, TrendingUp, Heart } from 'lucide-react'

const SORT_OPTIONS = [
  { value: 'new',     label: '新着順',     icon: Clock },
  { value: 'likes',   label: 'いいね順',   icon: Heart },
  { value: 'popular', label: 'コピー数順', icon: TrendingUp },
]

type Props = {
  current: string
  genre?: string
  q?: string
}

export default function SortFilter({ current, genre, q }: Props) {
  const buildHref = (value: string) => {
    const params = new URLSearchParams()
    if (value !== 'new') params.set('sort', value)
    if (genre && genre !== 'all') params.set('genre', genre)
    if (q) params.set('q', q)
    const qs = params.toString()
    return `/prompts${qs ? `?${qs}` : ''}`
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground whitespace-nowrap">並び順:</span>
      <div className="flex gap-1.5">
        {SORT_OPTIONS.map(({ value, label, icon: Icon }) => {
          const isActive = current === value || (value === 'new' && !current)
          return (
            <a
              key={value}
              href={buildHref(value)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
                          transition-all duration-200 border no-underline
                          ${isActive
                  ? 'bg-gradient-to-r from-violet-600 to-cyan-600 border-transparent text-white shadow-lg shadow-violet-500/25'
                  : 'bg-card border-border text-muted-foreground hover:border-violet-500/50 hover:text-foreground'
                }`}
            >
              <Icon className="w-3 h-3" />
              {label}
            </a>
          )
        })}
      </div>
    </div>
  )
}
