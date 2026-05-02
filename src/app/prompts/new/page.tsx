import PromptForm from '@/components/prompts/PromptForm'

export default function NewPromptPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">プロンプトを投稿</h1>
        <p className="text-muted-foreground">あなたのプロンプトをコミュニティに共有しましょう</p>
      </div>
      <div className="bg-card border border-border rounded-2xl p-8">
        <PromptForm />
      </div>
    </div>
  )
}
