import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

const SITE_URL = 'https://prompt-share-rosy.vercel.app'

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
    ...promptUrls,
  ]
}
