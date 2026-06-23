# Storefront — Ecommerce Template

> Leer también: `../CLAUDE.md` para contexto global del proyecto.

## Propósito

Ecommerce customer-facing construido como template reutilizable para múltiples clientes de Red Impulso. Desde Sprint 2 (2026-06-19) es **un único deploy multi-dominio**: Renuevo Almohadones (`renuevohogar.com`) y los clientes que se sumen (próximo: Antonello Muebles) corren sobre el mismo deploy de Vercel, resueltos por dominio — ver sección "Multi-tenant" más abajo.

Consume la API de `prodcast_api` — los productos que el fabricante carga con la PWA de Prodcast aparecen automáticamente en el ecommerce cuando su `status = 'published'`.

---

## Convención de Naming (OBLIGATORIO)

**Refactor de naming completado (2026-06-19):** todo el código en español fue traducido al inglés.

Reglas para código nuevo:
1. **Carpetas, archivos, componentes, funciones, variables, tipos** → siempre en inglés.
2. **Comentarios** → siempre en español.
3. **Excepción:** carpetas de rutas dentro de `src/app/` que son visibles en la URL (ej: `colecciones`, `cuenta`, `productos`, `contacto`, `nosotros`, `favoritos`, `buscar`, `inspiracion`, `login`) se quedan en español tal cual, porque son parte de la URL pública del sitio. Las funciones de página dentro de esas carpetas sí van en inglés (ej: `app/cuenta/page.tsx` exporta `AccountPage`, no `CuentaPage`).
4. **Copy visible al usuario** (textos de UI, labels, mensajes, `aria-label`) no es código — se mantiene en español sin restricción.

Esto no aplica a `src/types/product.ts` (`PublicProduct`), que espeja a propósito el contrato snake_case real de `prodcast_api` — no traducir esos campos.

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

**Sprint 2 — Compra online ✅ COMPLETADO (2026-06-08):**
- Carrito de compras (Zustand + localStorage persist key: renuevo-cart)
- Checkout con Mobbex (redirect a checkoutUrl)
- Confirmación de pedido por email (Resend, gestionado por prodcast_api)
- Sin panel de pedidos en Sprint 2 — solo email

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

> **Sprint 1:** Sin Zustand ni React Hook Form — no hay auth ni formularios complejos en el MVP.
> **Sprint 2 ✅:** Agrega Zustand v5 (cart store + persist), Zod (validación), React Hook Form + @hookform/resolvers (checkout form).
> **Sin next-sitemap** — se usa el sitemap dinámico nativo de Next.js 14 (`app/sitemap.ts`), más simple y compatible con ISR.

---

## Multi-tenant: un solo deploy, múltiples dominios (Sprint 2 — 2026-06-19)

**Reemplaza el modelo anterior** (un deploy por cliente, branding en env vars `NEXT_PUBLIC_*` + `src/config/client.ts`, ya eliminado). Ahora un único deploy de storefront en Vercel sirve a todos los clientes (Renuevo, Antonello Muebles, etc.), resolviendo el tenant por el dominio de cada request.

### Flujo de resolución de tenant

1. **`src/middleware.ts`** lee el header `host` de la request y resuelve el `tenantSlug` consultando **Vercel Edge Config** (lookup sub-ms en el Edge Runtime — nunca le pega directo a prodcast_api desde el middleware, porque el fetch cache de Next no aplica igual ahí).
   - En dev local sin `EDGE_CONFIG` seteado, usa un fallback hardcodeado (`localhost:3000 → el-renuevo`).
   - Si el dominio no matchea ningún tenant, reescribe a `/sites/unknown` (landing institucional, no un 404 plano).
2. Si resuelve, reescribe la request a `/sites/<tenantSlug>/<path original>` y setea el header interno `x-tenant-slug` (usado por `app/api/products/route.ts`, nunca derivado del path).
3. **`src/app/sites/[tenant]/layout.tsx`** (Server Component) recibe `params.tenant`, llama a `fetchTenantConfigBySlug` (`src/lib/tenant-config.ts` → `GET /api/v1/public/tenant-config` en prodcast_api) y envuelve el árbol en `TenantConfigProvider` (`src/components/providers/TenantConfigProvider.tsx`). Cualquier client component lee el branding con `useTenantConfig()` — ya no existe `clientConfig` ni `src/config/client.ts`.
4. **`generateStaticParams`** en ese layout pre-renderiza (ISR) los tenants conocidos en build time (`GET /api/v1/public/tenants`), con **`dynamicParams` implícito en `true`** — un tenant nuevo, dado de alta sin redeploy, se renderiza on-demand en su primera visita y queda cacheado igual que cualquier página ISR.

