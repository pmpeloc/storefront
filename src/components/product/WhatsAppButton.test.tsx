import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { WhatsAppButton } from './WhatsAppButton'
import { TenantConfigProvider } from '@/components/providers/TenantConfigProvider'
import type { PublicProduct } from '@/types/product'
import type { TenantConfig } from '@/lib/tenant-config'

const testTenantConfig: TenantConfig = {
  tenant_id: 'tenant-1',
  client_name: 'Test Store',
  brand_color: '#000',
  logo_url: null,
  favicon_url: null,
  email_from: null,
  whatsapp_number: '5491155555555',
  whatsapp_message: 'Hola!',
}

function renderWithProvider(ui: React.ReactElement) {
  return render(<TenantConfigProvider value={testTenantConfig}>{ui}</TenantConfigProvider>)
}

const product: PublicProduct = {
  id: '1',
  name: 'Almohada Premium',
  description: null,
  price: 15000,
  image_url: null,
  slug: 'almohada-premium',
  category: null,
  stock: 5,
  is_featured: false,
  seo_title: 'Almohada Premium',
  seo_description: null,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
}

describe('WhatsAppButton', () => {
  it('renders the CTA text', () => {
    renderWithProvider(<WhatsAppButton product={product} />)
    expect(screen.getByText('Consultar por WhatsApp')).toBeTruthy()
  })

  it('href apunta a wa.me con el número configurado', () => {
    renderWithProvider(<WhatsAppButton product={product} />)
    expect(screen.getByRole('link').getAttribute('href')).toContain('wa.me/5491155555555')
  })

  it('href incluye el nombre del producto en el mensaje', () => {
    renderWithProvider(<WhatsAppButton product={product} />)
    const href = screen.getByRole('link').getAttribute('href') ?? ''
    expect(decodeURIComponent(href)).toContain('Almohada Premium')
  })

  it('abre en nueva pestaña con atributos de seguridad correctos', () => {
    renderWithProvider(<WhatsAppButton product={product} />)
    const link = screen.getByRole('link')
    expect(link.getAttribute('target')).toBe('_blank')
    expect(link.getAttribute('rel')).toBe('noopener noreferrer')
  })
})
