'use client'

import Link from 'next/link'
import { useCartStore } from '@/store/cartStore'

export default function FailurePage() {
  const toggleDrawer = useCartStore((s) => s.toggleDrawer)

  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      <div className="mb-6 flex justify-center">
        <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
          <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
      </div>

      <h1 className="text-2xl font-bold text-stone-900 mb-2">No se pudo procesar el pago</h1>
      <p className="text-stone-500 text-sm mb-8">
        Hubo un problema al procesar tu pago. Tus productos siguen en el carrito.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={toggleDrawer}
          className="bg-brand text-white px-6 py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          Volver al carrito
        </button>
        <Link
          href="/"
          className="border border-stone-300 text-stone-700 px-6 py-3 rounded-xl font-semibold text-sm hover:bg-stone-50 transition-colors"
        >
          Ir a la tienda
        </Link>
      </div>
    </div>
  )
}
