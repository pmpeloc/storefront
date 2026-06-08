'use client'

import { useCartStore } from '@/store/cartStore'

export function CartButton() {
  const itemCount = useCartStore((s) => s.itemCount)
  const toggleDrawer = useCartStore((s) => s.toggleDrawer)

  return (
    <button
      onClick={toggleDrawer}
      aria-label="carrito de compras"
      className="relative p-2 text-stone-600 hover:text-stone-900 transition-colors"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.847-7.148a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
        />
      </svg>
      {itemCount > 0 && (
        <span
          data-testid="cart-badge"
          className="absolute -top-1 -right-1 bg-brand text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
        >
          {itemCount}
        </span>
      )}
    </button>
  )
}
