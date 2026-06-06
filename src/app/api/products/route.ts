import { type NextRequest, NextResponse } from 'next/server'
import { getProducts } from '@/lib/api'

// Proxy for client-side category filtering — keeps TENANT_SLUG server-side
export async function GET(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = req.nextUrl
  const category = searchParams.get('category') ?? undefined
  const page = Number(searchParams.get('page')) || 1
  const limit = Math.min(Number(searchParams.get('limit')) || 20, 100)

  try {
    const data = await getProducts({ category, page, limit })
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}
