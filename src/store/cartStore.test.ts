import { describe, it, expect, beforeEach } from 'vitest'
import { useCartStore } from './cartStore'

describe('cartStore', () => {
  beforeEach(() => {
    useCartStore.setState({ items: [], isOpen: false })
  })

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

  it('addItem agrega un producto nuevo con quantity 1', () => {
    useCartStore.getState().addItem(mockProduct)
    const { items } = useCartStore.getState()
    expect(items).toHaveLength(1)
    expect(items[0].quantity).toBe(1)
    expect(items[0].product.id).toBe('product-1')
  })

  it('addItem con el mismo id incrementa quantity en 1', () => {
    useCartStore.getState().addItem(mockProduct)
    useCartStore.getState().addItem(mockProduct)
    const { items } = useCartStore.getState()
    expect(items).toHaveLength(1)
    expect(items[0].quantity).toBe(2)
  })

  it('removeItem elimina el item del carrito', () => {
    useCartStore.getState().addItem(mockProduct)
    useCartStore.getState().removeItem('product-1')
    expect(useCartStore.getState().items).toHaveLength(0)
  })

  it('updateQuantity actualiza la cantidad del item', () => {
    useCartStore.getState().addItem(mockProduct)
    useCartStore.getState().updateQuantity('product-1', 5)
    expect(useCartStore.getState().items[0].quantity).toBe(5)
  })

  it('clear vacía el carrito completamente', () => {
    useCartStore.getState().addItem(mockProduct)
    useCartStore.getState().clear()
    expect(useCartStore.getState().items).toHaveLength(0)
  })

  it('total calcula la suma correcta', () => {
    useCartStore.getState().addItem(mockProduct)
    useCartStore.getState().addItem(mockProduct)
    expect(useCartStore.getState().total).toBe(15000)
  })

  it('itemCount cuenta la cantidad total de unidades', () => {
    useCartStore.getState().addItem(mockProduct)
    useCartStore.getState().updateQuantity('product-1', 3)
    expect(useCartStore.getState().itemCount).toBe(3)
  })

  it('toggleDrawer alterna isOpen', () => {
    expect(useCartStore.getState().isOpen).toBe(false)
    useCartStore.getState().toggleDrawer()
    expect(useCartStore.getState().isOpen).toBe(true)
    useCartStore.getState().toggleDrawer()
    expect(useCartStore.getState().isOpen).toBe(false)
  })
})
