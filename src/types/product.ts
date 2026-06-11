// Mirrors the PublicProduct shape returned by prodcast_api /public endpoints
export interface PublicProduct {
  id: string
  name: string
  description: string | null
  price: number
  image_url: string | null
  slug: string | null
  category: string | null
  stock: number
  is_featured: boolean
  seo_title: string
  seo_description: string | null
  created_at: string
  updated_at: string
  // Optional fields — populated when API returns them (additive, backward-compatible)
  compare_price?: number | null
  gallery_images?: string[]
  label?: string | null
}

export interface ProductsResponse {
  products: PublicProduct[]
  total: number
}
