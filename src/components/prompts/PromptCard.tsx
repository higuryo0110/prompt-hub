import Link from 'next/link'
import { Heart, Copy, Bot, User } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { PromptWithDetails } from '@/types'
import { GENRES } from '@/lib/genres'
import * as Icons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const RANK_STYLES: Record<number, { badge: string; border: string }> = {
  1: { badge: 'bg-yellow-400 text-yellow-900', border: 'border-yellow-400/50' },
  2: { badge: 'bg-slate-300 text-slate-900',   border: 'border-slate-300/50' },
  3: { badge: 'bg-amber-600 text-amber-100',   border: 'border-amber-600/50' },
}

export default function PromptCard({ prompt, rank }: { prompt: PromptWithDetails; rank?: number }) {
  const genre = GENRES.find(g => g.id === prompt.genre_id)
  const IconComponent = genre ? (Icons[genre.icon as keyof typeof Icons] as LucideIcon) : null
  const rankStyle = rank ? RANK_STYLES[rank] : null

  return (
    <Link href={`/prompts/${prompt.id}`}>
      <div className={`group relative bg-card border rounded-2xl p-5 h-full
                      transition-all duration-300 hover:-translate-y-1 card-glow cursor-pointer
                      hover:border-violet-500/50
                      ${rankStyle ? rankStyle.border : 'border-border'}`}>
        {rankStyle && (
          <span className={`absolute -top-2.5 -left-2.5 w-7 h-7 rounded-full text-xs font-black
                            flex items-center justify-center shadow-lg ${rankStyle.badge}`}>
            {rank}
          </span>
        )}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500/5 to-cyan-500/5
                        opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="relative">
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex items-center gap-2 flex-wrap">
              {genre && (
                <Badge variant="outline" className={`${genre.color} border-current/30 bg-current/10 text-xs`}>
                  {IconComponent && <IconComponent className="w-3 h-3 mr-1" />}
                  {genre.name}
                </Badge>
              )}
              {prompt.ai_model && (
                <Badge variant="outline" className="text-muted-foreground text-xs">
                  <Bot className="w-3 h-3 mr-1" />
                  {prompt.ai_model}
                </Badge>
              )}
            </div>
          </div>

          <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-violet-300 transition-colors">
            {prompt.title}
          </h3>

          {prompt.description && (
            <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
              {prompt.description}
            </p>
          )}

          <div className="bg-muted/50 rounded-lg p-3 mb-4">
            <p className="text-xs text-muted-foreground font-mono line-clamp-3 leading-relaxed">
              {prompt.content}
            </p>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <User className="w-3 h-3" />
              <span>{prompt.profile?.username ?? '匿名'}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Heart className="w-3 h-3 text-pink-400" />
                {prompt.favorite_count}
              </span>
              <span className="flex items-center gap-1">
                <Copy className="w-3 h-3 text-violet-400" />
                {prompt.copy_count}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
