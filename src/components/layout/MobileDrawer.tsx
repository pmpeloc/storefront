'use client'

import Link from 'next/link'
import Image from 'next/image'

interface MobileDrawerProps {
  open: boolean
  onClose: () => void
}

const LINKS = [
  { href: '/', label: 'Inicio' },
  { href: '/productos', label: 'Catálogo' },
  { href: '/colecciones', label: 'Colecciones' },
  { href: '/inspiracion', label: 'Inspiración' },
  { href: '/favoritos', label: 'Favoritos' },
  { href: '/nosotros', label: 'Nosotros' },
  { href: '/contacto', label: 'Contacto' },
  { href: '/cuenta', label: 'Mi cuenta' },
]

export function MobileDrawer({ open, onClose }: MobileDrawerProps) {
  return (
    <div
      className="fixed inset-0 z-[70]"
      style={{ pointerEvents: open ? 'auto' : 'none' }}
    >
      {/* Overlay */}
      <div
        onClick={onClose}
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          background: 'rgba(63,53,44,.32)',
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
            <Image
              src="/logos/wm-mono.png"
              alt=""
              width={40}
              height={40}
              className="object-contain"
              aria-hidden
            />
            <Image
              src="/logos/wm-word.png"
              alt="RENUEVO"
              width={0}
              height={0}
              style={{ height: '22px', width: 'auto' }}
              className="object-contain"
            />
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
          {LINKS.map(({ href, label }) => (
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
          © RENUEVO · Diseños para espacios que inspiran
        </p>
      </div>
    </div>
  )
}
