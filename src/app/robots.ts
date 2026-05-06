import { MetadataRoute } from 'next'

const SITE_URL = 'https://prompt-share-rosy.vercel.app'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard', '/favorites', '/api/'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
