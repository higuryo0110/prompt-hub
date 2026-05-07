import { Crown } from 'lucide-react'

export default function PremiumBadge({ size = 'sm' }: { size?: 'xs' | 'sm' }) {
  const cls = size === 'xs'
    ? 'text-[10px] px-1.5 py-0.5 gap-0.5'
    : 'text-xs px-2 py-0.5 gap-1'

  return (
    <span className={`inline-flex items-center ${cls} rounded-full
                      bg-yellow-400/15 text-yellow-400 border border-yellow-400/30 font-medium`}>
      <Crown className={size === 'xs' ? 'w-2.5 h-2.5' : 'w-3 h-3'} />
      PRO
    </span>
  )
}
