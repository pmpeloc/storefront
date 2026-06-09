'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MOCK_USER } from '@/lib/mock-data'
import { CuentaShell } from '@/components/cuenta/CuentaShell'

// TODO: cuenta-datos - reemplazar MOCK_USER con sesión real y PATCH /private/users/:id — ver TECHNICAL_DEBT.md

export default function DatosPage() {
  const [form, setForm] = useState({
    name: MOCK_USER.name,
    email: MOCK_USER.email,
    phone: MOCK_USER.phone,
  })
  const [saved, setSaved] = useState(false)

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    // TODO: cuenta-datos - PATCH al endpoint de usuario
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <CuentaShell>
    <div className="max-w-lg md:max-w-none">
      <div className="flex items-center gap-3 mb-6 md:hidden">
        <Link href="/cuenta" className="w-8 h-8 flex items-center justify-center rounded-[8px] hover:bg-beige transition-colors" style={{ color: 'var(--marron)' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" />
          </svg>
        </Link>
        <h1 style={{ fontFamily: 'var(--font-head)', fontSize: 22, color: 'var(--marron)', fontWeight: 600 }}>
          Mis datos
        </h1>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        {[
          { key: 'name', label: 'Nombre completo', type: 'text' },
          { key: 'email', label: 'Email', type: 'email' },
          { key: 'phone', label: 'Teléfono', type: 'tel' },
        ].map(({ key, label, type }) => (
          <div key={key}>
            <label className="block text-[11px] font-medium mb-1.5" style={{ color: 'var(--tx-soft)' }}>{label}</label>
            <input
              type={type}
              value={form[key as keyof typeof form]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              className="w-full rounded-[10px] px-3 py-3 text-[13px] outline-none"
              style={{ border: '1px solid var(--line)', background: '#fff', color: 'var(--tx)' }}
            />
          </div>
        ))}

        <button
          type="submit"
          className="w-full py-4 rounded-[10px] text-[12.5px] font-semibold tracking-[.1em] uppercase text-white transition-all mt-2"
          style={{ background: saved ? 'var(--exito)' : 'var(--taupe)' }}
        >
          {saved ? '✓ Guardado' : 'Guardar cambios'}
        </button>
      </form>

      <div className="mt-6 p-4 rounded-[14px]" style={{ background: 'var(--marfil)' }}>
        <p className="text-[12px] font-semibold mb-1" style={{ color: 'var(--tx)' }}>Contraseña</p>
        <p className="text-[11.5px] mb-3" style={{ color: 'var(--tx-soft)' }}>
          Por seguridad, podés cambiar tu contraseña desde aquí.
        </p>
        <button
          className="text-[11.5px] font-semibold"
          style={{ color: 'var(--taupe)' }}
        >
          Cambiar contraseña →
        </button>
      </div>
    </div>
    </CuentaShell>
  )
}
