'use client'

import { useState } from 'react'
import useSWR from 'swr'
import type { PublicProduct, ProductsResponse } from '@/types/product'
import { ProductCard } from './ProductCard'
import { ProductCardSkeleton } from '@/components/ui/Skeleton'

interface ProductGridProps {
  initialProducts: PublicProduct[]
  categories: string[]
}

const fetcher = (url: string): Promise<ProductsResponse> =>
  fetch(url).then((r) => {
    if (!r.ok) throw new Error('fetch failed')
    return r.json() as Promise<ProductsResponse>
  })

export function ProductGrid({ initialProducts, categories }: ProductGridProps) {
  const [selectedCategory, setSelectedCategory] = useState('')

  const swrKey = selectedCategory
    ? `/api/products?category=${encodeURIComponent(selectedCategory)}`
    : null

  const { data, isLoading } = useSWR(swrKey, fetcher)
  const products = selectedCategory ? (data?.products ?? []) : initialProducts

  return (
    <section id="catalog" className="max-w-6xl mx-auto px-4 py-12">
      {/* Section header */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <p className="text-[10px] tracking-[.22em] uppercase font-semibold mb-1" style={{ color: 'var(--tx-faint)' }}>
            Catálogo
          </p>
          <h2 style={{ fontFamily: 'var(--font-head)', fontSize: 28, color: 'var(--marron)', fontWeight: 600 }}>
            Todos los productos
          </h2>
        </div>
        {/* TODO: buscador - ver TECHNICAL_DEBT.md */}
      </div>

      {/* Filtros por categoría */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-7">
          <button
            onClick={() => setSelectedCategory('')}
            className="px-[14px] py-[7px] rounded-full text-[11px] font-medium transition-all"
            style={{
              background: !selectedCategory ? 'var(--marron)' : '#fff',
              color: !selectedCategory ? 'var(--marfil)' : 'var(--tx-soft)',
              border: '1px solid',
              borderColor: !selectedCategory ? 'var(--marron)' : 'var(--line)',
            }}
          >
            Todos
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className="px-[14px] py-[7px] rounded-full text-[11px] font-medium transition-all"
              style={{
                background: selectedCategory === cat ? 'var(--marron)' : '#fff',
                color: selectedCategory === cat ? 'var(--marfil)' : 'var(--tx-soft)',
                border: '1px solid',
                borderColor: selectedCategory === cat ? 'var(--marron)' : 'var(--line)',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: 'var(--beige)', color: 'var(--gris-taupe)' }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
            </svg>
          </div>
          <p style={{ fontFamily: 'var(--font-head)', fontSize: 18, color: 'var(--marron)' }}>
            Sin resultados
          </p>
          <p className="text-[10.5px] mt-1.5" style={{ color: 'var(--tx-faint)' }}>
            Probá con otra categoría.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  )
}
