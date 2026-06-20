import { type NextRequest, NextResponse } from 'next/server'
import { get } from '@vercel/edge-config'

export const config = {
  matcher: ['/((?!_next|sites|favicon|api/health).*)'],
}

// Mapeo mínimo para desarrollo local, cuando no hay Edge Config conectado
// (sin EDGE_CONFIG seteado). Nunca se usa como fallback en producción: ahí
// Edge Config siempre debe tener el dominio real sincronizado (ver
// scripts/sync-edge-config.ts). Si Edge Config está conectado pero el
// dominio no está en el mapeo, se considera dominio desconocido.
const DEV_FALLBACK_DOMAINS: Record<string, string> = {
  'localhost:3000': 'el-renuevo',
}

async function resolveTenantSlug(host: string): Promise<string | null> {
  // Edge Middleware corre en el Edge Runtime — el fetch cache de Next no
  // aplica igual que en Server Components, así que no le pegamos a
  // prodcast_api acá. Edge Config es un lookup sub-ms sin red, pensado
  // exactamente para esto.
  if (process.env.EDGE_CONFIG) {
    try {
      const tenantSlug = await get<string>(`domain:${host}`)
      if (tenantSlug) return tenantSlug
      return null
    } catch {
      return null
    }
  }

  return DEV_FALLBACK_DOMAINS[host] ?? null
}

export async function middleware(req: NextRequest): Promise<NextResponse> {
  const host = req.headers.get('host') ?? ''
  const tenantSlug = await resolveTenantSlug(host)

  const url = req.nextUrl.clone()

  if (!tenantSlug) {
    url.pathname = `/sites/unknown${req.nextUrl.pathname}`
    return NextResponse.rewrite(url)
  }

  url.pathname = `/sites/${tenantSlug}${req.nextUrl.pathname}`

  const requestHeaders = new Headers(req.headers)
  requestHeaders.set('x-tenant-slug', tenantSlug)

  return NextResponse.rewrite(url, { request: { headers: requestHeaders } })
}
