'use client'

export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { useCartStore } from '@/store/cartStore'

export default function FailurePage() {
  const toggleDrawer = useCartStore((s) => s.toggleDrawer)

  return (
    <div className="max-w-md mx-auto px-4 py-16 text-center animate-fade-in">
      {/* Ícono */}
      <div
        className="w-[88px] h-[88px] rounded-full flex items-center justify-center mx-auto mb-6 text-white"
        style={{ background: 'var(--error)', boxShadow: '0 10px 30px rgba(185,99,99,.3)' }}
      >
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" />
        </svg>
      </div>

      <h1
        style={{ fontFamily: 'var(--font-head)', fontSize: 28, color: 'var(--marron)', fontWeight: 600 }}
        className="mb-2"
      >
        No se pudo procesar el pago
      </h1>
      <p className="text-[13px] mb-8" style={{ color: 'var(--tx-soft)' }}>
        Hubo un problema con tu pago. Tus productos siguen en el carrito, podés intentarlo de nuevo.
      </p>

      <button
        onClick={toggleDrawer}
        className="flex items-center justify-center w-full py-4 rounded-[10px] text-[12.5px] font-semibold tracking-[.1em] uppercase text-white mb-2 transition-opacity hover:opacity-90"
        style={{ background: 'var(--taupe)' }}
      >
        Volver al carrito
      </button>
      <Link
        href="/"
        className="flex items-center justify-center w-full py-4 rounded-[10px] text-[12.5px] font-semibold tracking-[.1em] uppercase transition-colors"
        style={{ border: '1px solid var(--line)', color: 'var(--marron)', background: 'transparent' }}
      >
        Ir a la tienda
      </Link>
    </div>
  )
}
