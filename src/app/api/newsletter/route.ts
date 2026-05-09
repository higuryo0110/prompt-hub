import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function POST(req: NextRequest) {
  const { email } = await req.json()
  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } }
  )

  const { error } = await supabase.from('newsletter_subscribers').insert({
    email: email.toLowerCase().trim(),
    subscribed_at: new Date().toISOString(),
  })

  if (error?.code === '23505') {
    return NextResponse.json({ message: 'すでに登録済みです' })
  }

  return NextResponse.json({ message: 'success' })
}
