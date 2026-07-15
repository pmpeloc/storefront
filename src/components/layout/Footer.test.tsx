import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Footer } from './Footer'
import { TenantConfigProvider } from '@/components/providers/TenantConfigProvider'
import type { TenantConfig } from '@/lib/tenant-config'

const baseTenantConfig: TenantConfig = {
  tenant_id: 'tenant-1',
  client_name: 'Distribuidora Nehemías',
  brand_color: '#2563EB',
  logo_url: null,
  favicon_url: null,
  email_from: null,
  whatsapp_number: '5492664000000',
  whatsapp_message: 'Hola!',
  checkout_methods: ['whatsapp'],
  nav_sections: ['catalogo', 'contacto'],
  tagline: null,
  city: 'San Luis',
  default_product_image_url: null,
  theme_id: 'senal',
}

function renderFooter(config: Partial<TenantConfig> = {}) {
  return render(
    <TenantConfigProvider value={{ ...baseTenantConfig, ...config }}>
      <Footer />
    </TenantConfigProvider>,
  )
}

describe('Footer', () => {
  it('oculta los links de Tienda/Información que no están en nav_sections', () => {
    renderFooter()
    expect(screen.queryByRole('link', { name: 'Colecciones' })).toBeNull()
    expect(screen.queryByRole('link', { name: 'Inspiración' })).toBeNull()
    expect(screen.queryByRole('link', { name: 'Nosotros' })).toBeNull()
    expect(screen.getByRole('link', { name: 'Catálogo' })).toBeDefined()
  })

  it('sin tagline, no renderiza el párrafo de marca', () => {
    renderFooter({ tagline: null })
    expect(screen.queryByText(/Diseños para espacios/i)).toBeNull()
  })

  it('con tagline, renderiza el párrafo de marca', () => {
    renderFooter({ tagline: 'Repuestos y accesorios al mejor precio.' })
    expect(screen.getByText('Repuestos y accesorios al mejor precio.')).toBeDefined()
  })

  it('el copyright incluye la ciudad cuando está seteada', () => {
    renderFooter({ city: 'San Luis' })
    expect(screen.getByText((_, el) => el?.textContent === '© 2026 Distribuidora Nehemías · San Luis')).toBeDefined()
  })

  it('checkout_methods whatsapp: muestra el bloque de WhatsApp, sin badges de tarjeta', () => {
    renderFooter({ checkout_methods: ['whatsapp'] })
    expect(screen.getByText(/consultas y pedidos por whatsapp/i)).toBeDefined()
    expect(screen.queryByText('VISA')).toBeNull()
    expect(screen.queryByText('MASTER')).toBeNull()
    expect(screen.queryByText('AMEX')).toBeNull()
  })

  it('checkout_methods mobbex: muestra los badges de tarjeta', () => {
    renderFooter({ checkout_methods: ['mobbex'] })
    expect(screen.getByText('VISA')).toBeDefined()
    expect(screen.getByText('MASTER')).toBeDefined()
    expect(screen.getByText('AMEX')).toBeDefined()
    expect(screen.queryByText(/consultas y pedidos por whatsapp/i)).toBeNull()
  })

  it('sin logo_url, muestra el nombre del tenant en vez del wordmark de Renuevo', () => {
    renderFooter({ logo_url: null })
    expect(screen.getAllByText('Distribuidora Nehemías').length).toBeGreaterThan(0)
    expect(screen.queryByAltText('RENUEVO')).toBeNull()
  })
})
