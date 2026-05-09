'use client'

import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { GENRES, AI_MODELS } from '@/lib/genres'
import { createPrompt, updatePrompt } from '@/lib/actions/prompts'
import type { Prompt } from '@/types'
import { Loader2, Crown, Lock } from 'lucide-react'

type Props = {
  prompt?: Prompt
}

const PRICE_OPTIONS = [0, 100, 300, 500, 1000, 2000, 3000]

export default function PromptForm({ prompt }: Props) {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [isPaid, setIsPaid] = useState(!!(prompt as (Prompt & { price?: number }) | undefined)?.price)
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
      if ((result as { upgrade?: boolean }).upgrade) {
        setTimeout(() => { window.location.href = '/pricing' }, 2000)
      }
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

      {/* 有料設定 */}
      <div className="space-y-3 p-4 rounded-xl border border-border bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Crown className="w-4 h-4 text-yellow-400" />
            <Label className="cursor-pointer">有料プロンプトとして販売する</Label>
          </div>
          <button
            type="button"
            onClick={() => setIsPaid(!isPaid)}
            className={`relative w-10 h-5.5 rounded-full transition-colors duration-200
                        ${isPaid ? 'bg-violet-600' : 'bg-muted-foreground/30'}`}
            style={{ height: '22px' }}
          >
            <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200
                             ${isPaid ? 'translate-x-4.5' : 'translate-x-0'}`}
                  style={{ transform: isPaid ? 'translateX(18px)' : 'translateX(0)' }} />
          </button>
        </div>

        {isPaid && (
          <div className="space-y-2">
            <Label htmlFor="price" className="text-sm flex items-center gap-1">
              <Lock className="w-3 h-3" /> 販売価格（あなたの取り分は70%）
            </Label>
            <select
              id="price" name="price"
              defaultValue={(prompt as (Prompt & { price?: number }) | undefined)?.price ?? 300}
              className="w-full h-9 rounded-md border border-border bg-background px-3 py-1 text-sm
                         focus:outline-none focus:border-violet-500 text-foreground"
            >
              {PRICE_OPTIONS.filter(p => p > 0).map(p => (
                <option key={p} value={p}>
                  ¥{p.toLocaleString()} （あなたの収益: ¥{Math.floor(p * 0.7).toLocaleString()}）
                </option>
              ))}
            </select>
            <p className="text-xs text-muted-foreground">
              購入者はプロンプト全文を永久に閲覧できます。プラットフォーム手数料は30%です。
            </p>
          </div>
        )}
        {!isPaid && <input type="hidden" name="price" value="0" />}
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
