import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import PromptForm from '@/components/prompts/PromptForm'

type Props = { params: Promise<{ id: string }> }

export default async function EditPromptPage({ params }: Props) {
  const supabase = await createClient()
  const { id } = await params
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: prompt } = await supabase
    .from('prompts')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!prompt) notFound()

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">プロンプトを編集</h1>
        <p className="text-muted-foreground">プロンプトの内容を更新します</p>
      </div>
      <div className="bg-card border border-border rounded-2xl p-8">
        <PromptForm prompt={prompt} />
      </div>
    </div>
  )
}
