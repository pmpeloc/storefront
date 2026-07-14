'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { MOCK_PRODUCTS } from '@/lib/mock-data'
import { formatPrice } from '@/lib/format'

// TODO: search - reemplazar con GET /public/products/search?q=&tenantSlug= — ver TECHNICAL_DEBT.md

export default function SearchPage() {
  const [query, setQuery] = useState('')

  const results = useMemo(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase()
    return MOCK_PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.material.toLowerCase().includes(q),
    )
  }, [query])

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1
        className="mb-6"
        style={{ fontFamily: 'var(--font-head)', fontSize: 28, color: 'var(--marron)', fontWeight: 600 }}
      >
        Buscar
      </h1>

      {/* Input */}
      <div className="relative mb-6">
        <svg
          className="absolute left-3.5 top-1/2 -translate-y-1/2"
          width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}
          style={{ color: 'var(--tx-faint)' }}
        >
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
        </svg>
        <input
          type="search"
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscá almohadones, materiales, colores..."
          className="w-full rounded-[14px] pl-10 pr-4 py-4 text-[14px] outline-none transition-all"
          style={{
            border: '1.5px solid var(--line)',
            background: '#fff',
            color: 'var(--tx)',
            boxShadow: '0 2px 12px rgba(90,75,63,.06)',
          }}
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full hover:bg-beige transition-colors"
            style={{ color: 'var(--tx-faint)' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>

      {/* Estado vacío inicial */}
      {!query && (
        <div className="text-center py-16">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: 'var(--beige)', color: 'var(--gris-taupe)' }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
            </svg>
          </div>
          <p style={{ fontFamily: 'var(--font-head)', fontSize: 18, color: 'var(--marron)' }}>
            ¿Qué estás buscando?
          </p>
          <p className="text-[12px] mt-1.5" style={{ color: 'var(--tx-faint)' }}>
            Escribí el nombre de un producto, material o color
          </p>
        </div>
      )}

      {/* Sin resultados */}
      {query && results.length === 0 && (
        <div className="text-center py-16">
          <p style={{ fontFamily: 'var(--font-head)', fontSize: 18, color: 'var(--marron)' }}>
            Sin resultados para &ldquo;{query}&rdquo;
          </p>
          <p className="text-[12px] mt-1.5 mb-5" style={{ color: 'var(--tx-faint)' }}>
            Probá con otra búsqueda o explorá el catálogo
          </p>
          <Link
            href="/"
            className="inline-flex px-6 py-3 rounded-[10px] text-[12px] font-semibold tracking-[.1em] uppercase text-white transition-opacity hover:opacity-90"
            style={{ background: 'var(--taupe)' }}
          >
            Ver catálogo
          </Link>
        </div>
      )}

      {/* Resultados */}
      {results.length > 0 && (
        <>
          <p className="text-[12px] mb-4" style={{ color: 'var(--tx-soft)' }}>
            {results.length} {results.length === 1 ? 'resultado' : 'resultados'} para &ldquo;{query}&rdquo;
          </p>
          <ul className="space-y-2">
            {results.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/productos/${p.id}`}
                  className="flex items-center gap-4 p-3.5 rounded-[14px] transition-all hover:shadow-card"
                  style={{ background: '#fff', border: '1px solid var(--line-soft)' }}
                >
                  <div
                    className="w-[52px] h-[52px] rounded-[10px] flex-shrink-0"
                    style={{ background: 'var(--beige)' }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium truncate" style={{ color: 'var(--tx)' }}>{p.name}</p>
                    <p className="text-[11px] mt-0.5" style={{ color: 'var(--tx-soft)' }}>
                      {p.category} · {p.material}
                    </p>
                  </div>
                  <span className="text-[13px] font-semibold flex-shrink-0" style={{ color: 'var(--marron)' }}>
                    ${formatPrice(p.price)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
