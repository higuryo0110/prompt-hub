import { ImageResponse } from 'next/og'
import { CATEGORY_META } from '@/lib/constants'
import { GENRES } from '@/lib/genres'

export const runtime = 'nodejs'
export const alt = 'プロンプトシェア カテゴリ'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }: { params: { slug: string } }) {
  const meta = CATEGORY_META[params.slug]
  const genre = GENRES.find(g => g.slug === params.slug)
  const title = meta?.title ?? 'カテゴリ'
  const desc = meta?.description ?? ''
  const emoji = meta?.emoji ?? '✨'

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(135deg, #0a0a14 0%, #1a1033 50%, #0f1a2e 100%)',
          padding: '70px',
          position: 'relative',
        }}
      >
        <div style={{
          position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: 999,
          background: 'rgba(139, 92, 246, 0.25)', filter: 'blur(60px)'
        }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 'auto' }}>
          <div style={{
            fontSize: 48, width: 72, height: 72, borderRadius: 18,
            background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 900,
          }}>P</div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 28, fontWeight: 900, color: 'white', letterSpacing: 1 }}>プロンプトシェア</span>
            <span style={{ fontSize: 16, color: '#94a3b8' }}>カテゴリ - {genre?.name ?? ''}</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 24 }}>
          <span style={{ fontSize: 100 }}>{emoji}</span>
        </div>
        <div style={{ display: 'flex', fontSize: 60, fontWeight: 900, color: 'white', lineHeight: 1.2, marginBottom: 20, maxHeight: 220, overflow: 'hidden' }}>
          {title}
        </div>
        <div style={{ display: 'flex', fontSize: 24, color: '#cbd5e1', lineHeight: 1.5, maxHeight: 80, overflow: 'hidden' }}>
          {desc.slice(0, 100)}
        </div>
        <div style={{ position: 'absolute', bottom: 40, right: 70, fontSize: 18, color: '#64748b' }}>
          prompt-share-rosy.vercel.app
        </div>
      </div>
    ),
    { ...size },
  )
}
