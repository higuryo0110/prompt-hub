import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id') ?? 'unknown'
  const url = searchParams.get('url') ?? '/'
  const ref = searchParams.get('ref') ?? 'sidebar'

  // クリックをSupabaseに記録（テーブルが存在する場合のみ）
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll: () => [], setAll: () => {} } }
    )
    await supabase.from('affiliate_clicks').insert({
      affiliate_id: id,
      ref,
      user_agent: req.headers.get('user-agent')?.substring(0, 200),
      clicked_at: new Date().toISOString(),
    })
  } catch {
    // テーブル未作成でも動作継続
  }

  return NextResponse.redirect(url, { status: 302 })
}
