'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useTenantConfig } from '@/components/providers/TenantConfigProvider'
import type { NavSection } from '@/lib/nav-sections'

interface MobileDrawerProps {
  open: boolean
  onClose: () => void
}

const LINKS: { href: string; label: string; section: NavSection | null }[] = [
  { href: '/', label: 'Inicio', section: null },
  { href: '/productos', label: 'Catálogo', section: 'catalogo' },
  { href: '/colecciones', label: 'Colecciones', section: 'colecciones' },
  { href: '/inspiracion', label: 'Inspiración', section: 'inspiracion' },
  { href: '/favoritos', label: 'Favoritos', section: null },
  { href: '/nosotros', label: 'Nosotros', section: 'nosotros' },
  { href: '/contacto', label: 'Contacto', section: 'contacto' },
  { href: '/cuenta', label: 'Mi cuenta', section: null },
]

export function MobileDrawer({ open, onClose }: MobileDrawerProps) {
  const tenantConfig = useTenantConfig()
  const [logoError, setLogoError] = useState(false)
  const links = LINKS.filter((l) => !l.section || tenantConfig.nav_sections.includes(l.section))

  return (
    <div
      className="fixed inset-0 z-[70]"
      style={{ pointerEvents: open ? 'auto' : 'none' }}
      aria-hidden={!open}
    >
      {/* Overlay */}
      <div
        onClick={onClose}
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          background: 'rgba(var(--overlay-dark),.32)',
          opacity: open ? 1 : 0,
        }}
      />

      {/* Panel */}
      <div
        className="absolute top-0 bottom-0 left-0 w-[76%] max-w-xs bg-crema flex flex-col py-12 px-5"
        style={{
          transform: open ? 'none' : 'translateX(-100%)',
          transition: 'transform .28s cubic-bezier(.2,.8,.3,1)',
        }}
      >
        {/* Header del drawer */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/" onClick={onClose} className="flex flex-col items-start gap-2">
            {tenantConfig.logo_url && !logoError ? (
              <Image
                src={tenantConfig.logo_url}
                alt={tenantConfig.client_name}
                width={0}
                height={0}
                unoptimized
                style={{ height: '22px', width: 'auto' }}
                className="object-contain"
                onError={() => setLogoError(true)}
              />
            ) : (
              <span
                className="text-[15px] font-semibold"
                style={{ fontFamily: 'var(--font-head)', color: 'var(--brand)' }}
              >
                {tenantConfig.client_name}
              </span>
            )}
          </Link>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-marron rounded-[10px] hover:bg-beige transition-colors"
            aria-label="cerrar menú"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
              <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Links */}
        <nav className="flex flex-col flex-1">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className="text-left py-3.5 px-1 border-b border-line-soft text-marron hover:text-taupe transition-colors"
              style={{ fontFamily: 'var(--font-head)', fontSize: 18 }}
            >
              {label}
            </Link>
          ))}
        </nav>

        <p className="text-tx-faint text-[10.5px] tracking-wider mt-6">
          © {tenantConfig.client_name}
        </p>
      </div>
    </div>
  )
}
