'use client'

import { useState } from 'react'
import { useTenantConfig } from '@/components/providers/TenantConfigProvider'

// TODO: contact-form - conectar formulario a Resend (o endpoint propio) cuando esté disponible — ver TECHNICAL_DEBT.md

function buildChannels(whatsappNumber: string | null) {
  return [
  {
    id: 'whatsapp',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.557 4.118 1.526 5.849L.073 23.552a.5.5 0 00.625.601l5.835-1.527A11.942 11.942 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.888 0-3.65-.524-5.151-1.433l-.369-.221-3.821.999 1.018-3.72-.24-.383A9.96 9.96 0 012 12c0-5.514 4.486-10 10-10s10 4.486 10 10-4.486 10-10 10z" />
      </svg>
    ),
    label: 'WhatsApp',
    sub: '11 2345 6789',
    color: 'var(--exito)',
    href: whatsappNumber ? `https://wa.me/${whatsappNumber}` : '#',
  },
  {
    id: 'instagram',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}>
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.5" y2="6.5" strokeWidth={2} strokeLinecap="round" />
      </svg>
    ),
    label: 'Instagram',
    sub: '@renuevo.home',
    color: 'var(--marron)',
    href: 'https://instagram.com/renuevoalmohadones',
  },
  {
    id: 'email',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}>
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" strokeLinecap="round" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
    label: 'Email',
    sub: 'hola@renuevo.com.ar',
    color: 'var(--marron)',
    href: 'mailto:hola@renuevo.com.ar',
  },
  ]
}

