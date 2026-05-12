import { ImageResponse } from 'next/og'

export const runtime = 'nodejs'
export const alt = 'プロンプトシェア - AIプロンプト共有サービス'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(135deg, #0a0a14 0%, #1a1033 50%, #0f1a2e 100%)',
          padding: '80px',
          position: 'relative',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{
          position: 'absolute', top: -120, left: -120, width: 480, height: 480, borderRadius: 999,
          background: 'rgba(139, 92, 246, 0.3)', filter: 'blur(80px)'
        }} />
        <div style={{
          position: 'absolute', bottom: -120, right: -120, width: 460, height: 460, borderRadius: 999,
          background: 'rgba(34, 211, 238, 0.25)', filter: 'blur(80px)'
        }} />

        <div style={{
          fontSize: 64, width: 120, height: 120, borderRadius: 30,
          background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white', fontWeight: 900, marginBottom: 32,
        }}>P</div>

        <div style={{
          fontSize: 90, fontWeight: 900, color: 'white', lineHeight: 1.1,
          letterSpacing: -2, textAlign: 'center', marginBottom: 20,
        }}>
          プロンプトシェア
        </div>
        <div style={{
          fontSize: 32, color: '#c4b5fd', textAlign: 'center', marginBottom: 16,
          fontWeight: 700,
        }}>
          AIプロンプト共有サービス
        </div>
        <div style={{
          fontSize: 22, color: '#94a3b8', textAlign: 'center', maxWidth: 900, lineHeight: 1.5,
        }}>
          ChatGPT・Claude・Gemini・Midjourney対応の高品質プロンプトを無料で発見・シェア
        </div>
      </div>
    ),
    { ...size },
  )
}
