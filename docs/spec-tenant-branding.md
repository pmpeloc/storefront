# Spec — Parametrización de branding, contenido y theming por tenant

**Fecha:** 2026-07-15
**Motivador:** Distribuidora Nehemías (tercer tenant, `distribuidora-nehemias.com.ar`) está en
producción mostrando el branding, copy y paleta de color de Renuevo Almohadones — el template
de `impulso_ecommerce_app` tiene mucho más hardcodeado a Renuevo de lo que documentaba
`CLAUDE.md`. Detectado a partir de revisar una captura del sitio real.

## Contexto

`impulso_ecommerce_app` es multi-tenant vía `src/app/sites/[tenant]` + `tenant_config` /
`tenant_domains` en Supabase (migraciones 008 y 011). Hoy `tenant_config` cubre identidad
(`client_name`, `logo_url`, `favicon_url`, `whatsapp_number/message`), fuente de productos
(`product_source_mode`, `markup_*`, `external_connector_config`) y método de venta
(`checkout_methods`). No cubre: qué secciones de nav tiene el sitio, copy de footer/meta,
ciudad, imagen default de producto, ni ningún aspecto visual (color/tipografía) — todo eso
está fijo en el código, escrito para el catálogo de muebles de Renuevo.

Este spec cubre dos frentes que se decidió fusionar por tocar los mismos archivos
(`Footer.tsx`, `[tenant]/layout.tsx`, `tenant_config`):

- **Parte 1 — Contenido:** nav, medios de pago, cuotas, footer (tagline/ciudad), imagen
  default de producto ante error de carga.
- **Parte 2 — Theming:** paleta de color y tipografía por tenant, vía un catálogo curado de
  temas (`theme_id`), no colores libres por tenant.

**Fuera de alcance (Spec B, futuro):** contenido curado del hero (headline propio, tiles de
categoría con imagen propia, banner de inspiración, página "Nosotros" con historia de marca).
Se decidió que ese contenido es obligatorio antes de publicar un tenant nuevo y necesita su
propio gate de "sitio en preparación" — diseño separado, no entra acá. Mientras tanto, el
hero/tiles/inspiración de Nehemías se ocultan (ver Parte 1, nav_sections) en vez de mostrar
el contenido de Renuevo.

## Parte 1 — Contenido parametrizable

### Modelo de datos (`impulso_ecommerce_api`, migration `013_tenant_content.sql`)

```sql
ALTER TABLE tenant_config
  ADD COLUMN nav_sections jsonb NOT NULL
    DEFAULT '["catalogo","colecciones","inspiracion","nosotros","contacto"]'::jsonb,
  ADD COLUMN tagline text NULL,
  ADD COLUMN city text NULL,
  ADD COLUMN default_product_image_url text NULL,
  ADD COLUMN theme_id text NOT NULL DEFAULT 'renuevo';
```

(las 5 columnas van en un único `ALTER TABLE` — `theme_id` se explica en la Parte 2, se lista
acá para que la migración 013 quede completa en un solo lugar). El default de `nav_sections`
preserva el comportamiento actual de Renuevo/Antonello sin tocarles el dato. `tagline`, `city`,
`default_product_image_url` son opcionales: si no están, el sitio omite esa pieza (nunca cae
al copy de otro tenant).

### Comportamiento en `impulso_ecommerce_app`

- **`Header.tsx` / `Footer.tsx` — nav:** `NAV_LINKS` y `LINKS_TIENDA`/`LINKS_INFO` dejan de
  ser arrays fijos — se filtran contra `tenantConfig.nav_sections`.
- **`colecciones/[slug]`, `inspiracion/[slug]`, `nosotros` — page.tsx:** cada uno llama
  `notFound()` si su sección no está en `nav_sections`, para que un link directo (fuera del
  nav) tampoco exponga el contenido hardcodeado de Renuevo en esas páginas.
- **`Footer.tsx` — medios de pago:** si `checkout_methods.includes('mobbex')` → badges
  VISA/MASTER/AMEX + "Transferencia · Talo" (comportamiento actual). Si es
  `['whatsapp']` → bloque de "Consultas y pedidos por WhatsApp" con el ícono, sin badges de
  tarjeta.
- **`ProductCard.tsx` / `ProductDetail.tsx` — cuotas:** el texto de cuotas
  (`NEXT_PUBLIC_CUOTAS_TEXT`) solo se renderiza si `checkout_methods.includes('mobbex')`.
- **`Footer.tsx` — tagline/ciudad:** el párrafo de marca usa `tenantConfig.tagline` (si es
  `null`, no se renderiza el párrafo). El copyright usa
  `© {year} {client_name}{city ? ' · ' + city : ''}`.
- **`[tenant]/layout.tsx` — `generateMetadata`:** la meta description pasa de
  `"Diseños para espacios que inspiran"` fijo a `tenantConfig.tagline ?? \`Tienda online de
  ${client_name}\``.
