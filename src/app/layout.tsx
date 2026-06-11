import type { Metadata } from 'next'
import './globals.css'
import { clientConfig } from '@/config/client'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { BottomNav } from '@/components/layout/BottomNav'
import { PromoBanner } from '@/components/layout/PromoBanner'
import { CartDrawer } from '@/components/cart/CartDrawer'
import { ToastContainer } from '@/components/ui/Toast'

export const metadata: Metadata = {
  title: {
    default: clientConfig.clientName,
    template: `%s | ${clientConfig.clientName}`,
  },
  description: `Tienda online de ${clientConfig.clientName}. Diseños para espacios que inspiran.`,
  metadataBase: new URL(`https://${clientConfig.domain}`),
  icons: {
    icon: [
      { url: '/favicon-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: { url: '/favicon-180.png', sizes: '180x180', type: 'image/png' },
    other: [
      { rel: 'icon', url: '/favicon-192.png', sizes: '192x192', type: 'image/png' },
      { rel: 'icon', url: '/favicon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
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
        style={
          {
            '--brand-color': clientConfig.brandColor,
            fontFamily: 'var(--font-ui)',
          } as React.CSSProperties
        }
        className="bg-crema min-h-screen text-tx"
      >
        <PromoBanner />
        <Header />
        <main className="pb-20 md:pb-0">{children}</main>
        <Footer />
        <BottomNav />
        <CartDrawer />
        <ToastContainer />
      </body>
    </html>
  )
}
