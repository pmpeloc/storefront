import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getProductBySlug, getProducts } from '@/lib/api'
import { ProductDetail } from '@/components/product/ProductDetail'
import { clientConfig } from '@/config/client'

export const revalidate = 300

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  try {
    const data = await getProducts({ limit: 100 })
    return data.products
      .filter((p): p is typeof p & { slug: string } => p.slug !== null)
      .map((p) => ({ slug: p.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const data = await getProductBySlug(slug)
  if (!data) return { title: 'Producto no encontrado' }

  const { product } = data
  return {
    title: product.seo_title,
    description: product.seo_description ?? undefined,
    openGraph: {
      title: `${product.seo_title} | ${clientConfig.clientName}`,
      description: product.seo_description ?? undefined,
      images: product.image_url ? [{ url: product.image_url }] : [],
    },
  }
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params
  const data = await getProductBySlug(slug)
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
