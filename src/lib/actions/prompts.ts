'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createPrompt(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'ログインが必要です' }

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const content = formData.get('content') as string
  const genre_id = parseInt(formData.get('genre_id') as string)
  const ai_model = formData.get('ai_model') as string
  const priceRaw = parseInt(formData.get('price') as string || '0')
  const price = isNaN(priceRaw) || priceRaw <= 0 ? null : priceRaw

  if (!title || !content || !genre_id) return { error: '必須項目を入力してください' }

  const { data, error } = await supabase
    .from('prompts')
    .insert({ user_id: user.id, title, description, content, genre_id, ai_model, price })
    .select()
    .single()

  if (error) return { error: error.message }

  revalidatePath('/prompts')

  // IndexNow: Bingに新規プロンプトを即時通知
  const url = `https://prompt-share-rosy.vercel.app/prompts/${data.id}`
  fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      host: 'prompt-share-rosy.vercel.app',
      key: 'a4f8c2e1b7d3f9a4c2e1b7d3f9a4c2e1',
      keyLocation: 'https://prompt-share-rosy.vercel.app/a4f8c2e1b7d3f9a4c2e1b7d3f9a4c2e1.txt',
      urlList: [url, 'https://prompt-share-rosy.vercel.app/prompts'],
    }),
  }).catch(() => {})

  redirect(`/prompts/${data.id}`)
}

export async function updatePrompt(id: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'ログインが必要です' }

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const content = formData.get('content') as string
  const genre_id = parseInt(formData.get('genre_id') as string)
  const ai_model = formData.get('ai_model') as string

  const { error } = await supabase
    .from('prompts')
    .update({ title, description, content, genre_id, ai_model, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: error.message }

  revalidatePath(`/prompts/${id}`)
  redirect(`/prompts/${id}`)
}

export async function deletePrompt(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  await supabase.from('prompts').delete().eq('id', id).eq('user_id', user.id)

  revalidatePath('/prompts')
  redirect('/dashboard')
}

export async function incrementCopyCount(id: string) {
  const supabase = await createClient()
  await supabase.rpc('increment_copy_count', { prompt_id: id })
}
