import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MOCK_INSPIRATION, MOCK_PRODUCTS, MOCK_SWATCHES } from '@/lib/mock-data'

// TODO: inspiracion - reemplazar con GET /public/inspirations/:slug — ver TECHNICAL_DEBT.md

interface Props {
  params: { slug: string }
}

export function generateStaticParams() {
  return MOCK_INSPIRATION.map((i) => ({ slug: i.id }))
}

export default function InspiraccionDetailPage({ params }: Props) {
  const item = MOCK_INSPIRATION.find((i) => i.id === params.slug)
  if (!item) notFound()

  const products = item.productIds
    .map((id) => MOCK_PRODUCTS.find((p) => p.id === id))
    .filter(Boolean) as typeof MOCK_PRODUCTS

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      {/* Back */}
      <Link
        href="/inspiracion"
        className="inline-flex items-center gap-1.5 text-[11.5px] mb-6"
        style={{ color: 'var(--tx-soft)' }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" />
        </svg>
        Inspiración
      </Link>

      {/* Hero */}
      <div className="rounded-[18px] overflow-hidden mb-6 aspect-video" style={{ background: 'var(--beige)' }} />

      <span
        className="text-[9.5px] tracking-[.18em] uppercase font-semibold mb-1 block"
        style={{ color: 'var(--taupe)' }}
      >
        {item.category}
      </span>
      <h1
        className="mb-6"
        style={{ fontFamily: 'var(--font-head)', fontSize: 'clamp(22px,3vw,30px)', color: 'var(--marron)', fontWeight: 600 }}
      >
        {item.title}
      </h1>

      {/* Comprá el look */}
      <p className="text-[10px] tracking-[.2em] uppercase font-semibold mb-3" style={{ color: 'var(--tx-faint)' }}>
        Comprá el look
      </p>

      <div className="space-y-3">
        {products.map((p) => (
          <Link
            key={p.id}
            href={`/productos/${p.id}`}
            className="flex items-center gap-4 p-3.5 rounded-[14px] transition-all hover:shadow-card"
            style={{ background: '#fff', border: '1px solid var(--line-soft)' }}
          >
            <div className="w-[60px] h-[60px] rounded-[10px] flex-shrink-0" style={{ background: 'var(--beige)' }} />
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium truncate" style={{ color: 'var(--tx)' }}>{p.name}</p>
              <div className="flex items-center gap-1.5 mt-1">
                {p.variants.slice(0, 3).map((v) => (
                  <span
                    key={v}
                    className="w-4 h-4 rounded-full border"
                    style={{ background: MOCK_SWATCHES[v] ?? '#ccc', borderColor: 'var(--line)' }}
                    title={v}
                  />
                ))}
              </div>
            </div>
            <span className="text-[13px] font-semibold flex-shrink-0" style={{ color: 'var(--marron)' }}>
              ${p.price.toLocaleString('es-AR')}
            </span>
          </Link>
        ))}
      </div>
    </main>
  )
}
