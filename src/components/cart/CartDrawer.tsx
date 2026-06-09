'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useCartStore } from '@/store/cartStore'

const FREE_SHIPPING_THRESHOLD = 60000

export function CartDrawer() {
  const isOpen = useCartStore((s) => s.isOpen)
  const items = useCartStore((s) => s.items)
  const total = useCartStore((s) => s.total)
  const toggleDrawer = useCartStore((s) => s.toggleDrawer)
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const removeItem = useCartStore((s) => s.removeItem)

  const shipping = total > FREE_SHIPPING_THRESHOLD || total === 0 ? 0 : 4500
  const grandTotal = total + shipping
  const toFreeShipping = FREE_SHIPPING_THRESHOLD - total
  const freeShippingPct = Math.min(100, (total / FREE_SHIPPING_THRESHOLD) * 100)

  return (
    <>
      {/* Overlay */}
      <div
        onClick={toggleDrawer}
        className="fixed inset-0 z-40 transition-opacity duration-300"
        style={{
          background: 'rgba(63,53,44,.32)',
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
        }}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className="fixed inset-y-0 right-0 w-full max-w-sm z-50 flex flex-col"
        style={{
          background: 'var(--crema)',
          transform: isOpen ? 'none' : 'translateX(100%)',
          transition: 'transform .3s cubic-bezier(.2,.8,.3,1)',
          boxShadow: '-8px 0 40px rgba(63,53,44,.12)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-4 flex-shrink-0"
          style={{ borderBottom: '1px solid var(--line-soft)' }}
        >
          <h2 style={{ fontFamily: 'var(--font-head)', fontSize: 20, color: 'var(--marron)', fontWeight: 600 }}>
            Mi carrito
          </h2>
          <button
            onClick={toggleDrawer}
            aria-label="cerrar carrito"
            className="w-8 h-8 flex items-center justify-center rounded-[10px] hover:bg-beige transition-colors text-marron"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Barra envío gratis */}
        {total > 0 && (
          <div className="px-4 py-3 flex-shrink-0" style={{ borderBottom: '1px solid var(--line-soft)', background: 'var(--marfil)' }}>
            {toFreeShipping > 0 ? (
              <p className="text-[11px] mb-2" style={{ color: 'var(--tx-soft)' }}>
                Te faltan <strong style={{ color: 'var(--marron)' }}>${toFreeShipping.toLocaleString('es-AR')}</strong> para envío gratis
              </p>
            ) : (
              <p className="text-[11px] mb-2 font-semibold" style={{ color: 'var(--exito)' }}>
                ¡Tenés envío gratis!
              </p>
            )}
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--beige)' }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${freeShippingPct}%`, background: 'var(--exito)' }}
              />
            </div>
          </div>
        )}

        {/* Contenido */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
              style={{ background: 'var(--beige)', color: 'var(--gris-taupe)' }}
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M3 6h18" strokeLinecap="round" />
                <path d="M16 10a4 4 0 01-8 0" strokeLinecap="round" />
              </svg>
            </div>
            <p style={{ fontFamily: 'var(--font-head)', fontSize: 19, color: 'var(--marron)' }}>
              Tu carrito está vacío
            </p>
            <p className="text-[11px] mt-1.5 mb-5" style={{ color: 'var(--tx-faint)' }}>
              Descubrí nuestros almohadones y textiles.
            </p>
            <button
              onClick={toggleDrawer}
              className="px-6 py-3 rounded-[10px] text-[12px] font-semibold tracking-[.1em] uppercase text-white transition-opacity hover:opacity-90"
              style={{ background: 'var(--taupe)' }}
            >
              Ver catálogo
            </button>
          </div>
        ) : (
          <>
            {/* Items */}
            <ul className="flex-1 overflow-y-auto px-4 scrollbar-none">
              {items.map(({ product, quantity }) => (
                <li
                  key={product.id}
                  className="flex gap-3 py-3.5 items-start"
                  style={{ borderBottom: '1px solid var(--line-soft)' }}
                >
                  <div
                    className="relative w-[74px] h-[74px] flex-shrink-0 rounded-[12px] overflow-hidden"
                    style={{ background: 'var(--beige)' }}
                  >
                    {product.image_url ? (
                      <Image
                        src={product.image_url}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="74px"
                      />
                    ) : null}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-[12.5px] font-medium leading-snug pr-1" style={{ color: 'var(--tx)' }}>
                        {product.name}
                      </p>
                      <button
                        onClick={() => removeItem(product.id)}
                        aria-label="eliminar"
                        className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-[8px] hover:bg-beige transition-colors"
                        style={{ color: 'var(--tx-faint)' }}
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      {/* Stepper */}
                      <div
                        className="flex items-center overflow-hidden rounded-[9px]"
                        style={{ border: '1px solid var(--line)' }}
                      >
                        <button
                          onClick={() => {
                            if (quantity > 1) updateQuantity(product.id, quantity - 1)
                            else removeItem(product.id)
                          }}
                          className="w-7 h-7 flex items-center justify-center text-marron hover:bg-beige transition-colors"
                          style={{ background: '#fff' }}
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                            <path d="M5 12h14" strokeLinecap="round" />
                          </svg>
                        </button>
                        <span className="w-[30px] text-center text-[12px] font-semibold" style={{ color: 'var(--tx)' }}>
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-marron hover:bg-beige transition-colors"
                          style={{ background: '#fff' }}
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                            <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                          </svg>
                        </button>
                      </div>

                      <span className="text-[13px] font-semibold" style={{ color: 'var(--marron)' }}>
                        ${(product.price * quantity).toLocaleString('es-AR')}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {/* Footer con resumen */}
            <div
              className="flex-shrink-0 px-4 py-4"
              style={{ borderTop: '1px solid var(--line-soft)' }}
            >
              <div
                className="rounded-[14px] p-4 mb-3"
                style={{ background: 'var(--marfil)' }}
              >
                <div className="flex justify-between text-[12.5px] mb-2">
                  <span style={{ color: 'var(--tx-soft)' }}>Subtotal</span>
                  <span>${total.toLocaleString('es-AR')}</span>
                </div>
                <div className="flex justify-between text-[12.5px] mb-2">
                  <span style={{ color: 'var(--tx-soft)' }}>Envío</span>
                  <span style={{ color: shipping === 0 ? 'var(--exito)' : 'var(--tx)' }}>
                    {shipping === 0 ? 'Gratis' : `$${shipping.toLocaleString('es-AR')}`}
                  </span>
                </div>
                <div style={{ height: 1, background: 'var(--line-soft)', margin: '10px 0' }} />
                <div className="flex justify-between font-semibold" style={{ fontSize: 15, color: 'var(--marron)' }}>
                  <span>Total</span>
                  <span>${grandTotal.toLocaleString('es-AR')}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                onClick={toggleDrawer}
                className="flex items-center justify-center w-full py-4 rounded-[10px] text-[12.5px] font-semibold tracking-[.1em] uppercase text-white transition-opacity hover:opacity-90 mb-2"
                style={{ background: 'var(--marron)' }}
              >
                Iniciar compra
              </Link>

              <div className="flex items-center justify-center gap-1.5 text-[11px]" style={{ color: 'var(--tx-faint)' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" strokeLinecap="round" />
                </svg>
                Compra protegida con certificado SSL
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}
