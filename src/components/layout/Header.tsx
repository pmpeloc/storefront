'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { clientConfig } from '@/config/client'
import { CartButton } from '@/components/cart/CartButton'
import { MobileDrawer } from './MobileDrawer'
import { useFavoritesStore } from '@/store/favoritesStore'

const NAV_LINKS = [
  { href: '/productos', label: 'Catálogo' },
  { href: '/colecciones', label: 'Colecciones' },
  { href: '/inspiracion', label: 'Inspiración' },
  { href: '/nosotros', label: 'Nosotros' },
  { href: '/contacto', label: 'Contacto' },
]

export function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()
  const favIds = useFavoritesStore((s) => s.ids)

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/buscar?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchOpen(false)
      setSearchQuery('')
    }
  }

  return (
    <>
      <header
        className="sticky top-0 z-50 border-b"
        style={{
          background: 'rgba(250,247,243,.94)',
          backdropFilter: 'blur(10px)',
          borderColor: 'var(--line-soft)',
        }}
      >
        <div className="max-w-6xl mx-auto px-4 h-[68px] flex items-center justify-between gap-3">

          {/* Hamburguesa (mobile) */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-[11px] hover:bg-beige transition-colors text-marron"
            aria-label="abrir menú"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
              <path d="M3 12h18M3 6h18M3 18h18" strokeLinecap="round" />
            </svg>
          </button>

          {/* Nav izquierda (desktop) */}
          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.slice(0, 3).map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-[13px] font-medium text-tx hover:text-taupe transition-colors tracking-[.02em]"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Logo — centro */}
          <Link href="/" className="flex items-center justify-center gap-2 absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 md:mx-auto">
            {clientConfig.logoUrl ? (
              <Image
                src={clientConfig.logoUrl}
                alt={clientConfig.clientName}
                width={36}
                height={36}
                className="object-contain"
              />
            ) : null}
            <span
              className="text-marron font-semibold tracking-[.22em] uppercase text-[17px] leading-none"
              style={{ fontFamily: 'var(--font-head)' }}
            >
              {clientConfig.clientName}
            </span>
          </Link>

          {/* Nav derecha (desktop) */}
          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.slice(3).map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-[13px] font-medium text-tx hover:text-taupe transition-colors tracking-[.02em]"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Acciones */}
          <div className="flex items-center gap-1">
            {/* Buscador */}
            {searchOpen ? (
              <form onSubmit={handleSearch} className="flex items-center">
                <input
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar..."
                  className="w-36 md:w-52 text-sm border rounded-[10px] px-3 py-1.5 outline-none bg-white"
                  style={{ borderColor: 'var(--line)', color: 'var(--tx)' }}
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="ml-1 w-8 h-8 flex items-center justify-center text-tx-faint hover:text-marron"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" />
                  </svg>
                </button>
              </form>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="w-9 h-9 flex items-center justify-center rounded-[11px] hover:bg-beige transition-colors text-marron"
                aria-label="buscar"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
                </svg>
              </button>
            )}

            {/* Favoritos (visible en desktop) */}
            <Link
              href="/favoritos"
              className="hidden md:flex w-9 h-9 items-center justify-center rounded-[11px] hover:bg-beige transition-colors text-marron relative"
              aria-label="favoritos"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {favIds.length > 0 && (
                <span
                  className="absolute top-0.5 right-0.5 w-[15px] h-[15px] rounded-full text-white text-[9px] font-semibold flex items-center justify-center"
                  style={{ background: 'var(--accent, var(--taupe))' }}
                >
                  {favIds.length}
                </span>
              )}
            </Link>

            {/* Carrito */}
            <CartButton />

            {/* Cuenta (desktop) */}
            <Link
              href="/cuenta"
              className="hidden md:flex w-9 h-9 items-center justify-center rounded-[11px] hover:bg-beige transition-colors text-marron"
              aria-label="mi cuenta"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>
      </header>

      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  )
}
