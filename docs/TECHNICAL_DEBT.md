# Deuda Técnica — Impulso Ecommerce App Renuevo

Este documento registra todas las features implementadas con **mock data** o marcadas como `// TODO`
en el codebase del impulso_ecommerce_app. Cada entrada indica qué se necesita en el backend para resolverla.

---

## Grupo A — Funcionalidad bloqueada por falta de credenciales (prioridad Alta)

### A1 · Mobbex — Pago con tarjeta
- **Estado:** Checkout implementado. El endpoint `POST /public/orders` está listo en `impulso_ecommerce_api`.
- **Falta:** Credenciales Mobbex (`MOBBEX_API_KEY`, `MOBBEX_ACCESS_TOKEN`) en `.env` de `impulso_ecommerce_api`.
- **Archivos:** `src/app/checkout/page.tsx`
- **Acción:** Obtener credenciales Mobbex → configurar en Railway → testear flujo completo.

### A2 · Talo — Pago por transferencia bancaria
- **Estado:** Botón de pago Talo en paso 3 del checkout (UI implementada). Sin integración de pago real.
- **Falta:** API key Talo + endpoint en `impulso_ecommerce_api` para crear talón de pago.
- **Archivos:** `src/app/checkout/page.tsx` (StepPago, método `transfer`)
- **Acción:** Abrir cuenta Talo → integrar en `impulso_ecommerce_api` con webhook de confirmación.

### A3 · Resend — Emails de confirmación de pedido
- **Estado:** Stub en `impulso_ecommerce_api` (modo mock sin credenciales).
- **Falta:** API key Resend + dominio verificado `renuevohogar.com`.
- **Archivos:** `impulso_ecommerce_api/src/services/email.service.ts`
- **Acción:** Obtener API key Resend → configurar dominio → activar envío real.

---

## Grupo B — Mock data (requieren cambios en base de datos y API)

### B1 · Precio anterior / compare_price
- **Prioridad:** Alta
- **Descripción:** Los productos muestran precio tachado cuando `oldPrice` existe. Actualmente usa `MOCK_PRODUCTS`.
- **Necesita:** Migration `006_add_compare_price` — agregar columna `compare_price NUMERIC` a tabla `products`.
- **Archivos con TODO:** `src/components/product/ProductCard.tsx`, `src/lib/mock-data.ts`

### B2 · Badges de producto (Más vendido / Novedad / Oferta)
- **Prioridad:** Alta
- **Descripción:** Cards muestran badges de estado. Actualmente hardcodeado en `MOCK_PRODUCTS.tag`.
- **Necesita:** Columna `badge VARCHAR(20)` en tabla `products` + campo en `PublicProduct`.
- **Archivos con TODO:** `src/components/product/ProductCard.tsx`, `src/lib/mock-data.ts`

### B3 · Galería de imágenes con thumbnails
- **Prioridad:** Alta
- **Descripción:** `ProductDetail` muestra galería con thumbnails seleccionables. Actualmente usa placeholders.
- **Necesita:** Tabla `product_images (id, product_id, url, position)` + endpoint que retorne array de imágenes.
- **Archivos con TODO:** `src/components/product/ProductDetail.tsx`

### B4 · Variantes de color y talle (swatches)
- **Prioridad:** Alta
- **Descripción:** `ProductDetail` muestra swatches de colores y botones de talle.
- **Necesita:** Tabla `product_variants (id, product_id, type, value, stock)` + endpoint `GET /public/products/:slug/variants`.
- **Archivos con TODO:** `src/components/product/ProductDetail.tsx`, `src/lib/mock-data.ts`

### B5 · Productos relacionados "Combina con"
- **Prioridad:** Media
- **Descripción:** Sección de productos sugeridos en `ProductDetail`.
- **Necesita:** Endpoint `GET /public/products/:slug/related?tenantSlug=` (por categoría o curación manual).
- **Archivos con TODO:** `src/components/product/ProductDetail.tsx`

