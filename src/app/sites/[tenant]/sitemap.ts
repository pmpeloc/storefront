import type { MetadataRoute } from 'next'
import { headers } from 'next/headers'
import { getProducts } from '@/lib/api'

interface SitemapProps {
  params: Promise<{ tenant: string }>
}

// Usa el host real de la request (no un dominio fijo de config) — un tenant
// puede tener varios dominios (tenant_domains). Esto fuerza dynamic rendering
// para este archivo puntual; no afecta el ISR de productos/colecciones.
export default async function sitemap({ params }: SitemapProps): Promise<MetadataRoute.Sitemap> {
  const { tenant } = await params
  const host = (await headers()).get('host') ?? 'localhost:3000'
  const baseUrl = `https://${host}`

  let productPages: MetadataRoute.Sitemap = []
  try {
    const data = await getProducts(tenant, { limit: 100 })
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
