import { getProducts, getFeaturedProducts, getCategories } from '@/lib/api'
import { fetchTenantConfigBySlug } from '@/lib/tenant-config'
import { HeroBanner } from '@/components/home/HeroBanner'
import { CategorySection } from '@/components/home/CategorySection'
import { FeaturedProducts } from '@/components/home/FeaturedProducts'
import { InspirationBanner } from '@/components/home/InspirationBanner'
import { ProductGrid } from '@/components/product/ProductGrid'

export const revalidate = 60

interface HomePageProps {
  params: Promise<{ tenant: string }>
}

export default async function HomePage({ params }: HomePageProps) {
  const { tenant } = await params
  const [productsData, featuredData, categoriesData, tenantConfig] = await Promise.all([
    getProducts(tenant),
    getFeaturedProducts(tenant),
    getCategories(tenant),
    fetchTenantConfigBySlug(tenant),
  ])
  // product_source_mode='external' (ej. Nehemías) no tiene contenido de home curado (hero
  // propio, tiles de categoría, banner de inspiración) — eso es Spec B. Hasta que exista,
  // se ocultan en vez de mostrar el contenido de Renuevo. Se reutiliza 'colecciones' como
  // proxy de "tenant con catálogo propio curado" (ver nota de la Task 10B).
  const showCuratedHome = tenantConfig?.nav_sections.includes('colecciones') ?? false

  // Novedades = productos con tag novedad o más vendido (hasta 4)
  const novedades = productsData.products
    .filter((p) => (p as { tag?: string }).tag === 'Novedad' || (p as { tag?: string }).tag === 'Más vendido')
    .slice(0, 4)

  return (
    <>
      {showCuratedHome && (
        <>
          {/* 1. Hero — desktop full-bleed / mobile editorial */}
          <HeroBanner />

          {/* 2. Comprá por categoría */}
          <CategorySection />
        </>
      )}

      {/* 3. Productos destacados */}
      <FeaturedProducts products={featuredData.products} />

      {showCuratedHome && (
        /* 4. Banner inspiración */
        <InspirationBanner />
      )}

      {/* 5. Novedades — fondo marfil para separar visualmente */}
      {novedades.length > 0 && (
        <section style={{ background: 'var(--marfil)' }}>
          <FeaturedProducts
            products={novedades}
            eyebrow="Recién llegados"
            title="Novedades"
            ctaHref="/productos"
            ctaLabel="Ver más →"
          />
        </section>
      )}

      {/* 6. Catálogo completo con filtros */}
      <ProductGrid
        initialProducts={productsData.products}
        categories={categoriesData.categories}
      />
    </>
  )
}
