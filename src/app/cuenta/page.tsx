'use client'

import Link from 'next/link'
import { MOCK_USER, MOCK_ORDERS } from '@/lib/mock-data'
import { CuentaShell } from '@/components/cuenta/CuentaShell'

// TODO: cuenta-auth - proteger esta ruta con middleware cuando exista auth — ver TECHNICAL_DEBT.md
// TODO: cuenta-auth - reemplazar MOCK_USER con sesión real de Supabase Auth

const STATUS_COLOR: Record<string, string> = {
  'En camino': 'var(--taupe)',
  Entregado: 'var(--exito)',
  'En preparación': 'var(--gris-taupe)',
}

export default function CuentaPage() {
  const lastOrder = MOCK_ORDERS[0]

  return (
    <CuentaShell>
    <div className="max-w-lg md:max-w-none">
      <h1
        className="mb-6"
        style={{ fontFamily: 'var(--font-head)', fontSize: 26, color: 'var(--marron)', fontWeight: 600 }}
      >
        Mi cuenta
      </h1>

      {/* Avatar + nombre */}
      <div
        className="flex items-center gap-4 p-4 rounded-[14px] mb-4"
        style={{ background: 'var(--marfil)' }}
      >
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-white font-semibold text-[15px]"
          style={{ background: 'var(--taupe)' }}
        >
          {MOCK_USER.name.split(' ').map((n) => n[0]).join('')}
        </div>
        <div>
          <p className="font-semibold text-[14px]" style={{ color: 'var(--tx)' }}>{MOCK_USER.name}</p>
          <p className="text-[11.5px]" style={{ color: 'var(--tx-soft)' }}>{MOCK_USER.email}</p>
        </div>
      </div>

      {/* Último pedido */}
      {lastOrder && (
        <div
          className="rounded-[14px] p-4 mb-4"
          style={{ background: '#fff', border: '1px solid var(--line-soft)' }}
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-[11px] tracking-[.12em] uppercase font-semibold" style={{ color: 'var(--tx-faint)' }}>
              Último pedido
            </p>
            <span
              className="text-[10px] font-semibold px-2 py-1 rounded-full"
              style={{
                background: `${STATUS_COLOR[lastOrder.status] ?? 'var(--taupe)'}22`,
                color: STATUS_COLOR[lastOrder.status] ?? 'var(--taupe)',
              }}
            >
              {lastOrder.status}
            </span>
          </div>
          <p style={{ fontFamily: 'var(--font-head)', fontSize: 18, color: 'var(--marron)', fontWeight: 600 }}>
            #{lastOrder.id}
          </p>
          <p className="text-[11.5px] mt-0.5 mb-3" style={{ color: 'var(--tx-soft)' }}>
            {lastOrder.items.map((i) => `${i.name} ×${i.qty}`).join(' · ')}
          </p>
          <Link
            href="/cuenta/pedidos"
            className="text-[11.5px] font-semibold"
            style={{ color: 'var(--taupe)' }}
          >
            Ver todos mis pedidos →
          </Link>
        </div>
      )}

      {/* Links */}
      {[
        { href: '/cuenta/pedidos', label: 'Mis pedidos', icon: '📦' },
        { href: '/cuenta/datos', label: 'Mis datos', icon: '👤' },
        { href: '/favoritos', label: 'Favoritos', icon: '♡' },
      ].map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="flex items-center justify-between px-4 py-3.5 rounded-[12px] mb-2 transition-all hover:shadow-card"
          style={{ background: '#fff', border: '1px solid var(--line-soft)' }}
        >
          <span className="flex items-center gap-3 text-[13px] font-medium" style={{ color: 'var(--tx)' }}>
            <span>{item.icon}</span>
            {item.label}
          </span>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} style={{ color: 'var(--tx-faint)' }}>
            <path d="M9 18l6-6-6-6" strokeLinecap="round" />
          </svg>
        </Link>
      ))}

      {/* El botón de cerrar sesión está en el CuentaShell sidebar (desktop) o aquí (mobile) */}
      <button
        className="md:hidden w-full mt-4 py-3 rounded-[10px] text-[12px] font-medium transition-colors"
        style={{ border: '1px solid var(--line)', color: 'var(--tx-soft)' }}
      >
        Cerrar sesión
      </button>
    </div>
    </CuentaShell>
  )
}
