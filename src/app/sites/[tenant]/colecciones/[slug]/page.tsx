import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { MOCK_COLLECTIONS, MOCK_PRODUCTS } from '@/lib/mock-data'
import { formatPrice } from '@/lib/format'

// TODO: collections - reemplazar con GET /public/collections/:slug — ver TECHNICAL_DEBT.md

interface Props {
  params: { slug: string }
}

export function generateStaticParams() {
  return MOCK_COLLECTIONS.map((c) => ({ slug: c.id }))
}

export default function CollectionDetailPage({ params }: Props) {
  const collection = MOCK_COLLECTIONS.find((c) => c.id === params.slug)
  if (!collection) notFound()

  const products = collection.productIds
    .map((id) => MOCK_PRODUCTS.find((p) => p.id === id))
    .filter(Boolean) as typeof MOCK_PRODUCTS

  return (
    <main>
      {/* Hero full-bleed — Desktop 420px / Mobile 240px */}
      <div className="relative" style={{ height: 'clamp(240px,35vw,420px)' }}>
        <Image
          src={collection.heroImage}
          alt={collection.name}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(63,53,44,.7), transparent 60%)' }}
        />
        {/* Back button mobile */}
        <div className="md:hidden absolute top-4 left-4">
          <Link
            href="/colecciones"
            className="flex items-center justify-center w-9 h-9 rounded-full"
            style={{ background: 'rgba(255,255,255,.85)' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--marron)" strokeWidth={2}>
              <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" />
            </svg>
          </Link>
        </div>
        {/* Texto overlay */}
        <div
          className="absolute inset-0 flex flex-col justify-end"
          style={{ padding: 'clamp(20px,3vw,50px)', paddingBottom: 'clamp(24px,4vw,50px)' }}
        >
          <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%' }}>
            <p
              className="text-[11px] tracking-[.24em] uppercase font-semibold"
              style={{ color: '#fff', opacity: 0.9 }}
            >
              Colección
            </p>
            <h1
              style={{
                fontFamily: 'var(--font-head)',
                color: '#fff',
                fontSize: 'clamp(30px,5vw,60px)',
                fontWeight: 600,
                marginTop: 10,
                lineHeight: 1.05,
              }}
            >
              {collection.name}
            </h1>
            <p style={{ color: 'rgba(255,255,255,.9)', fontSize: 16, maxWidth: 480, marginTop: 8 }}>
              {collection.description}
            </p>
          </div>
        </div>
      </div>

      {/* Desktop: sec-head + grid-4 */}
      <div className="hidden md:block" style={{ maxWidth: 1200, margin: '0 auto', padding: '56px 40px 80px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            marginBottom: 40,
          }}
        >
          <div>
            <p className="text-[11px] tracking-[.24em] uppercase font-semibold" style={{ color: 'var(--taupe)' }}>
              Piezas de la colección
            </p>
            <h2
              style={{
                fontFamily: 'var(--font-head)',
                fontSize: 32,
                color: 'var(--marron)',
                fontWeight: 600,
                marginTop: 10,
              }}
            >
              {products.length} productos
            </h2>
          </div>
          <Link
            href="/colecciones"
            className="text-[13px] font-semibold transition-opacity hover:opacity-70"
            style={{ color: 'var(--taupe)' }}
          >
            ← Todas las colecciones
          </Link>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '34px 28px',
          }}
        >
          {products.map((p) => (
            <CollectionProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>

      {/* Mobile: back + grid-2 */}
      <div className="md:hidden px-[18px] py-6">
        <Link
          href="/colecciones"
          className="inline-flex items-center gap-1.5 text-[11.5px] mb-5"
          style={{ color: 'var(--tx-soft)' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" />
          </svg>
          Todas las colecciones
        </Link>
        <p
          className="text-[11px] tracking-[.2em] uppercase font-semibold mb-4"
          style={{ color: 'var(--taupe)' }}
        >
          Productos de la colección
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px 14px' }}>
          {products.map((p) => (
            <CollectionProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </main>
  )
}

function CollectionProductCard({ product }: { product: (typeof MOCK_PRODUCTS)[0] }) {
  return (
    <Link href={`/productos/${product.slug}`} className="block group">
      <div
        className="relative aspect-square overflow-hidden mb-2"
        style={{ borderRadius: 14, background: 'var(--beige)' }}
      >
        <Image
          src={product.mainImage}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:-translate-y-1"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
      </div>
      <p className="text-[12px] font-medium leading-snug" style={{ color: 'var(--tx)' }}>
        {product.name}
      </p>
      <p className="text-[11px] mt-0.5" style={{ color: 'var(--tx-soft)' }}>
        {product.color}
      </p>
      <p className="text-[13px] font-semibold mt-0.5" style={{ color: 'var(--marron)' }}>
        ${formatPrice(product.price)}
      </p>
    </Link>
  )
}
