import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { clientConfig } from '@/config/client'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { CartDrawer } from '@/components/cart/CartDrawer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: clientConfig.clientName,
    template: `%s | ${clientConfig.clientName}`,
  },
  description: `Tienda online de ${clientConfig.clientName}. Comprá desde WhatsApp.`,
  metadataBase: new URL(`https://${clientConfig.domain}`),
  openGraph: {
    siteName: clientConfig.clientName,
    locale: 'es_AR',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body
        className={`${inter.className} bg-stone-50 min-h-screen`}
        style={{ '--brand-color': clientConfig.brandColor } as React.CSSProperties}
      >
        <Header />
        <main>{children}</main>
        <Footer />
        <CartDrawer />
      </body>
    </html>
  )
}
