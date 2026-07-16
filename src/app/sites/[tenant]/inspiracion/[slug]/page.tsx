import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { MOCK_INSPIRATION, MOCK_PRODUCTS } from '@/lib/mock-data'
import { InspirationAddToCart } from '@/components/inspiration/InspirationAddToCart'
import { formatPrice } from '@/lib/format'
import { assertNavSectionEnabled } from '@/lib/nav-sections'

// TODO: inspiracion - reemplazar con GET /public/inspirations/:slug — ver TECHNICAL_DEBT.md

interface Props {
  params: { tenant: string; slug: string }
}

export function generateStaticParams() {
  return MOCK_INSPIRATION.map((i) => ({ slug: i.id }))
}

export default async function InspirationDetailPage({ params }: Props) {
  await assertNavSectionEnabled(params.tenant, 'inspiracion')
  const item = MOCK_INSPIRATION.find((i) => i.id === params.slug)
  if (!item) notFound()

  const products = item.productIds
    .map((id) => MOCK_PRODUCTS.find((p) => p.id === id))
    .filter(Boolean) as typeof MOCK_PRODUCTS

  return (
    <main>
      {/* Desktop: split 1.4fr / 1fr */}
      <div
        className="hidden md:block"
        style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 40px 90px' }}
      >
        <Link
          href="/inspiracion"
          className="inline-flex items-center gap-2 text-[12px] font-medium mb-5 transition-opacity hover:opacity-70"
          style={{ color: 'var(--taupe)' }}
        >
          ← Volver a inspiración
        </Link>

        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 50, alignItems: 'start' }}>
          {/* Imagen ambiente */}
          <div
            className="relative overflow-hidden"
            style={{ aspectRatio: '4/3', borderRadius: 18 }}
          >
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover"
              priority
              sizes="55vw"
            />
          </div>

          {/* Info + productos */}
          <div>
            <p
              className="text-[11px] tracking-[.22em] uppercase font-semibold"
              style={{ color: 'var(--taupe)' }}
            >
              {item.category}
            </p>
            <h1
              style={{
                fontFamily: 'var(--font-head)',
                fontSize: 38,
                fontWeight: 600,
                color: 'var(--marron)',
                margin: '10px 0 14px',
                lineHeight: 1.1,
              }}
            >
              {item.title}
            </h1>
            <p className="text-[15px] leading-relaxed" style={{ color: 'var(--tx-soft)' }}>
              Recreá este ambiente con los productos seleccionados. Sumalos al carrito directamente.
            </p>

            <div style={{ marginTop: 24 }}>
              <p
                className="text-[11px] tracking-[.22em] uppercase font-semibold mb-4"
                style={{ color: 'var(--tx-faint)' }}
              >
                Productos en la foto
              </p>
              {products.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-4"
                  style={{ padding: '16px 0', borderBottom: '1px solid var(--line-soft)' }}
                >
                  <Link href={`/productos/${p.slug}`} className="flex-shrink-0">
                    <div
                      className="relative overflow-hidden"
                      style={{ width: 72, height: 72, borderRadius: 12, background: 'var(--beige)' }}
                    >
                      <Image
                        src={p.mainImage}
                        alt={p.name}
                        fill
                        className="object-cover"
                        sizes="72px"
                      />
                    </div>
                  </Link>
                  <Link href={`/productos/${p.slug}`} className="flex-1">
                    <p className="text-[14px] font-medium" style={{ color: 'var(--marron)' }}>{p.name}</p>
                    <p className="text-[13px] font-semibold mt-0.5" style={{ color: 'var(--marron)' }}>
                      ${formatPrice(p.price)}
                    </p>
                  </Link>
                  <InspirationAddToCart product={p} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: hero + lista */}
      <div className="md:hidden">
        {/* Back button flotante */}
        <div className="relative" style={{ height: 300 }}>
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute top-4 left-4">
            <Link
              href="/inspiracion"
              className="flex items-center justify-center w-9 h-9 rounded-full"
              style={{ background: 'rgba(255,255,255,.85)' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--marron)" strokeWidth={2}>
                <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" />
              </svg>
            </Link>
          </div>
        </div>

        <div className="px-[18px] pt-4 pb-10">
          <p
            className="text-[11px] tracking-[.22em] uppercase font-semibold"
            style={{ color: 'var(--taupe)' }}
          >
            {item.category}
          </p>
          <h1
            style={{
              fontFamily: 'var(--font-head)',
              fontSize: 24,
              fontWeight: 600,
              color: 'var(--marron)',
              margin: '6px 0 6px',
              lineHeight: 1.2,
            }}
          >
            {item.title}
          </h1>
          <p className="text-[12.5px] leading-relaxed" style={{ color: 'var(--tx-soft)' }}>
            Recreá este ambiente con los productos seleccionados. Tocá cada uno para comprarlo.
          </p>

          <p
            className="text-[11px] tracking-[.22em] uppercase font-semibold mt-5 mb-2"
            style={{ color: 'var(--tx-faint)' }}
          >
            Productos en la foto
          </p>
          {products.map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-3"
              style={{ padding: '12px 0', borderBottom: '1px solid var(--line-soft)' }}
            >
              <Link href={`/productos/${p.slug}`} className="flex-shrink-0">
                <div
                  className="relative overflow-hidden"
                  style={{ width: 60, height: 60, borderRadius: 10, background: 'var(--beige)' }}
                >
                  <Image
                    src={p.mainImage}
                    alt={p.name}
                    fill
                    className="object-cover"
                    sizes="60px"
                  />
                </div>
              </Link>
              <Link href={`/productos/${p.slug}`} className="flex-1">
                <p className="text-[12.5px] font-medium" style={{ color: 'var(--tx)' }}>{p.name}</p>
                <p className="text-[12.5px] font-semibold mt-0.5" style={{ color: 'var(--marron)' }}>
                  ${formatPrice(p.price)}
                </p>
              </Link>
              <InspirationAddToCart product={p} size="sm" />
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
