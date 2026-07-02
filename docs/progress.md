# Impulso Ecommerce App — Estado de Tareas

**Sprint 1 — Catálogo + WhatsApp CTA** ✅ COMPLETADO en producción (renuevohogar.com)
**Sprint 2 — Carrito + Checkout Mobbex + Email** ✅ COMPLETADO
**Rediseño completo (Design Sprint)** ✅ COMPLETADO — 2026-06-09

---

## Sprint 1 — Completado ✅ (en producción)

[DONE] setup-proyecto
[DONE] core-lib
[DONE] componentes-ui
[DONE] componentes-layout
[DONE] componentes-producto
[DONE] componentes-home
[DONE] paginas
[DONE] instalar-dependencias
[DONE] tests-componentes
[DONE] deploy-vercel — renuevohogar.com ✅

---

## Sprint 2 — Completado ✅

[DONE] install-deps-sprint2 — zustand, zod, react-hook-form, @hookform/resolvers
[DONE] cart-store — src/store/cartStore.ts + .test.ts (Zustand + persist key:renuevo-cart)
[DONE] cart-button — src/components/cart/CartButton.tsx + .test.tsx (badge con itemCount)
[DONE] cart-drawer — src/components/cart/CartDrawer.tsx + .test.tsx (slide-over, stepper, eliminar)
[DONE] update-header — Header.tsx + layout.tsx (CartButton en nav, CartDrawer en root)
[DONE] checkout-page — src/app/checkout/page.tsx + .test.tsx (RHF + Zod, POST /orders, redirige a checkoutUrl)
[DONE] success-page — src/app/checkout/success/page.tsx + .test.tsx (clear cart, muestra orderId)
[DONE] failure-page — src/app/checkout/failure/page.tsx + .test.tsx (reabrir carrito)
[DONE] product-card-add-to-cart — AddToCartButton.tsx + ProductCard.tsx actualizado (12 tests)
[DONE] env-vars-sprint2 — .env.local.example actualizado (NEXT_PUBLIC_CHECKOUT_SUCCESS/FAILURE_URL)

---

## Rediseño completo (Design Sprint) — Completado ✅ — 2026-06-09

### Fundación
[DONE] design-tokens — globals.css: CSS custom properties completo (taupe, marfil, beige, crema, marron, etc.)
[DONE] fonts — Google Fonts: Cormorant Garamond (--font-head) + Poppins (--font-ui)
[DONE] tailwind-tokens — tailwind.config.ts extendido con todos los tokens semánticos
[DONE] layout-update — layout.tsx: PromoBanner + BottomNav + ToastContainer + bg-crema

### Nuevos stores y datos
[DONE] mock-data — src/lib/mock-data.ts: 7 productos, 5 categorías, 3 colecciones, 6 inspiraciones
[DONE] favorites-store — src/store/favoritesStore.ts: Zustand + persist localStorage
[DONE] toast-store — src/store/toastStore.ts: auto-remove 3s, tipos ok/error/default

### Componentes de layout
[DONE] promo-banner — src/components/layout/PromoBanner.tsx: NEXT_PUBLIC_PROMO_BANNER
[DONE] header-redesign — Header.tsx: hamburger + logo centrado + mega-menú desktop + search toggle
[DONE] mobile-drawer — src/components/layout/MobileDrawer.tsx: slide-in from left
[DONE] footer-redesign — Footer.tsx: newsletter + 4 col grid + social + payment badges
[DONE] bottom-nav — src/components/layout/BottomNav.tsx: 5 items, badges carrito+favoritos
[DONE] toast — src/components/ui/Toast.tsx: ToastContainer posicionado sobre bottom nav
[DONE] skeleton-update — Skeleton.tsx: shimmer animation + ProductDetailSkeleton + CartItemSkeleton

