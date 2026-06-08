'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'

const checkoutSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(1, 'El teléfono es requerido'),
  street: z.string().min(1, 'La calle es requerida'),
  city: z.string().min(1, 'La ciudad es requerida'),
  province: z.string().min(1, 'La provincia es requerida'),
  zip: z.string().min(1, 'El código postal es requerido'),
})

type CheckoutFormData = z.infer<typeof checkoutSchema>

export default function CheckoutPage() {
  const router = useRouter()
  const items = useCartStore((s) => s.items)
  const total = useCartStore((s) => s.total)
  const [apiError, setApiError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormData>({ resolver: zodResolver(checkoutSchema) })

  if (items.length === 0) {
    router.push('/')
    return null
  }

  async function onSubmit(data: CheckoutFormData) {
    setApiError(null)
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'
    const tenantSlug = process.env.TENANT_SLUG ?? ''

    const body = {
      tenantSlug,
      customer: { name: data.name, email: data.email, phone: data.phone },
      shippingAddress: { street: data.street, city: data.city, province: data.province, zip: data.zip },
      items: items.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
    }

    try {
      const res = await fetch(`${apiUrl}/api/v1/public/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const json = await res.json()

      if (!res.ok) {
        setApiError(json?.error?.message ?? 'Ocurrió un error al procesar tu pedido.')
        return
      }

      window.location.href = json.checkoutUrl
    } catch {
      setApiError('No se pudo conectar con el servidor. Intentá de nuevo.')
    }
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-stone-900 mb-6">Finalizar compra</h1>

      {/* Resumen */}
      <div className="bg-stone-50 rounded-xl p-4 mb-6 space-y-1">
        {items.map(({ product, quantity }) => (
          <div key={product.id} className="flex justify-between text-sm text-stone-700">
            <span>{product.name} × {quantity}</span>
            <span>${(product.price * quantity).toLocaleString('es-AR')}</span>
          </div>
        ))}
        <div className="flex justify-between font-bold text-stone-900 pt-2 border-t border-stone-200 mt-2">
          <span>Total</span>
          <span>${total.toLocaleString('es-AR')}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <fieldset className="space-y-4">
          <legend className="text-sm font-semibold text-stone-700 mb-2">Datos de contacto</legend>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-stone-700 mb-1">
              Nombre completo
            </label>
            <input
              id="name"
              type="text"
              aria-label="nombre completo"
              {...register('name')}
              className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            />
            {errors.name && <p role="alert" className="text-xs text-red-600 mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              aria-label="email"
              {...register('email')}
              className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            />
            {errors.email && <p role="alert" className="text-xs text-red-600 mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-stone-700 mb-1">
              Teléfono
            </label>
            <input
              id="phone"
              type="tel"
              aria-label="teléfono"
              {...register('phone')}
              className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            />
            {errors.phone && <p role="alert" className="text-xs text-red-600 mt-1">{errors.phone.message}</p>}
          </div>
        </fieldset>

        <fieldset className="space-y-4">
          <legend className="text-sm font-semibold text-stone-700 mb-2">Dirección de envío</legend>

          <div>
            <label htmlFor="street" className="block text-sm font-medium text-stone-700 mb-1">
              Calle y número
            </label>
            <input
              id="street"
              type="text"
              aria-label="calle"
              {...register('street')}
              className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            />
            {errors.street && <p role="alert" className="text-xs text-red-600 mt-1">{errors.street.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-stone-700 mb-1">
                Ciudad
              </label>
              <input
                id="city"
                type="text"
                aria-label="ciudad"
                {...register('city')}
                className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
              />
              {errors.city && <p role="alert" className="text-xs text-red-600 mt-1">{errors.city.message}</p>}
            </div>

            <div>
              <label htmlFor="province" className="block text-sm font-medium text-stone-700 mb-1">
                Provincia
              </label>
              <input
                id="province"
                type="text"
                aria-label="provincia"
                {...register('province')}
                className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
              />
              {errors.province && <p role="alert" className="text-xs text-red-600 mt-1">{errors.province.message}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="zip" className="block text-sm font-medium text-stone-700 mb-1">
              Código postal
            </label>
            <input
              id="zip"
              type="text"
              aria-label="código postal"
              {...register('zip')}
              className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            />
            {errors.zip && <p role="alert" className="text-xs text-red-600 mt-1">{errors.zip.message}</p>}
          </div>
        </fieldset>

        {apiError && (
          <p role="alert" className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
            {apiError}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-brand text-white py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-60"
        >
          {isSubmitting ? 'Procesando...' : 'Confirmar pedido'}
        </button>
      </form>
    </div>
  )
}
