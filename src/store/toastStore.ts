'use client'

import { create } from 'zustand'

export interface Toast {
  id: string
  message: string
  kind: 'default' | 'ok' | 'error'
}

interface ToastState {
  toasts: Toast[]
  addToast: (message: string, kind?: Toast['kind']) => void
  removeToast: (id: string) => void
}

export const useToastStore = create<ToastState>()((set) => ({
  toasts: [],

  addToast(message: string, kind: Toast['kind'] = 'default') {
    const id = Math.random().toString(36).slice(2)
    set((state) => ({ toasts: [...state.toasts, { id, message, kind }] }))
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }))
    }, 3000)
  },

  removeToast(id: string) {
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }))
  },
}))
