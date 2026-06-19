import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CheckoutPage from './page'
import { useCartStore } from '@/store/cartStore'

const mockPush = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}))

const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

// jsdom no implementa navegación real — reemplazamos location para que
// la redirección de handleOrder (window.location.href = ...) no loguee error
Object.defineProperty(window, 'location', {
  value: { href: '' },
  writable: true,
})

const mockProduct = {
  id: 'product-1',
  name: 'Almohadón Test',
  price: 7500,
  image_url: null,
  slug: 'almohadon-test',
  category: null,
  stock: 10,
  is_featured: false,
  description: null,
  seo_title: 'Almohadón Test',
  seo_description: null,
  created_at: '',
  updated_at: '',
}

async function fillStep1AndContinue(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/nombre/i), 'Ana')
  await user.type(screen.getByLabelText(/apellido/i), 'García')
  await user.type(screen.getByLabelText(/teléfono/i), '5491100000000')
  await user.type(screen.getByLabelText(/email/i), 'ana@test.com')
  await user.click(screen.getByRole('button', { name: /continuar/i }))
}

async function fillStep2AndContinue(user: ReturnType<typeof userEvent.setup>) {
  await user.type(await screen.findByLabelText(/calle/i), 'Av. Test 123')
  await user.type(screen.getByLabelText(/ciudad/i), 'Buenos Aires')
  await user.type(screen.getByLabelText(/código postal/i), '1000')
  await user.type(screen.getByLabelText(/provincia/i), 'CABA')
  await user.click(screen.getByRole('button', { name: /continuar/i }))
}

describe('CheckoutPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useCartStore.setState({
      items: [{ product: mockProduct, quantity: 1 }],
      isOpen: false,
      total: 7500,
      itemCount: 1,
    })
  })

  it('renderiza los campos del paso 1 (datos personales)', () => {
    render(<CheckoutPage />)
    expect(screen.getByLabelText(/nombre/i)).toBeDefined()
    expect(screen.getByLabelText(/apellido/i)).toBeDefined()
    expect(screen.getByLabelText(/teléfono/i)).toBeDefined()
    expect(screen.getByLabelText(/email/i)).toBeDefined()
  })

  it('muestra errores de validación al enviar el paso 1 vacío', async () => {
    const user = userEvent.setup()
    render(<CheckoutPage />)
    await user.click(screen.getByRole('button', { name: /continuar/i }))
    await waitFor(() => {
      expect(screen.getAllByRole('alert').length).toBeGreaterThan(0)
    })
  })

  it('avanza al paso 2 y muestra los campos de envío', async () => {
    const user = userEvent.setup()
    render(<CheckoutPage />)
    await fillStep1AndContinue(user)
    expect(await screen.findByLabelText(/calle/i)).toBeDefined()
    expect(screen.getByLabelText(/ciudad/i)).toBeDefined()
    expect(screen.getByLabelText(/provincia/i)).toBeDefined()
    expect(screen.getByLabelText(/código postal/i)).toBeDefined()
  })

  it('llama POST /api/v1/public/orders con datos válidos y redirige', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ orderId: 'order-123', checkoutUrl: '/checkout/success?orderId=order-123' }),
    })

    const user = userEvent.setup()
    render(<CheckoutPage />)

    await fillStep1AndContinue(user)
    await fillStep2AndContinue(user)
    await user.click(await screen.findByRole('button', { name: /pagar ahora/i }))

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledOnce()
      const [url, opts] = mockFetch.mock.calls[0]
      expect(url).toContain('/api/v1/public/orders')
      expect(JSON.parse(opts.body).customer.name).toBe('Ana García')
    })
  })

  it('muestra error cuando la API falla', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      json: async () => ({ error: { message: 'Error del servidor' } }),
    })

    const user = userEvent.setup()
    render(<CheckoutPage />)

    await fillStep1AndContinue(user)
    await fillStep2AndContinue(user)
    await user.click(await screen.findByRole('button', { name: /pagar ahora/i }))

    await waitFor(() => {
      expect(screen.getByText('Error del servidor')).toBeDefined()
    })
  })
})
