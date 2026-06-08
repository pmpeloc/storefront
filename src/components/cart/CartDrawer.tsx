'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useCartStore } from '@/store/cartStore'

export function CartDrawer() {
  const isOpen = useCartStore((s) => s.isOpen)
  const items = useCartStore((s) => s.items)
  const total = useCartStore((s) => s.total)
  const toggleDrawer = useCartStore((s) => s.toggleDrawer)
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const removeItem = useCartStore((s) => s.removeItem)

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={toggleDrawer}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white z-50 flex flex-col shadow-xl">
        <div className="flex items-center justify-between px-4 py-4 border-b border-stone-200">
          <h2 className="text-lg font-semibold text-stone-900">Tu carrito</h2>
          <button
            onClick={toggleDrawer}
            aria-label="cerrar carrito"
            className="p-2 text-stone-400 hover:text-stone-600 transition-colors"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-stone-400 text-sm">
            El carrito está vacío
          </div>
        ) : (
          <>
            <ul className="flex-1 overflow-y-auto divide-y divide-stone-100 px-4">
              {items.map(({ product, quantity }) => (
                <li key={product.id} className="py-4 flex gap-3">
                  <div className="relative h-16 w-16 flex-shrink-0 rounded-lg overflow-hidden bg-stone-100">
                    {product.image_url ? (
                      <Image src={product.image_url} alt={product.name} fill className="object-cover" sizes="64px" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-stone-300">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-stone-800 line-clamp-2">{product.name}</p>
                    <p className="text-sm font-bold text-stone-900 mt-0.5">
                      ${(product.price * quantity).toLocaleString('es-AR')}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        aria-label="reducir cantidad"
                        disabled={quantity <= 1}
                        className="h-6 w-6 rounded-full border border-stone-300 flex items-center justify-center text-stone-600 hover:border-stone-500 disabled:opacity-40"
                      >
                        <span aria-hidden="true">−</span>
                      </button>
                      <span className="text-sm font-medium w-5 text-center">{quantity}</span>
                      <button
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        aria-label="aumentar cantidad"
                        className="h-6 w-6 rounded-full border border-stone-300 flex items-center justify-center text-stone-600 hover:border-stone-500"
                      >
                        <span aria-hidden="true">+</span>
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => removeItem(product.id)}
                    aria-label="eliminar producto"
                    className="self-start p-1 text-stone-400 hover:text-red-500 transition-colors"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>

            <div className="border-t border-stone-200 px-4 py-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-stone-600">Total</span>
                <span className="text-lg font-bold text-stone-900">
                  ${total.toLocaleString('es-AR')}
                </span>
              </div>
              <Link
                href="/checkout"
                onClick={toggleDrawer}
                className="block w-full bg-brand text-white text-center py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                Finalizar compra
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  )
}
