'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { PublicProduct } from '@/types/product'
import { useCartStore } from '@/store/cartStore'
import { useFavoritesStore } from '@/store/favoritesStore'
import { useToastStore } from '@/store/toastStore'
import { WhatsAppButton } from './WhatsAppButton'
import { MOCK_SWATCHES, getRelatedMockProducts } from '@/lib/mock-data'

// TODO: galería de imágenes - ver TECHNICAL_DEBT.md
// TODO: variantes de color/talle - ver TECHNICAL_DEBT.md
// TODO: productos relacionados - ver TECHNICAL_DEBT.md
// TODO: compare_price / precio anterior - ver TECHNICAL_DEBT.md
// TODO: rating / reseñas - ver TECHNICAL_DEBT.md

interface ProductDetailProps {
  product: PublicProduct
}

function ChevronIcon({ down }: { down: boolean }) {
  return (
    <svg
      width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}
      style={{ transform: down ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}
    >
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.8}>
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [imgIdx, setImgIdx] = useState(0)
  const [openDesc, setOpenDesc] = useState(true)
  const [quantity, setQuantity] = useState(1)

  // TODO: variantes - ver TECHNICAL_DEBT.md (mock swatches from mock-data)
  const mockVariants = ['Natural', 'Beige', 'Arena']
  const [selectedColor, setSelectedColor] = useState(mockVariants[0])
  const mockSizes = ['40x40', '50x50', '60x60']
  const [selectedSize, setSelectedSize] = useState('50x50')

  const addItem = useCartStore((s) => s.addItem)
  const toggleDrawer = useCartStore((s) => s.toggleDrawer)
  const isFav = useFavoritesStore((s) => s.isFavorite(product.id))
  const toggleFav = useFavoritesStore((s) => s.toggleFavorite)
  const addToast = useToastStore((s) => s.addToast)

  // TODO: galería de imágenes - ver TECHNICAL_DEBT.md
  const images = product.image_url ? [product.image_url, product.image_url, product.image_url] : []

  // TODO: productos relacionados - ver TECHNICAL_DEBT.md
  const related = getRelatedMockProducts(product.id ?? '', 4)

  const cuotasText = process.env.NEXT_PUBLIC_CUOTAS_TEXT ?? '6 cuotas sin interés'

  function handleAddToCart() {
    for (let i = 0; i < quantity; i++) addItem(product)
    addToast('Agregado al carrito', 'ok')
  }

  function handleBuyNow() {
    for (let i = 0; i < quantity; i++) addItem(product)
    toggleDrawer()
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-14">
        {/* Galería */}
        <div>
          {/* Mobile: imagen arriba + miniaturas abajo; Desktop: miniaturas izquierda + imagen derecha */}
          <div className="flex flex-col md:flex-row gap-3">
            {/* Miniaturas — TODO: galería - ver TECHNICAL_DEBT.md */}
            {images.length > 1 && (
              <div className="order-2 md:order-1 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible md:w-[72px] md:flex-shrink-0">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setImgIdx(i)}
                    className="relative w-[66px] h-[66px] md:w-[72px] md:h-[72px] rounded-[10px] overflow-hidden flex-shrink-0 transition-all"
                    style={{
                      border: `2px solid ${i === imgIdx ? 'var(--taupe)' : 'transparent'}`,
                      background: 'var(--beige)',
                    }}
                  >
                    {img && (
                      <Image
                        src={img}
                        alt={`miniatura ${i + 1}`}
                        fill
                        className="object-cover"
                        sizes="72px"
                      />
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Imagen principal */}
            <div
              className="order-1 md:order-2 relative aspect-square rounded-[18px] overflow-hidden flex-1"
              style={{ background: 'var(--marfil)' }}
            >
              {images[imgIdx] ? (
                <Image
                  src={images[imgIdx]}
                  alt={`${product.name} — imagen ${imgIdx + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,.45) 0%, rgba(255,255,255,0) 55%), linear-gradient(160deg, #EFE7DD, #E2D7C8)',
                  }}
                />
              )}
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col gap-4">
          {/* Tag + título */}
          {product.is_featured && (
            <span
              className="text-[10px] font-semibold tracking-[.12em] uppercase"
              style={{ color: 'var(--taupe)' }}
            >
              Destacado
            </span>
          )}

          <div className="flex items-start justify-between gap-4">
            <h1
              className="leading-tight"
              style={{ fontFamily: 'var(--font-head)', fontSize: 28, color: 'var(--marron)', fontWeight: 600 }}
            >
              {product.name}
            </h1>
            <button
              onClick={() => toggleFav(product.id)}
              className="w-9 h-9 rounded-[11px] flex items-center justify-center flex-shrink-0 transition-colors"
              style={{
                color: isFav ? 'var(--error)' : 'var(--marron)',
                background: 'var(--beige)',
              }}
              aria-label={isFav ? 'quitar de favoritos' : 'agregar a favoritos'}
            >
              <HeartIcon filled={isFav} />
            </button>
          </div>

          {/* Precio */}
          <div>
            <div className="flex items-baseline gap-2">
              <span
                style={{ fontFamily: 'var(--font-head)', fontSize: 30, color: 'var(--marron)', fontWeight: 600 }}
              >
                ${product.price.toLocaleString('es-AR')}
              </span>
              {/* TODO: compare_price - ver TECHNICAL_DEBT.md */}
            </div>
            <p className="text-sm font-medium mt-1" style={{ color: 'var(--exito)' }}>
              {cuotasText} de ${Math.round(product.price / 6).toLocaleString('es-AR')}
            </p>
          </div>

          <div style={{ height: 1, background: 'var(--line-soft)' }} />

          {/* Color — TODO: variantes - ver TECHNICAL_DEBT.md */}
          <div>
            <p className="text-[11px] font-medium mb-2.5" style={{ color: 'var(--tx-soft)' }}>
              Color: <strong style={{ color: 'var(--marron)' }}>{selectedColor}</strong>
            </p>
            <div className="flex gap-2.5">
              {mockVariants.map((c) => (
                <button
                  key={c}
                  title={c}
                  onClick={() => setSelectedColor(c)}
                  className="w-[26px] h-[26px] rounded-full transition-all"
                  style={{
                    background: MOCK_SWATCHES[c] ?? '#ccc',
                    border: '2px solid #fff',
                    boxShadow: c === selectedColor ? '0 0 0 2px var(--taupe)' : '0 0 0 1px var(--line)',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Talle — TODO: variantes - ver TECHNICAL_DEBT.md */}
          <div>
            <p className="text-[11px] font-medium mb-2.5" style={{ color: 'var(--tx-soft)' }}>
              Tamaño: <strong style={{ color: 'var(--marron)' }}>{selectedSize} cm</strong>
            </p>
            <div className="flex gap-2">
              {mockSizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className="px-3 py-2 text-[11px] font-medium rounded-[9px] transition-all"
                  style={{
                    border: `1px solid ${s === selectedSize ? 'var(--taupe)' : 'var(--line)'}`,
                    background: s === selectedSize ? 'var(--beige)' : '#fff',
                    color: s === selectedSize ? 'var(--marron)' : 'var(--tx-soft)',
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Stock */}
          <div className="flex items-center gap-2 text-[12px] font-medium" style={{ color: 'var(--exito)' }}>
            <span className="w-2 h-2 rounded-full" style={{ background: 'var(--exito)' }} />
            {product.stock > 0 ? 'Stock disponible' : 'Sin stock'}
          </div>

          {/* Stepper + botones */}
          <div className="flex items-center gap-3 mt-1">
            <div
              className="flex items-center overflow-hidden rounded-[9px]"
              style={{ border: '1px solid var(--line)' }}
            >
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-9 h-9 flex items-center justify-center text-marron hover:bg-beige transition-colors"
                style={{ background: '#fff' }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M5 12h14" strokeLinecap="round" />
                </svg>
              </button>
              <span className="w-8 text-center text-[13px] font-semibold" style={{ color: 'var(--tx)' }}>
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-9 h-9 flex items-center justify-center text-marron hover:bg-beige transition-colors"
                style={{ background: '#fff' }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            <button
              onClick={handleAddToCart}
              className="w-full py-4 rounded-[10px] text-[12.5px] font-semibold tracking-[.12em] uppercase text-white transition-opacity hover:opacity-90"
              style={{ background: 'var(--taupe)' }}
            >
              Agregar al carrito
            </button>
            <button
              onClick={handleBuyNow}
              className="w-full py-4 rounded-[10px] text-[12.5px] font-semibold tracking-[.12em] uppercase transition-colors"
              style={{
                background: 'var(--marron)',
                color: 'var(--marfil)',
              }}
            >
              Comprar ahora
            </button>
            <WhatsAppButton product={product} size="lg" />
          </div>

          {/* Descripción accordion */}
          <div style={{ borderTop: '1px solid var(--line-soft)' }} className="pt-4 mt-1">
            <button
              onClick={() => setOpenDesc((o) => !o)}
              className="w-full flex items-center justify-between"
              style={{ background: 'none', border: 'none', padding: '4px 0', cursor: 'pointer' }}
            >
              <span style={{ fontFamily: 'var(--font-head)', fontSize: 17, color: 'var(--marron)' }}>
                Descripción y cuidados
              </span>
              <span style={{ color: 'var(--gris-taupe)' }}>
                <ChevronIcon down={openDesc} />
              </span>
            </button>

            {openDesc && product.description && (
              <div className="pt-3 animate-fade-in">
                <p className="text-[12.5px] leading-relaxed" style={{ color: 'var(--tx-soft)' }}>
                  {product.description}
                </p>
                {product.category && (
                  <div className="mt-3">
                    <p className="text-[10.5px] font-semibold tracking-[.08em] uppercase" style={{ color: 'var(--gris-taupe)' }}>
                      Categoría
                    </p>
                    <p className="text-[12px] mt-1" style={{ color: 'var(--tx)' }}>{product.category}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Productos relacionados — TODO: related products - ver TECHNICAL_DEBT.md */}
      <div className="mt-16">
        <div className="flex items-baseline justify-between mb-6">
          <h2 style={{ fontFamily: 'var(--font-head)', fontSize: 24, color: 'var(--marron)', fontWeight: 600 }}>
            Combina con
          </h2>
        </div>
        {/* Mobile: scroll horizontal; Desktop: grid 4 cols */}
        <div className="md:hidden flex gap-4 overflow-x-auto pb-2 scrollbar-none">
          {related.map((r) => (
            <div key={r.id} className="flex-shrink-0 w-[140px]">
              <Link href={`/productos/${r.id}`}>
                <div className="h-[140px] rounded-[12px] overflow-hidden mb-2" style={{ background: 'var(--beige)' }} />
              </Link>
              <p className="text-[11px] font-medium leading-tight" style={{ color: 'var(--tx)' }}>{r.name}</p>
              <p className="text-[12px] font-semibold mt-0.5" style={{ color: 'var(--marron)' }}>${r.price.toLocaleString('es-AR')}</p>
            </div>
          ))}
        </div>
        <div className="hidden md:grid md:grid-cols-4 gap-5">
          {related.map((r) => (
            <div key={r.id}>
              <Link href={`/productos/${r.id}`}>
                <div className="aspect-square rounded-[12px] overflow-hidden mb-2 transition-opacity hover:opacity-90" style={{ background: 'var(--beige)' }} />
              </Link>
              <p className="text-[12px] font-medium leading-tight" style={{ color: 'var(--tx)' }}>{r.name}</p>
              <p className="text-[13px] font-semibold mt-0.5" style={{ color: 'var(--marron)' }}>${r.price.toLocaleString('es-AR')}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
