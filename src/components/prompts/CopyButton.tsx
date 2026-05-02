'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { incrementCopyCount } from '@/lib/actions/prompts'

export default function CopyButton({ promptId, content }: { promptId: string; content: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content)
    setCopied(true)
    await incrementCopyCount(promptId)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Button
      onClick={handleCopy}
      className={`gap-2 transition-all duration-200 ${
        copied
          ? 'bg-emerald-600 hover:bg-emerald-600 border-emerald-500'
          : 'bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 border-0'
      }`}
    >
      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      {copied ? 'コピーしました！' : 'コピーする'}
    </Button>
  )
}