> **Naming:** la carpeta es `sites/[tenant]` (sin guion bajo). Next.js trata `_foldername` como "private folder" excluida del routing — con guion bajo, ninguna ruta se generaba. Lección aprendida durante este sprint.

### Sincronización dominio → tenant (Edge Config)

`tenant_domains` en prodcast_api/Supabase es la fuente de verdad. `scripts/sync-edge-config.ts` (`npm run sync:edge-config`) lee esa tabla y sobreescribe el mapeo completo en Vercel Edge Config. Correr a mano después de crear/editar un `tenant_domain` (ya existe el CRUD admin en prodcast_api, ver su CLAUDE.md — falta solo automatizar el trigger).

**Las keys de Edge Config solo aceptan alfanumérico + `_`/`-`** (no `:` ni `.`). Un dominio real (`renuevohogar.com`) no es una key válida tal cual. `src/lib/edge-config-key.ts` exporta `domainToEdgeConfigKey()` — la usan tanto `middleware.ts` (lookup) como `sync-edge-config.ts` (write). **Si tocás el encoding, tocalo en ese único archivo** — si se desincronizan, el middleware deja de resolver todos los dominios sin ningún error visible (`get()` simplemente no encuentra la key).

### Matcher del middleware — qué NO debe reescribirse

`config.matcher` en `middleware.ts` excluye: `_next`, `sites` (acceso directo bloqueado), `robots.txt` (vive en la raíz, ver abajo), y cualquier path que termine en una extensión de archivo estático (`.png`, `.jpg`, `.css`, `.js`, etc.). **Cualquier asset nuevo en `public/` con una extensión no listada ahí se va a romper en producción** (se reescribe a `/sites/<tenant>/esa-ruta`, que no existe → 404) — agregar la extensión a la regex del matcher si hace falta.

`/api/*` **sí** pasa por el middleware (necesita el header `x-tenant-slug`), pero el middleware nunca le reescribe el path — `app/api/*` vive deliberadamente en la raíz, no bajo `sites/[tenant]/`, así que reescribirlo rompería la ruta.

### `sitemap.ts` / `robots.ts` — limitaciones reales de Next.js (no obvias, costaron 3 rounds de debugging en prod)

1. **Necesitan `export const dynamic = 'force-dynamic'`** si usan `headers()`/`cookies()`. Sin esto, Next los intenta pre-renderizar estáticos en build y `headers()` rompe en runtime (500 en sitemap, ruta ni generada en robots).
2. **No reciben `params` del segmento dinámico padre** — a diferencia de `page.tsx`/`layout.tsx`, un `sitemap.ts`/`robots.ts` dentro de `sites/[tenant]/` NO recibe `{ params: { tenant } }`. Si necesitás el tenant ahí, leé `x-tenant-slug` del header (mismo patrón que `app/api/products/route.ts`), nunca asumas que te llega por params.
3. **`robots.ts` no soporta vivir en un segmento dinámico en absoluto** (a diferencia de `sitemap.ts`, que sí soporta multi-instancia vía `generateSitemaps()`) — puesto en `sites/[tenant]/robots.ts`, Next silenciosamente nunca genera la ruta (404, sin error de build). Por eso `robots.ts` vive en `app/robots.ts` (raíz) y resuelve el host vía `headers()` sin necesitar nada per-tenant — el middleware lo excluye del rewrite (`robots\\.txt` en el matcher).

### Brand color dinámico
El color de marca sigue sin hardcodearse en Tailwind, pero ya no viene de una env var fija:
1. `sites/[tenant]/layout.tsx` pone `style={{ '--brand-color': tenantConfig.brand_color }}` en un `<div>` que envuelve Header/Footer/main (no en `<body>` — el `<body>` vive en el layout raíz, que no conoce el tenant)
2. `tailwind.config.ts` define `colors.brand: 'var(--brand-color)'` (sin cambios)
3. Los componentes usan `bg-brand`, `text-brand` normalmente (sin cambios)

### Proxy route handler
`src/app/api/products/route.ts` es un proxy interno que envuelve las llamadas a prodcast_api. Propósito: el client component `ProductGrid` necesita filtrar por categoría en el cliente, pero el tenant se resuelve server-side. El proxy lee `x-tenant-slug` del header seteado por el middleware antes de llamar a la API externa — **nunca** parsea el path reescrito (desacopla el route handler de la convención de carpetas `sites/[tenant]`).

