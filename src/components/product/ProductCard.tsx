'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { PublicProduct } from '@/types/product'
import { useCartStore } from '@/store/cartStore'
import { useFavoritesStore } from '@/store/favoritesStore'
import { useToastStore } from '@/store/toastStore'
import { useTenantConfig } from '@/components/providers/TenantConfigProvider'
import { formatPrice } from '@/lib/format'

const TAG_COLORS: Record<string, string> = {
  Destacado: 'rgba(var(--overlay-dark),.85)',
}

interface ProductCardProps {
  product: PublicProduct
  badge?: 'Más vendido' | 'Novedad' | 'Oferta' | ''
  comparePrice?: number
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <path
        d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function ProductCard({ product, badge, comparePrice }: ProductCardProps) {
  const tenantConfig = useTenantConfig()
  const href = product.slug ? `/productos/${product.slug}` : '#'
  const addItem = useCartStore((s) => s.addItem)
  const isFav = useFavoritesStore((s) => s.isFavorite(product.id))
  const toggleFav = useFavoritesStore((s) => s.toggleFavorite)
  const addToast = useToastStore((s) => s.addToast)
  const [imgError, setImgError] = useState(false)

  const tagLabel = badge ?? (product.is_featured ? 'Destacado' : '')
  const showCuotas = tenantConfig.checkout_methods.includes('mobbex')
  const cuotasText = process.env.NEXT_PUBLIC_CUOTAS_TEXT ?? '6 cuotas sin interés'
  const cuotaValue = `${cuotasText} de $${formatPrice(Math.round(product.price / 6))}`
  const imageSrc = imgError ? tenantConfig.default_product_image_url : product.image_url

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    addItem(product)
    addToast('Agregado al carrito', 'ok')
  }

  return (
    <article className="relative cursor-pointer group">
      {/* Imagen */}
      <Link href={href}>
        <div
          className="relative aspect-square overflow-hidden"
          style={{ borderRadius: 14, background: 'var(--beige)' }}
        >
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:-translate-y-1"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              onError={() => setImgError(true)}
            />
          ) : (
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(135deg, rgba(255,255,255,.45), rgba(255,255,255,0) 55%), linear-gradient(160deg, #EFE7DD, #E2D7C8)',
              }}
            />
          )}

          {/* Badge */}
          {tagLabel && (
            <span
              className="absolute left-3 top-3 z-10 text-white text-[8.5px] font-semibold tracking-[.08em] uppercase px-[7px] py-[3px] rounded-[6px]"
              style={{
                background:
                  tagLabel === 'Oferta' ? 'var(--error)' : TAG_COLORS[tagLabel] ?? 'rgba(var(--overlay-dark),.82)',
              }}
            >
              {tagLabel}
            </span>
          )}

          {/* Favorito — siempre accesible pero sutil */}
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              toggleFav(product.id)
            }}
            className="absolute top-[9px] right-[9px] w-7 h-7 rounded-full flex items-center justify-center transition-transform hover:scale-110 opacity-0 group-hover:opacity-100"
            style={{
              background: 'rgba(255,255,255,.82)',
              backdropFilter: 'blur(3px)',
              color: isFav ? 'var(--error)' : 'var(--marron)',
              ...(isFav ? { opacity: 1 } : {}),
            }}
            aria-label={isFav ? 'quitar de favoritos' : 'agregar a favoritos'}
          >
            <HeartIcon filled={isFav} />
          </button>

          {/* Botón "Agregar al carrito" como overlay en desktop — aparece en hover */}
          <div
            className="absolute left-3 right-3 bottom-3 hidden md:block opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200"
            style={{ zIndex: 10 }}
          >
            <button
              onClick={handleAddToCart}
              className="w-full"
              style={{
                fontFamily: 'var(--font-ui)',
                fontWeight: 600,
                fontSize: 11.5,
                letterSpacing: '.1em',
                textTransform: 'uppercase',
                border: 'none',
                cursor: 'pointer',
                borderRadius: 9,
                padding: '11px 18px',
                background: 'var(--marron)',
                color: 'var(--marfil)',
              }}
            >
              Agregar al carrito
            </button>
          </div>
        </div>
      </Link>

      {/* Info */}
      <Link href={href}>
        <p
          className="mt-[9px] text-[12px] font-medium leading-[1.3]"
          style={{ color: 'var(--tx)' }}
        >
          {product.name}
        </p>
      </Link>
      <div className="flex items-baseline gap-1.5 mt-0.5">
        <span className="text-[13px] font-semibold" style={{ color: 'var(--marron)' }}>
          ${formatPrice(product.price)}
        </span>
        {comparePrice && (
          <span className="text-[10.5px] line-through" style={{ color: 'var(--tx-faint)' }}>
            ${formatPrice(comparePrice)}
          </span>
        )}
      </div>
      {showCuotas && (
        <p className="text-[10px] font-medium mt-0.5" style={{ color: 'var(--exito)' }}>
          {cuotaValue}
        </p>
      )}

      {/* Botón mobile — siempre visible debajo de la info */}
      <button
        onClick={handleAddToCart}
        className="md:hidden mt-2 w-full py-[9px] text-[10.5px] font-semibold tracking-[.08em] uppercase rounded-[9px] transition-colors"
        style={{
          border: '1px solid var(--line)',
          color: 'var(--marron)',
          background: 'transparent',
        }}
      >
        Agregar
      </button>
    </article>
  )
}
