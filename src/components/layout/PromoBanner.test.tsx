import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PromoBanner } from './PromoBanner'
import { TenantConfigProvider } from '@/components/providers/TenantConfigProvider'
import type { TenantConfig } from '@/lib/tenant-config'

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

function renderBanner(config: Partial<TenantConfig> = {}) {
  return render(
    <TenantConfigProvider value={{ ...baseTenantConfig, ...config }}>
      <PromoBanner />
    </TenantConfigProvider>,
  )
}

describe('PromoBanner', () => {
  it('checkout_methods whatsapp: no menciona cuotas', () => {
    renderBanner({ checkout_methods: ['whatsapp'] })
    expect(screen.queryByText(/cuotas/i)).toBeNull()
  })

  it('checkout_methods mobbex: menciona cuotas', () => {
    renderBanner({ checkout_methods: ['mobbex'] })
    expect(screen.getByText(/cuotas/i)).toBeDefined()
  })
})
