'use client'

export const dynamic = 'force-dynamic'

import { Suspense, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'

function SuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')
  const clear = useCartStore((s) => s.clear)

  useEffect(() => {
    clear()
  }, [clear])

  return (
    <div className="max-w-md mx-auto px-4 py-16 text-center animate-fade-in">
      {/* Ícono */}
      <div
        className="w-[88px] h-[88px] rounded-full flex items-center justify-center mx-auto mb-6 text-white"
        style={{ background: 'var(--exito)', boxShadow: '0 10px 30px rgba(127,154,112,.4)' }}
      >
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <h1
        style={{ fontFamily: 'var(--font-head)', fontSize: 28, color: 'var(--marron)', fontWeight: 600 }}
        className="mb-2"
      >
        ¡Gracias por tu compra!
      </h1>
      <p className="text-[13px] mb-6" style={{ color: 'var(--tx-soft)' }}>
        Tu pedido fue recibido. Te enviamos la confirmación por email.
      </p>

      {/* Detalle del pedido */}
      <div
        className="rounded-[14px] p-5 mb-6 text-left"
        style={{ background: 'var(--marfil)' }}
      >
        <p className="text-[10px] tracking-[.16em] uppercase font-semibold mb-2" style={{ color: 'var(--tx-faint)' }}>
          Número de pedido
        </p>
        <p
          className="mb-4"
          style={{ fontFamily: 'var(--font-head)', fontSize: 24, color: 'var(--marron)', fontWeight: 600 }}
        >
          {orderId ? `#${orderId}` : '#RN-NUEVO'}
        </p>

        <div className="flex justify-between text-[12.5px] mb-2.5">
          <span style={{ color: 'var(--tx-soft)' }}>Envío</span>
          <span style={{ color: 'var(--taupe)', fontWeight: 500 }}>En preparación</span>
        </div>
        <div className="flex justify-between text-[12.5px] items-center">
          <span style={{ color: 'var(--tx-soft)' }}>Pago</span>
          <span className="flex items-center gap-1.5 font-medium" style={{ color: 'var(--exito)' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path d="M5 13l4 4L19 7" strokeLinecap="round" />
            </svg>
            Aprobado
          </span>
        </div>
      </div>

      <Link
        href="/cuenta/pedidos"
        className="flex items-center justify-center w-full py-4 rounded-[10px] text-[12.5px] font-semibold tracking-[.1em] uppercase text-white mb-2 transition-opacity hover:opacity-90"
        style={{ background: 'var(--taupe)' }}
      >
        Ver mi pedido
      </Link>
      <Link
        href="/"
        className="flex items-center justify-center w-full py-4 rounded-[10px] text-[12.5px] font-semibold tracking-[.1em] uppercase transition-colors"
        style={{ border: '1px solid var(--line)', color: 'var(--marron)', background: 'transparent' }}
      >
        Volver al inicio
      </Link>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  )
}
