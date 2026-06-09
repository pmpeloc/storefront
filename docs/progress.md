# Storefront — Estado de Tareas

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

## Pendiente

[ ] assets-logo — Copiar logo-lockup.png, logo-monogram.png, logo-wordmark.png a /public/ desde bundle de diseño
[ ] deploy-storefront — Deploy a Vercel con nuevas vars de entorno (NEXT_PUBLIC_PROMO_BANNER, NEXT_PUBLIC_CUOTAS_TEXT)
[ ] mobbex-credentials — Obtener credenciales Mobbex y activar pagos reales (ver TECHNICAL_DEBT.md A1)
[ ] resend-credentials — Obtener API key Resend y activar emails (ver TECHNICAL_DEBT.md A3)
