import type { PublicProduct } from '@/types/product'
import type { ClientConfig } from '@/config/client'

export function buildWhatsAppUrl(product: PublicProduct, config: ClientConfig): string {
  const message = encodeURIComponent(
    `Hola! Me interesa el producto *${product.name}* ($${product.price.toLocaleString('es-AR')}). ¿Tienen stock disponible?`,
  )
  return `https://wa.me/${config.whatsappNumber}?text=${message}`
}

export function buildGenericWhatsAppUrl(config: ClientConfig): string {
  const message = encodeURIComponent(config.whatsappMessage)
  return `https://wa.me/${config.whatsappNumber}?text=${message}`
}
