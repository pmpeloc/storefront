import type { ProductsResponse, PublicProduct } from '@/types/product'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'

function buildParams(
  tenantSlug: string,
  extra?: Record<string, string | number | undefined>,
): URLSearchParams {
  const params = new URLSearchParams({ tenantSlug })
  if (extra) {
    for (const [k, v] of Object.entries(extra)) {
      if (v !== undefined) params.set(k, String(v))
    }
  }
  return params
}

export async function getProducts(
  tenantSlug: string,
  options?: {
    category?: string
    page?: number
    limit?: number
  },
): Promise<ProductsResponse> {
  const params = buildParams(tenantSlug, {
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

export async function getFeaturedProducts(tenantSlug: string): Promise<ProductsResponse> {
  const params = buildParams(tenantSlug)
  const res = await fetch(`${API_URL}/api/v1/public/products/featured?${params}`, {
    next: { revalidate: 60 },
  })
  if (!res.ok) throw new Error(`getFeaturedProducts failed: ${res.status}`)
  return res.json() as Promise<ProductsResponse>
}

export async function getProductBySlug(
  tenantSlug: string,
  slug: string,
): Promise<{ product: PublicProduct } | null> {
  const params = buildParams(tenantSlug)
  const res = await fetch(`${API_URL}/api/v1/public/products/${encodeURIComponent(slug)}?${params}`, {
    next: { revalidate: 300 },
  })
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`getProductBySlug failed: ${res.status}`)
  return res.json() as Promise<{ product: PublicProduct }>
}

export async function getCategories(tenantSlug: string): Promise<{ categories: string[] }> {
  const params = buildParams(tenantSlug)
  const res = await fetch(`${API_URL}/api/v1/public/categories?${params}`, {
    next: { revalidate: 60 },
  })
  if (!res.ok) throw new Error(`getCategories failed: ${res.status}`)
  return res.json() as Promise<{ categories: string[] }>
}
