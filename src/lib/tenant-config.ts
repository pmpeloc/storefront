// Espeja el contrato de impulso_ecommerce_api (snake_case) — ver GET /api/v1/public/tenant-config
export interface TenantConfig {
  tenant_id: string
  client_name: string
  brand_color: string
  logo_url: string | null
  favicon_url: string | null
  email_from: string | null
  whatsapp_number: string | null
  whatsapp_message: string | null
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'

export async function fetchTenantConfigBySlug(tenantSlug: string): Promise<TenantConfig | null> {
  const res = await fetch(
    `${API_URL}/api/v1/public/tenant-config?tenantSlug=${encodeURIComponent(tenantSlug)}`,
    { next: { revalidate: 300 } },
  )
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`fetchTenantConfigBySlug failed: ${res.status}`)
  const data = (await res.json()) as { tenantConfig: TenantConfig }
  return data.tenantConfig
}

export async function fetchAllTenantSlugs(): Promise<string[]> {
  const res = await fetch(`${API_URL}/api/v1/public/tenants`, { next: { revalidate: 3600 } })
  if (!res.ok) return []
  const data = (await res.json()) as { slugs: string[] }
  return data.slugs
}
