import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { fetchTenantConfigBySlug, fetchAllTenantSlugs } from '@/lib/tenant-config'
import { TenantConfigProvider } from '@/components/providers/TenantConfigProvider'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { BottomNav } from '@/components/layout/BottomNav'
import { PromoBanner } from '@/components/layout/PromoBanner'
import { CartDrawer } from '@/components/cart/CartDrawer'
import { ToastContainer } from '@/components/ui/Toast'

interface LayoutProps {
  children: React.ReactNode
  params: Promise<{ tenant: string }>
}

// Pre-warm de los tenants conocidos en build time. dynamicParams=true (default)
// permite que un tenant nuevo, dado de alta sin redeploy, se renderice
// on-demand en su primera visita y quede cacheado como cualquier página ISR.
export async function generateStaticParams(): Promise<{ tenant: string }[]> {
  try {
    const slugs = await fetchAllTenantSlugs()
    return slugs.map((tenant) => ({ tenant }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const { tenant } = await params
  const tenantConfig = await fetchTenantConfigBySlug(tenant)
  if (!tenantConfig) return {}

  return {
    title: {
      default: tenantConfig.client_name,
      template: `%s | ${tenantConfig.client_name}`,
    },
    description: `Tienda online de ${tenantConfig.client_name}. Diseños para espacios que inspiran.`,
    icons: tenantConfig.favicon_url ? { icon: tenantConfig.favicon_url } : undefined,
    openGraph: {
      siteName: tenantConfig.client_name,
      locale: 'es_AR',
      type: 'website',
    },
  }
}

export default async function TenantLayout({ children, params }: LayoutProps) {
  const { tenant } = await params
  const tenantConfig = await fetchTenantConfigBySlug(tenant)
  if (!tenantConfig) notFound()

  return (
    <TenantConfigProvider value={tenantConfig}>
      <div style={{ '--brand-color': tenantConfig.brand_color } as React.CSSProperties}>
        <PromoBanner />
        <Header />
        <main className="pb-20 md:pb-0">{children}</main>
        <Footer />
        <BottomNav />
        <CartDrawer />
        <ToastContainer />
      </div>
    </TenantConfigProvider>
  )
}
