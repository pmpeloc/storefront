import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { CartButton } from './CartButton'
import { useCartStore } from '@/store/cartStore'

describe('CartButton', () => {
  beforeEach(() => {
    useCartStore.setState({ items: [], isOpen: false, total: 0, itemCount: 0 })
  })

  it('renderiza el ícono del carrito', () => {
    render(<CartButton />)
    expect(screen.getByRole('button', { name: /carrito/i })).toBeDefined()
  })

  it('no muestra badge cuando itemCount es 0', () => {
    render(<CartButton />)
    expect(screen.queryByTestId('cart-badge')).toBeNull()
  })

  it('muestra badge con el número cuando itemCount > 0', () => {
    useCartStore.setState({ itemCount: 3 })
    render(<CartButton />)
    expect(screen.getByTestId('cart-badge').textContent).toBe('3')
  })

  it('llama toggleDrawer al hacer click', () => {
    const toggleDrawer = vi.fn()
    useCartStore.setState({ toggleDrawer })
    render(<CartButton />)
    fireEvent.click(screen.getByRole('button', { name: /carrito/i }))
    expect(toggleDrawer).toHaveBeenCalledOnce()
  })
})
