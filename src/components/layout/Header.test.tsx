import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Header } from './Header'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}))

describe('Header', () => {
  it('renderiza el CartButton', () => {
    render(<Header />)
    expect(screen.getByRole('button', { name: /carrito/i })).toBeDefined()
  })
})
