/**
 * GA4 イベントトラッキングのヘルパー
 * 主要なユーザーアクション（コピー・お気に入り・シェアなど）を記録
 */

type EventParams = Record<string, string | number | boolean>

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    dataLayer?: unknown[]
  }
}

export function trackEvent(eventName: string, params?: EventParams) {
  if (typeof window === 'undefined') return
  if (typeof window.gtag !== 'function') return
  try {
    window.gtag('event', eventName, params || {})
  } catch {
    // gtag may not be initialized
  }
}

/** プロンプト関連の標準イベント */
export const Events = {
  PROMPT_COPY: 'prompt_copy',
  PROMPT_FAVORITE: 'prompt_favorite',
  PROMPT_UNFAVORITE: 'prompt_unfavorite',
  PROMPT_SHARE: 'prompt_share',
  PROMPT_VIEW: 'prompt_view',
  NEWSLETTER_SUBSCRIBE: 'newsletter_subscribe',
  CATEGORY_VIEW: 'category_view',
  RANKING_VIEW: 'ranking_view',
  SEARCH: 'search',
} as const
