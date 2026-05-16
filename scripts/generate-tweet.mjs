const SUPABASE_URL = 'https://atgtjtyflpiaxwmdador.supabase.co'
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const SITE_URL = 'https://promptshare.jp'

const pick = a => a[Math.floor(Math.random() * a.length)]

const HOOKS = [
  (p) => `${p.genre?.name || 'AI'}で困っていませんか？`,
  (p) => `${p.genre?.name || 'AI'}の作業、まだ手動でやっていますか？`,
  (p) => `「${p.title}」――これ、AIに任せられます。`,
  (p) => `${p.genre?.name || 'AI'}の効率を上げたい。そんなあなたへ。`,
  (p) => `毎回ゼロから考えていませんか？`,
]

async function fetchRandomPrompt() {
  const r = await fetch(
    `${SUPABASE_URL}/rest/v1/prompts?is_public=eq.true&select=id`,
    { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
  )
  const ids = await r.json()
  const id = pick(ids).id

  const r2 = await fetch(
    `${SUPABASE_URL}/rest/v1/prompts?id=eq.${id}&select=*,genre:genres(name)`,
    { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
  )
  const [prompt] = await r2.json()
  return prompt
}

function extractPromptPreview(content) {
  const lines = content.split('\n').filter(l => l.trim())
  const preview = lines.slice(0, 20).join('\n')
  if (preview.length > 600) return preview.slice(0, 600) + '\n...'
  return preview
}

function buildTweet(prompt) {
  const hook = pick(HOOKS)(prompt)
  const preview = extractPromptPreview(prompt.content)
  const desc = prompt.description
    ? prompt.description.slice(0, 80) + (prompt.description.length > 80 ? '...' : '')
    : ''

  return `${SITE_URL}
33分野のAIプロンプトを無料公開中

――――――――――

${hook}

${desc ? desc + '\n' : ''}以下のプロンプトをChatGPTやClaudeにそのまま貼るだけで使えます。

――――――――――

${preview}

――――――――――

【自由に入力】の部分をあなたの内容に変えるだけ。このようなプロンプトを「33分野」すべて無料で公開しています。

${SITE_URL}`
}

async function main() {
  const prompt = await fetchRandomPrompt()
  const tweet = buildTweet(prompt)

  console.log('='.repeat(50))
  console.log(tweet)
  console.log('='.repeat(50))
  console.log(`文字数: ${tweet.length}`)
  console.log(`プロンプト: ${prompt.title}`)
}

main().catch(console.error)
