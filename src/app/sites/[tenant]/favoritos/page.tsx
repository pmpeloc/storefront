'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useFavoritesStore } from '@/store/favoritesStore'
import { useCartStore } from '@/store/cartStore'
import { useToastStore } from '@/store/toastStore'
import { MOCK_PRODUCTS } from '@/lib/mock-data'
import type { PublicProduct } from '@/types/product'
import { formatPrice } from '@/lib/format'

// TODO: favorites-sync - cuando haya auth, sincronizar favoritos con tabla user_favorites — ver TECHNICAL_DEBT.md

export default function FavoritesPage() {
  const ids = useFavoritesStore((s) => s.ids)
  const toggleFav = useFavoritesStore((s) => s.toggleFavorite)
  const addItem = useCartStore((s) => s.addItem)
  const addToast = useToastStore((s) => s.addToast)

  const favorites = ids
    .map((id) => MOCK_PRODUCTS.find((p) => p.id === id))
    .filter(Boolean) as typeof MOCK_PRODUCTS

  function handleAddToCart(p: (typeof MOCK_PRODUCTS)[0]) {
    const product: PublicProduct = {
      id: p.id,
      name: p.name,
      price: p.price,
      image_url: p.mainImage,
      slug: p.slug,
      category: p.category,
      stock: p.stock ? 1 : 0,
      is_featured: false,
      seo_title: p.name,
      seo_description: p.description,
      description: p.description,
      created_at: '',
      updated_at: '',
    }
    addItem(product)
    addToast('Agregado al carrito', 'ok')
  }

  if (ids.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ background: 'var(--beige)', color: 'var(--gris-taupe)' }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p style={{ fontFamily: 'var(--font-head)', fontSize: 22, color: 'var(--marron)' }}>
          Aún no tenés favoritos
        </p>
        <p className="text-[12.5px] mt-2 mb-6" style={{ color: 'var(--tx-soft)' }}>
          Guardá los productos que más te gusten tocando el corazón.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center px-8 py-3.5 rounded-[10px] text-[12px] font-semibold tracking-[.1em] uppercase text-white transition-opacity hover:opacity-90"
          style={{ background: 'var(--taupe)' }}
        >
          Explorar productos
        </Link>
      </div>
    )
  }

  return (
    <main>
      {/* Desktop: header + grid-4 */}
      <div className="hidden md:block" style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 40px 90px' }}>
        <h1
          style={{ fontFamily: 'var(--font-head)', fontSize: 38, color: 'var(--marron)', fontWeight: 600 }}
          className="mb-2"
        >
          Mis favoritos
        </h1>
        <p className="text-[14px] mb-8" style={{ color: 'var(--tx-soft)' }}>
          {favorites.length} producto{favorites.length !== 1 ? 's' : ''} guardado{favorites.length !== 1 ? 's' : ''}
        </p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '34px 28px',
          }}
        >
          {favorites.map((p) => (
            <div key={p.id} className="group relative">
              <Link href={`/productos/${p.slug}`}>
                <div
                  className="relative aspect-square overflow-hidden mb-2"
                  style={{ borderRadius: 14, background: 'var(--beige)' }}
                >
                  <Image
                    src={p.mainImage}
                    alt={p.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:-translate-y-1"
                    sizes="25vw"
                  />
                </div>
              </Link>
              <button
                onClick={() => toggleFav(p.id)}
                aria-label="quitar de favoritos"
                className="absolute top-2.5 right-2.5 w-7 h-7 flex items-center justify-center rounded-full"
                style={{ background: 'rgba(255,255,255,.92)', color: 'var(--error)' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                </svg>
              </button>
              <p className="text-[12px] font-medium leading-snug" style={{ color: 'var(--tx)' }}>{p.name}</p>
              <p className="text-[11px] mt-0.5" style={{ color: 'var(--tx-soft)' }}>{p.color}</p>
              <p className="text-[13px] font-semibold mt-0.5" style={{ color: 'var(--marron)' }}>
                ${formatPrice(p.price)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile: header + lista horizontal */}
      <div className="md:hidden">
        <div className="px-[18px] pt-5 pb-3">
          <h1
            style={{ fontFamily: 'var(--font-head)', fontSize: 26, color: 'var(--marron)', fontWeight: 600 }}
          >
            Favoritos
          </h1>
          <p className="text-[12px] mt-0.5" style={{ color: 'var(--tx-soft)' }}>
            {favorites.length} producto{favorites.length !== 1 ? 's' : ''} guardado{favorites.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="px-[18px] pb-10">
          {favorites.map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-3"
              style={{ padding: '14px 0', borderBottom: '1px solid var(--line-soft)' }}
            >
              <Link href={`/productos/${p.slug}`} className="flex-shrink-0">
                <div
                  className="relative overflow-hidden"
                  style={{ width: 72, height: 72, borderRadius: 12, background: 'var(--beige)' }}
                >
                  <Image
                    src={p.mainImage}
                    alt={p.name}
                    fill
                    className="object-cover"
                    sizes="72px"
                  />
                </div>
              </Link>

              <div className="flex-1 min-w-0" onClick={() => {}}>
                <p className="text-[13px] font-medium leading-snug" style={{ color: 'var(--tx)' }}>
                  {p.name}
                </p>
                <p className="text-[11px] mt-0.5" style={{ color: 'var(--tx-soft)' }}>
                  {p.color}
                </p>
                <p className="text-[13px] font-semibold mt-0.5" style={{ color: 'var(--marron)' }}>
                  ${formatPrice(p.price)}
                </p>
              </div>

              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                <button
                  onClick={() => toggleFav(p.id)}
                  aria-label="quitar de favoritos"
                  style={{ color: 'var(--error)', background: 'transparent', border: 'none', cursor: 'pointer', padding: 4 }}
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleAddToCart(p)}
                  className="text-[10.5px] font-semibold tracking-[.06em] uppercase rounded-[8px] transition-opacity hover:opacity-80"
                  style={{
                    padding: '8px 12px',
                    background: 'var(--taupe)',
                    color: 'var(--marfil)',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Agregar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
