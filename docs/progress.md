# Storefront — Estado de Tareas

**Sprint 1 — Catálogo + WhatsApp CTA** ✅ COMPLETADO en producción (renuevohogar.com)
**Sprint 2 — Carrito + Checkout Mobbex + Email** ✅ COMPLETADO
**Completado Sprint 2:** 2026-06-08

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
