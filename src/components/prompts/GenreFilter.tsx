'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { GENRES, CATEGORY_GROUPS } from '@/lib/genres'
import { useState, useRef, useEffect } from 'react'
import * as Icons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { ChevronDown, LayoutGrid } from 'lucide-react'

export default function GenreFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentGenre = searchParams.get('genre') ?? 'all'
  const [openGroup, setOpenGroup] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpenGroup(null)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSelect = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (slug === 'all') {
      params.delete('genre')
    } else {
      params.set('genre', slug)
    }
    params.delete('page')
    router.push(`/prompts?${params.toString()}`)
    setOpenGroup(null)
  }

  const isActive = (slug: string) => currentGenre === slug
  const groupHasActive = (group: typeof CATEGORY_GROUPS[number]) =>
    group.genreSlugs.includes(currentGenre)

  return (
    <div ref={containerRef} className="flex flex-wrap gap-2">
      <button
        onClick={() => handleSelect('all')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium
                    transition-all duration-200 border
                    ${isActive('all')
            ? 'bg-gradient-to-r from-violet-600 to-cyan-600 border-transparent text-white shadow-lg shadow-violet-500/25'
            : 'bg-card border-border text-muted-foreground hover:border-violet-500/50 hover:text-foreground'
          }`}
      >
        <LayoutGrid className={`w-3.5 h-3.5 ${isActive('all') ? 'text-white' : 'text-slate-300'}`} />
        すべて
      </button>

      {CATEGORY_GROUPS.map(group => {
        const GroupIcon = Icons[group.icon as keyof typeof Icons] as LucideIcon
        const isOpen = openGroup === group.slug
        const hasActive = groupHasActive(group)

        return (
          <div key={group.slug} className="relative">
            <button
              onClick={() => setOpenGroup(isOpen ? null : group.slug)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium
                          transition-all duration-200 border
                          ${hasActive
                  ? 'bg-violet-600/20 border-violet-500/50 text-violet-300'
                  : 'bg-card border-border text-muted-foreground hover:border-violet-500/50 hover:text-foreground'
                }`}
            >
              {GroupIcon && <GroupIcon className={`w-3.5 h-3.5 ${hasActive ? 'text-violet-300' : group.color}`} />}
              {group.name}
              <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
              <div className="absolute top-full left-0 mt-1 z-50 bg-card border border-border rounded-xl
                              shadow-xl shadow-black/20 p-1 min-w-[180px]">
                {group.genreSlugs.map(slug => {
                  const genre = GENRES.find(g => g.slug === slug)
                  if (!genre) return null
                  return (
                    <button
                      key={slug}
                      onClick={() => handleSelect(slug)}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left
                                  transition-colors
                                  ${isActive(slug)
                          ? 'bg-violet-600/20 text-violet-300 font-medium'
                          : 'text-foreground hover:bg-muted'
                        }`}
                    >
                      {genre.name}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
