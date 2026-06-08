'use client'

import { useCartStore } from '@/store/cartStore'
import type { PublicProduct } from '@/types/product'

interface AddToCartButtonProps {
  product: PublicProduct
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const addItem = useCartStore((s) => s.addItem)
  const items = useCartStore((s) => s.items)
  const isInCart = items.some((i) => i.product.id === product.id)

  return (
    <button
      onClick={() => addItem(product)}
      className="w-full mt-2 py-2 rounded-lg border border-brand text-brand text-xs font-semibold hover:bg-brand hover:text-white transition-colors flex items-center justify-center gap-1.5"
    >
      {isInCart ? (
        <>
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          En carrito
        </>
      ) : (
        'Agregar al carrito'
      )}
    </button>
  )
}
