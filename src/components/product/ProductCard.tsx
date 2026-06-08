import Link from 'next/link'
import Image from 'next/image'
import type { PublicProduct } from '@/types/product'
import { Badge } from '@/components/ui/Badge'
import { WhatsAppButton } from './WhatsAppButton'
import { AddToCartButton } from './AddToCartButton'

interface ProductCardProps {
  product: PublicProduct
}

export function ProductCard({ product }: ProductCardProps) {
  const href = product.slug ? `/productos/${product.slug}` : '#'

  return (
    <article className="rounded-xl overflow-hidden border border-stone-200 bg-white flex flex-col shadow-sm hover:shadow-md transition-shadow">
      <Link href={href} className="block">
        <div className="relative aspect-square bg-stone-100">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-stone-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
          {product.is_featured && (
            <span className="absolute top-2 left-2 bg-amber-400 text-amber-900 text-xs font-semibold px-2 py-0.5 rounded-full">
              Destacado
            </span>
          )}
        </div>
      </Link>

      <div className="p-3 flex flex-col gap-1.5 flex-1">
        {product.category && <Badge>{product.category}</Badge>}
        <Link href={href}>
          <h3 className="font-semibold text-stone-800 text-sm leading-snug line-clamp-2 hover:text-stone-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-lg font-bold text-stone-900">
          ${product.price.toLocaleString('es-AR')}
        </p>
        <div className="mt-auto pt-1 space-y-1.5">
          <AddToCartButton product={product} />
          <WhatsAppButton product={product} size="sm" />
        </div>
      </div>
    </article>
  )
}
