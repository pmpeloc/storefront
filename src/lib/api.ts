import type { ProductsResponse, PublicProduct } from '@/types/product'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'
// TENANT_SLUG is server-only — never exposed to the browser
const TENANT_SLUG = process.env.TENANT_SLUG ?? 'el-renuevo'

function buildParams(extra?: Record<string, string | number | undefined>): URLSearchParams {
  const params = new URLSearchParams({ tenantSlug: TENANT_SLUG })
  if (extra) {
    for (const [k, v] of Object.entries(extra)) {
      if (v !== undefined) params.set(k, String(v))
    }
  }
  return params
}

export async function getProducts(options?: {
  category?: string
  page?: number
  limit?: number
}): Promise<ProductsResponse> {
  const params = buildParams({
    category: options?.category,
    page: options?.page,
    limit: options?.limit,
  })
  const res = await fetch(`${API_URL}/api/v1/public/products?${params}`, {
    next: { revalidate: 60 },
  })
  if (!res.ok) throw new Error(`getProducts failed: ${res.status}`)
  return res.json() as Promise<ProductsResponse>
}

export async function getFeaturedProducts(): Promise<ProductsResponse> {
  const params = buildParams()
  const res = await fetch(`${API_URL}/api/v1/public/products/featured?${params}`, {
    next: { revalidate: 60 },
  })
  if (!res.ok) throw new Error(`getFeaturedProducts failed: ${res.status}`)
  return res.json() as Promise<ProductsResponse>
}

export async function getProductBySlug(
  slug: string,
): Promise<{ product: PublicProduct } | null> {
  const params = buildParams()
  const res = await fetch(`${API_URL}/api/v1/public/products/${encodeURIComponent(slug)}?${params}`, {
    next: { revalidate: 300 },
  })
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`getProductBySlug failed: ${res.status}`)
  return res.json() as Promise<{ product: PublicProduct }>
}

export async function getCategories(): Promise<{ categories: string[] }> {
  const params = buildParams()
  const res = await fetch(`${API_URL}/api/v1/public/categories?${params}`, {
    next: { revalidate: 60 },
  })
  if (!res.ok) throw new Error(`getCategories failed: ${res.status}`)
  return res.json() as Promise<{ categories: string[] }>
}
