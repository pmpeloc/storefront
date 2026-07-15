import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Header } from './Header'
import { TenantConfigProvider } from '@/components/providers/TenantConfigProvider'
import type { TenantConfig } from '@/lib/tenant-config'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}))

const testTenantConfig: TenantConfig = {
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

describe('Header', () => {
  it('renderiza el CartButton', () => {
    render(
      <TenantConfigProvider value={testTenantConfig}>
        <Header />
      </TenantConfigProvider>,
    )
    expect(screen.getByRole('button', { name: /carrito/i })).toBeDefined()
  })

  it('oculta los links de nav que no están en nav_sections', () => {
    render(
      <TenantConfigProvider value={{ ...testTenantConfig, nav_sections: ['catalogo', 'contacto'] }}>
        <Header />
      </TenantConfigProvider>,
    )
    expect(screen.queryByRole('link', { name: 'Colecciones' })).toBeNull()
    expect(screen.queryByRole('link', { name: 'Inspiración' })).toBeNull()
    expect(screen.queryByRole('link', { name: 'Nosotros' })).toBeNull()
    expect(screen.getByRole('link', { name: 'Catálogo' })).toBeDefined()
    expect(screen.getByRole('link', { name: 'Contacto' })).toBeDefined()
  })

  it('sin logo_url, muestra el nombre del tenant en vez del wordmark de Renuevo', () => {
    render(
      <TenantConfigProvider value={{ ...testTenantConfig, client_name: 'Distribuidora Nehemías', logo_url: null }}>
        <Header />
      </TenantConfigProvider>,
    )
    expect(screen.getAllByText('Distribuidora Nehemías').length).toBeGreaterThan(0)
    expect(screen.queryByAltText('RENUEVO')).toBeNull()
  })

  it('oculta "Ver colecciones" del mega-menú cuando colecciones no está en nav_sections', () => {
    render(
      <TenantConfigProvider value={{ ...testTenantConfig, nav_sections: ['catalogo', 'contacto'] }}>
        <Header />
      </TenantConfigProvider>,
    )
    expect(screen.queryByText('Ver colecciones →')).toBeNull()
  })

  it('logo roto: cae al fallback de texto', () => {
    render(
      <TenantConfigProvider value={{ ...testTenantConfig, logo_url: 'https://example.com/logo.png' }}>
        <Header />
      </TenantConfigProvider>,
    )
    const logos = screen.getAllByAltText(testTenantConfig.client_name)
    logos.forEach((img) => fireEvent.error(img))
    expect(screen.queryByAltText(testTenantConfig.client_name)).toBeNull()
    expect(screen.getAllByText(testTenantConfig.client_name).length).toBeGreaterThan(0)
  })
})
