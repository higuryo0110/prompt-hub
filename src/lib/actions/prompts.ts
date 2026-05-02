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

  if (!title || !content || !genre_id) return { error: '必須項目を入力してください' }

  const { data, error } = await supabase
    .from('prompts')
    .insert({ user_id: user.id, title, description, content, genre_id, ai_model })
    .select()
    .single()

  if (error) return { error: error.message }

  revalidatePath('/prompts')
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
