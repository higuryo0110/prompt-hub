import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { createServerClient } from '@supabase/ssr'
import Stripe from 'stripe'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = getStripe().webhooks.constructEvent(body, sig, process.env.STRIPE_PROMPT_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const { prompt_id, buyer_id, seller_id, price } = session.metadata ?? {}

    if (!prompt_id || !buyer_id) return NextResponse.json({ received: true })

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { cookies: { getAll: () => [], setAll: () => {} } }
    )

    const platformFee = Math.floor(Number(price) * 0.3)
    const creatorEarning = Number(price) - platformFee

    await supabase.from('prompt_purchases').insert({
      prompt_id,
      buyer_id,
      seller_id,
      amount: Number(price),
      platform_fee: platformFee,
      creator_earning: creatorEarning,
      stripe_session_id: session.id,
    })

    // 売上をprofilesに累積（seller）- RPCが存在する場合のみ
    try {
      await supabase.rpc('add_creator_earning', { user_id: seller_id, amount: creatorEarning })
    } catch {}
  }

  return NextResponse.json({ received: true })
}
