'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'
import { useFavoritesStore } from '@/store/favoritesStore'

const NAV_ITEMS = [
  {
    id: 'inicio', href: '/', label: 'Inicio',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.6}>
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 22V12h6v10" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 'catalogo', href: '/productos', label: 'Categorías',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.6}>
        <rect x="3" y="3" width="7" height="7" rx="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 'favoritos', href: '/favoritos', label: 'Favoritos',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 2 : 1.6}>
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 'carrito', href: '/carrito', label: 'Carrito',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.6}>
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3 6h18" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 10a4 4 0 01-8 0" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 'cuenta', href: '/cuenta', label: 'Cuenta',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.6}>
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
]

export function BottomNav() {
  const pathname = usePathname()
  const itemCount = useCartStore((s) => s.itemCount)
  const favIds = useFavoritesStore((s) => s.ids)

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-[35] md:hidden grid grid-cols-5"
      style={{
        height: 62,
        background: 'rgba(255,255,255,.92)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid var(--line-soft)',
        paddingBottom: 4,
      }}
    >
      {NAV_ITEMS.map((item) => {
        const isActive =
          item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
        const badge =
          item.id === 'carrito' ? itemCount :
          item.id === 'favoritos' ? favIds.length : 0

        return (
          <Link
            key={item.id}
            href={item.href}
            className="flex flex-col items-center justify-center gap-[3px] relative text-[9px] font-medium tracking-wide transition-colors"
            style={{ color: isActive ? 'var(--accent, var(--taupe))' : 'var(--tx-faint)' }}
          >
            {item.icon(isActive)}
            {badge > 0 && (
              <span
                className="absolute top-[7px] right-[calc(50%-18px)] min-w-[14px] h-[14px] px-[3px] text-white rounded-full text-[8px] font-semibold flex items-center justify-center"
                style={{ background: 'var(--accent, var(--taupe))' }}
              >
                {badge}
              </span>
            )}
            <span>{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
