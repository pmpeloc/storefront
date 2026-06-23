import type { MetadataRoute } from 'next'
import { headers } from 'next/headers'

// headers() solo es válido en rutas dinámicas — sin esto, Next intenta
// pre-renderear este archivo en build time y la ruta ni se genera (404).
export const dynamic = 'force-dynamic'

export default async function robots(): Promise<MetadataRoute.Robots> {
  const host = (await headers()).get('host') ?? 'localhost:3000'
  const baseUrl = `https://${host}`
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
