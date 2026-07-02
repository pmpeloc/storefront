# Impulso Ecommerce App — Plan de Tareas (Sprint 2)

**Spec de referencia:** `docs/spec.md`  
**Generado:** 2026-06-08

> Sprint 1 completado al 100%. Este archivo reemplaza ese plan.
> Requiere que impulso_ecommerce_api Sprint 2 esté en marcha primero (migration 005 + endpoint /orders).

---

## Fase 0 — Dependencias

## [PENDING] install-deps-sprint2
- Archivo: `package.json`, `node_modules/`
- Test primero: N/A — configuración
- Implementación: `npm install zustand zod react-hook-form @hookform/resolvers`
- Verificación: `npm install` completa sin errores; packages aparecen en `package.json`

---

## Fase 1 — Cart Store

## [PENDING] cart-store
- Archivo: `src/store/cartStore.ts`
- Test primero: `src/store/cartStore.test.ts` — `addItem` agrega item, `addItem` con mismo id incrementa quantity, `removeItem` elimina item, `clear` vacía el carrito, `total` calcula suma correcta, `itemCount` cuenta items totales
- Implementación: Zustand v5 store con middleware `persist` (key: `renuevo-cart`). Incluir `addItem`, `removeItem`, `updateQuantity`, `clear`, `toggleDrawer`, computed `total` y `itemCount`.
- Verificación: Test pasa (6 casos); localStorage persiste entre renders

---

## Fase 2 — Componentes Cart

## [PENDING] cart-button
- Archivo: `src/components/cart/CartButton.tsx`
- Test primero: `CartButton.test.tsx` — renderiza ícono carrito; si `itemCount > 0` muestra badge numérico; al click llama `cartStore.toggleDrawer`
- Implementación: `'use client'`. Ícono carrito (Heroicons o SVG inline). Badge condicional. `onClick` → `useCartStore().toggleDrawer()`.
- Verificación: Test pasa (3 casos); badge no aparece si `itemCount === 0`

## [PENDING] cart-drawer
- Archivo: `src/components/cart/CartDrawer.tsx`
- Test primero: `CartDrawer.test.tsx` — renderiza lista de items; stepper +/- llama `updateQuantity`; botón eliminar llama `removeItem`; "Finalizar compra" navega a `/checkout`
- Implementación: `'use client'`. Slide-over desde la derecha con overlay oscuro. Lista de items: imagen, nombre, precio, stepper +/-, botón eliminar. Total al pie + botón que usa `next/navigation` para ir a `/checkout`. Se cierra al hacer clic en overlay.
- Verificación: Test pasa (4 casos); animación slide-over funciona en mobile

## [PENDING] update-header
- Archivo: `src/components/layout/Header.tsx`
- Test primero: `Header.test.tsx` — renderiza CartButton
- Implementación: Agregar `CartButton` al Header. Agregar `CartDrawer` a `layout.tsx` (fuera del Header, a nivel raíz). Server component Header puede importar client component CartButton.
- Verificación: Test pasa; badge se actualiza al agregar items

---

## Fase 3 — Checkout Flow

## [PENDING] checkout-page
- Archivo: `src/app/checkout/page.tsx`
- Test primero: `checkout/page.test.tsx` — formulario renderiza todos los campos; submit con datos válidos llama `POST /api/v1/public/orders`; si carrito vacío redirige a inicio; error de API muestra mensaje
- Implementación: `'use client'`. React Hook Form + Zod para validación. Campos: nombre, email, teléfono, calle, ciudad, provincia, CP. Al submit: POST al endpoint, redirige a `window.location.href = checkoutUrl` (Mobbex) o a `/checkout/success?orderId=...` en modo stub.
- Verificación: Test pasa (4 casos); validación en tiempo real funciona en mobile

## [PENDING] success-page
- Archivo: `src/app/checkout/success/page.tsx`
- Test primero: `success/page.test.tsx` — muestra mensaje de confirmación; lee `orderId` de searchParams; llama `cartStore.clear()`
- Implementación: `'use client'` (necesita `useSearchParams` para leer `?orderId=`). Mensaje de éxito. Lee `orderId`. Llama `clear()` en `useEffect`. Link a la tienda.
- Verificación: Test pasa (2 casos); carrito vacío después de visitar la página

## [PENDING] failure-page
- Archivo: `src/app/checkout/failure/page.tsx`
- Test primero: `failure/page.test.tsx` — muestra mensaje de error; botón "Volver al carrito" activa `cartStore.toggleDrawer`
- Implementación: `'use client'`. Mensaje de error amigable. Botón que llama `toggleDrawer()` para reabrir el carrito.
- Verificación: Test pasa (2 casos)

---

## Fase 4 — ProductCard (Add to Cart)

## [PENDING] product-card-add-to-cart
- Archivo: `src/components/product/ProductCard.tsx` (update)
- Test primero: `ProductCard.test.tsx` (update) — botón "Agregar al carrito" llama `cartStore.addItem`; si item ya está en carrito muestra "En carrito" con badge
- Implementación: Agregar botón "Agregar al carrito" en `ProductCard`. El botón WhatsApp puede coexistir o reemplazarse — confirmar con producto. Usar `useCartStore().addItem(product)`.
- Verificación: Test pasa; badge en CartButton se actualiza inmediatamente

---

## Fase 5 — Variables de Entorno

## [PENDING] env-vars-sprint2
- Archivo: `.env.local.example` (update), `.env.local` (gitignored)
- Test primero: N/A
- Implementación: Agregar al `.env.local.example`:
  ```
  NEXT_PUBLIC_CHECKOUT_SUCCESS_URL=https://renuevohogar.com/checkout/success
  NEXT_PUBLIC_CHECKOUT_FAILURE_URL=https://renuevohogar.com/checkout/failure
  ```
- Verificación: Variables disponibles en CheckoutPage
