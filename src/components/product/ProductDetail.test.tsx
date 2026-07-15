import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ProductDetail } from './ProductDetail'
import { TenantConfigProvider } from '@/components/providers/TenantConfigProvider'
import type { PublicProduct } from '@/types/product'
import type { TenantConfig } from '@/lib/tenant-config'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}))

vi.mock('next/image', () => ({
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

function renderDetail(config: Partial<TenantConfig> = {}) {
  return render(
    <TenantConfigProvider value={{ ...baseTenantConfig, ...config }}>
      <ProductDetail product={baseProduct} />
    </TenantConfigProvider>,
  )
}

describe('ProductDetail', () => {
  it('muestra el texto de cuotas cuando checkout_methods incluye mobbex', () => {
    renderDetail({ checkout_methods: ['mobbex'] })
    expect(screen.getByText(/cuotas sin interés/i)).toBeTruthy()
  })

  it('no muestra el texto de cuotas cuando checkout_methods es solo whatsapp', () => {
    renderDetail({ checkout_methods: ['whatsapp'] })
    expect(screen.queryByText(/cuotas sin interés/i)).toBeNull()
  })

  it('imagen rota sin default_product_image_url: la imagen principal cae al placeholder', () => {
    renderDetail({ default_product_image_url: null })
    const mainImg = screen.getByAltText(`${baseProduct.name} — imagen 1`)
    fireEvent.error(mainImg)
    expect(screen.queryByAltText(`${baseProduct.name} — imagen 1`)).toBeNull()
  })

  it('imagen rota con default_product_image_url: usa la imagen de marca del tenant', () => {
    renderDetail({ default_product_image_url: 'https://example.com/fallback.png' })
    const mainImg = screen.getByAltText(`${baseProduct.name} — imagen 1`)
    fireEvent.error(mainImg)
    expect(screen.getByAltText(`${baseProduct.name} — imagen 1`).getAttribute('src')).toBe(
      'https://example.com/fallback.png',
    )
  })
})
