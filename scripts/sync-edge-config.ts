/**
 * Sync tenant_domains (prodcast_api / Supabase) → Vercel Edge Config.
 *
 * El middleware de storefront resuelve dominio→tenant leyendo Edge Config
 * (lookup sub-ms en el Edge Runtime, sin red) — nunca le pega directo a
 * prodcast_api. Este script es la fuente de sincronización: lee la tabla
 * tenant_domains (join con tenants para el slug) y sobreescribe el mapeo
 * completo `domain:<host>` → `<tenantSlug>` en Edge Config.
 *
 * Uso: npm run sync:edge-config
 *
 * Correr a mano después de crear/editar un tenant_domain, hasta que exista
 * un CRUD admin que lo dispare automáticamente.
 *
 * Requiere en .env.local:
 *   SUPABASE_URL
 *   SUPABASE_SERVICE_KEY
 *   VERCEL_API_TOKEN     — vercel.com/account/tokens
 *   EDGE_CONFIG_ID        — id del Edge Config (vercel.com/dashboard → Storage)
 */

import { config } from 'dotenv'
config({ path: '.env.local' })

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } },
)

const VERCEL_API_TOKEN = process.env.VERCEL_API_TOKEN
const EDGE_CONFIG_ID = process.env.EDGE_CONFIG_ID

if (!VERCEL_API_TOKEN || !EDGE_CONFIG_ID) {
  console.error('❌  VERCEL_API_TOKEN y EDGE_CONFIG_ID son requeridos en .env')
  process.exit(1)
}

interface TenantDomainRow {
  domain: string
  tenants: { slug: string } | { slug: string }[] | null
}

async function sync() {
  console.log('🔄  Leyendo tenant_domains desde Supabase...')

  const { data, error } = await supabase
    .from('tenant_domains')
    .select('domain, tenants(slug)')
    .returns<TenantDomainRow[]>()

  if (error) {
    console.error('❌  Error al leer tenant_domains:', error.message)
    process.exit(1)
  }

  const items = (data ?? []).flatMap((row) => {
    const tenant = Array.isArray(row.tenants) ? row.tenants[0] : row.tenants
    if (!tenant) return []
    return [{ operation: 'upsert' as const, key: `domain:${row.domain}`, value: tenant.slug }]
  })

  if (items.length === 0) {
    console.log('ℹ️  No hay tenant_domains para sincronizar.')
    return
  }

  console.log(`🚀  Sincronizando ${items.length} dominios a Edge Config...`)
  items.forEach((i) => console.log(`   ${i.key} → ${i.value}`))

  const res = await fetch(`https://api.vercel.com/v1/edge-config/${EDGE_CONFIG_ID}/items`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${VERCEL_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ items }),
  })

  if (!res.ok) {
    const body = await res.text()
    console.error(`❌  Error al actualizar Edge Config (${res.status}):`, body)
    process.exit(1)
  }

  console.log('✅  Edge Config sincronizado correctamente.')
}

sync()
