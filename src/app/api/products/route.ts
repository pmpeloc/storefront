import { type NextRequest, NextResponse } from 'next/server'
import { getProducts } from '@/lib/api'

// Proxy for client-side category filtering. El tenant se lee del header
// interno x-tenant-slug, seteado por middleware.ts al resolver el dominio —
// nunca se re-deriva parseando el path reescrito (sites/[tenant]/...), para
// no acoplar este route handler a esa convención de carpetas.
export async function GET(req: NextRequest): Promise<NextResponse> {
  const tenantSlug = req.headers.get('x-tenant-slug')
  if (!tenantSlug) {
    return NextResponse.json({ error: 'Missing x-tenant-slug header' }, { status: 400 })
  }

  const { searchParams } = req.nextUrl
  const category = searchParams.get('category') ?? undefined
  const page = Number(searchParams.get('page')) || 1
  const limit = Math.min(Number(searchParams.get('limit')) || 20, 100)

  try {
    const data = await getProducts(tenantSlug, { category, page, limit })
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}
