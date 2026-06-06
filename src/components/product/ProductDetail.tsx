import type { PublicProduct } from '@/types/product'
import { ProductImages } from './ProductImages'
import { WhatsAppButton } from './WhatsAppButton'
import { Badge } from '@/components/ui/Badge'

interface ProductDetailProps {
  product: PublicProduct
}

export function ProductDetail({ product }: ProductDetailProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
      <ProductImages imageUrl={product.image_url} name={product.name} />

      <div className="flex flex-col gap-4">
        {product.category && (
          <div>
            <Badge variant="category">{product.category}</Badge>
          </div>
        )}

        <h1 className="text-2xl md:text-3xl font-bold text-stone-900 leading-tight">
          {product.name}
        </h1>

        <p className="text-3xl font-bold text-stone-900">
          ${product.price.toLocaleString('es-AR')}
        </p>

        {product.stock > 0 ? (
          <Badge variant="stock">Stock disponible</Badge>
        ) : (
          <Badge variant="category">Sin stock</Badge>
        )}

        {product.description && (
          <p className="text-stone-600 leading-relaxed text-sm md:text-base">
            {product.description}
          </p>
        )}

        <div className="pt-2">
          <WhatsAppButton product={product} size="lg" />
        </div>

        <p className="text-xs text-stone-400">
          Al hacer clic en el botón se abrirá WhatsApp con un mensaje pre-armado.
        </p>
      </div>
    </div>
  )
}
