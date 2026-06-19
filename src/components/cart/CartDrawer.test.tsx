import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { CartDrawer } from './CartDrawer'
import { useCartStore } from '@/store/cartStore'

const mockProduct = {
  id: 'product-1',
  name: 'Almohadón Test',
  price: 7500,
  image_url: null,
  slug: 'almohadon-test',
  category: 'Almohadones',
  stock: 10,
  is_featured: false,
  description: null,
  seo_title: 'Almohadón Test',
  seo_description: null,
  created_at: '2026-06-08T00:00:00Z',
  updated_at: '2026-06-08T00:00:00Z',
}

describe('CartDrawer', () => {
  beforeEach(() => {
    useCartStore.setState({
      items: [{ product: mockProduct, quantity: 2 }],
      isOpen: true,
      total: 15000,
      itemCount: 2,
    })
  })

  it('renderiza la lista de items cuando isOpen es true', () => {
    render(<CartDrawer />)
    expect(screen.getByText('Almohadón Test')).toBeDefined()
  })

  it('botón + llama updateQuantity con quantity + 1', () => {
    const updateQuantity = vi.fn()
    useCartStore.setState({ updateQuantity })
    render(<CartDrawer />)
    fireEvent.click(screen.getByRole('button', { name: /aumentar cantidad/i }))
    expect(updateQuantity).toHaveBeenCalledWith('product-1', 3)
  })

  it('botón - llama updateQuantity con quantity - 1', () => {
    const updateQuantity = vi.fn()
    useCartStore.setState({ updateQuantity })
    render(<CartDrawer />)
    fireEvent.click(screen.getByRole('button', { name: /reducir cantidad/i }))
    expect(updateQuantity).toHaveBeenCalledWith('product-1', 1)
  })

  it('botón eliminar llama removeItem', () => {
    const removeItem = vi.fn()
    useCartStore.setState({ removeItem })
    render(<CartDrawer />)
    fireEvent.click(screen.getByRole('button', { name: /eliminar producto/i }))
    expect(removeItem).toHaveBeenCalledWith('product-1')
  })

  it('botón Iniciar compra enlaza a /checkout', () => {
    render(<CartDrawer />)
    const link = screen.getByRole('link', { name: /iniciar compra/i })
    expect(link.getAttribute('href')).toBe('/checkout')
  })

  it('oculta el panel (fuera de pantalla) cuando isOpen es false', () => {
    useCartStore.setState({ isOpen: false })
    render(<CartDrawer />)
    const panel = screen.getByText('Mi carrito').closest('div')?.parentElement as HTMLElement
    expect(panel.style.transform).toBe('translateX(100%)')
  })
})
