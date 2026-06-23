'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { CartButton } from '@/components/cart/CartButton'
import { MobileDrawer } from './MobileDrawer'
import { useFavoritesStore } from '@/store/favoritesStore'
import { useTenantConfig } from '@/components/providers/TenantConfigProvider'
import { MOCK_CATEGORIES } from '@/lib/mock-data'

const NAV_LINKS = [
  { href: '/productos', label: 'Catálogo', hasMega: true },
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
  const tenantConfig = useTenantConfig()

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
        <div className="max-w-6xl mx-auto px-4 h-[68px] md:h-[76px] flex items-center gap-3">

          {/* Hamburguesa (mobile) */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-[11px] hover:bg-beige transition-colors text-marron flex-shrink-0"
            aria-label="abrir menú"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
              <path d="M3 12h18M3 6h18M3 18h18" strokeLinecap="round" />
            </svg>
          </button>

          {/* Logo mobile — monograma centrado */}
          <Link
            href="/"
            className="md:hidden absolute left-1/2 -translate-x-1/2 flex items-center"
            aria-label={tenantConfig.client_name}
          >
            <Image
              src={tenantConfig.logo_url ?? '/logos/wm-mono.png'}
              alt={tenantConfig.client_name}
              width={36}
              height={36}
              className="object-contain"
            />
          </Link>

          {/* Logo desktop — lockup horizontal izquierda */}
          <Link
            href="/"
            className="hidden md:flex items-center gap-[15px] flex-shrink-0"
          >
            {tenantConfig.logo_url ? (
              <Image
                src={tenantConfig.logo_url}
                alt={tenantConfig.client_name}
                width={0}
                height={0}
                unoptimized
                style={{ height: '42px', width: 'auto' }}
                className="object-contain"
                priority
              />
            ) : (
              <>
                <Image
                  src="/logos/wm-mono.png"
                  alt=""
                  width={42}
                  height={42}
                  className="object-contain"
                  aria-hidden
                />
                <Image
                  src="/logos/wm-word.png"
                  alt="RENUEVO"
                  width={0}
                  height={0}
                  unoptimized
                  style={{ height: '42px', width: 'auto' }}
                  className="object-contain"
                  priority
                />
              </>
            )}
          </Link>

          {/* Nav central (desktop) */}
          <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
            {NAV_LINKS.map(({ href, label, hasMega }) =>
              hasMega ? (
                <div key={href} className="relative group">
                  <Link
                    href={href}
                    className="flex items-center gap-1 px-3 py-2 rounded-[10px] text-[13px] font-medium hover:bg-beige transition-colors tracking-[.02em]"
                    style={{ color: 'var(--tx)' }}
                  >
                    {label}
                    <svg
                      width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
                      className="transition-transform group-hover:rotate-180"
                      style={{ color: 'var(--tx-faint)' }}
                    >
                      <path d="M6 9l6 6 6-6" strokeLinecap="round" />
                    </svg>
                  </Link>

                  {/* Mega-menú dropdown */}
                  <div
                    className="absolute top-full left-0 pt-2 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-200 translate-y-1 group-hover:translate-y-0"
                    style={{ zIndex: 100 }}
                  >
                    <div
                      className="w-52 rounded-[14px] py-2 overflow-hidden"
                      style={{
                        background: '#fff',
                        border: '1px solid var(--line-soft)',
                        boxShadow: '0 8px 32px rgba(63,53,44,.12)',
                      }}
                    >
                      <div className="px-3 pb-1.5 pt-0.5">
                        <p className="text-[9.5px] tracking-[.16em] uppercase font-semibold" style={{ color: 'var(--tx-faint)' }}>
                          Categorías
                        </p>
                      </div>
                      {MOCK_CATEGORIES.map((cat) => (
                        <Link
                          key={cat.id}
                          href={`/?category=${encodeURIComponent(cat.name)}`}
                          className="flex items-center justify-between px-3 py-2 mx-1 rounded-[10px] hover:bg-beige transition-colors"
                        >
                          <span className="text-[12.5px]" style={{ color: 'var(--tx)' }}>{cat.name}</span>
                          <span className="text-[10px]" style={{ color: 'var(--tx-faint)' }}>{cat.count}</span>
                        </Link>
                      ))}
                      <div style={{ height: 1, background: 'var(--line-soft)', margin: '6px 12px' }} />
                      <Link
                        href="/colecciones"
                        className="flex items-center gap-2 px-3 py-2 mx-1 rounded-[10px] hover:bg-beige transition-colors text-[12.5px] font-medium"
                        style={{ color: 'var(--taupe)' }}
                      >
                        Ver colecciones →
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={href}
                  href={href}
                  className="px-3 py-2 rounded-[10px] text-[13px] font-medium hover:bg-beige transition-colors tracking-[.02em]"
                  style={{ color: 'var(--tx)' }}
                >
                  {label}
                </Link>
              )
            )}
          </nav>

          {/* Acciones (derecha) */}
          <div className="flex items-center gap-1 ml-auto md:ml-0 flex-shrink-0">
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

            {/* Favoritos (desktop) */}
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