### B6 · Buscador
- **Prioridad:** Media
- **Descripción:** Página `/buscar` filtra sobre `MOCK_PRODUCTS` localmente.
- **Necesita:** Endpoint `GET /public/products/search?q=&tenantSlug=` con búsqueda full-text en PostgreSQL.
- **Archivos con TODO:** `src/app/buscar/page.tsx`

### B7 · Colecciones
- **Prioridad:** Media
- **Descripción:** Páginas `/colecciones` y `/colecciones/[slug]` muestran `MOCK_COLLECTIONS`.
- **Necesita:** Tabla `collections (id, tenant_id, name, slug, description, tone, product_ids[])` + endpoints `GET /public/collections` y `GET /public/collections/:slug`.
- **Archivos con TODO:** `src/app/colecciones/page.tsx`, `src/app/colecciones/[slug]/page.tsx`

### B8 · Inspiración (masonry)
- **Prioridad:** Media
- **Descripción:** Páginas `/inspiracion` y `/inspiracion/[slug]` muestran `MOCK_INSPIRATION`.
- **Necesita:** Tabla `inspirations (id, tenant_id, title, slug, category, image_url, product_ids[])` + endpoints correspondientes.
- **Archivos con TODO:** `src/app/inspiracion/page.tsx`, `src/app/inspiracion/[slug]/page.tsx`

### B9 · Favoritos — sincronización con cuenta
- **Prioridad:** Media
- **Descripción:** Favoritos persisten en localStorage (sin auth). Funciona sin cuenta.
- **Necesita:** Auth implementado + tabla `user_favorites (user_id, product_id)` + PATCH/GET endpoints privados.
- **Archivos con TODO:** `src/app/favoritos/page.tsx`, `src/store/favoritesStore.ts`

### B10 · Rating y reseñas
- **Prioridad:** Baja
- **Descripción:** `ProductDetail` muestra rating y cantidad de reseñas de `MOCK_PRODUCTS`.
- **Necesita:** Tabla `reviews (id, product_id, user_id, rating, body)` + endpoint de creación (solo usuarios autenticados con compra confirmada).
- **Archivos con TODO:** `src/components/product/ProductDetail.tsx`

### B11 · Newsletter
- **Prioridad:** Baja
- **Descripción:** Formulario de newsletter en `Footer.tsx` — sin backend.
- **Necesita:** Endpoint `POST /public/newsletter` + integración Resend (lista de contactos) o similar.
- **Archivos con TODO:** `src/components/layout/Footer.tsx`

### B12 · Mi Cuenta — auth real
- **Prioridad:** Baja (depende de decisión de producto)
- **Descripción:** Páginas `/cuenta`, `/cuenta/pedidos`, `/cuenta/datos`, `/login` usan `MOCK_USER` y `MOCK_ORDERS`.
- **Necesita:** Auth (Supabase Auth o JWT propio) + endpoints privados para usuarios y pedidos + middleware de protección de rutas.
- **Archivos con TODO:** `src/app/cuenta/page.tsx`, `src/app/cuenta/pedidos/page.tsx`, `src/app/cuenta/datos/page.tsx`, `src/app/login/page.tsx`

### B13 · Formulario de contacto
- **Prioridad:** Baja
- **Descripción:** Formulario en `/contacto` no envía datos reales.
- **Necesita:** Endpoint `POST /public/contact` + envío por Resend (depende de A3).
- **Archivos con TODO:** `src/app/contacto/page.tsx`

---

## Assets pendientes

### Logo PNG — assets del diseño
- **Descripción:** Los archivos `logo-lockup.png`, `logo-monogram.png`, `logo-wordmark.png` y variantes light deben copiarse a `impulso_ecommerce_app/public/` desde el design bundle.
- **Acción:** Extraer del bundle de diseño → copiar a `/public/` → actualizar `NEXT_PUBLIC_LOGO_URL` y referencias en `Header.tsx`.

---

## Leyenda de prioridades

| Prioridad | Criterio |
|-----------|----------|
| Alta | Bloquea conversión o funcionalidad core del ecommerce |
| Media | Mejora experiencia pero no bloquea ventas |
| Baja | Nice-to-have, depende de otras features o decisión de producto |
