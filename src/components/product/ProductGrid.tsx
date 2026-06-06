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
    <section id="catalog" className="max-w-5xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold text-stone-900 mb-6">Catálogo</h2>

      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              !selectedCategory
                ? 'bg-brand text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Todos
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-brand text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <p className="text-stone-500 text-center py-16">
          No hay productos en esta categoría.
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  )
}
