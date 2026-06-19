'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'

// ── Schemas ──────────────────────────────────────────────────────────────────
const customerDataSchema = z.object({
  name: z.string().min(1, 'Ingresá tu nombre'),
  lastName: z.string().min(1, 'Ingresá tu apellido'),
  phone: z.string().min(8, 'Teléfono inválido'),
  email: z.string().email('Email inválido'),
  subscribeToNewsletter: z.boolean().optional(),
})

const shippingSchema = z.object({
  street: z.string().min(1, 'La calle es requerida'),
  city: z.string().min(1, 'La ciudad es requerida'),
  province: z.string().min(1, 'La provincia es requerida'),
  zip: z.string().min(1, 'El CP es requerido'),
  shippingMethod: z.enum(['domicilio', 'retiro']),
})

type CustomerDataForm = z.infer<typeof customerDataSchema>
type ShippingForm = z.infer<typeof shippingSchema>

// ── Progress indicator ────────────────────────────────────────────────────────
function ProgressBar({ step }: { step: 1 | 2 | 3 }) {
  const labels = ['Datos', 'Envío', 'Pago']
  return (
    <div className="flex items-center justify-center gap-2 py-4">
      {labels.map((label, i) => {
        const s = i + 1
        const isDone = s < step
        const isOn = s === step
        return (
          <div key={label} className="flex items-center gap-2">
            <div className="flex flex-col items-center gap-1">
              <div
                className="w-[22px] h-[22px] rounded-full flex items-center justify-center text-[10px] font-semibold transition-all"
                style={{
                  background: isDone ? 'var(--exito)' : isOn ? 'var(--taupe)' : 'var(--beige)',
                  color: isDone || isOn ? '#fff' : 'var(--tx-faint)',
                  border: `1.5px solid ${isDone ? 'var(--exito)' : isOn ? 'var(--taupe)' : 'var(--line)'}`,
                }}
              >
                {isDone ? (
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                    <path d="M5 13l4 4L19 7" strokeLinecap="round" />
                  </svg>
                ) : s}
              </div>
              <span className="text-[9px] font-medium tracking-[.06em]" style={{ color: isOn ? 'var(--taupe)' : 'var(--tx-faint)' }}>
                {label}
              </span>
            </div>
            {i < labels.length - 1 && (
              <div
                className="w-10 h-[2px] mb-4 rounded-full transition-all"
                style={{ background: s < step ? 'var(--taupe)' : 'var(--line)' }}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── Mini resumen ──────────────────────────────────────────────────────────────
function OrderSummary() {
  const items = useCartStore((s) => s.items)
  const total = useCartStore((s) => s.total)
  const shipping = total > 60000 ? 0 : 4500
  return (
    <div className="rounded-[14px] p-4 mb-4" style={{ background: 'var(--marfil)' }}>
      <p className="text-[10px] tracking-[.16em] uppercase font-semibold mb-3" style={{ color: 'var(--tx-faint)' }}>
        Resumen del pedido
      </p>
      {items.map(({ product, quantity }) => (
        <div key={product.id} className="flex justify-between text-[12.5px] mb-1.5">
          <span style={{ color: 'var(--tx-soft)' }}>{product.name} × {quantity}</span>
          <span>${(product.price * quantity).toLocaleString('es-AR')}</span>
        </div>
      ))}
      <div style={{ height: 1, background: 'var(--line-soft)', margin: '10px 0' }} />
      <div className="flex justify-between text-[12.5px] mb-1.5">
        <span style={{ color: 'var(--tx-soft)' }}>Envío</span>
        <span style={{ color: shipping === 0 ? 'var(--exito)' : 'var(--tx)' }}>
          {shipping === 0 ? 'Gratis' : `$${shipping.toLocaleString('es-AR')}`}
        </span>
      </div>
      <div className="flex justify-between font-semibold mt-2" style={{ fontSize: 15, color: 'var(--marron)' }}>
        <span>Total</span>
        <span>${(total + shipping).toLocaleString('es-AR')}</span>
      </div>
    </div>
  )
}

// ── Step 1: Datos ─────────────────────────────────────────────────────────────
function StepCustomerData({ onNext }: { onNext: (data: CustomerDataForm) => void }) {
  const { register, handleSubmit, formState: { errors } } = useForm<CustomerDataForm>({
    resolver: zodResolver(customerDataSchema),
  })

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <FieldWrapper id="name" label="Nombre" error={errors.name?.message}>
          <input type="text" placeholder="María" {...register('name')} />
        </FieldWrapper>
        <FieldWrapper id="lastName" label="Apellido" error={errors.lastName?.message}>
          <input type="text" placeholder="González" {...register('lastName')} />
        </FieldWrapper>
      </div>
      <FieldWrapper id="phone" label="Teléfono" error={errors.phone?.message}>
        <input type="tel" placeholder="11 2345 6789" {...register('phone')} />
      </FieldWrapper>
      <FieldWrapper id="email" label="Email" error={errors.email?.message}>
        <input type="email" placeholder="maria@gmail.com" {...register('email')} />
      </FieldWrapper>
      <label className="flex items-start gap-2.5 text-[11.5px] cursor-pointer" style={{ color: 'var(--tx-soft)' }}>
        <input type="checkbox" {...register('subscribeToNewsletter')} style={{ accentColor: 'var(--taupe)', marginTop: 1 }} />
        Quiero recibir novedades y ofertas de RENUEVO
      </label>
      <PrimaryButton type="submit">Continuar</PrimaryButton>
    </form>
  )
}

// ── Step 2: Envío ─────────────────────────────────────────────────────────────
function StepShipping({ onNext, onBack }: { onNext: (data: ShippingForm) => void, onBack: () => void }) {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<ShippingForm>({
    resolver: zodResolver(shippingSchema),
    defaultValues: { shippingMethod: 'domicilio' },
  })
  const method = watch('shippingMethod')

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-3">
      <FieldWrapper id="street" label="Calle y número" error={errors.street?.message}>
        <input type="text" placeholder="Av. Corrientes 1234" {...register('street')} />
      </FieldWrapper>
      <div className="grid grid-cols-2 gap-3">
        <FieldWrapper id="city" label="Ciudad" error={errors.city?.message}>
          <input type="text" placeholder="Buenos Aires" {...register('city')} />
        </FieldWrapper>
        <FieldWrapper id="zip" label="Código postal" error={errors.zip?.message}>
          <input type="text" placeholder="1000" {...register('zip')} />
        </FieldWrapper>
      </div>
      <FieldWrapper id="province" label="Provincia" error={errors.province?.message}>
        <input type="text" placeholder="Buenos Aires" {...register('province')} />
      </FieldWrapper>

      <div className="pt-1">
        <p className="text-[11px] font-medium mb-2.5" style={{ color: 'var(--tx-soft)' }}>
          Método de envío
        </p>
        {[
          { id: 'domicilio' as const, label: 'Envío a domicilio', sub: '2 a 5 días hábiles', price: 4500 },
          { id: 'retiro' as const, label: 'Retiro en sucursal', sub: '3 a 7 días hábiles', price: 0 },
        ].map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => setValue('shippingMethod', o.id)}
            className="w-full flex items-center gap-3 p-3.5 rounded-[12px] mb-2.5 text-left transition-all"
            style={{
              border: `1.5px solid ${method === o.id ? 'var(--taupe)' : 'var(--line)'}`,
              background: method === o.id ? 'var(--beige)' : '#fff',
            }}
          >
            <span
              className="w-[18px] h-[18px] rounded-full flex items-center justify-center flex-shrink-0"
              style={{ border: `2px solid ${method === o.id ? 'var(--taupe)' : 'var(--line)'}` }}
            >
              {method === o.id && (
                <span className="w-2 h-2 rounded-full" style={{ background: 'var(--taupe)' }} />
              )}
            </span>
            <span className="flex-1">
              <span className="block text-[13px] font-medium" style={{ color: 'var(--tx)' }}>{o.label}</span>
              <span className="block text-[11px]" style={{ color: 'var(--tx-soft)' }}>{o.sub}</span>
            </span>
            <span className="text-[13px] font-semibold" style={{ color: o.price === 0 ? 'var(--exito)' : 'var(--marron)' }}>
              {o.price === 0 ? 'Gratis' : `$${o.price.toLocaleString('es-AR')}`}
            </span>
          </button>
        ))}
      </div>

      <PrimaryButton type="submit">Continuar</PrimaryButton>
      <GhostButton type="button" onClick={onBack}>Volver</GhostButton>
    </form>
  )
}

// ── Step 3: Pago ──────────────────────────────────────────────────────────────
function StepPayment({
  onBack,
  onSubmit: handleOrder,
  isSubmitting,
  apiError,
}: {
  onBack: () => void
  onSubmit: (paymentMethod: string) => Promise<void>
  isSubmitting: boolean
  apiError: string | null
}) {
  const [paymentMethod, setPaymentMethod] = useState('credito')

  const methods = [
    { id: 'credito', label: 'Tarjeta de crédito', sub: 'Visa, Mastercard, American Express', badge: 'Mobbex' },
    { id: 'debito', label: 'Tarjeta de débito', sub: 'Débito inmediato', badge: 'Mobbex' },
    { id: 'transfer', label: 'Transferencia bancaria', sub: 'Generá tu talón de pago', badge: 'Talo' },
  ]

  return (
    <div className="space-y-3">
      <p className="text-[18px] font-semibold mb-1" style={{ fontFamily: 'var(--font-head)', color: 'var(--marron)' }}>
        Elegí tu método de pago
      </p>

      {methods.map((m) => (
        <button
          key={m.id}
          type="button"
          onClick={() => setPaymentMethod(m.id)}
          className="w-full flex items-center gap-3 p-3.5 rounded-[12px] text-left transition-all"
          style={{
            border: `1.5px solid ${paymentMethod === m.id ? 'var(--taupe)' : 'var(--line)'}`,
            background: paymentMethod === m.id ? 'var(--beige)' : '#fff',
          }}
        >
          <span
            className="w-[18px] h-[18px] rounded-full flex items-center justify-center flex-shrink-0"
            style={{ border: `2px solid ${paymentMethod === m.id ? 'var(--taupe)' : 'var(--line)'}` }}
          >
            {paymentMethod === m.id && (
              <span className="w-2 h-2 rounded-full" style={{ background: 'var(--taupe)' }} />
            )}
          </span>
          <span className="flex-1">
            <span className="block text-[13px] font-medium" style={{ color: 'var(--tx)' }}>{m.label}</span>
            <span className="block text-[11px]" style={{ color: 'var(--tx-soft)' }}>{m.sub}</span>
          </span>
          <span
            className="text-[8.5px] font-semibold tracking-[.06em] uppercase px-1.5 py-0.5 rounded-[6px]"
            style={{ color: 'var(--gris-taupe)', border: '1px solid var(--line)' }}
          >
            {m.badge}
          </span>
        </button>
      ))}

      {/* En desktop el resumen está en la sidebar — aquí solo mobile */}
      <div className="md:hidden">
        <OrderSummary />
      </div>

      {apiError && (
        <p className="text-[12px] px-3 py-2 rounded-[10px]" style={{ color: 'var(--error)', background: 'rgba(185,99,99,.08)' }}>
          {apiError}
        </p>
      )}

      <PrimaryButton type="button" onClick={() => handleOrder(paymentMethod)} disabled={isSubmitting}>
        {isSubmitting ? 'Procesando...' : 'Pagar ahora'}
      </PrimaryButton>
      <div className="flex items-center justify-center gap-1.5 text-[11px]" style={{ color: 'var(--tx-faint)' }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <rect x="3" y="11" width="18" height="11" rx="2" />
          <path d="M7 11V7a5 5 0 0110 0v4" strokeLinecap="round" />
        </svg>
        Pago seguro · tus datos están protegidos
      </div>
      <GhostButton type="button" onClick={onBack}>Volver</GhostButton>
    </div>
  )
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function FieldWrapper({ id, label, error, children }: { id: string, label: string, error?: string, children: React.ReactElement }) {
  return (
    <div>
      <label htmlFor={id} className="block text-[11px] font-medium mb-1.5" style={{ color: 'var(--tx-soft)' }}>{label}</label>
      {React.cloneElement(children, {
        id,
        className: 'w-full rounded-[10px] px-3 py-3 text-[13px] outline-none transition-all',
        style: {
          border: `1px solid ${error ? 'var(--error)' : 'var(--line)'}`,
          background: '#fff',
          color: 'var(--tx)',
          boxShadow: error ? '0 0 0 3px rgba(185,99,99,.12)' : undefined,
        },
      } as React.HTMLAttributes<HTMLInputElement>)}
      {error && <p role="alert" className="text-[10px] mt-1" style={{ color: 'var(--error)' }}>{error}</p>}
    </div>
  )
}

function PrimaryButton({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className="w-full py-4 rounded-[10px] text-[12.5px] font-semibold tracking-[.12em] uppercase text-white transition-opacity hover:opacity-90 disabled:opacity-60"
      style={{ background: 'var(--taupe)' }}
    >
      {children}
    </button>
  )
}

function GhostButton({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className="w-full py-4 rounded-[10px] text-[12.5px] font-semibold tracking-[.1em] uppercase transition-colors"
      style={{ border: '1px solid var(--line)', color: 'var(--marron)', background: 'transparent' }}
    >
      {children}
    </button>
  )
}

import React from 'react'

// ── Main page ─────────────────────────────────────────────────────────────────
export default function CheckoutPage() {
  const router = useRouter()
  const items = useCartStore((s) => s.items)
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [customerData, setCustomerData] = useState<CustomerDataForm | null>(null)
  const [shippingData, setShippingData] = useState<ShippingForm | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  useEffect(() => {
    if (items.length === 0) {
      router.push('/')
    }
  }, [items.length, router])

  if (items.length === 0) return null

  async function handleOrder(paymentMethod: string) {
    if (!customerData || !shippingData) return
    setIsSubmitting(true)
    setApiError(null)

    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'
    const tenantSlug = process.env.NEXT_PUBLIC_TENANT_SLUG ?? ''

    const body = {
      tenantSlug,
      customer: {
        name: `${customerData.name} ${customerData.lastName}`,
        email: customerData.email,
        phone: customerData.phone,
      },
      shippingAddress: {
        street: shippingData.street,
        city: shippingData.city,
        province: shippingData.province,
        zip: shippingData.zip,
      },
      items: items.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
      paymentMethod,
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
    } finally {
      setIsSubmitting(false)
    }
  }

  const stepTitles = ['Datos personales', 'Envío', 'Método de pago']

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header + progress (full width) */}
      <div className="max-w-lg md:max-w-none">
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={() => step > 1 ? setStep((s) => (s - 1) as 1 | 2 | 3) : router.push('/')}
            className="w-9 h-9 flex items-center justify-center rounded-[10px] hover:bg-beige transition-colors text-marron"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
              <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <h1
            style={{ fontFamily: 'var(--font-head)', fontSize: 20, color: 'var(--marron)', fontWeight: 600 }}
          >
            {stepTitles[step - 1]}
          </h1>
        </div>
        <ProgressBar step={step} />
      </div>

      {/* Layout: mobile = stack, desktop = 2 cols */}
      <div className="md:grid md:grid-cols-[1fr_360px] md:gap-10 mt-6 items-start">
        {/* Columna izquierda: pasos del formulario */}
        <div className="max-w-lg md:max-w-none">
          {step === 1 && (
            <StepCustomerData
              onNext={(data) => {
                setCustomerData(data)
                setStep(2)
              }}
            />
          )}
          {step === 2 && (
            <StepShipping
              onNext={(data) => {
                setShippingData(data)
                setStep(3)
              }}
              onBack={() => setStep(1)}
            />
          )}
          {step === 3 && (
            <StepPayment
              onBack={() => setStep(2)}
              onSubmit={handleOrder}
              isSubmitting={isSubmitting}
              apiError={apiError}
            />
          )}
        </div>

        {/* Columna derecha: resumen sticky (solo desktop) */}
        <div className="hidden md:block">
          <div className="sticky top-[88px]">
            <p
              className="text-[11px] tracking-[.16em] uppercase font-semibold mb-3"
              style={{ color: 'var(--tx-faint)' }}
            >
              Tu pedido
            </p>
            <OrderSummary />
          </div>
        </div>
      </div>
    </div>
  )
}
