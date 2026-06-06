# Storefront — Ecommerce Template

> Leer también: `../CLAUDE.md` para contexto global del proyecto.

## Propósito

Ecommerce customer-facing construido como template reutilizable para múltiples clientes de Red Impulso. El primer deploy es para **Renuevo Almohadones** en `renuevohogar.com`.

Consume la API de `prodcast_api` — los productos que el fabricante carga con la PWA de Prodcast aparecen automáticamente en el ecommerce cuando su `status = 'published'`.

---

## Decisiones de Producto (CEO/Product)

### MVP — lo que entra en Sprint 1
El objetivo es que Renuevo pueda vender online lo antes posible. El MVP no incluye carrito ni checkout — la conversión inicial es por WhatsApp. Esto es deliberado: es más rápido de construir y Renuevo ya vende por WhatsApp hoy.

**Sprint 1 — Catálogo + Contacto:**
- Homepage con productos destacados y catálogo completo
- Filtrado por categoría
- Página de detalle de producto
- Botón "Consultar por WhatsApp" como CTA principal
- SEO básico (meta tags, Open Graph, sitemap)
- Mobile-first (el tráfico de Renuevo es mayormente mobile)

**Sprint 2 — Compra online:**
- Carrito de compras
- Checkout con Mobbex
- Confirmación de pedido por email
- Panel de pedidos (integrado con prodcast_api)

### Por qué WhatsApp primero
Renuevo ya tiene clientes que compran por WhatsApp. Agregar el botón es inmediato y no requiere infraestructura de pagos. El checkout con Mobbex agrega fricción técnica que retrasa la salida al mercado — se hace en Sprint 2 cuando el catálogo ya esté funcionando.

---

## Stack

| Tecnología | Versión | Uso |
|-----------|---------|-----|
| Next.js | 14+ (App Router) | Framework — SSG/ISR para SEO |
| TypeScript | strict | Tipado completo |
| Tailwind CSS | 3+ | Estilos — mobile-first |
| SWR | latest | Fetching client-side |
| next-sitemap | latest | Generación de sitemap.xml |

> **Sin Zustand ni React Hook Form en Sprint 1** — no hay auth ni formularios complejos en el MVP.

---

## Configuración por cliente (multi-tenant)

El storefront se configura por variables de entorno y un archivo de config. Esto permite deployar la misma codebase para distintos clientes sin modificar código.

```typescript
// src/config/client.ts — generado por env vars
export const clientConfig = {
  tenantId:        process.env.TENANT_ID,
  clientName:      process.env.CLIENT_NAME,       // "Renuevo Almohadones"
  brandColor:      process.env.BRAND_COLOR,        // "#9b8b75"
  whatsappNumber:  process.env.WHATSAPP_NUMBER,    // "5493884123456"
  whatsappMessage: process.env.WHATSAPP_MESSAGE,   // "Hola! Me interesa..."
  logoUrl:         process.env.LOGO_URL,
  domain:          process.env.NEXT_PUBLIC_DOMAIN, // "renuevohogar.com"
}
```

---

## Estructura de Carpetas

```
storefront/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout con metadata dinámica
│   │   ├── page.tsx                # Homepage — destacados + catálogo
│   │   ├── productos/
│   │   │   └── [slug]/
│   │   │       └── page.tsx        # Detalle de producto (SSG con ISR)
│   │   ├── sitemap.ts              # Sitemap dinámico
│   │   └── robots.ts              # robots.txt
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx          # Logo + nav + búsqueda
│   │   │   └── Footer.tsx          # Info de contacto + RRSS
│   │   ├── product/
│   │   │   ├── ProductGrid.tsx     # Grid de productos con filtros
│   │   │   ├── ProductCard.tsx     # Card en listing
│   │   │   ├── ProductDetail.tsx   # Vista completa del producto
│   │   │   ├── ProductImages.tsx   # Galería de imágenes
│   │   │   └── WhatsAppButton.tsx  # CTA principal de conversión
│   │   ├── home/
│   │   │   ├── HeroBanner.tsx      # Banner principal homepage
│   │   │   └── FeaturedProducts.tsx # Sección destacados
│   │   └── ui/
│   │       ├── Badge.tsx           # Badge de categoría / stock
│   │       └── Skeleton.tsx        # Loading states
│   │
│   ├── lib/
│   │   ├── api.ts                  # Cliente HTTP → prodcast_api (público, sin auth)
│   │   └── whatsapp.ts             # Helpers para generar links de WhatsApp
│   │
│   ├── types/
│   │   └── product.ts              # Tipos alineados con prodcast_api
│   │
│   └── config/
│       └── client.ts               # Configuración por cliente desde env vars
│
├── public/
│   └── [assets del cliente]        # Logo, favicon, imágenes estáticas
│
├── docs/
│   ├── spec.md
│   ├── plan.md
│   └── progress.md
│
├── .env.local.example
├── next.config.mjs
└── tsconfig.json
```

