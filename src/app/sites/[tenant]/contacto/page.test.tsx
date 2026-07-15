import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ContactPage from './page'
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

function renderContact(config: Partial<TenantConfig> = {}) {
  return render(
    <TenantConfigProvider value={{ ...baseTenantConfig, ...config }}>
      <ContactPage />
    </TenantConfigProvider>,
  )
}

describe('ContactPage', () => {
  it('nunca muestra el Instagram/email/dirección de Renuevo', () => {
    renderContact()
    expect(screen.queryByText(/renuevo/i)).toBeNull()
    expect(screen.queryByText('Av. Santa Fe 1234, Palermo')).toBeNull()
  })

  it('sin email_from, no muestra el canal de email', () => {
    const { container } = renderContact({ email_from: null })
    // No usar queryByText('Email') — el formulario tiene su propio <Field label="Email">
    // siempre presente. El signal real es el link mailto:.
    expect(container.querySelector('a[href^="mailto:"]')).toBeNull()
  })

  it('con email_from, muestra el canal de email con ese dato', () => {
    renderContact({ email_from: 'ventas@distribuidoranehemias.com.ar' })
    expect(screen.getAllByText('ventas@distribuidoranehemias.com.ar').length).toBeGreaterThan(0)
  })

  it('con city, muestra el bloque de showroom con la ciudad del tenant', () => {
    renderContact({ city: 'San Luis' })
    expect(screen.getAllByText(/San Luis/).length).toBeGreaterThan(0)
  })

  it('sin city, no muestra el bloque de showroom', () => {
    renderContact({ city: null })
    expect(screen.queryByText('Showroom')).toBeNull()
  })
})
