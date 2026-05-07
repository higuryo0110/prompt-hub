import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { createServerClient } from '@supabase/ssr'
import Stripe from 'stripe'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    const stripe = getStripe()
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Webhook signature invalid' }, { status: 400 })
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } }
  )

  if (event.type === 'customer.subscription.created' || event.type === 'customer.subscription.updated') {
    const sub = event.data.object as Stripe.Subscription
    const userId = sub.metadata.supabase_user_id
    if (!userId) return NextResponse.json({ received: true })

    const isActive = sub.status === 'active' || sub.status === 'trialing'
    const periodEnd = new Date((sub as unknown as { current_period_end: number }).current_period_end * 1000).toISOString()

    await supabase.from('profiles').update({
      is_premium: isActive,
      premium_until: isActive ? periodEnd : null,
    }).eq('id', userId)

    await supabase.from('subscriptions').upsert({
      user_id: userId,
      stripe_subscription_id: sub.id,
      stripe_customer_id: sub.customer as string,
      status: sub.status,
      price_id: sub.items.data[0]?.price.id,
      current_period_end: periodEnd,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'stripe_subscription_id' })
  }

  if (event.type === 'customer.subscription.deleted') {
    const sub = event.data.object as Stripe.Subscription
    const userId = sub.metadata.supabase_user_id
    if (!userId) return NextResponse.json({ received: true })

    await supabase.from('profiles').update({
      is_premium: false,
      premium_until: null,
    }).eq('id', userId)
  }

  return NextResponse.json({ received: true })
}
