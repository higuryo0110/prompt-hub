import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-04-22.dahlia',
})

export const PREMIUM_PRICE_ID = process.env.STRIPE_PREMIUM_PRICE_ID!

export const PLANS = {
  free: {
    name: 'フリー',
    price: 0,
    features: [
      'プロンプトの閲覧・コピー',
      'いいね機能',
      'プロンプト投稿（月3件まで）',
    ],
    limits: { postsPerMonth: 3 },
  },
  premium: {
    name: 'プレミアム',
    price: 980,
    features: [
      'プロンプトの閲覧・コピー（無制限）',
      'いいね機能',
      'プロンプト投稿（無制限）',
      'プレミアムバッジ表示',
      '広告なし',
      '優先サポート',
    ],
    limits: { postsPerMonth: Infinity },
  },
}
