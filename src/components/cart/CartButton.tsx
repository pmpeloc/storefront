'use client'

import { useCartStore } from '@/store/cartStore'

export function CartButton() {
  const itemCount = useCartStore((s) => s.itemCount)
  const toggleDrawer = useCartStore((s) => s.toggleDrawer)

  return (
    <button
      onClick={toggleDrawer}
      aria-label="carrito de compras"
      className="relative w-9 h-9 flex items-center justify-center rounded-[11px] hover:bg-beige transition-colors text-marron"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3 6h18" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 10a4 4 0 01-8 0" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
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
