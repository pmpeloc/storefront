# Storefront Sprint 1 — Spec

## Objetivo
Ecommerce customer-facing para Renuevo Almohadones. MVP con catálogo, detalle y CTA por WhatsApp. Sin carrito ni checkout (Sprint 2).

## Alcance Sprint 1

### Páginas
- **Homepage** (`/`): Hero banner + productos destacados + catálogo completo con filtro por categoría
- **Detalle de producto** (`/productos/[slug]`): imagen, nombre, precio, descripción, stock, botón WhatsApp
- **Sitemap** (`/sitemap.xml`): generado dinámicamente con ISR
- **Robots** (`/robots.txt`): generado dinámicamente

### Funcionalidades
- Filtrado por categoría (client-side con SWR)
- WhatsApp CTA con mensaje pre-armado con nombre y precio del producto
- SEO básico: title, description, Open Graph por página
- ISR: homepage revalida cada 60s, detalle cada 300s
- Mobile-first (375px como viewport mínimo de referencia)
- Multi-tenant: toda configuración viene de env vars, cero hardcoding

### Fuera de alcance (Sprint 2)
- Carrito de compras
- Checkout con Mobbex
- Panel de pedidos

## Decisiones técnicas
- `TENANT_SLUG` es server-only → protegido vía route handler `/api/products`
- `NEXT_PUBLIC_*` para config visible en cliente (colores, nombre, WhatsApp)
- `bg-brand` usa CSS variable `--brand-color` definida en `<body>` → color dinámico sin rebuild
- Imágenes vía `next/image` con `remotePatterns` para Supabase Storage
