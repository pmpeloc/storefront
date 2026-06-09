import Link from 'next/link'
import type { PublicProduct } from '@/types/product'
import { ProductCard } from '@/components/product/ProductCard'

interface FeaturedProductsProps {
  products: PublicProduct[]
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  if (products.length === 0) return null

  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-end justify-between mb-6">
        <div>
          <p className="text-[10px] tracking-[.22em] uppercase font-semibold mb-1" style={{ color: 'var(--tx-faint)' }}>
            Destacados
          </p>
          <h2 style={{ fontFamily: 'var(--font-head)', fontSize: 26, color: 'var(--marron)', fontWeight: 600 }}>
            Los más queridos
          </h2>
        </div>
        <Link
          href="/productos"
          className="text-[12px] font-semibold transition-colors"
          style={{ color: 'var(--taupe)' }}
        >
          Ver todo
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {products.slice(0, 4).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
