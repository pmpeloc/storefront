'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  { href: '/cuenta', label: 'Inicio', exact: true },
  { href: '/cuenta/pedidos', label: 'Mis pedidos' },
  { href: '/cuenta/datos', label: 'Mis datos' },
  { href: '/favoritos', label: 'Favoritos' },
]

export function AccountShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 md:grid md:grid-cols-[220px_1fr] md:gap-8 md:items-start">
      {/* Sidebar (desktop) */}
      <aside className="hidden md:block">
        <div className="sticky top-[88px]">
          <p className="text-[10px] tracking-[.16em] uppercase font-semibold mb-3 px-3" style={{ color: 'var(--tx-faint)' }}>
            Mi cuenta
          </p>
          <nav>
            {NAV.map(({ href, label, exact }) => {
              const isActive = exact ? pathname === href : pathname.startsWith(href)
              return (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center px-3 py-2.5 rounded-[10px] text-[13px] font-medium mb-0.5 transition-all"
                  style={{
                    background: isActive ? 'var(--beige)' : 'transparent',
                    color: isActive ? 'var(--marron)' : 'var(--tx-soft)',
                  }}
                >
                  {label}
                </Link>
              )
            })}
          </nav>
          <div style={{ height: 1, background: 'var(--line-soft)', margin: '10px 12px' }} />
          <button
            className="w-full text-left px-3 py-2.5 text-[13px] font-medium transition-colors hover:text-marron"
            style={{ color: 'var(--tx-faint)' }}
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Contenido */}
      <div>{children}</div>
    </div>
  )
}