---

## Estructura de Carpetas

```
storefront/
├── src/
│   ├── middleware.ts                # Resuelve tenant por host (Edge Config) → rewrite a /sites/<tenant>/...
│   ├── app/
│   │   ├── layout.tsx                # Root layout — NO conoce el tenant, solo html/body genérico
│   │   ├── globals.css               # @tailwind directives
│   │   ├── robots.ts                  # Raíz a propósito — robots.ts no soporta segmento dinámico (ver sección Multi-tenant)
│   │   ├── api/
│   │   │   └── products/
│   │   │       └── route.ts          # Proxy para filtrado client-side (lee x-tenant-slug del header)
│   │   └── sites/
│   │       ├── unknown/
│   │       │   └── page.tsx          # Landing institucional — dominio no reconocido
│   │       └── [tenant]/
│   │           ├── layout.tsx        # generateStaticParams + dynamicParams=true, TenantConfigProvider, brand CSS var
│   │           ├── page.tsx          # Homepage — ISR 60s
│   │           ├── productos/[slug]/page.tsx   # Detalle (SSG + ISR 300s, generateStaticParams anidado)
│   │           ├── checkout/
│   │           │   ├── page.tsx      # 'use client', force-dynamic — usa params.tenant
│   │           │   ├── success/page.tsx
│   │           │   └── failure/page.tsx
│   │           ├── colecciones/, cuenta/, favoritos/, inspiracion/, buscar/, login/, nosotros/, contacto/
│   │           └── sitemap.ts        # Dinámico (force-dynamic) — lee host y x-tenant-slug de headers(), no de params
│   │
│   ├── components/
│   │   ├── providers/
│   │   │   └── TenantConfigProvider.tsx  # Context + useTenantConfig() — branding por request, ya no env vars
│   │   ├── layout/
│   │   │   ├── Header.tsx          # Logo + nav — sticky, server component. Sprint 2: + CartButton
│   │   │   └── Footer.tsx          # Contacto + link WhatsApp genérico — usa useTenantConfig()
│   │   ├── cart/
│   │   │   ├── CartButton.tsx      # Sprint 2 — ícono + badge, abre drawer
│   │   │   └── CartDrawer.tsx      # Sprint 2 — slide-over desde la derecha
│   │   ├── product/
│   │   │   ├── ProductGrid.tsx     # 'use client' — grilla 2/3/4 cols + filtros SWR
│   │   │   ├── ProductCard.tsx     # Card en listing — imagen, precio, badge, CTA. Sprint 2: + Add to Cart
│   │   │   ├── ProductDetail.tsx   # Vista completa del producto
│   │   │   ├── ProductImages.tsx   # Imagen con placeholder SVG si no hay imagen
│   │   │   └── WhatsAppButton.tsx  # 'use client' — usa useTenantConfig(), mensaje pre-armado
│   │   ├── home/
│   │   │   ├── HeroBanner.tsx      # Hero con CTA a catálogo y WhatsApp directo
│   │   │   └── FeaturedProducts.tsx # Primeros 4 productos is_featured=true
│   │   └── ui/
│   │       ├── Badge.tsx           # Variants: category | stock | featured
│   │       └── Skeleton.tsx        # Skeleton base + ProductCardSkeleton
│   │
│   ├── store/
│   │   └── cartStore.ts            # Sprint 2 — Zustand + persist middleware (key: renuevo-cart)
│   │
│   └── lib/
│       ├── api.ts                  # Cliente HTTP → prodcast_api /public/* — tenantSlug como parámetro explícito
│       ├── tenant-config.ts        # fetchTenantConfigBySlug, fetchAllTenantSlugs → prodcast_api
│       └── whatsapp.ts             # buildWhatsAppUrl + buildGenericWhatsAppUrl (recibe TenantConfig)
│
├── scripts/
│   └── sync-edge-config.ts         # tenant_domains (Supabase) → Vercel Edge Config — npm run sync:edge-config
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
| GET | `/api/v1/public/tenant-config?domain=\|?tenantSlug=` | Branding del tenant (client_name, brand_color, logo_url, favicon_url, whatsapp, email_from) — consumido por `sites/[tenant]/layout.tsx` |
| GET | `/api/v1/public/tenants` | Lista de slugs — usado por `generateStaticParams` para pre-warm ISR por tenant |
| POST | `/api/v1/public/orders` | Sprint 2 — crea orden y retorna `{ orderId, checkoutUrl }` |
| POST | `/api/v1/public/orders/webhook` | Sprint 2 — webhook Mobbex → actualiza status + envía email |

Rate limit en prodcast_api: 200 req/min por IP sobre `/public/*`.

**Respuesta de productos:** El campo `description` ya viene mapeado (`description_optimized ?? description_transcription`). El campo `image_url` ya viene resuelto (`image_optimized_url ?? image_url`). El storefront no necesita lógica de fallback.

---

## Rendering Strategy (SEO)

- **Homepage:** ISR (revalidate: 60s) — se actualiza sin rebuild cuando hay productos nuevos
- **Producto detalle:** SSG + ISR (revalidate: 300s) — URLs estáticas para SEO, se regeneran al publicar. `generateStaticParams` anidado: el layout de `[tenant]` pre-genera los tenants, y `productos/[slug]` recibe `params.tenant` ya resuelto para generar sus propios slugs por tenant (cross-product de Next.js entre segmentos dinámicos anidados)
- **Filtros por categoría:** client-side con SWR — no afecta SEO
- **`sitemap.ts`/`robots.ts`:** dynamic rendering (usan `headers()` porque un tenant puede tener varios dominios) — no afecta el ISR de productos/colecciones, que es lo que importa para el tráfico de descubrimiento. Ver limitaciones reales de Next con estos archivos en la sección Multi-tenant más arriba.

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
export function buildWhatsAppUrl(product: PublicProduct, config: TenantConfig): string {
  const message = encodeURIComponent(
    `Hola! Me interesa el producto *${product.name}* ($${product.price.toLocaleString('es-AR')}). ¿Tienen stock disponible?`
  )
  return `https://wa.me/${config.whatsapp_number ?? ''}?text=${message}`
}

// Para el Footer y el HeroBanner (sin producto específico)
export function buildGenericWhatsAppUrl(config: TenantConfig): string {
  return `https://wa.me/${config.whatsapp_number ?? ''}?text=${encodeURIComponent(config.whatsapp_message ?? '')}`
}
```

`WhatsAppButton` es `'use client'` y lee el branding con `useTenantConfig()` (`src/components/providers/TenantConfigProvider.tsx`) — el número de WhatsApp ya no viene de una env var fija, sino de `tenant_config.whatsapp_number` resuelto por dominio en el layout de `sites/[tenant]`.

---

## Variables de Entorno (post Sprint 2 — multi-tenant)

```bash
# .env.local.example

# API
NEXT_PUBLIC_API_URL=http://localhost:3001

# Vercel Edge Config — mapeo dominio→tenant para el middleware
# Sin esto, dev local usa el fallback hardcodeado en src/middleware.ts
EDGE_CONFIG=

# Sync de tenant_domains → Edge Config (scripts/sync-edge-config.ts, no usado
# por la app en runtime)
SUPABASE_URL=
SUPABASE_SERVICE_KEY=
VERCEL_API_TOKEN=
EDGE_CONFIG_ID=
```

> **Lo que YA NO está acá:** `TENANT_SLUG`, `NEXT_PUBLIC_CLIENT_NAME`, `NEXT_PUBLIC_BRAND_COLOR`, `NEXT_PUBLIC_DOMAIN`, `NEXT_PUBLIC_WHATSAPP_*`, `NEXT_PUBLIC_LOGO_URL`, `NEXT_PUBLIC_CHECKOUT_*_URL`. Todo eso vive en `tenant_config`/`tenant_domains` en prodcast_api y se resuelve en runtime por dominio — un cliente nuevo (ej. Antonello Muebles) no requiere ninguna env var nueva ni redeploy, solo una fila en esas tablas + sync a Edge Config.

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
8. Nunca hardcodear colores, textos o números de contacto — siempre vía `useTenantConfig()` (`src/components/providers/TenantConfigProvider.tsx`) en client components, o `fetchTenantConfigBySlug` (`src/lib/tenant-config.ts`) en server components. `src/config/client.ts` ya no existe.
9. Toda página nueva va bajo `src/app/sites/[tenant]/` (no en `src/app/` directamente) — si no, el middleware no la va a poder resolver por dominio
10. ESLint 9: usar `eslint.config.mjs` (flat config). No crear `.eslintrc.*`
