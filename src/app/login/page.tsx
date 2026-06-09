'use client'

import { useState } from 'react'
import Link from 'next/link'

// TODO: storefront-auth - conectar con Supabase Auth o custom JWT endpoint — ver TECHNICAL_DEBT.md

export default function LoginPage() {
  const [tab, setTab] = useState<'login' | 'register'>('login')
  const [form, setForm] = useState({ email: '', password: '', name: '' })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // TODO: storefront-auth - llamar a signIn / signUp
    alert('Auth no implementado. Ver TECHNICAL_DEBT.md')
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/">
            <p style={{ fontFamily: 'var(--font-head)', fontSize: 22, color: 'var(--marron)', fontWeight: 600, letterSpacing: '.1em' }}>
              RENUEVO
            </p>
          </Link>
          <p className="text-[11px] mt-1" style={{ color: 'var(--tx-faint)' }}>Almohadones &amp; Textiles</p>
        </div>

        {/* Tabs */}
        <div
          className="flex rounded-[12px] p-1 mb-6"
          style={{ background: 'var(--beige)' }}
        >
          {(['login', 'register'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="flex-1 py-2.5 rounded-[10px] text-[12px] font-semibold tracking-[.06em] uppercase transition-all"
              style={{
                background: tab === t ? '#fff' : 'transparent',
                color: tab === t ? 'var(--marron)' : 'var(--tx-soft)',
                boxShadow: tab === t ? '0 1px 4px rgba(90,75,63,.1)' : 'none',
              }}
            >
              {t === 'login' ? 'Ingresar' : 'Registrarme'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {tab === 'register' && (
            <div>
              <label className="block text-[11px] font-medium mb-1.5" style={{ color: 'var(--tx-soft)' }}>Nombre</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Tu nombre"
                className="w-full rounded-[10px] px-3 py-3 text-[13px] outline-none"
                style={{ border: '1px solid var(--line)', background: '#fff', color: 'var(--tx)' }}
              />
            </div>
          )}

          <div>
            <label className="block text-[11px] font-medium mb-1.5" style={{ color: 'var(--tx-soft)' }}>Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="tu@email.com"
              className="w-full rounded-[10px] px-3 py-3 text-[13px] outline-none"
              style={{ border: '1px solid var(--line)', background: '#fff', color: 'var(--tx)' }}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-medium" style={{ color: 'var(--tx-soft)' }}>Contraseña</label>
              {tab === 'login' && (
                <button type="button" className="text-[10.5px]" style={{ color: 'var(--taupe)' }}>
                  Olvidé mi contraseña
                </button>
              )}
            </div>
            <input
              type="password"
              required
              minLength={6}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              className="w-full rounded-[10px] px-3 py-3 text-[13px] outline-none"
              style={{ border: '1px solid var(--line)', background: '#fff', color: 'var(--tx)' }}
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-[10px] text-[12.5px] font-semibold tracking-[.1em] uppercase text-white transition-opacity hover:opacity-90 mt-2"
            style={{ background: 'var(--taupe)' }}
          >
            {tab === 'login' ? 'Ingresar' : 'Crear cuenta'}
          </button>
        </form>

        <p className="text-center text-[11.5px] mt-6" style={{ color: 'var(--tx-soft)' }}>
          {tab === 'login' ? '¿No tenés cuenta? ' : '¿Ya tenés cuenta? '}
          <button
            onClick={() => setTab(tab === 'login' ? 'register' : 'login')}
            className="font-semibold"
            style={{ color: 'var(--taupe)' }}
          >
            {tab === 'login' ? 'Registrate' : 'Ingresá'}
          </button>
        </p>

        <Link
          href="/"
          className="block text-center text-[11px] mt-4"
          style={{ color: 'var(--tx-faint)' }}
        >
          ← Volver a la tienda
        </Link>
      </div>
    </div>
  )
}
