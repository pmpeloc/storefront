'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface FavoritesState {
  ids: string[]
  isFavorite: (id: string) => boolean
  toggleFavorite: (id: string) => void
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      ids: [],

      isFavorite(id: string) {
        return get().ids.includes(id)
      },

      toggleFavorite(id: string) {
        set((state) => {
          const already = state.ids.includes(id)
          return {
            ids: already ? state.ids.filter((x) => x !== id) : [...state.ids, id],
          }
        })
      },
    }),
    { name: 'renuevo-favorites' },
  ),
)