- **`ProductCard.tsx` (y demás lugares con `<Image src={product.image_url}>`) — imagen
  rota:** se agrega `onError` que cambia el `src` a `tenantConfig.default_product_image_url`
  si está seteado, o al gradiente genérico ya existente si no.

### Seed de Distribuidora Nehemías

```ts
nav_sections: ['catalogo', 'contacto'],
city: 'San Luis',
tagline: null,                    // pendiente: Misael define el copy
default_product_image_url: null,  // pendiente, opcional
checkout_methods: ['whatsapp'],   // ya estaba correcto, sin cambios
```

`logo_url` sigue siendo carga manual pendiente (falta el archivo real) — con el fallback de
Parte 2 (ver abajo) deja de mostrar "RENUEVO" aunque todavía no esté cargado.

## Parte 2 — Theming por tenant

### Principio

Los temas son un **catálogo curado en código**, no colores libres por tenant — un tenant
elige un `theme_id` (dato), pero los valores de cada tema se definen y mantienen en el
frontend (`src/lib/themes.ts`), igual que un design system. Esto evita que un tenant termine
con una paleta rota/no probada por accesibilidad de contraste.

### Modelo de datos

`theme_id` es una de las 5 columnas de la migración 013 (ver Parte 1). Vive en la DB (no en un mapa `tenant_slug → theme` hardcodeado en el frontend) para
no requerir redeploy al dar de alta un tenant nuevo — mismo principio que ya rige
`generateStaticParams`/`dynamicParams=true`.

`brand_color` (columna existente, migration 008) casi no se usa hoy — grep confirma un solo
consumidor (la propia inyección en `layout.tsx`; ningún componente lo lee). Se mantiene con un
rol acotado: si está seteado, pisa únicamente el token `--brand` del tema resuelto (permite un
ajuste fino de un tenant sin crear un tema nuevo entero).

### `src/lib/themes.ts`

```ts
export interface ThemeTokens {
  background: string
  surface: string
  txPrimary: string
  txSecondary: string
  txFaint: string
  border: string
  borderSoft: string
  brand: string
  brandHover: string
  success: string
  error: string
  footerBg: string
  hoverSoft: string
  overlayDark: string   // base "r,g,b" para rgba(var(--overlay-dark), alpha)
  fontHead: string
  fontBody: string
  radius: string
}

export const THEMES: Record<string, ThemeTokens> = {
  renuevo: { /* valores actuales de globals.css — el look no cambia */ },
  senal:   { /* valores de senal-tokens.css */ },
}

export const DEFAULT_THEME_ID = 'renuevo'
```

### Inyección server-side (`[tenant]/layout.tsx`)

Reemplaza el `div` que hoy solo inyecta `--brand-color` por uno que inyecta el set completo de
variables del tema resuelto (`THEMES[tenantConfig.theme_id] ?? THEMES[DEFAULT_THEME_ID]`),
más el override opcional de `brand_color`:

```
--background, --surface, --tx, --tx-soft, --tx-faint, --line, --line-soft,
--brand, --brand-hover, --exito, --error, --footer-bg, --hover-soft,
--overlay-dark, --font-head, --font-ui, --radius
```

Es un Server Component (`async function TenantLayout`), así que no hay flash de tema
incorrecto — las variables ya vienen resueltas en el HTML inicial.

### `globals.css` — capa de alias (compatibilidad, cero cambios de JSX)

El `:root` de `globals.css` pasa a ser el *fallback* fuera del wrapper del tenant (páginas de
error, `/sites/unknown`). Dentro del wrapper, el estilo inline de `layout.tsx` pisa estas
variables. Los nombres legacy (`--taupe`, `--crema`, `--marfil`, `--beige`, `--marron`,
`--gris-taupe`, `--arena`, `--accent`) quedan como alias de los tokens semánticos nuevos —
**no se tocan los ~90 usos de `var(--marron)` / `var(--taupe)` / etc. repartidos en
`ProductCard`, `ProductDetail`, `ProductGrid`, `CartDrawer`, `CheckoutSharedUI`, `Footer`,
`HeroBanner`, `InspirationBanner`, `CategorySection`, `Toast`, `AccountShell`, etc.** — al ser
ya variables CSS (no hex fijos), heredan el tema automáticamente.

`tailwind.config.ts`: `colors.brand` pasa de `var(--brand-color)` (variable muerta, sin
consumidores reales hoy) a `var(--brand)`, para que quede alineado al mismo token que usa todo
lo demás.

### Valores hardcodeados que SÍ hay que tocar (no son variables, son literales)

Verificado con grep contra el código real — son los únicos puntos que no se resuelven solos
con la capa de alias:

