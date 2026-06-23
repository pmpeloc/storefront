'use client'

import { useCartStore } from '@/store/cartStore'
import { CartIcon } from '@/components/icons/CartIcon'

export function CartButton() {
  const itemCount = useCartStore((s) => s.itemCount)
  const toggleDrawer = useCartStore((s) => s.toggleDrawer)

  return (
    <button
      onClick={toggleDrawer}
      aria-label="carrito de compras"
      className="relative w-9 h-9 flex items-center justify-center rounded-[11px] hover:bg-beige transition-colors text-marron"
    >
      <CartIcon />
      {itemCount > 0 && (
        <span
          data-testid="cart-badge"
          className="absolute top-0 right-0 min-w-[15px] h-[15px] px-[3px] text-white rounded-full text-[9px] font-semibold flex items-center justify-center"
          style={{ background: 'var(--accent, var(--taupe))', border: '1.5px solid var(--crema)' }}
        >
          {itemCount}
        </span>
      )}
    </button>
  )
}
