import type { MetadataRoute } from 'next'
import { fetchFWProducts } from '@/lib/fourthwall'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://malachiasmusic.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await fetchFWProducts().catch(() => [])

  const productUrls: MetadataRoute.Sitemap = products.map(p => ({
    url: `${SITE_URL}/merch/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.6,
  }))

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/merch`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/epk`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.75,
    },
    ...productUrls,
  ]
}
