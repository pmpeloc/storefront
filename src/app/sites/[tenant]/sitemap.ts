import type { MetadataRoute } from 'next'
import { headers } from 'next/headers'
import { getProducts } from '@/lib/api'

// headers() solo es válido en rutas dinámicas — sin esto, Next intenta
// pre-renderear este archivo en build time y headers() tira un 500.
export const dynamic = 'force-dynamic'

// sitemap.ts NO recibe params del segmento [tenant] (a diferencia de
// page.tsx) — ese no es el contrato de los archivos de metadata. El tenant
// se lee del header x-tenant-slug que pone middleware.ts, igual que en
// app/api/products/route.ts.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const headersList = await headers()
  const host = headersList.get('host') ?? 'localhost:3000'
  const tenant = headersList.get('x-tenant-slug') ?? ''
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
