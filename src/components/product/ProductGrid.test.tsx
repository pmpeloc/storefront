import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import useSWR from 'swr'
import { ProductGrid } from './ProductGrid'
import type { PublicProduct } from '@/types/product'

vi.mock('swr', () => ({ default: vi.fn() }))

vi.mock('@/components/product/ProductCard', () => ({
  ProductCard: ({ product }: { product: PublicProduct }) => (
    <div data-testid="product-card">{product.name}</div>
  ),
}))

vi.mock('@/components/ui/Skeleton', () => ({
  ProductCardSkeleton: () => <div data-testid="skeleton" />,
  Skeleton: () => <div />,
}))

const mockUseSWR = vi.mocked(useSWR)

const makeProduct = (id: string, name: string): PublicProduct => ({
  id,
  name,
  description: null,
  price: 10000,
  image_url: null,
  slug: id,
  category: null,
  stock: 1,
  is_featured: false,
  seo_title: name,
  seo_description: null,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
})

const initialProducts = [makeProduct('p1', 'Producto Uno'), makeProduct('p2', 'Producto Dos')]
const categories = ['Almohadas', 'Cojines']

describe('ProductGrid', () => {
  beforeEach(() => {
    mockUseSWR.mockReturnValue({ data: undefined, isLoading: false } as any)
  })

  it('muestra los productos iniciales cuando no hay categoría seleccionada', () => {
    render(<ProductGrid initialProducts={initialProducts} categories={categories} />)
    expect(screen.getByText('Producto Uno')).toBeTruthy()
    expect(screen.getByText('Producto Dos')).toBeTruthy()
  })

  it('renderiza el botón Todos y los botones de categoría', () => {
    render(<ProductGrid initialProducts={initialProducts} categories={categories} />)
    expect(screen.getAllByText('Todos').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Almohadas').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Cojines').length).toBeGreaterThan(0)
  })

  it('no renderiza los filtros cuando categories está vacío', () => {
    render(<ProductGrid initialProducts={initialProducts} categories={[]} />)
    expect(screen.queryByText('Todos')).toBeNull()
  })

  it('muestra skeletons mientras SWR carga datos', async () => {
    mockUseSWR.mockImplementation((key) => ({
      data: undefined,
      isLoading: key !== null,
    } as any))
    const user = userEvent.setup()
    render(<ProductGrid initialProducts={initialProducts} categories={categories} />)

    expect(screen.queryByTestId('skeleton')).toBeNull()

    await user.click(screen.getAllByText('Almohadas')[0])

    expect(screen.getAllByTestId('skeleton').length).toBeGreaterThan(0)
  })

  it('muestra los productos que devuelve SWR al seleccionar una categoría', async () => {
    const swrProduct = makeProduct('swr-1', 'Producto Filtrado')
    mockUseSWR.mockReturnValue({
      data: { products: [swrProduct], total: 1 },
      isLoading: false,
    } as any)
    const user = userEvent.setup()
    render(<ProductGrid initialProducts={initialProducts} categories={categories} />)

    await user.click(screen.getAllByText('Almohadas')[0])

    expect(screen.getByText('Producto Filtrado')).toBeTruthy()
    expect(screen.queryByText('Producto Uno')).toBeNull()
  })

  it('muestra el mensaje vacío cuando SWR no retorna productos para la categoría', async () => {
    const user = userEvent.setup()
    render(<ProductGrid initialProducts={initialProducts} categories={categories} />)

    await user.click(screen.getAllByText('Almohadas')[0])

    expect(screen.getByText('Sin resultados')).toBeTruthy()
  })

  it('vuelve a mostrar los productos iniciales al hacer click en Todos', async () => {
    const user = userEvent.setup()
    render(<ProductGrid initialProducts={initialProducts} categories={categories} />)

    await user.click(screen.getAllByText('Almohadas')[0])
    await user.click(screen.getAllByText('Todos')[0])

    expect(screen.getByText('Producto Uno')).toBeTruthy()
    expect(screen.getByText('Producto Dos')).toBeTruthy()
  })
})
