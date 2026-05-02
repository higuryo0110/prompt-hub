'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function toggleFavorite(promptId: string, isFavorited: boolean) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'ログインが必要です' }

  if (isFavorited) {
    await supabase.from('favorites').delete()
      .eq('user_id', user.id).eq('prompt_id', promptId)
  } else {
    await supabase.from('favorites').insert({ user_id: user.id, prompt_id: promptId })
  }

  revalidatePath(`/prompts/${promptId}`)
  revalidatePath('/favorites')
}
