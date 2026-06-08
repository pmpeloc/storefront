'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')
  const clear = useCartStore((s) => s.clear)

  useEffect(() => {
    clear()
  }, [clear])

  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      <div className="mb-6 flex justify-center">
        <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
          <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>

      <h1 className="text-2xl font-bold text-stone-900 mb-2">¡Pedido confirmado!</h1>
      <p className="text-stone-500 text-sm mb-1">
        Recibiste un email con los detalles de tu compra.
      </p>
      {orderId && (
        <p className="text-xs text-stone-400 mb-8">
          Número de pedido: <span className="font-mono">{orderId}</span>
        </p>
      )}

      <Link
        href="/"
        className="inline-block bg-brand text-white px-6 py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity"
      >
        Volver a la tienda
      </Link>
    </div>
  )
}
