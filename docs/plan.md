# Storefront Sprint 1 — Plan

## [DONE] setup-proyecto
- Archivo: package.json, tsconfig.json, next.config.mjs, tailwind.config.ts, postcss.config.mjs, vitest.config.ts
- Implementación: scaffolding completo con Next.js 14, TypeScript strict, Tailwind v3, SWR, Vitest

## [DONE] core-lib
- Archivo: src/types/product.ts, src/config/client.ts, src/lib/api.ts, src/lib/whatsapp.ts
- Implementación: tipos alineados con prodcast_api, config multi-tenant por env vars, cliente HTTP con ISR, helper WhatsApp

## [DONE] componentes-ui
- Archivo: src/components/ui/Badge.tsx, src/components/ui/Skeleton.tsx
- Implementación: Badge (category/stock/featured), Skeleton + ProductCardSkeleton

## [DONE] componentes-layout
- Archivo: src/components/layout/Header.tsx, src/components/layout/Footer.tsx
- Implementación: Header sticky con logo/nombre, Footer con link WhatsApp

## [DONE] componentes-producto
- Archivo: src/components/product/{WhatsAppButton,ProductCard,ProductDetail,ProductImages,ProductGrid}.tsx
- Implementación: grilla responsive 2/3/4 cols, filtros por categoría con SWR, CTA WhatsApp

## [DONE] componentes-home
- Archivo: src/components/home/{HeroBanner,FeaturedProducts}.tsx
- Implementación: hero con CTA a catálogo y WhatsApp, sección destacados

## [DONE] paginas
- Archivo: src/app/{layout,page,sitemap,robots}.tsx, src/app/productos/[slug]/page.tsx, src/app/api/products/route.ts
- Implementación: ISR, generateStaticParams, metadata dinámica, sitemap/robots

## [PENDING] instalar-dependencias
- Archivo: node_modules/
- Implementación: npm install en storefront/

## [PENDING] tests-componentes
- Archivo: src/components/**/*.test.tsx
- Test: WhatsAppButton genera URL correcta, ProductCard renderiza nombre y precio, ProductGrid filtra por categoría
- Implementación: Vitest + RTL

## [PENDING] deploy-vercel
- Configurar variables de entorno en Vercel para Renuevo Almohadones
- Conectar dominio renuevohogar.com
