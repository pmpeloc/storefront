import { describe, it, expect, vi, beforeEach } from 'vitest'
import { notFound } from 'next/navigation'
import { assertNavSectionEnabled } from './nav-sections'
import { fetchTenantConfigBySlug } from './tenant-config'
import type { TenantConfig } from './tenant-config'

vi.mock('next/navigation', () => ({
  notFound: vi.fn(() => {
    throw new Error('NEXT_NOT_FOUND')
  }),
}))

vi.mock('./tenant-config', () => ({
  fetchTenantConfigBySlug: vi.fn(),
}))

const mockFetch = vi.mocked(fetchTenantConfigBySlug)

const baseConfig: TenantConfig = {
  tenant_id: 'tenant-1',
  client_name: 'Test Store',
  brand_color: '#000',
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

describe('assertNavSectionEnabled', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('no lanza cuando la sección está en nav_sections', async () => {
    mockFetch.mockResolvedValue(baseConfig)
    await expect(assertNavSectionEnabled('nehemias', 'catalogo')).resolves.toBeUndefined()
  })

  it('llama notFound() cuando la sección no está en nav_sections', async () => {
    mockFetch.mockResolvedValue(baseConfig)
    await expect(assertNavSectionEnabled('nehemias', 'nosotros')).rejects.toThrow('NEXT_NOT_FOUND')
    expect(notFound).toHaveBeenCalledOnce()
  })

  it('llama notFound() cuando el tenant no existe', async () => {
    mockFetch.mockResolvedValue(null)
    await expect(assertNavSectionEnabled('desconocido', 'catalogo')).rejects.toThrow('NEXT_NOT_FOUND')
  })
})