| Archivo | Línea aprox. | Valor actual | Reemplazo |
|---|---|---|---|
| `Header.tsx` | 43 | `background: 'rgba(250,247,243,.94)'` (header sticky) | `color-mix(in srgb, var(--surface) 94%, transparent)` |
| `Header.tsx` | 146 | `boxShadow: '0 8px 32px rgba(63,53,44,.12)'` (mega-menú) | `rgba(var(--overlay-dark), .12)` |
| `HeroBanner.tsx` | 52 | gradiente `rgba(63,53,44,.42 → .05)` | `rgba(var(--overlay-dark), .72 → .12)` (el azul de Señal necesita más contraste que el marrón para texto blanco) |
| `CategorySection.tsx` | 74 | gradiente `rgba(63,53,44,.55)` | `rgba(var(--overlay-dark), .62)` |
| `InspirationBanner.tsx` | 130 | gradiente `rgba(63,53,44,.55)` | `rgba(var(--overlay-dark), .62)` |
| `CartDrawer.tsx` | 30, 44 | overlay `rgba(63,53,44,.32)` / shadow `.12` | `rgba(var(--overlay-dark), .32 / .12)` |
| `MobileDrawer.tsx` | 33 | overlay `rgba(63,53,44,.32)` | `rgba(var(--overlay-dark), .32)` |
| `ProductCard.tsx` | 12, 90 | badge `rgba(63,53,44,.85 / .82)` | `rgba(var(--overlay-dark), .78)` |
| `Footer.tsx` | ~10 spots | tintes `rgba(246,242,237,.xx)` (marfil sobre fondo oscuro) | `rgba(255,255,255,.xx)` — funciona igual sobre cualquier `--footer-bg` oscuro, sin necesitar un token nuevo |

`--overlay-dark` se define como un triplete `"r,g,b"` (no `#hex`) específicamente para poder
componerlo con distintos alphas vía `rgba(var(--overlay-dark), N)` en estos casos.

> ponytail: `var(--marron)` queda como alias permanente de doble uso (texto oscuro y fondo
> oscuro a la vez) en vez de auditar cada uno de sus ~90 usos para separarlos en tokens
> semánticos distintos — visualmente ambos temas tienen un tono suficientemente oscuro para
> cumplir los dos roles sin verse mal. Si algún tema futuro necesita texto y fondo oscuro con
> tonos claramente distintos, ahí se separa call-site por call-site.

### Tema `senal` (Distribuidora Nehemías)

Valores tomados de `senal-tokens.css` (generado con Claude Design, revisado contra el código
real):

```ts
senal: {
  background: '#F4F6F8', surface: '#FFFFFF',
  txPrimary: '#1B2430', txSecondary: '#5A6675', txFaint: '#98A2B2',
  border: '#D9E0E8', borderSoft: '#E8EDF2',
  brand: '#2563EB', brandHover: '#1D4FC7',
  success: '#16A34A', error: '#DC2626',
  footerBg: '#101826', hoverSoft: '#EBF0F5',
  overlayDark: '16,24,38',
  fontHead: "'Space Grotesk', system-ui, sans-serif",
  fontBody: "'Inter', system-ui, sans-serif",
  radius: '12px',
}
```

Fuentes: agregar Space Grotesk (500/600/700) + Inter (400/500/600/700, italic 400/700) al
`@import` de `globals.css` (o migrar a `next/font` si se quiere evitar el import global de
ambas familias en todas las páginas — decisión de implementación, no bloquea el spec).

## Criterios de aceptación

- [ ] Renuevo y Antonello se ven **exactamente igual** que hoy (regresión visual cero) —
      `theme_id` default `'renuevo'`, `nav_sections` default preserva las 5 secciones.
- [ ] `distribuidora-nehemias.com.ar` no muestra en ningún momento el logo, tagline, ciudad,
      nav (Colecciones/Inspiración/Nosotros) ni paleta de Renuevo.
- [ ] Tema `senal` aplicado completo: fondos, textos, bordes, azul de marca en
      botones/precios/links, footer azul-noche, Space Grotesk + Inter.
- [ ] Footer de Nehemías: bloque de WhatsApp, sin badges de tarjeta, sin cuotas, "San Luis".
- [ ] `grep -r "rgba(63,53,44" src/components src/app` y
      `grep -r "rgba(246,242,237" src/components` no devuelven resultados.
- [ ] Imagen de producto rota cae al fallback (genérico o `default_product_image_url`), nunca
      al ícono roto del navegador.
- [ ] Link directo a `/nosotros`, `/colecciones/*`, `/inspiracion/*` en un tenant sin esa
      sección da 404, no el contenido de Renuevo.
- [ ] Tests existentes pasan; `tsc --noEmit` y build sin errores.

## Notas de implementación (no bloquean el spec, para la fase de plan)

- Migration 013 en `impulso_ecommerce_api` es aditiva (solo `ADD COLUMN` con defaults) — sin
  downtime, sin backfill necesario más allá de setear los valores de Nehemías vía el seed.
- El admin de `tenant_config` (CRUD Sprint 3, `impulso_ecommerce_api`) va a necesitar
  eventualmente exponer `theme_id`/`nav_sections`/`tagline`/`city`/`default_product_image_url`
  para no depender de SQL directo — no es parte de este spec (sigue siendo deuda ya conocida:
  "onboarding real de un tenant nuevo todavía es manual").
