import { describe, it, expect, vi } from 'vitest'
import { notFound } from 'next/navigation'
import CollectionsPage from './page'

vi.mock('next/navigation', () => ({
  notFound: vi.fn(() => {
    throw new Error('NEXT_NOT_FOUND')
  }),
}))

const mockAssertNavSectionEnabled = vi.fn()
vi.mock('@/lib/nav-sections', () => ({
  assertNavSectionEnabled: (...args: unknown[]) => mockAssertNavSectionEnabled(...args),
}))

describe('CollectionsPage', () => {
  it('llama a assertNavSectionEnabled con la sección colecciones', async () => {
    mockAssertNavSectionEnabled.mockResolvedValue(undefined)
    await CollectionsPage({ params: { tenant: 'el-renuevo' } })
    expect(mockAssertNavSectionEnabled).toHaveBeenCalledWith('el-renuevo', 'colecciones')
  })

  it('propaga notFound() cuando la sección no está habilitada', async () => {
    mockAssertNavSectionEnabled.mockImplementation(() => {
      notFound()
      return Promise.resolve()
    })
    await expect(CollectionsPage({ params: { tenant: 'distribuidora-nehemias' } })).rejects.toThrow('NEXT_NOT_FOUND')
  })
})
