import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { WhatsAppButton } from './WhatsAppButton'
import type { PublicProduct } from '@/types/product'

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
    render(<WhatsAppButton product={product} />)
    expect(screen.getByText('Consultar por WhatsApp')).toBeTruthy()
  })

  it('href apunta a wa.me con el número configurado', () => {
    render(<WhatsAppButton product={product} />)
    expect(screen.getByRole('link').getAttribute('href')).toContain('wa.me/5491155555555')
  })

  it('href incluye el nombre del producto en el mensaje', () => {
    render(<WhatsAppButton product={product} />)
    const href = screen.getByRole('link').getAttribute('href') ?? ''
    expect(decodeURIComponent(href)).toContain('Almohada Premium')
  })

  it('abre en nueva pestaña con atributos de seguridad correctos', () => {
    render(<WhatsAppButton product={product} />)
    const link = screen.getByRole('link')
    expect(link.getAttribute('target')).toBe('_blank')
    expect(link.getAttribute('rel')).toBe('noopener noreferrer')
  })
})
