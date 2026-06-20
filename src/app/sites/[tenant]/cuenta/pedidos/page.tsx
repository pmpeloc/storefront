'use client'

import Link from 'next/link'
import { MOCK_ORDERS } from '@/lib/mock-data'
import { AccountShell } from '@/components/account/AccountShell'

// TODO: cuenta-pedidos - reemplazar con GET /private/orders?userId= cuando exista auth — ver TECHNICAL_DEBT.md

const STATUS_COLOR: Record<string, string> = {
  'En camino': 'var(--taupe)',
  Entregado: 'var(--exito)',
  'En preparación': 'var(--gris-taupe)',
}

export default function OrdersPage() {
  return (
    <AccountShell>
    <div className="max-w-lg md:max-w-none">
      <div className="flex items-center gap-3 mb-6 md:hidden">
        <Link href="/cuenta" className="w-8 h-8 flex items-center justify-center rounded-[8px] hover:bg-beige transition-colors" style={{ color: 'var(--marron)' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" />
          </svg>
        </Link>
        <h1 style={{ fontFamily: 'var(--font-head)', fontSize: 22, color: 'var(--marron)', fontWeight: 600 }}>
          Mis pedidos
        </h1>
      </div>

      {MOCK_ORDERS.length === 0 ? (
        <div className="text-center py-16">
          <p style={{ fontFamily: 'var(--font-head)', fontSize: 18, color: 'var(--marron)' }}>Sin pedidos aún</p>
          <Link href="/" className="text-[12px] mt-2 block" style={{ color: 'var(--taupe)' }}>Ir a la tienda →</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {MOCK_ORDERS.map((o) => (
            <div
              key={o.id}
              className="rounded-[14px] p-4"
              style={{ background: '#fff', border: '1px solid var(--line-soft)' }}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p style={{ fontFamily: 'var(--font-head)', fontSize: 16, color: 'var(--marron)', fontWeight: 600 }}>
                    #{o.id}
                  </p>
                  <p className="text-[11px] mt-0.5" style={{ color: 'var(--tx-faint)' }}>{o.date}</p>
                </div>
                <span
                  className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
                  style={{
                    background: `${STATUS_COLOR[o.status] ?? 'var(--taupe)'}22`,
                    color: STATUS_COLOR[o.status] ?? 'var(--taupe)',
                  }}
                >
                  {o.status}
                </span>
              </div>

              <p className="text-[12px] mb-2" style={{ color: 'var(--tx-soft)' }}>
                {o.items.map((i) => `${i.name} ×${i.qty}`).join(' · ')}
              </p>

              <div className="flex items-center justify-between pt-2.5" style={{ borderTop: '1px solid var(--line-soft)' }}>
                <span className="text-[11.5px]" style={{ color: 'var(--tx-soft)' }}>Total</span>
                <span className="text-[14px] font-semibold" style={{ color: 'var(--marron)' }}>
                  ${o.total.toLocaleString('es-AR')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </AccountShell>
  )
}
