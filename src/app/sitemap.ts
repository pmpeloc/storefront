import type { MetadataRoute } from 'next'
import { getProducts } from '@/lib/api'
import { clientConfig } from '@/config/client'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = `https://${clientConfig.domain}`

  let productPages: MetadataRoute.Sitemap = []
  try {
    const data = await getProducts({ limit: 100 })
    productPages = data.products
      .filter((p): p is typeof p & { slug: string } => p.slug !== null)
      .map((p) => ({
        url: `${baseUrl}/productos/${p.slug}`,
        lastModified: new Date(p.updated_at),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }))
  } catch {
    // silently skip product pages if API is unavailable at build time
  }

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...productPages,
  ]
}
