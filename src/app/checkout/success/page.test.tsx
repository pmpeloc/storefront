import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import SuccessPage from './page'
import { useCartStore } from '@/store/cartStore'

vi.mock('next/navigation', () => ({
  useSearchParams: () => ({ get: (key: string) => key === 'orderId' ? 'order-123' : null }),
}))

describe('SuccessPage', () => {
  beforeEach(() => {
    useCartStore.setState({ items: [{ product: { id: '1', name: 'Test', price: 1, image_url: null, slug: null, category: null, stock: 1, is_featured: false, description: null, seo_title: '', seo_description: null, created_at: '', updated_at: '' }, quantity: 1 }], total: 1, itemCount: 1, isOpen: false })
  })

  it('muestra mensaje de confirmación de pedido', () => {
    render(<SuccessPage />)
    expect(screen.getByText(/pedido confirmado/i)).toBeDefined()
  })

  it('muestra el orderId recibido por searchParams', () => {
    render(<SuccessPage />)
    expect(screen.getByText(/order-123/i)).toBeDefined()
  })

  it('vacía el carrito al montar la página', () => {
    render(<SuccessPage />)
    expect(useCartStore.getState().items).toHaveLength(0)
  })
})
