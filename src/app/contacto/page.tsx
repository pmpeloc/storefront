'use client'

import { useState } from 'react'
import type { Metadata } from 'next'

// TODO: contact-form - conectar formulario a Resend (o endpoint propio) cuando esté disponible — ver TECHNICAL_DEBT.md

const CHANNELS = [
  {
    id: 'whatsapp',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.557 4.118 1.526 5.849L.073 23.552a.5.5 0 00.625.601l5.835-1.527A11.942 11.942 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.888 0-3.65-.524-5.151-1.433l-.369-.221-3.821.999 1.018-3.72-.24-.383A9.96 9.96 0 012 12c0-5.514 4.486-10 10-10s10 4.486 10 10-4.486 10-10 10z" />
      </svg>
    ),
    label: 'WhatsApp',
    sub: 'Respondemos en menos de 1 hora',
    action: 'Abrir WhatsApp',
    href: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER
      ? `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`
      : '#',
  },
  {
    id: 'email',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}>
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" strokeLinecap="round" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
    label: 'Email',
    sub: 'hola@renuevohogar.com',
    action: 'Enviar email',
    href: 'mailto:hola@renuevohogar.com',
  },
  {
    id: 'instagram',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}>
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.5" y2="6.5" strokeWidth={2} strokeLinecap="round" />
      </svg>
    ),
    label: 'Instagram',
    sub: '@renuevoalmohadones',
    action: 'Ir a Instagram',
    href: 'https://instagram.com/renuevoalmohadones',
  },
]

export default function ContactoPage() {
  const [form, setForm] = useState({ nombre: '', email: '', mensaje: '' })
  const [sent, setSent] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // TODO: contact-form - enviar a endpoint /api/contact cuando esté disponible
    setSent(true)
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <p className="text-[10px] tracking-[.22em] uppercase font-semibold mb-2" style={{ color: 'var(--taupe)' }}>
          Estamos aquí para ayudarte
        </p>
        <h1
          style={{ fontFamily: 'var(--font-head)', fontSize: 'clamp(26px,4vw,36px)', color: 'var(--marron)', fontWeight: 600 }}
        >
          Contacto
        </h1>
      </div>

      {/* Canales */}
      <div className="grid sm:grid-cols-3 gap-3 mb-10">
        {CHANNELS.map((c) => (
          <a
            key={c.id}
            href={c.href}
            target={c.id !== 'email' ? '_blank' : undefined}
            rel="noopener noreferrer"
            className="flex flex-col items-center text-center p-5 rounded-[14px] transition-all hover:shadow-card"
            style={{ background: '#fff', border: '1px solid var(--line-soft)' }}
          >
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center mb-3"
              style={{ background: 'var(--beige)', color: 'var(--marron)' }}
            >
              {c.icon}
            </div>
            <p className="text-[13px] font-semibold mb-0.5" style={{ color: 'var(--tx)' }}>{c.label}</p>
            <p className="text-[11px] mb-3" style={{ color: 'var(--tx-soft)' }}>{c.sub}</p>
            <span
              className="text-[11px] font-semibold tracking-[.08em] uppercase px-3 py-1.5 rounded-[8px]"
              style={{ background: 'var(--beige)', color: 'var(--marron)' }}
            >
              {c.action}
            </span>
          </a>
        ))}
      </div>

      {/* Formulario */}
      <div className="rounded-[18px] p-6" style={{ background: 'var(--marfil)' }}>
        <h2
          className="mb-4"
          style={{ fontFamily: 'var(--font-head)', fontSize: 20, color: 'var(--marron)', fontWeight: 600 }}
        >
          Enviarnos un mensaje
        </h2>

        {sent ? (
          <div className="text-center py-6">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 text-white"
              style={{ background: 'var(--exito)' }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <path d="M5 13l4 4L19 7" strokeLinecap="round" />
              </svg>
            </div>
            <p style={{ fontFamily: 'var(--font-head)', fontSize: 18, color: 'var(--marron)' }}>¡Mensaje enviado!</p>
            <p className="text-[12px] mt-1" style={{ color: 'var(--tx-soft)' }}>Te respondemos a la brevedad.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="Nombre">
                <input
                  required
                  type="text"
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  placeholder="Tu nombre"
                />
              </Field>
              <Field label="Email">
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="tu@email.com"
                />
              </Field>
            </div>
            <Field label="Mensaje">
              <textarea
                required
                rows={4}
                value={form.mensaje}
                onChange={(e) => setForm({ ...form, mensaje: e.target.value })}
                placeholder="¿En qué te podemos ayudar?"
                style={{ resize: 'none' }}
              />
            </Field>
            <button
              type="submit"
              className="w-full py-4 rounded-[10px] text-[12.5px] font-semibold tracking-[.1em] uppercase text-white transition-opacity hover:opacity-90 mt-2"
              style={{ background: 'var(--taupe)' }}
            >
              Enviar mensaje
            </button>
          </form>
        )}
      </div>

      {/* Showroom / dirección — solo desktop */}
      <div className="hidden md:block mt-8 rounded-[18px] overflow-hidden" style={{ border: '1px solid var(--line-soft)' }}>
        <div
          className="h-48"
          style={{ background: 'linear-gradient(135deg, var(--beige), var(--arena))' }}
        />
        <div className="p-5" style={{ background: 'var(--marfil)' }}>
          <p className="text-[10px] tracking-[.16em] uppercase font-semibold mb-1" style={{ color: 'var(--tx-faint)' }}>
            Showroom
          </p>
          <p className="text-[14px] font-medium" style={{ fontFamily: 'var(--font-head)', color: 'var(--marron)' }}>
            Buenos Aires, Argentina
          </p>
          <p className="text-[12.5px] mt-1" style={{ color: 'var(--tx-soft)' }}>
            Visitas con turno previo · escribinos por WhatsApp para coordinar.
          </p>
        </div>
      </div>
    </main>
  )
}

function Field({ label, children }: { label: string, children: React.ReactElement }) {
  return (
    <div>
      <label className="block text-[11px] font-medium mb-1.5" style={{ color: 'var(--tx-soft)' }}>{label}</label>
      {React.cloneElement(children, {
        className: 'w-full rounded-[10px] px-3 py-3 text-[13px] outline-none',
        style: { border: '1px solid var(--line)', background: '#fff', color: 'var(--tx)' },
      } as React.HTMLAttributes<HTMLInputElement>)}
    </div>
  )
}

import React from 'react'
