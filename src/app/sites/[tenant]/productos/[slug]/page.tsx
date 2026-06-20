import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getProductBySlug, getProducts } from '@/lib/api'
import { fetchTenantConfigBySlug } from '@/lib/tenant-config'
import { ProductDetail } from '@/components/product/ProductDetail'

export const revalidate = 300

interface PageProps {
  params: Promise<{ tenant: string; slug: string }>
}

// Recibe los tenants ya resueltos por el generateStaticParams del layout padre
// y genera, para cada uno, los slugs de producto a pre-renderizar.
export async function generateStaticParams({
  params,
}: {
  params: { tenant: string }
}): Promise<{ slug: string }[]> {
  try {
    const data = await getProducts(params.tenant, { limit: 100 })
    return data.products
      .filter((p): p is typeof p & { slug: string } => p.slug !== null)
      .map((p) => ({ slug: p.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { tenant, slug } = await params
  const [data, tenantConfig] = await Promise.all([
    getProductBySlug(tenant, slug),
    fetchTenantConfigBySlug(tenant),
  ])
  if (!data) return { title: 'Producto no encontrado' }

  const { product } = data
  return {
    title: product.seo_title,
    description: product.seo_description ?? undefined,
    openGraph: {
      title: tenantConfig ? `${product.seo_title} | ${tenantConfig.client_name}` : product.seo_title,
      description: product.seo_description ?? undefined,
      images: product.image_url ? [{ url: product.image_url }] : [],
    },
  }
}

export default async function ProductPage({ params }: PageProps) {
  const { tenant, slug } = await params
  const data = await getProductBySlug(tenant, slug)
  if (!data) notFound()

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <nav className="text-sm text-stone-400 mb-6">
        <Link href="/" className="hover:text-stone-700 transition-colors">
          Inicio
        </Link>
        {' / '}
        <Link href="/#catalog" className="hover:text-stone-700 transition-colors">
          Catálogo
        </Link>
        {' / '}
        <span className="text-stone-600">{data.product.name}</span>
      </nav>
      <ProductDetail product={data.product} />
    </div>
  )
}
