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
| Next.js | 14.2+ (App Router) | Framework — SSG/ISR para SEO |
| TypeScript | 5+ strict | Tipado completo |
| Tailwind CSS | 3.4+ | Estilos — mobile-first |
| SWR | 2.3+ | Fetching client-side (filtros por categoría) |
| ESLint | 9 (flat config) | Linting — `eslint.config.mjs` + `eslint-config-next` |
| Vitest | 2+ | Tests de componentes + RTL |

> **Sin Zustand ni React Hook Form en Sprint 1** — no hay auth ni formularios complejos en el MVP.
> **Sin next-sitemap** — se usa el sitemap dinámico nativo de Next.js 14 (`app/sitemap.ts`), más simple y compatible con ISR.

---

## Configuración por cliente (multi-tenant)

El storefront se configura por variables de entorno y un archivo de config. Esto permite deployar la misma codebase para distintos clientes sin modificar código.

```typescript
// src/config/client.ts
export const clientConfig = {
  tenantSlug:      process.env.TENANT_SLUG,                    // server-only — nunca al browser
  clientName:      process.env.NEXT_PUBLIC_CLIENT_NAME,        // "Renuevo Almohadones"
  brandColor:      process.env.NEXT_PUBLIC_BRAND_COLOR,        // "#9b8b75"
  whatsappNumber:  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER,    // "5493884123456"
  whatsappMessage: process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE,   // "Hola! Vi su tienda..."
  logoUrl:         process.env.NEXT_PUBLIC_LOGO_URL,           // "/logo-renuevo.png"
  domain:          process.env.NEXT_PUBLIC_DOMAIN,             // "renuevohogar.com"
}
```

> **Regla de variables:** Las vars de configuración visual usan `NEXT_PUBLIC_` — son seguras de exponer al browser. `TENANT_SLUG` es server-only porque se usa únicamente en los API fetches del servidor para llamar a `prodcast_api`. Nunca viaja al cliente.

### Brand color dinámico
El color de marca no se hardcodea en Tailwind. Flujo:
1. `layout.tsx` pone `style={{ '--brand-color': clientConfig.brandColor }}` en `<body>`
2. `tailwind.config.ts` define `colors.brand: 'var(--brand-color)'`
3. Los componentes usan `bg-brand`, `text-brand` normalmente

### Proxy route handler
`src/app/api/products/route.ts` es un proxy interno que envuelve las llamadas a prodcast_api. Propósito: el client component `ProductGrid` necesita filtrar por categoría en el cliente, pero `TENANT_SLUG` es server-only. El proxy inyecta el slug antes de llamar a la API externa.

---

## Estructura de Carpetas

```
storefront/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout — brand color via CSS var, metadata base
│   │   ├── page.tsx                # Homepage — ISR 60s
│   │   ├── globals.css             # @tailwind directives
│   │   ├── api/
│   │   │   └── products/
│   │   │       └── route.ts        # Proxy para filtrado client-side (protege TENANT_SLUG)
│   │   ├── productos/
│   │   │   └── [slug]/
│   │   │       └── page.tsx        # Detalle (SSG + ISR 300s, generateStaticParams, OG)
│   │   ├── sitemap.ts              # Sitemap dinámico nativo Next.js — ISR 3600s
│   │   └── robots.ts               # robots.txt
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx          # Logo + nav — sticky, server component
│   │   │   └── Footer.tsx          # Contacto + link WhatsApp genérico
│   │   ├── product/
│   │   │   ├── ProductGrid.tsx     # 'use client' — grilla 2/3/4 cols + filtros SWR
│   │   │   ├── ProductCard.tsx     # Card en listing — imagen, precio, badge, CTA
│   │   │   ├── ProductDetail.tsx   # Vista completa del producto
│   │   │   ├── ProductImages.tsx   # Imagen con placeholder SVG si no hay imagen
│   │   │   └── WhatsAppButton.tsx  # CTA — mensaje pre-armado con nombre y precio
│   │   ├── home/
│   │   │   ├── HeroBanner.tsx      # Hero con CTA a catálogo y WhatsApp directo
│   │   │   └── FeaturedProducts.tsx # Primeros 4 productos is_featured=true
│   │   └── ui/
│   │       ├── Badge.tsx           # Variants: category | stock | featured
│   │       └── Skeleton.tsx        # Skeleton base + ProductCardSkeleton
│   │
│   ├── lib/
│   │   ├── api.ts                  # Cliente HTTP → prodcast_api /public/* (sin auth)
│   │   └── whatsapp.ts             # buildWhatsAppUrl + buildGenericWhatsAppUrl
│   │
│   ├── types/
│   │   └── product.ts              # PublicProduct (snake_case, espeja prodcast_api)
│   │
│   └── config/
│       └── client.ts               # clientConfig desde env vars (ver sección vars)
│
├── public/
│   └── logo-renuevo.png            # Placeholder 40×40 color brand — reemplazar con logo real
│
├── docs/
│   ├── spec.md
│   ├── plan.md
│   └── progress.md
│
├── eslint.config.mjs               # ESLint 9 flat config — eslint-config-next/core-web-vitals
├── vitest.config.ts                # Vitest + jsdom + alias @/*
├── tailwind.config.ts              # colors.brand = var(--brand-color)
├── next.config.mjs                 # remotePatterns: *.supabase.co
├── .env.local.example
└── tsconfig.json
```

