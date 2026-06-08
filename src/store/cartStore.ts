import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { PublicProduct } from '@/types/product'

export interface CartItem {
  product: PublicProduct
  quantity: number
}

interface CartState {
  items: CartItem[]
  isOpen: boolean
  total: number
  itemCount: number
  addItem: (product: PublicProduct) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clear: () => void
  toggleDrawer: () => void
}

function computeDerived(items: CartItem[]) {
  return {
    total: items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
  }
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      total: 0,
      itemCount: 0,

      addItem(product: PublicProduct) {
        set((state) => {
          const existing = state.items.find((i) => i.product.id === product.id)
          const items = existing
            ? state.items.map((i) =>
                i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i,
              )
            : [...state.items, { product, quantity: 1 }]
          return { items, ...computeDerived(items) }
        })
      },

      removeItem(productId: string) {
        set((state) => {
          const items = state.items.filter((i) => i.product.id !== productId)
          return { items, ...computeDerived(items) }
        })
      },

      updateQuantity(productId: string, quantity: number) {
        set((state) => {
          const items = state.items.map((i) =>
            i.product.id === productId ? { ...i, quantity } : i,
          )
          return { items, ...computeDerived(items) }
        })
      },

      clear() {
        set({ items: [], total: 0, itemCount: 0 })
      },

      toggleDrawer() {
        set((state) => ({ isOpen: !state.isOpen }))
      },
    }),
    { name: 'renuevo-cart' },
  ),
)
