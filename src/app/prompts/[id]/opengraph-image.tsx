/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from 'next/og'
import { createClient } from '@/lib/supabase/server'
import { GENRES } from '@/lib/genres'

export const runtime = 'nodejs'
export const alt = 'プロンプトシェア'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: prompt } = await supabase
    .from('prompts')
    .select('title,description,ai_model,genre_id')
    .eq('id', params.id)
    .single()

  const title = prompt?.title ?? 'プロンプト詳細'
  const description = prompt?.description ?? ''
  const aiModel = prompt?.ai_model ?? ''
  const genre = GENRES.find(g => g.id === prompt?.genre_id)

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(135deg, #0a0a14 0%, #1a1033 50%, #0f1a2e 100%)',
          padding: '60px',
          position: 'relative',
        }}
      >
        {/* Decorative glow */}
        <div
          style={{
            position: 'absolute',
            top: -100,
            right: -100,
            width: 400,
            height: 400,
            borderRadius: 999,
            background: 'rgba(139, 92, 246, 0.25)',
            filter: 'blur(60px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -100,
            left: -100,
            width: 380,
            height: 380,
            borderRadius: 999,
            background: 'rgba(34, 211, 238, 0.2)',
            filter: 'blur(60px)',
          }}
        />

        {/* Top: Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 'auto' }}>
          <div
            style={{
              fontSize: 48,
              width: 72,
              height: 72,
              borderRadius: 18,
              background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 900,
            }}
          >
            P
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 28, fontWeight: 900, color: 'white', letterSpacing: 1 }}>
              プロンプトシェア
            </span>
            <span style={{ fontSize: 16, color: '#94a3b8', letterSpacing: 1 }}>
              AIプロンプト共有サービス
            </span>
          </div>
        </div>

        {/* Badges */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
          {genre && (
            <div
              style={{
                display: 'flex',
                padding: '8px 18px',
                background: 'rgba(139, 92, 246, 0.18)',
                border: '1px solid rgba(139, 92, 246, 0.4)',
                borderRadius: 999,
                color: '#c4b5fd',
                fontSize: 20,
                fontWeight: 700,
              }}
            >
              {genre.name}
            </div>
          )}
          {aiModel && (
            <div
              style={{
                display: 'flex',
                padding: '8px 18px',
                background: 'rgba(34, 211, 238, 0.18)',
                border: '1px solid rgba(34, 211, 238, 0.4)',
                borderRadius: 999,
                color: '#67e8f9',
                fontSize: 20,
                fontWeight: 700,
              }}
            >
              {aiModel}
            </div>
          )}
        </div>

        {/* Title */}
        <div
          style={{
            display: 'flex',
            fontSize: 64,
            fontWeight: 900,
            color: 'white',
            lineHeight: 1.2,
            letterSpacing: -1,
            marginBottom: 18,
            maxHeight: 240,
            overflow: 'hidden',
          }}
        >
          {title.length > 50 ? title.slice(0, 50) + '…' : title}
        </div>

        {/* Description */}
        {description && (
          <div
            style={{
              display: 'flex',
              fontSize: 24,
              color: '#cbd5e1',
              lineHeight: 1.5,
              maxHeight: 80,
              overflow: 'hidden',
            }}
          >
            {description.length > 100 ? description.slice(0, 100) + '…' : description}
          </div>
        )}

        {/* Bottom: URL */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            right: 60,
            fontSize: 18,
            color: '#64748b',
          }}
        >
          prompt-share-rosy.vercel.app
        </div>
      </div>
    ),
    { ...size },
  )
}
