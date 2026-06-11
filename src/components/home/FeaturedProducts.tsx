import Link from 'next/link'
import type { PublicProduct } from '@/types/product'
import { ProductCard } from '@/components/product/ProductCard'

interface FeaturedProductsProps {
  products: PublicProduct[]
  eyebrow?: string
  title?: string
  ctaHref?: string
  ctaLabel?: string
}

export function FeaturedProducts({
  products,
  eyebrow = 'Lo más elegido',
  title = 'Productos destacados',
  ctaHref = '/productos',
  ctaLabel = 'Ver todo el catálogo →',
}: FeaturedProductsProps) {
  if (products.length === 0) return null

  return (
    <section style={{ padding: '64px 0' }}>
      {/* ── Desktop ── */}
      <div className="hidden md:block" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            marginBottom: 34,
          }}
        >
          <div>
            <p
              style={{
                fontSize: 11,
                letterSpacing: '.24em',
                textTransform: 'uppercase',
                color: 'var(--accent, var(--taupe))',
                fontWeight: 600,
                margin: 0,
              }}
            >
              {eyebrow}
            </p>
            <h2
              style={{
                fontFamily: 'var(--font-head)',
                fontWeight: 600,
                color: 'var(--marron)',
                fontSize: 40,
                lineHeight: 1.05,
                letterSpacing: '.005em',
                marginTop: 10,
                marginBottom: 0,
              }}
            >
              {title}
            </h2>
          </div>
          <Link
            href={ctaHref}
            style={{
              color: 'var(--accent, var(--taupe))',
              fontWeight: 600,
              fontSize: 13,
              textDecoration: 'none',
              cursor: 'pointer',
            }}
            className="transition-colors hover:opacity-80"
          >
            {ctaLabel}
          </Link>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '34px 28px',
          }}
        >
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* ── Mobile ── */}
      <div className="md:hidden px-[18px]">
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            marginBottom: 12,
          }}
        >
          <p
            style={{
              fontSize: 10,
              letterSpacing: '.22em',
              textTransform: 'uppercase',
              color: 'var(--tx-faint)',
              fontWeight: 500,
              margin: 0,
            }}
          >
            {eyebrow}
          </p>
          <Link
            href={ctaHref}
            style={{
              color: 'var(--accent, var(--taupe))',
              fontWeight: 600,
              fontSize: 12,
              textDecoration: 'none',
            }}
          >
            Ver todo
          </Link>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '16px 14px',
          }}
        >
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
