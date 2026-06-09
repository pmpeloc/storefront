'use client'

import { useToastStore } from '@/store/toastStore'

function CheckIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function BagIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 6h18" strokeLinecap="round" />
      <path d="M16 10a4 4 0 01-8 0" strokeLinecap="round" />
    </svg>
  )
}

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts)

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-[74px] md:bottom-6 left-3.5 right-3.5 md:left-auto md:right-6 md:w-80 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="flex items-center gap-2.5 px-3.5 py-3 rounded-[12px] text-[11.5px] text-marfil"
          style={{
            background: t.kind === 'ok' ? 'var(--exito)' : t.kind === 'error' ? 'var(--error)' : 'var(--marron)',
            boxShadow: '0 8px 22px rgba(74,61,49,.28)',
            animation: 'toastIn .28s cubic-bezier(.2,.8,.3,1)',
          }}
        >
          {t.kind === 'ok' ? <CheckIcon /> : <BagIcon />}
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  )
}