---

## API — Endpoints consumidos

El storefront consume la API de prodcast_api **sin autenticación** — los endpoints de productos públicos no requieren token. Solo se exponen productos con `status = 'published'`.

> ⚠️ **Pendiente:** la prodcast_api necesita endpoints públicos (sin auth) para el ecommerce. Actualmente todos los endpoints requieren JWT. Esto es la primera tarea del Sprint 1 en prodcast_api antes de arrancar el storefront.

| Método | Endpoint | Uso |
|--------|----------|-----|
| GET | `/public/products` | Lista de productos publicados del tenant |
| GET | `/public/products/:slug` | Detalle de producto por slug |
| GET | `/public/products/featured` | Productos destacados para homepage |
| GET | `/public/categories` | Categorías disponibles del tenant |

---

## Rendering Strategy (SEO)

- **Homepage:** ISR (revalidate: 60s) — se actualiza sin rebuild cuando hay productos nuevos
- **Producto detalle:** SSG + ISR (revalidate: 300s) — URLs estáticas para SEO, se regeneran al publicar
- **Filtros por categoría:** client-side con SWR — no afecta SEO

---

## Tipos

```typescript
// src/types/product.ts
interface PublicProduct {
  id: string
  slug: string
  name: string
  descriptionOptimized: string | null
  descriptionTranscription: string | null
  price: number
  stock: number
  isFeatured: boolean
  category: string | null
  imageUrl: string | null
  imageOptimizedUrl: string | null
  imageAiUrl: string | null
  seoTitle: string | null
  seoDescription: string | null
  // Convención UI: description = descriptionOptimized ?? descriptionTranscription ?? ''
  // Convención UI: imagen = imageOptimizedUrl ?? imageUrl
}
```

---

## WhatsApp Integration

El CTA principal del MVP es un botón que abre WhatsApp con un mensaje pre-armado:

```typescript
// src/lib/whatsapp.ts
export function buildWhatsAppUrl(product: PublicProduct, config: ClientConfig) {
  const message = encodeURIComponent(
    `Hola! Me interesa el producto *${product.name}* ($${product.price}). ¿Tienen stock disponible?`
  )
  return `https://wa.me/${config.whatsappNumber}?text=${message}`
}
```

---

## Variables de Entorno — Renuevo

```bash
# .env.local.example

# API
NEXT_PUBLIC_API_URL=http://localhost:3001

# Cliente — Renuevo Almohadones
TENANT_ID=                          # ID del tenant en prodcast_api
CLIENT_NAME=Renuevo Almohadones
BRAND_COLOR=#9b8b75
NEXT_PUBLIC_DOMAIN=renuevohogar.com

# WhatsApp
WHATSAPP_NUMBER=549XXXXXXXXXX       # Con código de país, sin + ni espacios
WHATSAPP_MESSAGE=Hola! Vi su tienda online y me interesa...

# Logo
LOGO_URL=/logo-renuevo.png          # en /public/
```

---

## Instrucciones para Superpowers

Al iniciar trabajo en este repo:
1. Leer este `CLAUDE.md`, `../CLAUDE.md` (raíz) y `../prodcast_api/CLAUDE.md` antes de actuar
2. **PRIMERA tarea siempre:** verificar que prodcast_api tiene los endpoints públicos `/public/*` implementados. Sin eso el storefront no puede funcionar.
3. Al finalizar brainstorming → guardar spec en `docs/spec.md`
4. Al generar plan → guardar en `docs/plan.md`
5. Al completar cada tarea → actualizar `docs/progress.md`
6. TDD: tests de componentes con Vitest + RTL, tests de páginas con getStaticProps mockeado
7. Verificar siempre en viewport 375px (mobile-first)
8. Nunca hardcodear colores, textos o números de contacto — siempre desde `src/config/client.ts`
