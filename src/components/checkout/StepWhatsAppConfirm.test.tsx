import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { StepWhatsAppConfirm } from './StepWhatsAppConfirm'
import { useCartStore } from '@/store/cartStore'

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

describe('StepWhatsAppConfirm', () => {
  beforeEach(() => {
    useCartStore.setState({
      items: [{ product: mockProduct, quantity: 1 }],
      isOpen: false,
      total: 7500,
      itemCount: 1,
    })
  })

  it('renderiza el resumen del pedido', () => {
    render(
      <StepWhatsAppConfirm
        onBack={vi.fn()}
        onSubmit={vi.fn()}
        isSubmitting={false}
        apiError={null}
      />,
    )
    expect(screen.getByText('Resumen del pedido')).toBeDefined()
    expect(screen.getByText(/Almohadón Test/)).toBeDefined()
  })

  it('renderiza el botón "Confirmar pedido por WhatsApp"', () => {
    render(
      <StepWhatsAppConfirm
        onBack={vi.fn()}
        onSubmit={vi.fn()}
        isSubmitting={false}
        apiError={null}
      />,
    )
    expect(
      screen.getByRole('button', { name: /confirmar pedido por whatsapp/i }),
    ).toBeDefined()
  })

  it('el click en el botón dispara onSubmit con "whatsapp"', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    render(
      <StepWhatsAppConfirm
        onBack={vi.fn()}
        onSubmit={onSubmit}
        isSubmitting={false}
        apiError={null}
      />,
    )
    await user.click(
      screen.getByRole('button', { name: /confirmar pedido por whatsapp/i }),
    )
    expect(onSubmit).toHaveBeenCalledWith('whatsapp')
  })

  it('muestra el apiError cuando está seteado', () => {
    render(
      <StepWhatsAppConfirm
        onBack={vi.fn()}
        onSubmit={vi.fn()}
        isSubmitting={false}
        apiError='Ocurrió un error al procesar tu pedido.'
      />,
    )
    expect(
      screen.getByText('Ocurrió un error al procesar tu pedido.'),
    ).toBeDefined()
  })

  it('deshabilita el botón cuando isSubmitting es true', () => {
    render(
      <StepWhatsAppConfirm
        onBack={vi.fn()}
        onSubmit={vi.fn()}
        isSubmitting={true}
        apiError={null}
      />,
    )
    const button = screen.getByRole('button', { name: /procesando/i })
    expect(button).toHaveProperty('disabled', true)
  })

  it('llama a onBack al clickear "Volver"', async () => {
    const user = userEvent.setup()
    const onBack = vi.fn()
    render(
      <StepWhatsAppConfirm
        onBack={onBack}
        onSubmit={vi.fn()}
        isSubmitting={false}
        apiError={null}
      />,
    )
    await user.click(screen.getByRole('button', { name: /volver/i }))
    expect(onBack).toHaveBeenCalledOnce()
  })

  it('no renderiza ningún selector de método de pago con tarjeta', () => {
    render(
      <StepWhatsAppConfirm
        onBack={vi.fn()}
        onSubmit={vi.fn()}
        isSubmitting={false}
        apiError={null}
      />,
    )
    expect(screen.queryByText(/tarjeta/i)).toBeNull()
    expect(screen.queryByText(/débito/i)).toBeNull()
    expect(screen.queryByText(/crédito/i)).toBeNull()
    expect(screen.queryByText(/transferencia/i)).toBeNull()
  })
})
