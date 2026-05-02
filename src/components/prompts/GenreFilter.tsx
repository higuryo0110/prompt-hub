'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { GENRES } from '@/lib/genres'
import * as Icons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export default function GenreFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentGenre = searchParams.get('genre') ?? 'all'

  const handleSelect = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (slug === 'all') {
      params.delete('genre')
    } else {
      params.set('genre', slug)
    }
    params.delete('page')
    router.push(`/prompts?${params.toString()}`)
  }

  const all = [{ id: 0, slug: 'all', name: 'すべて', icon: 'LayoutGrid', color: 'text-slate-300' }, ...GENRES]

  return (
    <div className="flex flex-wrap gap-2">
      {all.map(genre => {
        const IconComponent = Icons[genre.icon as keyof typeof Icons] as LucideIcon
        const isActive = currentGenre === genre.slug
        return (
          <button
            key={genre.slug}
            onClick={() => handleSelect(genre.slug)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium
                        transition-all duration-200 border
                        ${isActive
                ? 'bg-gradient-to-r from-violet-600 to-cyan-600 border-transparent text-white shadow-lg shadow-violet-500/25'
                : 'bg-card border-border text-muted-foreground hover:border-violet-500/50 hover:text-foreground'
              }`}
          >
            {IconComponent && <IconComponent className={`w-3.5 h-3.5 ${isActive ? 'text-white' : genre.color}`} />}
            {genre.name}
          </button>
        )
      })}
    </div>
  )
}
