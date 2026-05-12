import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'
import { SITE_URL } from '@/lib/constants'
import { GENRES } from '@/lib/genres'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()

  const { data: prompts } = await supabase
    .from('prompts')
    .select('id, updated_at')
    .eq('is_public', true)
    .order('updated_at', { ascending: false })

  const promptUrls: MetadataRoute.Sitemap = (prompts ?? []).map(p => ({
    url: `${SITE_URL}/prompts/${p.id}`,
    lastModified: new Date(p.updated_at),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  // カテゴリページ (大量のSEO対象URL)
  const categoryUrls: MetadataRoute.Sitemap = GENRES.map(g => ({
    url: `${SITE_URL}/categories/${g.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.8,
  }))

  // フィルタ済み prompts ページ（ジャンル別 + ソート別）
  const filterUrls: MetadataRoute.Sitemap = GENRES.flatMap(g => [
    {
      url: `${SITE_URL}/prompts?genre=${g.slug}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/prompts?genre=${g.slug}&sort=popular`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.5,
    },
  ])

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/prompts`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/prompts?sort=popular`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    ...categoryUrls,
    ...filterUrls,
    ...promptUrls,
  ]
}
