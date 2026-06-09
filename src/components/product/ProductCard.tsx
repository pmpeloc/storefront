'use client'

import Link from 'next/link'
import Image from 'next/image'
import type { PublicProduct } from '@/types/product'
import { useCartStore } from '@/store/cartStore'
import { useFavoritesStore } from '@/store/favoritesStore'
import { useToastStore } from '@/store/toastStore'

const TAG_COLORS: Record<string, string> = {
  Destacado: 'rgba(63,53,44,.85)',
}

interface ProductCardProps {
  product: PublicProduct
  // TODO: badge - ver TECHNICAL_DEBT.md
  badge?: 'Más vendido' | 'Novedad' | 'Oferta' | ''
  // TODO: compare_price - ver TECHNICAL_DEBT.md
  comparePrice?: number
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.8}>
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function ProductCard({ product, badge, comparePrice }: ProductCardProps) {
  const href = product.slug ? `/productos/${product.slug}` : '#'
  const addItem = useCartStore((s) => s.addItem)
  const isFav = useFavoritesStore((s) => s.isFavorite(product.id))
  const toggleFav = useFavoritesStore((s) => s.toggleFavorite)
  const addToast = useToastStore((s) => s.addToast)

  const tagLabel = badge ?? (product.is_featured ? 'Destacado' : '')
  const cuotasText = process.env.NEXT_PUBLIC_CUOTAS_TEXT ?? '6 cuotas sin interés'
  const cuotaValue = `${cuotasText} de $${Math.round(product.price / 6).toLocaleString('es-AR')}`

  return (
    <article className="relative cursor-pointer group">
      {/* Imagen */}
      <Link href={href}>
        <div
          className="relative aspect-square rounded-[12px] overflow-hidden"
          style={{ background: 'var(--beige)' }}
        >
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:-translate-y-1"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,.45), rgba(255,255,255,0) 55%), linear-gradient(160deg, #EFE7DD, #E2D7C8)',
              }}
            />
          )}

          {/* Badge */}
          {tagLabel && (
            <span
              className="absolute left-2 top-2 z-10 text-white text-[8.5px] font-semibold tracking-[.08em] uppercase px-[7px] py-[3px] rounded-[6px]"
              style={{ background: tagLabel === 'Oferta' ? 'var(--error)' : TAG_COLORS[tagLabel] ?? 'rgba(63,53,44,.82)' }}
            >
              {tagLabel}
            </span>
          )}

          {/* Favorito */}
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              toggleFav(product.id)
            }}
            className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-transform hover:scale-110"
            style={{
              background: 'rgba(255,255,255,.82)',
              backdropFilter: 'blur(3px)',
              color: isFav ? 'var(--error)' : 'var(--marron)',
            }}
            aria-label={isFav ? 'quitar de favoritos' : 'agregar a favoritos'}
          >
            <HeartIcon filled={isFav} />
          </button>
        </div>
      </Link>

      {/* Info */}
      <Link href={href}>
        <p className="mt-2.5 text-[12px] font-medium leading-[1.3]" style={{ color: 'var(--tx)' }}>
          {product.name}
        </p>
      </Link>
      <div className="flex items-baseline gap-1.5 mt-0.5">
        <span className="text-[13px] font-semibold" style={{ color: 'var(--marron)' }}>
          ${product.price.toLocaleString('es-AR')}
        </span>
        {comparePrice && (
          // TODO: compare_price - ver TECHNICAL_DEBT.md
          <span className="text-[10.5px] line-through" style={{ color: 'var(--tx-faint)' }}>
            ${comparePrice.toLocaleString('es-AR')}
          </span>
        )}
      </div>
      <p className="text-[10px] font-medium mt-0.5" style={{ color: 'var(--exito)' }}>
        {cuotaValue}
      </p>

      {/* Add to cart — mobile: siempre visible; desktop: aparece en hover */}
      <button
        onClick={() => {
          addItem(product)
          addToast('Agregado al carrito', 'ok')
        }}
        className="mt-2 w-full py-2 text-[11px] font-semibold tracking-[.08em] uppercase rounded-[10px] transition-all duration-200 md:opacity-0 md:translate-y-1 md:group-hover:opacity-100 md:group-hover:translate-y-0"
        style={{
          border: '1px solid var(--line)',
          color: 'var(--marron)',
          background: 'transparent',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'var(--beige)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent'
        }}
      >
        Agregar al carrito
      </button>
    </article>
  )
}
