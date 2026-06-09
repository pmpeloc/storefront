'use client'

import Link from 'next/link'
import { useFavoritesStore } from '@/store/favoritesStore'
import { MOCK_PRODUCTS } from '@/lib/mock-data'

// TODO: favorites-sync - cuando haya auth, sincronizar favoritos con tabla user_favorites — ver TECHNICAL_DEBT.md

export default function FavoritosPage() {
  const ids = useFavoritesStore((s) => s.ids)
  const toggle = useFavoritesStore((s) => s.toggleFavorite)

  // Busca en mock + futura integración con API real
  const favorites = ids
    .map((id) => MOCK_PRODUCTS.find((p) => p.id === id))
    .filter(Boolean) as typeof MOCK_PRODUCTS

  if (ids.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ background: 'var(--beige)', color: 'var(--gris-taupe)' }}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p style={{ fontFamily: 'var(--font-head)', fontSize: 22, color: 'var(--marron)' }}>
          Tus favoritos están vacíos
        </p>
        <p className="text-[12px] mt-2 mb-6" style={{ color: 'var(--tx-faint)' }}>
          Guardá los productos que te gustan tocando el corazón en cada card.
        </p>
        <Link
          href="/"
          className="inline-flex px-8 py-3.5 rounded-[10px] text-[12px] font-semibold tracking-[.1em] uppercase text-white transition-opacity hover:opacity-90"
          style={{ background: 'var(--taupe)' }}
        >
          Ver catálogo
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 style={{ fontFamily: 'var(--font-head)', fontSize: 26, color: 'var(--marron)', fontWeight: 600 }}>
          Favoritos
          <span className="ml-2 text-[14px]" style={{ fontFamily: 'var(--font-ui)', color: 'var(--tx-faint)', fontWeight: 400 }}>
            ({ids.length})
          </span>
        </h1>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {favorites.map((p) => (
          <div
            key={p.id}
            className="rounded-[14px] overflow-hidden relative"
            style={{ background: '#fff', border: '1px solid var(--line-soft)', boxShadow: 'var(--sh-card)' }}
          >
            {/* Imagen */}
            <Link href={`/productos/${p.id}`}>
              <div
                className="w-full aspect-square"
                style={{ background: 'var(--beige)' }}
              />
            </Link>

            {/* Quitar de favoritos */}
            <button
              onClick={() => toggle(p.id)}
              aria-label="quitar de favoritos"
              className="absolute top-2.5 right-2.5 w-8 h-8 flex items-center justify-center rounded-full"
              style={{ background: 'rgba(255,255,255,.92)', color: '#B96363' }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth={1.5}>
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
              </svg>
            </button>

            <div className="p-3">
              <Link href={`/productos/${p.id}`}>
                <p className="text-[12.5px] font-medium leading-snug mb-1" style={{ color: 'var(--tx)' }}>{p.name}</p>
                <p className="text-[13px] font-semibold" style={{ color: 'var(--marron)' }}>
                  ${p.price.toLocaleString('es-AR')}
                </p>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
