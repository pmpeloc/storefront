import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import FailurePage from './page'
import { useCartStore } from '@/store/cartStore'

describe('FailurePage', () => {
  beforeEach(() => {
    useCartStore.setState({ items: [], total: 0, itemCount: 0, isOpen: false })
  })

  it('muestra mensaje de error amigable', () => {
    render(<FailurePage />)
    expect(screen.getByText(/no se pudo procesar/i)).toBeDefined()
  })

  it('botón "Volver al carrito" llama toggleDrawer', () => {
    const toggleDrawer = vi.fn()
    useCartStore.setState({ toggleDrawer })
    render(<FailurePage />)
    fireEvent.click(screen.getByRole('button', { name: /volver al carrito/i }))
    expect(toggleDrawer).toHaveBeenCalledOnce()
  })
})
