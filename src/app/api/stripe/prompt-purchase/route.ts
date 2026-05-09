import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getStripe } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  const { promptId } = await req.json()
  if (!promptId) return NextResponse.json({ error: 'promptId required' }, { status: 400 })

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: prompt } = await supabase
    .from('prompts')
    .select('id, title, price, user_id')
    .eq('id', promptId)
    .single()

  if (!prompt?.price) return NextResponse.json({ error: 'This prompt is free' }, { status: 400 })
  if (prompt.user_id === user.id) return NextResponse.json({ error: 'Cannot buy own prompt' }, { status: 400 })

  // 既に購入済みチェック
  const { data: existing } = await supabase
    .from('prompt_purchases')
    .select('id')
    .eq('prompt_id', promptId)
    .eq('buyer_id', user.id)
    .maybeSingle()

  if (existing) return NextResponse.json({ error: 'Already purchased' }, { status: 400 })

  const stripe = getStripe()
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://prompt-share-rosy.vercel.app'

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    line_items: [{
      price_data: {
        currency: 'jpy',
        product_data: {
          name: prompt.title,
          description: 'プロンプトシェア - AIプロンプト',
        },
        unit_amount: prompt.price,
      },
      quantity: 1,
    }],
    success_url: `${siteUrl}/prompts/${promptId}?purchased=1`,
    cancel_url: `${siteUrl}/prompts/${promptId}`,
    locale: 'ja',
    metadata: {
      prompt_id: promptId,
      buyer_id: user.id,
      seller_id: prompt.user_id,
      price: String(prompt.price),
    },
  })

  return NextResponse.json({ url: session.url })
}
