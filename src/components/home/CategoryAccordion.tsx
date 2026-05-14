import Link from 'next/link'
import { GENRES, CATEGORY_GROUPS } from '@/lib/genres'
import * as Icons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export default function CategoryAccordion() {
  return (
    <div className="space-y-4">
      {CATEGORY_GROUPS.map(group => {
        const GroupIcon = Icons[group.icon as keyof typeof Icons] as LucideIcon
        const subGenres = group.genreSlugs
          .map(s => GENRES.find(g => g.slug === s))
          .filter((g): g is typeof GENRES[number] => !!g)

        return (
          <div key={group.slug}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-base">{group.emoji}</span>
              {GroupIcon && <GroupIcon className={`w-4 h-4 ${group.color}`} />}
              <span className="text-sm font-semibold text-foreground">{group.name}</span>
            </div>
            <div className="flex flex-wrap gap-1.5 ml-7">
              {subGenres.map(genre => (
                <Link
                  key={genre.slug}
                  href={`/categories/${genre.slug}`}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-200 border no-underline
                             bg-card border-border text-muted-foreground hover:border-violet-500/50 hover:text-foreground"
                >
                  {genre.name}
                </Link>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
