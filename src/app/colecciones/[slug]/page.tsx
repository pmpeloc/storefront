import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MOCK_COLLECTIONS, MOCK_PRODUCTS } from '@/lib/mock-data'

// TODO: collections - reemplazar con GET /public/collections/:slug — ver TECHNICAL_DEBT.md

interface Props {
  params: { slug: string }
}

export function generateStaticParams() {
  return MOCK_COLLECTIONS.map((c) => ({ slug: c.id }))
}

export default function ColeccionDetailPage({ params }: Props) {
  const collection = MOCK_COLLECTIONS.find((c) => c.id === params.slug)
  if (!collection) notFound()

  const products = collection.productIds
    .map((id) => MOCK_PRODUCTS.find((p) => p.id === id))
    .filter(Boolean) as typeof MOCK_PRODUCTS

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      {/* Back */}
      <Link
        href="/colecciones"
        className="inline-flex items-center gap-1.5 text-[11.5px] mb-6"
        style={{ color: 'var(--tx-soft)' }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" />
        </svg>
        Todas las colecciones
      </Link>

      <p className="text-[10px] tracking-[.22em] uppercase font-semibold mb-1" style={{ color: 'var(--taupe)' }}>
        Colección
      </p>
      <h1
        className="mb-2"
        style={{ fontFamily: 'var(--font-head)', fontSize: 'clamp(26px,4vw,36px)', color: 'var(--marron)', fontWeight: 600 }}
      >
        {collection.name}
      </h1>
      <p className="text-[13.5px] mb-8" style={{ color: 'var(--tx-soft)' }}>
        {collection.description}
      </p>

      <div className="grid grid-cols-2 gap-3">
        {products.map((p) => (
          <Link
            key={p.id}
            href={`/productos/${p.id}`}
            className="rounded-[14px] overflow-hidden transition-all hover:shadow-card"
            style={{ background: '#fff', border: '1px solid var(--line-soft)' }}
          >
            <div className="w-full aspect-square" style={{ background: 'var(--beige)' }} />
            <div className="p-3">
              <p className="text-[12.5px] font-medium leading-snug mb-1" style={{ color: 'var(--tx)' }}>{p.name}</p>
              <p className="text-[13px] font-semibold" style={{ color: 'var(--marron)' }}>
                ${p.price.toLocaleString('es-AR')}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}
