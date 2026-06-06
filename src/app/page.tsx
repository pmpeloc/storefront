import { getProducts, getFeaturedProducts, getCategories } from '@/lib/api'
import { HeroBanner } from '@/components/home/HeroBanner'
import { FeaturedProducts } from '@/components/home/FeaturedProducts'
import { ProductGrid } from '@/components/product/ProductGrid'

export const revalidate = 60

export default async function HomePage() {
  const [productsData, featuredData, categoriesData] = await Promise.all([
    getProducts(),
    getFeaturedProducts(),
    getCategories(),
  ])

  return (
    <>
      <HeroBanner />
      <FeaturedProducts products={featuredData.products} />
      <ProductGrid
        initialProducts={productsData.products}
        categories={categoriesData.categories}
      />
    </>
  )
}
