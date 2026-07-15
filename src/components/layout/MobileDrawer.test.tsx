import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MobileDrawer } from './MobileDrawer'
import { TenantConfigProvider } from '@/components/providers/TenantConfigProvider'
import type { TenantConfig } from '@/lib/tenant-config'

vi.mock('next/image', () => ({
  default: ({ src, alt, onError, ...props }: any) => <img src={src} alt={alt} onError={onError} {...props} />,
}))

const baseTenantConfig: TenantConfig = {
  tenant_id: 'tenant-1',
  client_name: 'Distribuidora Nehemías',
  brand_color: '#2563EB',
  logo_url: null,
  favicon_url: null,
  email_from: null,
  whatsapp_number: null,
  whatsapp_message: null,
  checkout_methods: ['whatsapp'],
  nav_sections: ['catalogo', 'contacto'],
  tagline: null,
  city: null,
  default_product_image_url: null,
  theme_id: 'senal',
}

function renderDrawer(config: Partial<TenantConfig> = {}) {
  return render(
    <TenantConfigProvider value={{ ...baseTenantConfig, ...config }}>
      <MobileDrawer open onClose={() => {}} />
    </TenantConfigProvider>,
  )
}

describe('MobileDrawer', () => {
  it('oculta los links que no están en nav_sections', () => {
    renderDrawer()
    expect(screen.queryByRole('link', { name: 'Colecciones' })).toBeNull()
    expect(screen.queryByRole('link', { name: 'Inspiración' })).toBeNull()
    expect(screen.queryByRole('link', { name: 'Nosotros' })).toBeNull()
    expect(screen.getByRole('link', { name: 'Catálogo' })).toBeDefined()
    expect(screen.getByRole('link', { name: 'Contacto' })).toBeDefined()
  })

  it('"Inicio"/"Favoritos"/"Mi cuenta" se muestran siempre, sin depender de nav_sections', () => {
    renderDrawer()
    expect(screen.getByRole('link', { name: 'Inicio' })).toBeDefined()
    expect(screen.getByRole('link', { name: 'Favoritos' })).toBeDefined()
    expect(screen.getByRole('link', { name: 'Mi cuenta' })).toBeDefined()
  })

  it('sin logo_url, muestra el nombre del tenant en vez del wordmark de Renuevo', () => {
    renderDrawer()
    expect(screen.getAllByText('Distribuidora Nehemías').length).toBeGreaterThan(0)
    expect(screen.queryByAltText('RENUEVO')).toBeNull()
  })

  it('el copyright usa el nombre del tenant, no "RENUEVO"', () => {
    renderDrawer()
    expect(screen.getByText('© Distribuidora Nehemías')).toBeDefined()
    expect(screen.queryByText(/RENUEVO/)).toBeNull()
  })

  it('logo roto: cae al fallback de texto', () => {
    renderDrawer({ logo_url: 'https://example.com/logo.png' })
    const logo = screen.getByAltText(baseTenantConfig.client_name)
    fireEvent.error(logo)
    expect(screen.queryByAltText(baseTenantConfig.client_name)).toBeNull()
    expect(screen.getAllByText(baseTenantConfig.client_name).length).toBeGreaterThan(0)
  })
})
