import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ProductCard } from './ProductCard'
import type { PublicProduct } from '@/types/product'
import { useCartStore } from '@/store/cartStore'

vi.mock('next/link', () => ({
  default: ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => (
    <a href={href} className={className}>{children}</a>
  ),
}))

vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}))

vi.mock('@/config/client', () => ({
  clientConfig: {
    tenantSlug: 'test-tenant',
    clientName: 'Test Store',
    brandColor: '#000',
    whatsappNumber: '5491155555555',
    whatsappMessage: 'Hola!',
    logoUrl: null,
    domain: 'localhost',
  },
}))

const baseProduct: PublicProduct = {
  id: '1',
  name: 'Almohada Escandinava',
  description: 'Una descripción',
  price: 15000,
  image_url: 'https://example.com/image.jpg',
  slug: 'almohada-escandinava',
  category: 'Almohadas',
  stock: 3,
  is_featured: false,
  seo_title: 'Almohada Escandinava',
  seo_description: null,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
}

describe('ProductCard', () => {
  beforeEach(() => {
    useCartStore.setState({ items: [], total: 0, itemCount: 0, isOpen: false })
  })

  it('renderiza el nombre del producto', () => {
    render(<ProductCard product={baseProduct} />)
    expect(screen.getByText('Almohada Escandinava')).toBeTruthy()
  })

  it('renderiza el precio', () => {
    render(<ProductCard product={baseProduct} />)
    expect(screen.getByText(/\$15/)).toBeTruthy()
  })

  it('enlaza a /productos/[slug] cuando el slug existe', () => {
    render(<ProductCard product={baseProduct} />)
    const links = screen.getAllByRole('link')
    expect(links.some(l => l.getAttribute('href') === '/productos/almohada-escandinava')).toBe(true)
  })

  it('enlaza a # cuando el slug es null', () => {
    render(<ProductCard product={{ ...baseProduct, slug: null }} />)
    const links = screen.getAllByRole('link')
    expect(links.some(l => l.getAttribute('href') === '#')).toBe(true)
  })

  it('renderiza la imagen cuando image_url está disponible', () => {
    render(<ProductCard product={baseProduct} />)
    expect(screen.getByRole('img', { name: 'Almohada Escandinava' })).toBeTruthy()
  })

  it('renderiza el placeholder SVG cuando image_url es null', () => {
    render(<ProductCard product={{ ...baseProduct, image_url: null }} />)
    expect(screen.queryByRole('img', { name: 'Almohada Escandinava' })).toBeNull()
  })

  it('muestra el badge Destacado cuando is_featured es true', () => {
    render(<ProductCard product={{ ...baseProduct, is_featured: true }} />)
    expect(screen.getByText('Destacado')).toBeTruthy()
  })

  it('no muestra el badge Destacado cuando is_featured es false', () => {
    render(<ProductCard product={baseProduct} />)
    expect(screen.queryByText('Destacado')).toBeNull()
  })

  it('botón "Agregar al carrito" llama addItem del store', () => {
    render(<ProductCard product={baseProduct} />)
    fireEvent.click(screen.getByRole('button', { name: /agregar al carrito/i }))
    expect(useCartStore.getState().items).toHaveLength(1)
    expect(useCartStore.getState().items[0].product.id).toBe('1')
  })
})
