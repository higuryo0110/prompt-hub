import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import { Toaster } from '@/components/ui/sonner'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

const SITE_URL = 'https://prompt-share-rosy.vercel.app'
const SITE_NAME = 'プロンプトシェア'
const SITE_DESCRIPTION = 'プロンプトシェアは、業務委託・アプリ制作・画像生成・ライティングなど、あらゆるジャンルのAIプロンプトを無料で共有・発見できるプロンプト共有サービスです。ChatGPT・Claude・Geminiなど主要AIに対応したプロンプトが揃っています。'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | AIプロンプト共有サービス`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    'プロンプトシェア', 'プロンプト共有', 'AIプロンプト', 'プロンプト',
    'ChatGPT', 'Claude', 'Gemini', '画像生成', 'プロンプト集',
    'AI活用', 'プロンプトエンジニアリング', '業務効率化',
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} | AIプロンプト共有サービス`,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} | AIプロンプト共有サービス`,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-snippet': -1 },
  },
  alternates: {
    canonical: SITE_URL,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-background antialiased`}>
        <Navbar />
        <main>{children}</main>
        <Toaster theme="dark" />
      </body>
    </html>
  )
}
