'use client'

import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { GENRES, AI_MODELS } from '@/lib/genres'
import { createPrompt, updatePrompt } from '@/lib/actions/prompts'
import type { Prompt } from '@/types'
import { Loader2 } from 'lucide-react'

type Props = {
  prompt?: Prompt
}

export default function PromptForm({ prompt }: Props) {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const formData = new FormData(e.currentTarget)
    const result = prompt
      ? await updatePrompt(prompt.id, formData)
      : await createPrompt(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-destructive/10 border border-destructive/50 text-destructive rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="title">タイトル <span className="text-destructive">*</span></Label>
        <Input
          id="title" name="title" required
          defaultValue={prompt?.title}
          placeholder="例: マーケティングコピーを一発で書かせるプロンプト"
          className="bg-muted border-border focus:border-violet-500"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">説明</Label>
        <Input
          id="description" name="description"
          defaultValue={prompt?.description ?? ''}
          placeholder="このプロンプトで何ができるか簡単に説明"
          className="bg-muted border-border focus:border-violet-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="genre_id">ジャンル <span className="text-destructive">*</span></Label>
          <select
            id="genre_id" name="genre_id" required
            defaultValue={prompt?.genre_id ?? ''}
            className="w-full h-9 rounded-md border border-border bg-muted px-3 py-1 text-sm
                       focus:outline-none focus:border-violet-500 text-foreground"
          >
            <option value="">選択してください</option>
            {GENRES.map(g => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="ai_model">対応AIモデル</Label>
          <select
            id="ai_model" name="ai_model"
            defaultValue={prompt?.ai_model ?? ''}
            className="w-full h-9 rounded-md border border-border bg-muted px-3 py-1 text-sm
                       focus:outline-none focus:border-violet-500 text-foreground"
          >
            <option value="">未指定</option>
            {AI_MODELS.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">プロンプト本文 <span className="text-destructive">*</span></Label>
        <Textarea
          id="content" name="content" required
          defaultValue={prompt?.content}
          placeholder="ここにプロンプトを入力してください..."
          rows={10}
          className="bg-muted border-border focus:border-violet-500 font-mono text-sm resize-none"
        />
      </div>

      <Button
        type="submit" disabled={loading}
        className="w-full bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 border-0 h-11"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
        {prompt ? 'プロンプトを更新する' : 'プロンプトを投稿する'}
      </Button>
    </form>
  )
}