### Componentes de producto
[DONE] product-card-redesign — ProductCard.tsx: favorite overlay, badge, compare price, cuotas
[DONE] add-to-cart-btn — AddToCartButton.tsx: design tokens, size prop sm/lg, toast
[DONE] product-grid-redesign — ProductGrid.tsx: eyebrow text, filter chips marron, empty state
[DONE] product-detail-redesign — ProductDetail.tsx: galería mock, swatches, stepper, comprar ahora, relacionados

### Home
[DONE] hero-redesign — HeroBanner.tsx: Cormorant Garamond, italic accent, benefits bar
[DONE] featured-redesign — FeaturedProducts.tsx: eyebrow text, "Ver todo" link

### Carrito
[DONE] cart-button-redesign — CartButton.tsx: bag icon, design tokens
[DONE] cart-drawer-redesign — CartDrawer.tsx: slide animation, free shipping bar, empty state, SSL badge

### Checkout
[DONE] checkout-3-steps — checkout/page.tsx: 3 pasos (Datos→Envío→Pago), progress indicator, order mini-summary
[DONE] checkout-talo — Talo como método de pago en paso 3 (radio button UI)
[DONE] success-redesign — checkout/success/page.tsx: checkmark verde, status badges, CTAs
[DONE] failure-redesign — checkout/failure/page.tsx: error state, volver al carrito

### Nuevas páginas
[DONE] buscar — src/app/buscar/page.tsx: search input + filtro mock + empty states
[DONE] favoritos — src/app/favoritos/page.tsx: grid de favoritos guardados en localStorage
[DONE] nosotros — src/app/nosotros/page.tsx: historia, valores, CTA (static)
[DONE] contacto — src/app/contacto/page.tsx: 3 canales + formulario (UI, sin backend)
[DONE] colecciones — src/app/colecciones/page.tsx: listing mock con tono de color
[DONE] colecciones-slug — src/app/colecciones/[slug]/page.tsx: detalle con productos
[DONE] inspiracion — src/app/inspiracion/page.tsx: masonry 2 cols + filtros por categoría
[DONE] inspiracion-slug — src/app/inspiracion/[slug]/page.tsx: "Comprá el look" con productos
[DONE] cuenta — src/app/cuenta/page.tsx: overview mock + último pedido
[DONE] cuenta-pedidos — src/app/cuenta/pedidos/page.tsx: lista de pedidos mock
[DONE] cuenta-datos — src/app/cuenta/datos/page.tsx: form edición perfil mock
[DONE] login — src/app/login/page.tsx: login/register UI (sin backend)

### Documentación
[DONE] technical-debt — docs/TECHNICAL_DEBT.md: 13 items documentados con prioridad y archivos

---

## Desktop Design — Completado ✅ — 2026-06-09

[DONE] desktop-layout-header — Header.tsx: mega-menú Catálogo en hover (MOCK_CATEGORIES), logo md:left, nav md:center, icons md:right
[DONE] desktop-layout-herobanner — HeroBanner.tsx: split md:grid-cols-2 (texto izquierda / imagen derecha), benefits bar con subtexto en md:
[DONE] desktop-layout-productgrid — ProductGrid.tsx: sidebar sticky de categorías en md: (hidden mobile), chips solo mobile, md:grid-cols-3 lg:grid-cols-4
[DONE] desktop-layout-productcard — ProductCard.tsx: quick-add button md:opacity-0 → md:group-hover:opacity-100
[DONE] desktop-layout-productdetail — ProductDetail.tsx: thumbnails verticales izquierda en md: (flex-col), relacionados md:grid-cols-4
[DONE] desktop-layout-cartdrawer — CartDrawer.tsx: md:w-[420px] md:max-w-none
[DONE] desktop-layout-checkout — checkout/page.tsx: md:grid-cols-[1fr_360px], sticky OrderSummary sidebar derecha, form izquierda
[DONE] desktop-layout-colecciones — colecciones/page.tsx: md:grid-cols-3 con imagen hero vertical
[DONE] desktop-layout-inspiracion — inspiracion/page.tsx: md:columns-3 masonry
[DONE] desktop-layout-favoritos — favoritos/page.tsx: md:grid-cols-3 lg:grid-cols-4
[DONE] desktop-layout-cuenta — CuentaShell.tsx: sidebar nav md:grid-cols-[220px_1fr], sticky top-[88px]
[DONE] desktop-layout-contacto — contacto/page.tsx: showroom/dirección hidden md:block

