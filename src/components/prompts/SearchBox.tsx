'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { useRef } from 'react'

export default function SearchBox() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const q = searchParams.get('q') ?? ''
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const value = inputRef.current?.value.trim() ?? ''
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set('q', value)
    } else {
      params.delete('q')
    }
    params.delete('page')
    router.push(`/prompts?${params.toString()}`)
  }

  const handleClear = () => {
    if (inputRef.current) inputRef.current.value = ''
    const params = new URLSearchParams(searchParams.toString())
    params.delete('q')
    router.push(`/prompts?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-md">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
      <input
        ref={inputRef}
        defaultValue={q}
        placeholder="タイトル・説明・内容で検索..."
        className="w-full pl-9 pr-16 py-2 rounded-lg bg-card border border-border text-sm
                   text-foreground placeholder:text-muted-foreground
                   focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30
                   transition-colors"
      />
      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
        {q && (
          <button
            type="button"
            onClick={handleClear}
            className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
        <button
          type="submit"
          className="px-2 py-1 text-xs rounded bg-violet-600 hover:bg-violet-500 text-white transition-colors"
        >
          検索
        </button>
      </div>
    </form>
  )
}
