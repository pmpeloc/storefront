import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ProductCard } from './ProductCard'
import { TenantConfigProvider } from '@/components/providers/TenantConfigProvider'
import type { PublicProduct } from '@/types/product'
import type { TenantConfig } from '@/lib/tenant-config'
import { useCartStore } from '@/store/cartStore'

vi.mock('next/link', () => ({
  default: ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => (
    <a href={href} className={className}>{children}</a>
  ),
}))

vi.mock('next/image', () => ({
  // eslint-disable-next-line @next/next/no-img-element -- mock de test, no es <Image> real en producción
  default: ({ src, alt, onError }: { src: string; alt: string; onError?: () => void }) => (
    <img src={src} alt={alt} onError={onError} />
  ),
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

const baseTenantConfig: TenantConfig = {
  tenant_id: 'tenant-1',
  client_name: 'Test Store',
  brand_color: '#000',
  logo_url: null,
  favicon_url: null,
  email_from: null,
  whatsapp_number: null,
  whatsapp_message: null,
  checkout_methods: ['mobbex'],
  nav_sections: ['catalogo', 'colecciones', 'inspiracion', 'nosotros', 'contacto'],
  tagline: null,
  city: null,
  default_product_image_url: null,
  theme_id: 'renuevo',
}

function renderCard(
  product: Partial<PublicProduct> = {},
  config: Partial<TenantConfig> = {},
  cardProps: { badge?: 'Más vendido' | 'Novedad' | 'Oferta' | ''; comparePrice?: number } = {},
) {
  return render(
    <TenantConfigProvider value={{ ...baseTenantConfig, ...config }}>
      <ProductCard product={{ ...baseProduct, ...product }} {...cardProps} />
    </TenantConfigProvider>,
  )
}

describe('ProductCard', () => {
  beforeEach(() => {
    useCartStore.setState({ items: [], total: 0, itemCount: 0, isOpen: false })
  })

  it('renderiza el nombre del producto', () => {
    renderCard()
    expect(screen.getByText('Almohada Escandinava')).toBeTruthy()
  })

  it('renderiza el precio', () => {
    renderCard()
    expect(screen.getByText(/\$15/)).toBeTruthy()
  })

  it('enlaza a /productos/[slug] cuando el slug existe', () => {
    renderCard()
    const links = screen.getAllByRole('link')
    expect(links.some(l => l.getAttribute('href') === '/productos/almohada-escandinava')).toBe(true)
  })

  it('enlaza a # cuando el slug es null', () => {
    renderCard({ slug: null })
    const links = screen.getAllByRole('link')
    expect(links.some(l => l.getAttribute('href') === '#')).toBe(true)
  })

  it('renderiza la imagen cuando image_url está disponible', () => {
    renderCard()
    expect(screen.getByRole('img', { name: 'Almohada Escandinava' })).toBeTruthy()
  })

  it('renderiza el placeholder cuando image_url es null', () => {
    renderCard({ image_url: null })
    expect(screen.queryByRole('img', { name: 'Almohada Escandinava' })).toBeNull()
  })

  it('muestra el badge Destacado cuando is_featured es true', () => {
    renderCard({ is_featured: true })
    expect(screen.getByText('Destacado')).toBeTruthy()
  })

  it('no muestra el badge Destacado cuando is_featured es false', () => {
    renderCard()
    expect(screen.queryByText('Destacado')).toBeNull()
  })

  it('botón "Agregar al carrito" llama addItem del store', () => {
    renderCard()
    fireEvent.click(screen.getByRole('button', { name: /agregar al carrito/i }))
    expect(useCartStore.getState().items).toHaveLength(1)
    expect(useCartStore.getState().items[0].product.id).toBe('1')
  })

  it('muestra el texto de cuotas cuando checkout_methods incluye mobbex', () => {
    renderCard({}, { checkout_methods: ['mobbex'] })
    expect(screen.getByText(/cuotas sin interés/i)).toBeTruthy()
  })

  it('no muestra el texto de cuotas cuando checkout_methods es solo whatsapp', () => {
    renderCard({}, { checkout_methods: ['whatsapp'] })
    expect(screen.queryByText(/cuotas sin interés/i)).toBeNull()
  })

  it('imagen rota sin default_product_image_url: cae al placeholder genérico', () => {
    renderCard({}, { default_product_image_url: null })
    fireEvent.error(screen.getByRole('img', { name: 'Almohada Escandinava' }))
    expect(screen.queryByRole('img', { name: 'Almohada Escandinava' })).toBeNull()
  })

  it('imagen rota con default_product_image_url: usa la imagen de marca del tenant', () => {
    renderCard({}, { default_product_image_url: 'https://example.com/fallback.png' })
    fireEvent.error(screen.getByRole('img', { name: 'Almohada Escandinava' }))
    // Nota: sin @testing-library/jest-dom en este repo (no está instalado) — se usa
    // getAttribute directo en lugar del matcher toHaveAttribute.
    expect(
      screen.getByRole('img', { name: 'Almohada Escandinava' }).getAttribute('src'),
    ).toBe('https://example.com/fallback.png')
  })
})
