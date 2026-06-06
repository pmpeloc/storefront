import type { MetadataRoute } from 'next'
import { clientConfig } from '@/config/client'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = `https://${clientConfig.domain}`
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
