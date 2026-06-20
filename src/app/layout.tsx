import type { Metadata } from 'next'
import './globals.css'

// Layout raíz — no conoce el tenant (el segmento [tenant] vive un nivel
// más abajo, en sites/[tenant]/layout.tsx). Branding, metadata real y
// los componentes de UI (Header, Footer, etc.) se inyectan ahí.
export const metadata: Metadata = {
  title: 'Red Impulso',
  description: 'Tienda online',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body
        style={{ fontFamily: 'var(--font-ui)' } as React.CSSProperties}
        className="bg-crema min-h-screen text-tx"
      >
        {children}
      </body>
    </html>
  )
}
