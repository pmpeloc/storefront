import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import CheckoutPage from './page'
import { useCartStore } from '@/store/cartStore'

const mockPush = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  redirect: vi.fn(),
}))

const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

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

  it('renderiza todos los campos del formulario', () => {
    render(<CheckoutPage />)
    expect(screen.getByLabelText(/nombre/i)).toBeDefined()
    expect(screen.getByLabelText(/email/i)).toBeDefined()
    expect(screen.getByLabelText(/teléfono/i)).toBeDefined()
    expect(screen.getByLabelText(/calle/i)).toBeDefined()
    expect(screen.getByLabelText(/ciudad/i)).toBeDefined()
    expect(screen.getByLabelText(/provincia/i)).toBeDefined()
    expect(screen.getByLabelText(/código postal/i)).toBeDefined()
  })

  it('muestra errores de validación al enviar formulario vacío', async () => {
    render(<CheckoutPage />)
    fireEvent.click(screen.getByRole('button', { name: /confirmar pedido/i }))
    await waitFor(() => {
      expect(screen.getAllByRole('alert').length).toBeGreaterThan(0)
    })
  })

  it('llama POST /api/v1/public/orders con datos válidos y redirige', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ orderId: 'order-123', checkoutUrl: '/checkout/success?orderId=order-123' }),
    })

    render(<CheckoutPage />)

    fireEvent.change(screen.getByLabelText(/nombre/i), { target: { value: 'Ana García' } })
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'ana@test.com' } })
    fireEvent.change(screen.getByLabelText(/teléfono/i), { target: { value: '5491100000000' } })
    fireEvent.change(screen.getByLabelText(/calle/i), { target: { value: 'Av. Test 123' } })
    fireEvent.change(screen.getByLabelText(/ciudad/i), { target: { value: 'Buenos Aires' } })
    fireEvent.change(screen.getByLabelText(/provincia/i), { target: { value: 'CABA' } })
    fireEvent.change(screen.getByLabelText(/código postal/i), { target: { value: '1000' } })

    fireEvent.click(screen.getByRole('button', { name: /confirmar pedido/i }))

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

    render(<CheckoutPage />)

    fireEvent.change(screen.getByLabelText(/nombre/i), { target: { value: 'Ana García' } })
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'ana@test.com' } })
    fireEvent.change(screen.getByLabelText(/teléfono/i), { target: { value: '5491100000000' } })
    fireEvent.change(screen.getByLabelText(/calle/i), { target: { value: 'Av. Test 123' } })
    fireEvent.change(screen.getByLabelText(/ciudad/i), { target: { value: 'Buenos Aires' } })
    fireEvent.change(screen.getByLabelText(/provincia/i), { target: { value: 'CABA' } })
    fireEvent.change(screen.getByLabelText(/código postal/i), { target: { value: '1000' } })

    fireEvent.click(screen.getByRole('button', { name: /confirmar pedido/i }))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeDefined()
    })
  })
})