---

## Pendiente

[ ] assets-logo — Copiar logo-lockup.png, logo-monogram.png, logo-wordmark.png a /public/ desde bundle de diseño
[ ] deploy-impulso_ecommerce_app — Deploy a Vercel con nuevas vars de entorno (NEXT_PUBLIC_PROMO_BANNER, NEXT_PUBLIC_CUOTAS_TEXT)
[ ] mobbex-credentials — Obtener credenciales Mobbex y activar pagos reales (ver TECHNICAL_DEBT.md A1)
[ ] resend-credentials — Obtener API key Resend y activar emails (ver TECHNICAL_DEBT.md A3)

---

## Multi-tenant — Sprint 2: middleware + sites/[tenant] (parametrización por cliente)

**Completado:** 2026-06-19

Objetivo: un único deploy de impulso_ecommerce_app sirve múltiples dominios/clientes (antes: un deploy por cliente con env vars hardcodeadas a Renuevo). Ver plan completo de parametrización en la raíz del monorepo.

[DONE] middleware — src/middleware.ts: resuelve tenant por header `host` vía Vercel Edge Config (fallback hardcodeado solo en dev sin EDGE_CONFIG), rewrite a `/sites/<tenant>/...` + header interno `x-tenant-slug`
[DONE] sync-edge-config — scripts/sync-edge-config.ts (`npm run sync:edge-config`): sincroniza tenant_domains (Supabase) → Vercel Edge Config
[DONE] restructure-app-router — TODO src/app/* movido a src/app/sites/[tenant]/* (home, productos, colecciones, checkout, contacto, cuenta, favoritos, inspiracion, buscar, login, nosotros, sitemap.ts, robots.ts)
[DONE] tenant-layout — src/app/sites/[tenant]/layout.tsx: generateStaticParams (pre-warm) + dynamicParams=true (alta de tenant sin redeploy), generateMetadata dinámico, TenantConfigProvider
[DONE] root-layout-minimal — src/app/layout.tsx: ya no conoce el tenant, solo html/body genérico
[DONE] tenant-config-provider — src/components/providers/TenantConfigProvider.tsx + src/lib/tenant-config.ts: branding (antes en src/config/client.ts vía env vars) ahora viene de impulso_ecommerce_api (tenant_config) resuelto en runtime
[DONE] api-lib-tenant-param — src/lib/api.ts y src/lib/whatsapp.ts: tenantSlug pasa a ser parámetro explícito, no env var fija
[DONE] fix-checkout-tenant-bug — checkout/page.tsx ya no lee `NEXT_PUBLIC_TENANT_SLUG` (no existía, era un bug) — usa `params.tenant`
[DONE] products-proxy-header — app/api/products/route.ts lee `x-tenant-slug` del header (seteado por middleware), no de env ni del path
[DONE] unknown-tenant-page — src/app/sites/unknown/page.tsx: landing institucional cuando el dominio no matchea ningún tenant (no 404 plano)
[DONE] env-cleanup-sprint2 — .env.local.example reducido a NEXT_PUBLIC_API_URL + vars de Edge Config/sync (branding ya no vive en env)
[DONE] tests-updated — WhatsAppButton.test.tsx (TenantConfigProvider en vez de mock de config/client), checkout/page.test.tsx (params prop), ProductCard.test.tsx (mock muerto removido)
[DONE] verificacion — typecheck limpio, `next build` genera todas las rutas bajo /sites/[tenant]/* (SSG donde corresponde), 49/49 tests pasando

**Nota de naming:** la convención inicial usaba `_sites/[tenant]` (con guion bajo), pero Next.js trata cualquier carpeta `_foldername` como "private folder" excluida del routing — ninguna ruta se generaba. Se renombró a `sites/[tenant]` (sin guion bajo) tanto la carpeta como las referencias en middleware.ts.

---

## Multi-tenant — Deploy real a producción (2026-06-23)

Primer deploy del Sprint 2/3 a `renuevohogar.com` (Vercel) + Supabase real. Quedó roto varias veces seguidas — documentado para no repetir los mismos errores con Antonello u otro cliente nuevo.

**Datos faltantes en Supabase real** (el-renuevo nunca tuvo `tenant_config`/`tenant_domains` cargados — Sprint 1 solo los sembraba en local):
[DONE] tenant_config y tenant_domains (renuevohogar.com + www.renuevohogar.com) creados a mano para el tenant `el-renuevo` real (`fa6ad816-...`)
[DONE] tenant + admin de Antonello Muebles (`antonello-muebles`) onboardeados con `scripts/onboard-tenant.ts` (nuevo — automatiza lo que antes era 100% SQL Editor)
[DONE] dominio `elrenuevo.store` cargado en `tenant_domains` para `antonello-muebles` — **es un dominio de prueba**, no el definitivo del cliente

**Bugs reales encontrados recién al probar contra Vercel real** (ninguno se detectaba en local/tests porque dependen de Edge Config/Vercel real):
[DONE] **Edge Config key format** — las keys de Edge Config solo aceptan alfanumérico + `_`/`-`, no `:` ni `.`. `domain:${host}` (con dominio tipo `renuevohogar.com`) era una key inválida. Fix: `src/lib/edge-config-key.ts` con `domainToEdgeConfigKey()`, usada por `middleware.ts` y `sync-edge-config.ts` — un solo lugar para no desincronizarlas.
[DONE] **Matcher del middleware no excluía assets estáticos** — `/logos/*.png`, `/productos/*.jpg`, etc. se reescribían a `/sites/<tenant>/logos/...` (no existe) → 404 en todas las imágenes. Fix: excluir por extensión de archivo en vez de por nombre de carpeta.
[DONE] **Matcher del middleware no excluía `/api/*` del rewrite** — solo excluía el inexistente `/api/health`. `app/api/products/route.ts` (vive en la raíz a propósito) se reescribía a `/sites/<tenant>/api/products` → 404. Fix: `/api/*` sigue pasando por el middleware (necesita el header `x-tenant-slug`) pero ya no se le reescribe el path.
[DONE] **`sitemap.ts`/`robots.ts` con `headers()` sin `export const dynamic = 'force-dynamic'`** → Next los pre-renderiza estáticos en build y `headers()` tira 500 (sitemap) o la ruta ni se genera (robots).
[DONE] **`robots.ts` no soporta vivir en un segmento dinámico** (`sites/[tenant]/robots.ts`) — a diferencia de `sitemap.ts` (que sí soporta multi-instancia vía `generateSitemaps()`), Next nunca generaba la ruta. Movido a `app/robots.ts` (raíz) — no necesita nada per-tenant, solo el host real vía `headers()`.
[DONE] **`sitemap.ts` asumía que recibía `params.tenant`** — los archivos de metadata (`sitemap.ts`/`robots.ts`) **no reciben los params del segmento dinámico padre** (eso es solo para `page.tsx`/`layout.tsx`). `await params` resolvía a `undefined` → `TypeError` al destructurar → 500. Fix: leer `x-tenant-slug` del header (mismo patrón que `app/api/products/route.ts`), no depender de `params`.

**Verificado en producción tras los fixes:** home, logo, imagen de producto, detalle de producto, proxy `/api/products`, favicon, `/sitemap.xml` (con los 6 productos reales) y `/robots.txt` — todos 200.

**Para el próximo onboarding (Antonello u otro cliente):** correr `scripts/onboard-tenant.ts` + cargar `tenant_config`/`tenant_domains` vía los endpoints admin **antes** de asignarle un dominio real en Vercel — si no, repite el mismo apagón que tuvo Renuevo.
