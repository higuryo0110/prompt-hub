'use client'

import { useState } from 'react'
import Link from 'next/link'
import { GENRES, CATEGORY_GROUPS } from '@/lib/genres'
import { CATEGORY_META } from '@/lib/constants'
import { ChevronDown, ChevronRight } from 'lucide-react'
import * as Icons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export default function CategoryAccordion() {
  const [openSlug, setOpenSlug] = useState<string | null>(null)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {CATEGORY_GROUPS.map(group => {
        const GroupIcon = Icons[group.icon as keyof typeof Icons] as LucideIcon
        const isOpen = openSlug === group.slug
        const subGenres = group.genreSlugs
          .map(s => GENRES.find(g => g.slug === s))
          .filter((g): g is typeof GENRES[number] => !!g)

        return (
          <div key={group.slug} className="rounded-xl border border-border bg-card overflow-hidden">
            <button
              type="button"
              onClick={() => setOpenSlug(isOpen ? null : group.slug)}
              className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-muted/50 transition-colors"
            >
              <span className="text-lg">{group.emoji}</span>
              {GroupIcon && <GroupIcon className={`w-4.5 h-4.5 ${group.color}`} />}
              <span className="font-semibold text-sm">{group.name}</span>
              <span className="text-xs text-muted-foreground ml-1">({subGenres.length})</span>
              <ChevronDown
                className={`w-4 h-4 text-muted-foreground ml-auto transition-transform duration-200
                            ${isOpen ? 'rotate-180' : ''}`}
              />
            </button>

            <div
              className={`grid transition-all duration-200 ease-in-out
                          ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
            >
              <div className="overflow-hidden">
                <div className="border-t border-border px-2 py-2 space-y-0.5">
                  {subGenres.map(genre => {
                    const meta = CATEGORY_META[genre.slug]
                    return (
                      <Link
                        key={genre.slug}
                        href={`/categories/${genre.slug}`}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg
                                   hover:bg-violet-500/10 transition-colors group no-underline"
                      >
                        <span className="text-sm">{meta?.emoji ?? '✨'}</span>
                        <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                          {genre.name}
                        </span>
                        <ChevronRight className="w-3 h-3 text-muted-foreground/40 ml-auto
                                                 group-hover:text-violet-400 transition-colors" />
                      </Link>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
