'use client'

import type { MockProduct } from '@/lib/mock-data'
import { useCartStore } from '@/store/cartStore'
import { useToastStore } from '@/store/toastStore'
import type { PublicProduct } from '@/types/product'

interface Props {
  product: MockProduct
  size?: 'sm' | 'md'
}

export function InspoAddToCart({ product, size = 'md' }: Props) {
  const addItem = useCartStore((s) => s.addItem)
  const addToast = useToastStore((s) => s.addToast)

  function handleAdd() {
    // Cast MockProduct to the shape addItem expects
    const p = {
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.imagenPrincipal,
      slug: product.slug,
      category: product.category,
      stock: product.stock ? 1 : 0,
      is_featured: false,
      seo_title: product.name,
      seo_description: product.description,
      description: product.description,
      created_at: '',
      updated_at: '',
    } as PublicProduct
    addItem(p)
    addToast('Agregado al carrito', 'ok')
  }

  if (size === 'sm') {
    return (
      <button
        onClick={handleAdd}
        className="flex-shrink-0 text-[10.5px] font-semibold tracking-[.06em] uppercase rounded-[8px] transition-opacity hover:opacity-80"
        style={{
          padding: '9px 12px',
          background: 'var(--taupe)',
          color: 'var(--marfil)',
          border: 'none',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
        }}
      >
        Agregar
      </button>
    )
  }

  return (
    <button
      onClick={handleAdd}
      className="flex-shrink-0 text-[11.5px] font-semibold tracking-[.08em] uppercase rounded-[9px] transition-opacity hover:opacity-80"
      style={{
        padding: '10px 16px',
        background: 'var(--taupe)',
        color: 'var(--marfil)',
        border: 'none',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
      }}
    >
      Agregar
    </button>
  )
}