---

## API — Endpoints consumidos

El storefront consume la API de prodcast_api **sin autenticación** — los endpoints de productos públicos no requieren token. Solo se exponen productos con `status = 'published'`.

Todos los endpoints reciben `?tenantSlug=<slug>` como query param obligatorio.

| Método | Endpoint completo | Uso |
|--------|-------------------|-----|
| GET | `/api/v1/public/products?tenantSlug=` | Lista paginada de productos publicados |
| GET | `/api/v1/public/products/:slug?tenantSlug=` | Detalle de producto por slug |
| GET | `/api/v1/public/products/featured?tenantSlug=` | Productos con `is_featured=true` |
| GET | `/api/v1/public/categories?tenantSlug=` | Categorías disponibles del tenant |

Rate limit en prodcast_api: 200 req/min por IP sobre `/public/*`.

**Respuesta de productos:** El campo `description` ya viene mapeado (`description_optimized ?? description_transcription`). El campo `image_url` ya viene resuelto (`image_optimized_url ?? image_url`). El storefront no necesita lógica de fallback.

---

## Rendering Strategy (SEO)

- **Homepage:** ISR (revalidate: 60s) — se actualiza sin rebuild cuando hay productos nuevos
- **Producto detalle:** SSG + ISR (revalidate: 300s) — URLs estáticas para SEO, se regeneran al publicar
- **Filtros por categoría:** client-side con SWR — no afecta SEO

---

## Tipos

```typescript
// src/types/product.ts — espeja la forma que devuelve prodcast_api (snake_case)
interface PublicProduct {
  id: string
  name: string
  description: string | null   // ya resuelto por la API: optimized ?? transcription
  price: number
  image_url: string | null     // ya resuelto por la API: optimized ?? original
  slug: string | null
  category: string | null
  stock: number
  is_featured: boolean
  seo_title: string            // con fallback a name en la API
  seo_description: string | null
  created_at: string
  updated_at: string
}

interface ProductsResponse {
  products: PublicProduct[]
  total: number
}
```

---

## WhatsApp Integration

El CTA principal del MVP es un botón que abre WhatsApp con un mensaje pre-armado:

```typescript
// src/lib/whatsapp.ts
export function buildWhatsAppUrl(product: PublicProduct, config: ClientConfig): string {
  const message = encodeURIComponent(
    `Hola! Me interesa el producto *${product.name}* ($${product.price.toLocaleString('es-AR')}). ¿Tienen stock disponible?`
  )
  return `https://wa.me/${config.whatsappNumber}?text=${message}`
}

// Para el Footer y el HeroBanner (sin producto específico)
export function buildGenericWhatsAppUrl(config: ClientConfig): string {
  return `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(config.whatsappMessage)}`
}
```

`WhatsAppButton` es un componente estándar (no server, no client) que lee `clientConfig` directamente. Como `whatsappNumber` usa `NEXT_PUBLIC_`, funciona en cualquier contexto.

---

## Variables de Entorno — Renuevo

```bash
# .env.local.example

# API
NEXT_PUBLIC_API_URL=http://localhost:3001

# Tenant — server-only (nunca usar NEXT_PUBLIC_ aquí)
TENANT_SLUG=el-renuevo     # slug del tenant en prodcast_api (tabla tenants)

# Brand — visibles en el cliente
NEXT_PUBLIC_CLIENT_NAME=Renuevo Almohadones
NEXT_PUBLIC_BRAND_COLOR=#9b8b75
NEXT_PUBLIC_DOMAIN=renuevohogar.com

# WhatsApp — visibles en el cliente
NEXT_PUBLIC_WHATSAPP_NUMBER=549XXXXXXXXXX   # Con código de país, sin + ni espacios
NEXT_PUBLIC_WHATSAPP_MESSAGE=Hola! Vi su tienda online y me interesa...

# Assets — visibles en el cliente
NEXT_PUBLIC_LOGO_URL=/logo-renuevo.png      # archivo en /public/
```

---

## Instrucciones para Superpowers

Al iniciar trabajo en este repo:
1. Leer este `CLAUDE.md`, `../CLAUDE.md` (raíz) y `../prodcast_api/CLAUDE.md` antes de actuar
2. Los endpoints `/api/v1/public/*` de prodcast_api **ya están implementados** — no hace falta verificarlos
3. Al finalizar brainstorming → guardar spec en `docs/spec.md`
4. Al generar plan → guardar en `docs/plan.md`
5. Al completar cada tarea → actualizar `docs/progress.md`
6. TDD: tests de componentes con Vitest + RTL. Usar alias `@/` en imports de tests
7. Verificar siempre en viewport 375px (mobile-first)
8. Nunca hardcodear colores, textos o números de contacto — siempre desde `src/config/client.ts`
9. Si un client component necesita datos de config, leer de `clientConfig` directamente (las vars son `NEXT_PUBLIC_`). Solo `tenantSlug` es server-only
10. ESLint 9: usar `eslint.config.mjs` (flat config). No crear `.eslintrc.*`