export default function ContactPage() {
  const tenantConfig = useTenantConfig()
  const channels = buildChannels(tenantConfig.whatsapp_number)
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSent(true)
  }

  return (
    <main>
      {/* Header centrado */}
      <div className="text-center" style={{ padding: 'clamp(40px,5vw,56px) 24px 0' }}>
        <p className="text-[11px] tracking-[.24em] uppercase font-semibold" style={{ color: 'var(--taupe)' }}>
          Contacto
        </p>
        <h1
          style={{
            fontFamily: 'var(--font-head)',
            fontSize: 'clamp(26px,3vw,46px)',
            color: 'var(--marron)',
            fontWeight: 600,
            marginTop: 12,
          }}
        >
          Estamos para ayudarte
        </h1>
        <p className="text-[15px] mt-3 max-w-md mx-auto" style={{ color: 'var(--tx-soft)' }}>
          Escribinos por el canal que prefieras o dejanos tu mensaje.
        </p>
      </div>

      {/* Desktop: split 1fr / 1.2fr */}
      <div
        className="hidden md:grid"
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '48px 40px 90px',
          gridTemplateColumns: '1fr 1.2fr',
          gap: 54,
          alignItems: 'start',
        }}
      >
        {/* Columna izquierda: canales + showroom */}
        <div>
          {channels.map((c) => (
            <a
              key={c.id}
              href={c.href}
              target={c.id !== 'email' ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="flex items-center gap-4 transition-opacity hover:opacity-80"
              style={{ padding: '20px 0', borderBottom: '1px solid var(--line-soft)', cursor: 'pointer' }}
            >
              <div
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 14,
                  background: 'var(--beige)',
                  display: 'grid',
                  placeItems: 'center',
                  color: c.color,
                  flexShrink: 0,
                }}
              >
                {c.icon}
              </div>
              <div>
                <div className="text-[15px] font-medium" style={{ color: 'var(--marron)' }}>{c.label}</div>
                <div className="text-[12.5px] mt-0.5" style={{ color: 'var(--tx-soft)' }}>{c.sub}</div>
              </div>
            </a>
          ))}

          {/* Showroom */}
          <div className="mt-7 rounded-[16px] p-6" style={{ background: 'var(--marfil)' }}>
            <p className="text-[11px] tracking-[.22em] uppercase font-semibold" style={{ color: 'var(--taupe)' }}>
              Showroom
            </p>
            <p className="text-[14px] mt-3 leading-relaxed" style={{ color: 'var(--marron)' }}>
              Av. Santa Fe 1234, Palermo<br />
              CABA, Buenos Aires<br />
              <span className="text-[13px]" style={{ color: 'var(--tx-soft)' }}>Lun a Sáb · 10 a 19 hs</span>
            </p>
          </div>
        </div>

        {/* Columna derecha: formulario */}
        <div style={{ border: '1px solid var(--line)', borderRadius: 18, padding: 30 }}>
          <h3
            style={{
              fontFamily: 'var(--font-head)',
              fontSize: 24,
              color: 'var(--marron)',
              fontWeight: 600,
              marginTop: 0,
            }}
          >
            Envianos tu mensaje
          </h3>

          {sent ? (
            <div className="text-center py-8">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 text-white"
                style={{ background: 'var(--exito)' }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <path d="M5 13l4 4L19 7" strokeLinecap="round" />
                </svg>
              </div>
              <p style={{ fontFamily: 'var(--font-head)', fontSize: 18, color: 'var(--marron)' }}>¡Mensaje enviado!</p>
              <p className="text-[12.5px] mt-1" style={{ color: 'var(--tx-soft)' }}>Te respondemos a la brevedad.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ marginTop: 18 }}>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <Field label="Nombre">
                  <input required type="text" value={form.name} placeholder="Tu nombre"
                    onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </Field>
                <Field label="Email">
                  <input required type="email" value={form.email} placeholder="tu@email.com"
                    onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </Field>
              </div>
              <Field label="Asunto">
                <input type="text" value={form.subject} placeholder="¿En qué te ayudamos?"
                  onChange={(e) => setForm({ ...form, subject: e.target.value })} />
              </Field>
              <Field label="Mensaje">
                <textarea
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Escribí tu mensaje…"
                  style={{ resize: 'vertical' }}
                />
              </Field>
              <button
                type="submit"
                className="w-full mt-3 transition-opacity hover:opacity-90"
                style={{
                  padding: '16px 24px',
                  borderRadius: 11,
                  background: 'var(--taupe)',
                  color: '#fff',
                  fontFamily: 'var(--font-ui)',
                  fontWeight: 600,
                  fontSize: 13,
                  letterSpacing: '.1em',
                  textTransform: 'uppercase',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Enviar mensaje
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Mobile: lista de canales + formulario */}
      <div className="md:hidden px-[18px] py-8">
        <div style={{ marginTop: 8 }}>
          {channels.map((c) => (
            <a
              key={c.id}
              href={c.href}
              target={c.id !== 'email' ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="flex items-center justify-between"
              style={{ padding: '16px 0', borderBottom: '1px solid var(--line-soft)' }}
            >
              <div className="flex items-center gap-3">
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: 'var(--beige)',
                    display: 'grid',
                    placeItems: 'center',
                    color: c.color,
                    flexShrink: 0,
                  }}
                >
                  {c.icon}
                </div>
                <div>
                  <div className="text-[13px] font-medium" style={{ color: 'var(--tx)' }}>{c.label}</div>
                  <div className="text-[11px] mt-0.5" style={{ color: 'var(--tx-soft)' }}>{c.sub}</div>
                </div>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} style={{ color: 'var(--tx-faint)' }}>
                <path d="M9 18l6-6-6-6" strokeLinecap="round" />
              </svg>
            </a>
          ))}
        </div>

        {/* Formulario mobile */}
        <div className="mt-7 rounded-[16px] p-5" style={{ border: '1px solid var(--line)' }}>
          <h2
            style={{ fontFamily: 'var(--font-head)', fontSize: 20, color: 'var(--marron)', fontWeight: 600 }}
            className="mb-4"
          >
            Envianos un mensaje
          </h2>
          {sent ? (
            <div className="text-center py-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 text-white" style={{ background: 'var(--exito)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <path d="M5 13l4 4L19 7" strokeLinecap="round" />
                </svg>
              </div>
              <p style={{ fontFamily: 'var(--font-head)', fontSize: 16, color: 'var(--marron)' }}>¡Mensaje enviado!</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <Field label="Nombre">
                <input required type="text" value={form.name} placeholder="Tu nombre"
                  onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </Field>
              <Field label="Email">
                <input required type="email" value={form.email} placeholder="tu@email.com"
                  onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </Field>
              <Field label="Mensaje">
                <textarea required rows={4} value={form.message} placeholder="¿En qué te podemos ayudar?"
                  onChange={(e) => setForm({ ...form, message: e.target.value })} style={{ resize: 'none' }} />
              </Field>
              <button
                type="submit"
                className="w-full py-4 rounded-[10px] text-[12.5px] font-semibold tracking-[.1em] uppercase text-white transition-opacity hover:opacity-90 mt-1"
                style={{ background: 'var(--taupe)', border: 'none', cursor: 'pointer' }}
              >
                Enviar mensaje
              </button>
            </form>
          )}
        </div>

        {/* Showroom mobile */}
        <div className="mt-5 rounded-[16px] p-5" style={{ background: 'var(--marfil)' }}>
          <p className="text-[11px] tracking-[.2em] uppercase font-semibold" style={{ color: 'var(--taupe)' }}>
            Showroom
          </p>
          <p className="text-[13px] mt-2 leading-relaxed" style={{ color: 'var(--marron)' }}>
            Av. Santa Fe 1234, Palermo<br />
            CABA · <span style={{ color: 'var(--tx-soft)' }}>Lun a Sáb 10 a 19 hs</span>
          </p>
        </div>
      </div>
    </main>
  )
}

const fieldStyle = {
  className: 'w-full rounded-[10px] px-3 py-3 text-[13px] outline-none',
  style: { border: '1px solid var(--line)', background: '#fff', color: 'var(--tx)' },
}

function Field({ label, children }: { label: string; children: React.ReactElement }) {
  return (
    <div className="mb-3">
      <label className="block text-[11px] font-medium mb-1.5" style={{ color: 'var(--tx-soft)' }}>
        {label}
      </label>
      {React.cloneElement(children, fieldStyle)}
    </div>
  )
}

import React from 'react'
