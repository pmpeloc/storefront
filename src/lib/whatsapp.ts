import type { PublicProduct } from '@/types/product'
import type { TenantConfig } from '@/lib/tenant-config'

export function buildWhatsAppUrl(product: PublicProduct, config: TenantConfig): string {
  const message = encodeURIComponent(
    `Hola! Me interesa el producto *${product.name}* ($${product.price.toLocaleString('es-AR')}). ¿Tienen stock disponible?`,
  )
  return `https://wa.me/${config.whatsapp_number ?? ''}?text=${message}`
}

export function buildGenericWhatsAppUrl(config: TenantConfig): string {
  const message = encodeURIComponent(config.whatsapp_message ?? '')
  return `https://wa.me/${config.whatsapp_number ?? ''}?text=${message}`
}
