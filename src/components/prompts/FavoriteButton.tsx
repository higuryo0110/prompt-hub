'use client'

import { useState } from 'react'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toggleFavorite } from '@/lib/actions/favorites'
import { useRouter } from 'next/navigation'

type Props = {
  promptId: string
  initialFavorited: boolean
  initialCount: number
  isLoggedIn: boolean
}

export default function FavoriteButton({ promptId, initialFavorited, initialCount, isLoggedIn }: Props) {
  const [isFavorited, setIsFavorited] = useState(initialFavorited)
  const [count, setCount] = useState(initialCount)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleClick = async () => {
    if (!isLoggedIn) { router.push('/login'); return }
    setLoading(true)
    setIsFavorited(prev => !prev)
    setCount(prev => isFavorited ? prev - 1 : prev + 1)
    await toggleFavorite(promptId, isFavorited)
    setLoading(false)
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleClick}
      disabled={loading}
      className={`gap-2 transition-all duration-200 ${
        isFavorited
          ? 'bg-pink-500/10 border-pink-500/50 text-pink-400 hover:bg-pink-500/20'
          : 'hover:border-pink-500/50 hover:text-pink-400'
      }`}
    >
      <Heart className={`w-4 h-4 transition-all ${isFavorited ? 'fill-pink-400 text-pink-400 scale-110' : ''}`} />
      {count}
    </Button>
  )
}
