import { TwitterApi } from 'twitter-api-v2'

const SUPABASE_URL = 'https://atgtjtyflpiaxwmdador.supabase.co'
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const SITE_URL = 'https://promptshare.jp'

const client = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_SECRET,
})

const INTRO_TEMPLATES = [
  '【今日のAIプロンプト💡】',
  '【おすすめプロンプト🔥】',
  '【コピペで即使える✨】',
  '【AIを使いこなす🚀】',
  '【業務効率10倍⚡】',
  '【プロンプト紹介📮】',
]

const CTA_TEMPLATES = [
  '▶ コピペで即利用👇',
  '▶ 詳細はこちら👇',
  '▶ 今すぐ使ってみる👇',
  '▶ 無料で使えます👇',
]

const HASHTAGS = [
  '#AIプロンプト #ChatGPT #Claude',
  '#AI活用 #プロンプト #業務効率化',
  '#ChatGPT活用 #AIツール #プロンプトシェア',
  '#Claude #Gemini #AI仕事術',
  '#プロンプトエンジニアリング #AI #生成AI',
]

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

async function fetchRandomPrompt() {
  const countRes = await fetch(
    `${SUPABASE_URL}/rest/v1/prompts?is_public=eq.true&select=id`,
    { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
  )
  const allIds = await countRes.json()
  if (!allIds.length) throw new Error('No prompts found')

  const randomId = pick(allIds).id

  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/prompts?id=eq.${randomId}&select=*,genre:genres(name)`,
    { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
  )
  const [prompt] = await res.json()
  return prompt
}

function buildTweet(prompt) {
  const intro = pick(INTRO_TEMPLATES)
  const cta = pick(CTA_TEMPLATES)
  const tags = pick(HASHTAGS)
  const genre = prompt.genre?.name ? `【${prompt.genre.name}】` : ''
  const url = `${SITE_URL}/prompts/${prompt.id}`

  const desc = prompt.description
    ? prompt.description.slice(0, 60) + (prompt.description.length > 60 ? '...' : '')
    : ''

  const lines = [
    `${intro}`,
    '',
    `${genre}${prompt.title}`,
  ]

  if (desc) lines.push(`${desc}`)

  lines.push('', cta, url, '', tags)

  let tweet = lines.join('\n')

  if (tweet.length > 280) {
    const shortLines = [
      intro,
      '',
      `${genre}${prompt.title.slice(0, 40)}`,
      '',
      cta,
      url,
      '',
      tags,
    ]
    tweet = shortLines.join('\n')
  }

  return tweet.slice(0, 280)
}

async function main() {
  try {
    const prompt = await fetchRandomPrompt()
    const tweet = buildTweet(prompt)

    console.log('--- Tweet ---')
    console.log(tweet)
    console.log(`--- ${tweet.length} chars ---`)

    const result = await client.v2.tweet(tweet)
    console.log(`Posted! Tweet ID: ${result.data.id}`)
    console.log(`https://x.com/i/status/${result.data.id}`)
  } catch (err) {
    console.error('Failed to tweet:', err.message || err)
    process.exit(1)
  }
}

main()
