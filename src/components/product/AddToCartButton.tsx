'use client'

import { useCartStore } from '@/store/cartStore'
import { useToastStore } from '@/store/toastStore'
import type { PublicProduct } from '@/types/product'

interface AddToCartButtonProps {
  product: PublicProduct
  quantity?: number
  size?: 'sm' | 'lg'
}

export function AddToCartButton({ product, quantity = 1, size = 'sm' }: AddToCartButtonProps) {
  const addItem = useCartStore((s) => s.addItem)
  const items = useCartStore((s) => s.items)
  const addToast = useToastStore((s) => s.addToast)
  const isInCart = items.some((i) => i.product.id === product.id)

  function handleAdd() {
    for (let i = 0; i < quantity; i++) addItem(product)
    addToast('Agregado al carrito', 'ok')
  }

  if (size === 'lg') {
    return (
      <button
        onClick={handleAdd}
        className="w-full py-4 rounded-[10px] text-[12.5px] font-semibold tracking-[.12em] uppercase text-white transition-opacity hover:opacity-90"
        style={{ background: 'var(--taupe)' }}
      >
        {isInCart ? '✓ En carrito — agregar más' : 'Agregar al carrito'}
      </button>
    )
  }

  return (
    <button
      onClick={handleAdd}
      className="w-full py-2 text-[11px] font-semibold tracking-[.08em] uppercase rounded-[10px] transition-colors"
      style={{ border: '1px solid var(--line)', color: 'var(--marron)', background: 'transparent' }}
    >
      {isInCart ? '✓ En carrito' : 'Agregar'}
    </button>
  )
}
