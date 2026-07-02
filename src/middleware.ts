import { type NextRequest, NextResponse } from 'next/server'
import { get } from '@vercel/edge-config'
import { domainToEdgeConfigKey } from './lib/edge-config-key'

export const config = {
  // Excluye archivos estáticos de /public (cualquier path con extensión de
  // asset), /sites (acceso directo bloqueado) y /robots.txt (vive en la raíz
  // de app/ — robots.ts no soporta segmentos dinámicos como sitemap.ts).
  // /api/* SÍ matchea — necesita el header x-tenant-slug, solo que no se le
  // reescribe el path (ver abajo).
  matcher: ['/((?!_next|sites|robots\\.txt|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|css|js|map|woff2?|ttf|eot)$).*)'],
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
  // impulso_ecommerce_api acá. Edge Config es un lookup sub-ms sin red, pensado
  // exactamente para esto.
  if (process.env.EDGE_CONFIG) {
    try {
      const tenantSlug = await get<string>(domainToEdgeConfigKey(host))
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
  const isApiRoute = req.nextUrl.pathname.startsWith('/api/')

  if (!tenantSlug) {
    if (isApiRoute) return NextResponse.next()
    const url = req.nextUrl.clone()
    url.pathname = `/sites/unknown${req.nextUrl.pathname}`
    return NextResponse.rewrite(url)
  }

  const requestHeaders = new Headers(req.headers)
  requestHeaders.set('x-tenant-slug', tenantSlug)

  // app/api/* vive en el root (no bajo sites/[tenant]) a propósito — solo
  // necesita el header, reescribirle el path lo rompería (no existe esa ruta).
  if (isApiRoute) {
    return NextResponse.next({ request: { headers: requestHeaders } })
  }

  const url = req.nextUrl.clone()
  url.pathname = `/sites/${tenantSlug}${req.nextUrl.pathname}`
  return NextResponse.rewrite(url, { request: { headers: requestHeaders } })
}
