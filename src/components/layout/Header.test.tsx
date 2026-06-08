import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Header } from './Header'

describe('Header', () => {
  it('renderiza el CartButton', () => {
    render(<Header />)
    expect(screen.getByRole('button', { name: /carrito/i })).toBeDefined()
  })
})
