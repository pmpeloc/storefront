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
    <div
      className="mx-auto px-4 animate-fade-in text-center"
      style={{ maxWidth: 760, paddingTop: 'clamp(48px,7vw,80px)', paddingBottom: 'clamp(48px,7vw,100px)' }}
    >
      {/* Ícono */}
      <div
        className="flex items-center justify-center mx-auto"
        style={{
          width: 'clamp(80px,12vw,100px)',
          height: 'clamp(80px,12vw,100px)',
          borderRadius: '50%',
          background: 'var(--exito)',
          boxShadow: '0 12px 36px rgba(127,154,112,.4)',
          color: '#fff',
        }}
      >
        <svg
          width="clamp(36px,6vw,52px)"
          height="clamp(36px,6vw,52px)"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.2}
        >
          <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <h1
        className="mt-6 mb-2"
        style={{
          fontFamily: 'var(--font-head)',
          fontSize: 'clamp(28px,4vw,46px)',
          color: 'var(--marron)',
          fontWeight: 600,
        }}
      >
        ¡Gracias por tu compra!
      </h1>
      <p className="text-[15px] mb-9" style={{ color: 'var(--tx-soft)' }}>
        Tu pedido fue recibido. Te enviamos la confirmación por email a tu casilla.
      </p>

      {/* Info del pedido — 3 cols */}
      <div
        className="rounded-[18px] text-center"
        style={{ background: 'var(--marfil)', padding: 'clamp(20px,4vw,30px)', marginBottom: 32 }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {/* Pedido */}
          <div>
            <p className="text-[10px] tracking-[.22em] uppercase font-semibold" style={{ color: 'var(--tx-faint)' }}>
              Pedido
            </p>
            <p
              className="mt-2"
              style={{
                fontFamily: 'var(--font-head)',
                fontSize: 'clamp(18px,3vw,24px)',
                color: 'var(--marron)',
                fontWeight: 600,
              }}
            >
              {orderId ? `#${orderId}` : '#RN-NUEVO'}
            </p>
          </div>

          {/* Pago */}
          <div style={{ borderLeft: '1px solid var(--line)', borderRight: '1px solid var(--line)' }}>
            <p className="text-[10px] tracking-[.22em] uppercase font-semibold" style={{ color: 'var(--tx-faint)' }}>
              Pago
            </p>
            <div
              className="flex items-center justify-center gap-1.5 mt-3 font-semibold"
              style={{ color: 'var(--exito)' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <path d="M5 13l4 4L19 7" strokeLinecap="round" />
              </svg>
              Aprobado
            </div>
          </div>

          {/* Envío */}
          <div>
            <p className="text-[10px] tracking-[.22em] uppercase font-semibold" style={{ color: 'var(--tx-faint)' }}>
              Envío
            </p>
            <p className="mt-3 font-semibold" style={{ color: 'var(--taupe)' }}>En preparación</p>
          </div>
        </div>
      </div>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/cuenta/pedidos"
          className="flex items-center justify-center py-4 px-10 rounded-[11px] text-[12.5px] font-semibold tracking-[.1em] uppercase text-white transition-opacity hover:opacity-90"
          style={{ background: 'var(--taupe)' }}
        >
          Ver mi pedido
        </Link>
        <Link
          href="/"
          className="flex items-center justify-center py-4 px-10 rounded-[11px] text-[12.5px] font-semibold tracking-[.1em] uppercase transition-colors hover:bg-beige"
          style={{ border: '1px solid var(--line)', color: 'var(--marron)', background: 'transparent' }}
        >
          Volver al inicio
        </Link>
      </div>
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
