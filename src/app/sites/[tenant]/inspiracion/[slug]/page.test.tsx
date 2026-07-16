import { describe, it, expect, vi } from 'vitest'
import { notFound } from 'next/navigation'
import InspirationDetailPage from './page'

vi.mock('next/navigation', () => ({
  notFound: vi.fn(() => {
    throw new Error('NEXT_NOT_FOUND')
  }),
}))

const mockAssertNavSectionEnabled = vi.fn()
vi.mock('@/lib/nav-sections', () => ({
  assertNavSectionEnabled: (...args: unknown[]) => mockAssertNavSectionEnabled(...args),
}))

describe('InspirationDetailPage', () => {
  it('llama a assertNavSectionEnabled con la sección inspiracion', async () => {
    mockAssertNavSectionEnabled.mockResolvedValue(undefined)
    await InspirationDetailPage({ params: { tenant: 'el-renuevo', slug: 'living-1' } })
    expect(mockAssertNavSectionEnabled).toHaveBeenCalledWith('el-renuevo', 'inspiracion')
  })

  it('propaga notFound() cuando la sección no está habilitada', async () => {
    mockAssertNavSectionEnabled.mockImplementation(() => {
      notFound()
      return Promise.resolve()
    })
    await expect(
      InspirationDetailPage({ params: { tenant: 'distribuidora-nehemias', slug: 'living-1' } })
    ).rejects.toThrow('NEXT_NOT_FOUND')
  })
})
