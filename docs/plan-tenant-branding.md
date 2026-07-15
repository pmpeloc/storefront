# Tenant Content & Theming Parametrization — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stop `impulso_ecommerce_app` from leaking Renuevo Almohadones' branding, nav, copy,
payment methods, and color/typography theme onto other tenants — parametrize all of it via
`tenant_config`, and apply it to the Distribuidora Nehemías tenant with a new `senal` theme.

**Architecture:** Five new nullable/defaulted columns on `tenant_config` (migration 013:
`nav_sections`, `tagline`, `city`, `default_product_image_url`, `theme_id`). A curated theme
catalog (`src/lib/themes.ts`) resolves `theme_id` to a full CSS custom-property set, injected
server-side per tenant in `[tenant]/layout.tsx` — no code change needed at most of the ~90
call sites already using `var(--marron)` etc., because those names become aliases of the new
tokens. Nav/payment/tagline/image-fallback logic reads directly from `tenant_config` fields
already threaded through `useTenantConfig()`.

**Tech Stack:** Next.js 14 App Router (Server Components for data/theme resolution, Client
Components for interactive nav/footer), Supabase Postgres (migration), Vitest + Testing
Library, TypeScript strict.

## Global Constraints

- Renuevo (`el-renuevo`) and Antonello must render **pixel-identical** to today — every new
  column has a default that reproduces current behavior; every new component branch has a
  fallback equal to current behavior.
- `impulso_ecommerce_api`: `**/*.test.ts` is excluded from `tsconfig.json` — test fixtures are
  NOT type-checked, only touch a fixture if a test actually asserts on the new fields.
- `impulso_ecommerce_app`: test files ARE type-checked (`tsc --noEmit` covers `**/*.tsx`) — any
  fixture typed `: TenantConfig` must include the new required fields or the build breaks.
- Naming: código en inglés, comentarios en español (regla global del proyecto).
- No new dependencies — `color-mix()` and CSS custom properties are native.
- `theme_id` values live in Postgres data, never in a `tenant_slug → theme` map in frontend
  code (breaks the existing no-redeploy-for-new-tenant guarantee).

---

## Part 1 — `impulso_ecommerce_api`

### Task 1: Migration 013 — nuevas columnas en `tenant_config`

**Files:**
- Create: `impulso_ecommerce_api/supabase/migrations/013_tenant_content_theme.sql`

**Interfaces:**
- Produces: 5 new columns on `tenant_config` — `nav_sections jsonb`, `tagline text`,
  `city text`, `default_product_image_url text`, `theme_id text` — consumed by Task 2
  (TS types) and every later task that reads/writes `tenant_config`.

- [ ] **Step 1: Write the migration file**

```sql
-- ============================================================
-- Migration 013 — Tenant Content & Theme Parametrization
-- Impulso Ecommerce API — nav por secciones, copy de footer/meta,
-- imagen default de producto, y selección de tema visual por tenant.
-- ============================================================

ALTER TABLE tenant_config
  ADD COLUMN nav_sections jsonb NOT NULL
    DEFAULT '["catalogo","colecciones","inspiracion","nosotros","contacto"]'::jsonb,
  ADD COLUMN tagline text NULL,
  ADD COLUMN city text NULL,
  ADD COLUMN default_product_image_url text NULL,
  ADD COLUMN theme_id text NOT NULL DEFAULT 'renuevo';

COMMENT ON COLUMN tenant_config.nav_sections IS
  'Secciones de nav/footer habilitadas para este tenant, ej. ["catalogo","contacto"]. Default preserva las 5 secciones de Renuevo/Antonello sin tocar su dato. impulso_ecommerce_app filtra el nav contra este array y hace notFound() en páginas de una sección no habilitada.';
COMMENT ON COLUMN tenant_config.tagline IS
  'Copy corto de marca para el footer y la meta description. NULL = esas piezas no se renderizan (nunca cae al copy de otro tenant).';
COMMENT ON COLUMN tenant_config.city IS
  'Ciudad mostrada en el copyright del footer. NULL = el copyright omite la ciudad.';
COMMENT ON COLUMN tenant_config.default_product_image_url IS
  'Imagen de marca usada cuando product.image_url falla al cargar (ej. URL rota de un proveedor externo). NULL = se usa el placeholder genérico ya existente.';
COMMENT ON COLUMN tenant_config.theme_id IS
  'Clave del tema visual (paleta + tipografía) resuelto contra el catálogo curado en impulso_ecommerce_app/src/lib/themes.ts. Default "renuevo" preserva el look actual. Vive en la DB (no en un mapa hardcodeado en el frontend) para no requerir redeploy al dar de alta un tenant nuevo.';

-- Sin RLS nuevo: mismas columnas de una tabla que ya tiene RLS (ver migration 008) —
-- la política tenant_config_select existente ya cubre estas columnas.
```

- [ ] **Step 2: Verificar contra el patrón de migraciones existente**

Run: `ls impulso_ecommerce_api/supabase/migrations` y confirmar que `013_tenant_content_theme.sql`
es el único archivo `013_*` y sigue el mismo header/comentarios que `012_commission.sql`.

- [ ] **Step 3: Aplicar la migración (si hay Supabase local/staging conectado)**

Run: `cd impulso_ecommerce_api && npx supabase db push` (o el comando de migración que use el
proyecto). Si no hay entorno Supabase disponible en esta sesión, dejar el archivo listo — se
aplica en el primer deploy/seed real, igual que las migraciones 011/012 documentan.

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/013_tenant_content_theme.sql
git commit -m "feat: add nav_sections, tagline, city, default_product_image_url, theme_id to tenant_config"
```

---

### Task 2: Tipos TS — `TenantConfig` + `NavSection`

**Files:**
- Modify: `impulso_ecommerce_api/src/types/tenant.ts:1-36`

**Interfaces:**
- Consumes: nada nuevo.
- Produces: `export type NavSection = 'catalogo' | 'colecciones' | 'inspiracion' | 'nosotros' | 'contacto'`,
  y 5 campos nuevos en `TenantConfig` — consumidos por Task 3 (admin-views) y cualquier código
  que importe `TenantConfig` de este módulo.

- [ ] **Step 1: Agregar el tipo `NavSection` y los campos a `TenantConfig`**

En `impulso_ecommerce_api/src/types/tenant.ts`, reemplazar:

```ts
export type ProductSourceMode = 'own' | 'external' | 'hybrid';
export type CheckoutMethod = 'mobbex' | 'whatsapp';
export type CommissionMode = 'settlement' | 'markup';
export type CommissionBasis = 'revenue' | 'margin';
```

por:

```ts
export type ProductSourceMode = 'own' | 'external' | 'hybrid';
export type CheckoutMethod = 'mobbex' | 'whatsapp';
export type CommissionMode = 'settlement' | 'markup';
export type CommissionBasis = 'revenue' | 'margin';
export type NavSection = 'catalogo' | 'colecciones' | 'inspiracion' | 'nosotros' | 'contacto';
```

Y en la interfaz `TenantConfig`, reemplazar el cierre:

```ts
  external_connector_config: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}
```

por:

```ts
  external_connector_config: Record<string, unknown> | null;
  nav_sections: NavSection[];
  tagline: string | null;
  city: string | null;
  default_product_image_url: string | null;
  theme_id: string;
  created_at: string;
  updated_at: string;
}
```

- [ ] **Step 2: Verificar que el build de src/ (sin tests) sigue limpio**

Run: `cd impulso_ecommerce_api && npm run typecheck`
Expected: sin errores — `**/*.test.ts` está excluido de `tsconfig.json`, así que ningún
fixture de test rompe acá (ver Global Constraints).

- [ ] **Step 3: Commit**

```bash
git add src/types/tenant.ts
git commit -m "feat: add NavSection type and 5 tenant_config fields to TenantConfig"
```

---

### Task 3: Public view — exponer los campos nuevos en `GET /public/tenant-config`

**Files:**
- Modify: `impulso_ecommerce_api/src/utils/admin-views.ts:57-70`
- Modify: `impulso_ecommerce_api/src/utils/admin-views.test.ts:49-72,124-135`
- Modify: `impulso_ecommerce_api/src/routes/public.routes.test.ts:157-213`

**Interfaces:**
- Consumes: `TenantConfig` de Task 2.
- Produces: `PublicTenantConfigView` con los 5 campos nuevos — consumido por
  `impulso_ecommerce_app/src/lib/tenant-config.ts` (Task 5, Part 2).

- [ ] **Step 1: Write the failing test — `admin-views.test.ts`**

En `fullTenantConfig` (línea 49), agregar los 5 campos nuevos antes del cierre:

```ts
const fullTenantConfig: TenantConfig = {
  id: 'config-1',
  tenant_id: 'tenant-1',
  client_name: 'Renuevo Almohadones',
  brand_color: '#6366F1',
  logo_url: 'https://example.com/logo.png',
  favicon_url: 'https://example.com/favicon.ico',
  email_from: 'ventas@renuevohogar.com',
  whatsapp_number: '+5491100000000',
  whatsapp_message: 'Hola!',
  meta_catalog_id: 'catalog-1',
  meta_access_token: 'EAABxx-secreto-real',
  meta_page_id: 'page-1',
  product_source_mode: 'external',
  markup_retail_pct: 40,
  markup_wholesale_pct: 20,
  checkout_methods: ['whatsapp'],
  commission_pct: 12.5,
  commission_mode: 'settlement',
  commission_basis: 'revenue',
  external_connector_config: { source: 'distribuidora_victoria', apiUrl: 'https://...' },
  nav_sections: ['catalogo', 'colecciones', 'inspiracion', 'nosotros', 'contacto'],
  tagline: 'Diseños para espacios que inspiran',
  city: 'Buenos Aires',
  default_product_image_url: null,
  theme_id: 'renuevo',
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-02T00:00:00Z',
};
```

Dentro de `describe('toPublicTenantConfigView', ...)`, agregar un nuevo `it` después de
"conserva los campos de branding y checkout permitidos" (línea ~130):

```ts
  it('conserva nav_sections, tagline, city, default_product_image_url y theme_id', () => {
    const view = toPublicTenantConfigView(fullTenantConfig);
    expect(view.nav_sections).toEqual(['catalogo', 'colecciones', 'inspiracion', 'nosotros', 'contacto']);
    expect(view.tagline).toBe('Diseños para espacios que inspiran');
    expect(view.city).toBe('Buenos Aires');
    expect(view.default_product_image_url).toBeNull();
    expect(view.theme_id).toBe('renuevo');
  });
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd impulso_ecommerce_api && npx vitest run src/utils/admin-views.test.ts -t "conserva nav_sections"`
Expected: FAIL — `view.nav_sections` es `undefined` (el campo todavía no está en el allowlist).

- [ ] **Step 3: Agregar los campos al allowlist público**

En `impulso_ecommerce_api/src/utils/admin-views.ts`, reemplazar:

```ts
const TENANT_CONFIG_PUBLIC_FIELDS = [
  'id', 'tenant_id', 'client_name', 'brand_color', 'logo_url', 'favicon_url', 'email_from',
  'whatsapp_number', 'whatsapp_message', 'checkout_methods', 'created_at', 'updated_at',
] as const satisfies readonly (keyof TenantConfig)[];
```

por:

```ts
const TENANT_CONFIG_PUBLIC_FIELDS = [
  'id', 'tenant_id', 'client_name', 'brand_color', 'logo_url', 'favicon_url', 'email_from',
  'whatsapp_number', 'whatsapp_message', 'checkout_methods', 'nav_sections', 'tagline', 'city',
  'default_product_image_url', 'theme_id', 'created_at', 'updated_at',
] as const satisfies readonly (keyof TenantConfig)[];
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd impulso_ecommerce_api && npx vitest run src/utils/admin-views.test.ts`
Expected: PASS (todos los tests del archivo, incluido el nuevo).

- [ ] **Step 5: Write the failing test — `public.routes.test.ts`**

En `tenantConfigWithSecrets` (línea 157), agregar los 5 campos antes del cierre:

```ts
  const tenantConfigWithSecrets = {
    id: 'config-1',
    tenant_id: 'tenant-1',
    client_name: 'Renuevo Almohadones',
    brand_color: '#6366F1',
    logo_url: 'https://example.com/logo.png',
    favicon_url: 'https://example.com/favicon.ico',
    email_from: 'ventas@renuevohogar.com',
    whatsapp_number: '+5491100000000',
    whatsapp_message: 'Hola!',
    meta_catalog_id: 'catalog-1',
    meta_access_token: 'EAABxx-secreto-real',
    meta_page_id: 'page-1',
    product_source_mode: 'external',
    markup_retail_pct: 40,
    markup_wholesale_pct: 20,
    checkout_methods: ['whatsapp'],
    commission_pct: 12.5,
    commission_mode: 'settlement',
    commission_basis: 'revenue',
    external_connector_config: { source: 'distribuidora_victoria', apiUrl: 'https://...' },
    nav_sections: ['catalogo', 'colecciones', 'inspiracion', 'nosotros', 'contacto'],
    tagline: 'Diseños para espacios que inspiran',
    city: 'Buenos Aires',
    default_product_image_url: null,
    theme_id: 'renuevo',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-02T00:00:00Z',
  };
```

Y extender el test "conserva los campos de branding y checkout esperados" (línea ~202):

```ts
  it('conserva los campos de branding y checkout esperados por impulso_ecommerce_app', async () => {
    mockGetTenantConfigBySlug.mockResolvedValue(tenantConfigWithSecrets);

    const res = await request(app)
      .get('/api/v1/public/tenant-config')
      .query({ tenantSlug: 'el-renuevo' });

    expect(res.status).toBe(200);
    expect(res.body.tenantConfig.client_name).toBe('Renuevo Almohadones');
    expect(res.body.tenantConfig.brand_color).toBe('#6366F1');
    expect(res.body.tenantConfig.checkout_methods).toEqual(['whatsapp']);
    expect(res.body.tenantConfig.nav_sections).toEqual(['catalogo', 'colecciones', 'inspiracion', 'nosotros', 'contacto']);
    expect(res.body.tenantConfig.theme_id).toBe('renuevo');
  });
```

- [ ] **Step 6: Run test to verify it passes**

Run: `cd impulso_ecommerce_api && npx vitest run src/routes/public.routes.test.ts`
Expected: PASS.

- [ ] **Step 7: Run full API test suite**

Run: `cd impulso_ecommerce_api && npm test`
Expected: PASS, sin regresiones.

- [ ] **Step 8: Commit**

```bash
git add src/utils/admin-views.ts src/utils/admin-views.test.ts src/routes/public.routes.test.ts
git commit -m "feat: expose nav_sections, tagline, city, default_product_image_url, theme_id in public tenant-config view"
```

---

### Task 4: Seed de Distribuidora Nehemías — nuevos campos

**Files:**
- Modify: `impulso_ecommerce_api/scripts/seed-distribuidora-nehemias.ts:31-44`

**Interfaces:**
- Consumes: `TenantConfig` de Task 2 (vía el cliente Supabase, sin tipado estricto en el script).
- Produces: fila real de `tenant_config` para `distribuidora-nehemias` con el tema `senal` y
  el nav reducido — consumida en producción por `impulso_ecommerce_app`.

- [ ] **Step 1: Actualizar el objeto `tenantConfig` del seed**

Reemplazar:

```ts
const tenantConfig = {
  client_name: 'Distribuidora Nehemías',
  product_source_mode: 'external',
  markup_retail_pct: null,
  markup_wholesale_pct: null,
  checkout_methods: ['whatsapp'],
  external_connector_config: {
    source: 'distribuidora_victoria',
    apiUrl: 'https://api.distribuidora-victoria.com.ar/api/web/tenant/www?in_stock=false',
  },
  // TODO(Misael): número real de WhatsApp de Distribuidora Nehemías — placeholder hasta confirmar.
  whatsapp_number: '5492664000000',
  whatsapp_message: 'Hola! Quiero consultar sobre un producto de su catálogo.',
};
```

por:

```ts
const tenantConfig = {
  client_name: 'Distribuidora Nehemías',
  product_source_mode: 'external',
  markup_retail_pct: null,
  markup_wholesale_pct: null,
  checkout_methods: ['whatsapp'],
  external_connector_config: {
    source: 'distribuidora_victoria',
    apiUrl: 'https://api.distribuidora-victoria.com.ar/api/web/tenant/www?in_stock=false',
  },
  // TODO(Misael): número real de WhatsApp de Distribuidora Nehemías — placeholder hasta confirmar.
  whatsapp_number: '5492664000000',
  whatsapp_message: 'Hola! Quiero consultar sobre un producto de su catálogo.',
  // Sin Colecciones/Inspiración/Nosotros — ese contenido curado es Spec B (fuera de alcance),
  // así que esas secciones se ocultan del nav en vez de mostrar el contenido de Renuevo.
  nav_sections: ['catalogo', 'contacto'],
  city: 'San Luis',
  // TODO(Misael): copy real del footer — null hasta definirlo, el footer omite el párrafo.
  tagline: null,
  // TODO: si Nehemías quiere un placeholder de marca propio para imágenes rotas del proveedor
  // externo, cargar la URL acá — null usa el gradiente genérico.
  default_product_image_url: null,
  theme_id: 'senal',
};
```

- [ ] **Step 2: Verificar tipos**

Run: `cd impulso_ecommerce_api && npm run typecheck`
Expected: sin errores.

- [ ] **Step 3: Commit**

```bash
git add scripts/seed-distribuidora-nehemias.ts
git commit -m "feat: set nav_sections, city, and senal theme for Distribuidora Nehemías seed"
```

(El seed no se corre en este task — requiere `SUPABASE_URL`/`SUPABASE_SERVICE_KEY` reales y la
migración 013 ya aplicada contra ese proyecto Supabase. Se corre en el deploy real:
`npm run seed:distribuidora-nehemias`.)

---

## Part 2 — `impulso_ecommerce_app`

### Task 5: `TenantConfig` type + `NavSection` helper en el frontend

**Files:**
- Modify: `impulso_ecommerce_app/src/lib/tenant-config.ts:1-12`
- Create: `impulso_ecommerce_app/src/lib/nav-sections.ts`
- Create: `impulso_ecommerce_app/src/lib/nav-sections.test.ts`
- Modify: `impulso_ecommerce_app/src/components/product/WhatsAppButton.test.tsx:8-18`
- Modify: `impulso_ecommerce_app/src/app/sites/[tenant]/checkout/page.test.tsx:40-50`
- Modify: `impulso_ecommerce_app/src/components/layout/Header.test.tsx:11-21`

**Interfaces:**
- Produces: `NavSection` type, `assertNavSectionEnabled(tenantSlug, section)` — consumido por
  Task 14 (page gates). `TenantConfig` con los 5 campos nuevos — consumido por todas las tareas
  siguientes de este repo.

- [ ] **Step 1: Write the failing test — `nav-sections.test.ts`**

```ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { notFound } from 'next/navigation'
import { assertNavSectionEnabled } from './nav-sections'
import { fetchTenantConfigBySlug } from './tenant-config'
import type { TenantConfig } from './tenant-config'

vi.mock('next/navigation', () => ({
  notFound: vi.fn(() => {
    throw new Error('NEXT_NOT_FOUND')
  }),
}))

vi.mock('./tenant-config', () => ({
  fetchTenantConfigBySlug: vi.fn(),
}))

const mockFetch = vi.mocked(fetchTenantConfigBySlug)

const baseConfig: TenantConfig = {
  tenant_id: 'tenant-1',
  client_name: 'Test Store',
  brand_color: '#000',
  logo_url: null,
  favicon_url: null,
  email_from: null,
  whatsapp_number: null,
  whatsapp_message: null,
  checkout_methods: ['whatsapp'],
  nav_sections: ['catalogo', 'contacto'],
  tagline: null,
  city: null,
  default_product_image_url: null,
  theme_id: 'senal',
}

describe('assertNavSectionEnabled', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('no lanza cuando la sección está en nav_sections', async () => {
    mockFetch.mockResolvedValue(baseConfig)
    await expect(assertNavSectionEnabled('nehemias', 'catalogo')).resolves.toBeUndefined()
  })

  it('llama notFound() cuando la sección no está en nav_sections', async () => {
    mockFetch.mockResolvedValue(baseConfig)
    await expect(assertNavSectionEnabled('nehemias', 'nosotros')).rejects.toThrow('NEXT_NOT_FOUND')
    expect(notFound).toHaveBeenCalledOnce()
  })

  it('llama notFound() cuando el tenant no existe', async () => {
    mockFetch.mockResolvedValue(null)
    await expect(assertNavSectionEnabled('desconocido', 'catalogo')).rejects.toThrow('NEXT_NOT_FOUND')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd impulso_ecommerce_app && npx vitest run src/lib/nav-sections.test.ts`
Expected: FAIL — no existe el módulo `./nav-sections`.

- [ ] **Step 3: Implementar `nav-sections.ts`**

```ts
import { notFound } from 'next/navigation'
import { fetchTenantConfigBySlug } from './tenant-config'

export type NavSection = 'catalogo' | 'colecciones' | 'inspiracion' | 'nosotros' | 'contacto'

// Gate de contenido: llama notFound() si la sección no está habilitada para el tenant, para que
// un link directo por URL (fuera del nav filtrado) tampoco exponga el contenido de otro tenant.
export async function assertNavSectionEnabled(tenantSlug: string, section: NavSection): Promise<void> {
  const config = await fetchTenantConfigBySlug(tenantSlug)
  if (!config || !config.nav_sections.includes(section)) notFound()
}
```

- [ ] **Step 4: Extender `TenantConfig` en `tenant-config.ts`**

Reemplazar:

```ts
// Espeja el contrato de impulso_ecommerce_api (snake_case) — ver GET /api/v1/public/tenant-config
export interface TenantConfig {
  tenant_id: string
  client_name: string
  brand_color: string
  logo_url: string | null
  favicon_url: string | null
  email_from: string | null
  whatsapp_number: string | null
  whatsapp_message: string | null
  checkout_methods: string[]
}
```

por:

```ts
import type { NavSection } from './nav-sections'

// Espeja el contrato de impulso_ecommerce_api (snake_case) — ver GET /api/v1/public/tenant-config
export interface TenantConfig {
  tenant_id: string
  client_name: string
  brand_color: string
  logo_url: string | null
  favicon_url: string | null
  email_from: string | null
  whatsapp_number: string | null
  whatsapp_message: string | null
  checkout_methods: string[]
  nav_sections: NavSection[]
  tagline: string | null
  city: string | null
  default_product_image_url: string | null
  theme_id: string
}
```

> Nota: `nav-sections.ts` importa `fetchTenantConfigBySlug` de `tenant-config.ts`, y
> `tenant-config.ts` importa el tipo `NavSection` de `nav-sections.ts` — es un import de tipo
> (`import type`), que TypeScript borra en tiempo de compilación, así que no genera ciclo de
> ejecución real. Si preferís evitarlo del todo, `NavSection` puede vivir directamente en
> `tenant-config.ts` en lugar de `nav-sections.ts` — ambas opciones son válidas, se eligió esta
> por mantener el gate y su tipo en el mismo archivo.

- [ ] **Step 5: Run test to verify it passes**

Run: `cd impulso_ecommerce_app && npx vitest run src/lib/nav-sections.test.ts`
Expected: PASS (los 3 tests).

- [ ] **Step 6: Arreglar los fixtures existentes rotos por los campos nuevos**

En `src/components/product/WhatsAppButton.test.tsx`, reemplazar:

```ts
const testTenantConfig: TenantConfig = {
  tenant_id: 'tenant-1',
  client_name: 'Test Store',
  brand_color: '#000',
  logo_url: null,
  favicon_url: null,
  email_from: null,
  whatsapp_number: '5491155555555',
  whatsapp_message: 'Hola!',
  checkout_methods: ['mobbex'],
}
```

por:

```ts
const testTenantConfig: TenantConfig = {
  tenant_id: 'tenant-1',
  client_name: 'Test Store',
  brand_color: '#000',
  logo_url: null,
  favicon_url: null,
  email_from: null,
  whatsapp_number: '5491155555555',
  whatsapp_message: 'Hola!',
  checkout_methods: ['mobbex'],
  nav_sections: ['catalogo', 'colecciones', 'inspiracion', 'nosotros', 'contacto'],
  tagline: null,
  city: null,
  default_product_image_url: null,
  theme_id: 'renuevo',
}
```

En `src/app/sites/[tenant]/checkout/page.test.tsx`, aplicar el mismo agregado a
`baseTenantConfig` (línea 40-50).

En `src/components/layout/Header.test.tsx`, aplicar el mismo agregado a `testTenantConfig`
(línea 11-21), con `checkout_methods: ['mobbex']` sin cambios y
`nav_sections: ['catalogo', 'colecciones', 'inspiracion', 'nosotros', 'contacto']`, `tagline: null`,
`city: null`, `default_product_image_url: null`, `theme_id: 'renuevo'`.

- [ ] **Step 7: Run full app test suite + typecheck**

Run: `cd impulso_ecommerce_app && npx vitest run && npx tsc --noEmit`
Expected: PASS, sin errores (esto es lo que confirma que los 3 fixtures quedaron completos).

- [ ] **Step 8: Commit**

```bash
git add src/lib/tenant-config.ts src/lib/nav-sections.ts src/lib/nav-sections.test.ts \
  src/components/product/WhatsAppButton.test.tsx src/app/sites/\[tenant\]/checkout/page.test.tsx \
  src/components/layout/Header.test.tsx
git commit -m "feat: add nav_sections/tagline/city/default_product_image_url/theme_id to TenantConfig"
```

---

### Task 6: Catálogo de temas — `src/lib/themes.ts`

**Files:**
- Create: `impulso_ecommerce_app/src/lib/themes.ts`
- Create: `impulso_ecommerce_app/src/lib/themes.test.ts`

**Interfaces:**
- Produces: `ThemeTokens` interface, `THEMES` record (`renuevo`, `senal`), `DEFAULT_THEME_ID` —
  consumidos por Task 8 (`[tenant]/layout.tsx`).

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from 'vitest'
import { THEMES, DEFAULT_THEME_ID } from './themes'

const REQUIRED_KEYS = [
  'background', 'surface', 'txPrimary', 'txSecondary', 'txFaint', 'border', 'borderSoft',
  'brand', 'brandHover', 'success', 'error', 'footerBg', 'hoverSoft', 'accentSecondary',
  'overlayDark', 'fontHead', 'fontBody', 'radius',
] as const

describe('THEMES', () => {
  it('define renuevo y senal', () => {
    expect(Object.keys(THEMES).sort()).toEqual(['renuevo', 'senal'])
  })

  it('cada tema tiene todos los tokens requeridos, sin strings vacíos', () => {
    for (const [themeId, tokens] of Object.entries(THEMES)) {
      for (const key of REQUIRED_KEYS) {
        expect(tokens[key], `${themeId}.${key}`).toBeTruthy()
      }
    }
  })

  it('DEFAULT_THEME_ID apunta a un tema que existe', () => {
    expect(THEMES[DEFAULT_THEME_ID]).toBeDefined()
    expect(DEFAULT_THEME_ID).toBe('renuevo')
  })

  it('overlayDark es un triplete "r,g,b" sin # ni espacios', () => {
    for (const [themeId, tokens] of Object.entries(THEMES)) {
      expect(tokens.overlayDark, themeId).toMatch(/^\d{1,3},\d{1,3},\d{1,3}$/)
    }
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd impulso_ecommerce_app && npx vitest run src/lib/themes.test.ts`
Expected: FAIL — no existe el módulo `./themes`.

- [ ] **Step 3: Implementar `themes.ts`**

Valores de `renuevo` copiados 1:1 de `src/app/globals.css` (cero cambio visual); valores de
`senal` tomados del handoff de Claude Design para Distribuidora Nehemías.

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
  accentSecondary: string // alias legacy: --salvia
  overlayDark: string     // triplete "r,g,b" para rgba(var(--overlay-dark), alpha)
  fontHead: string
  fontBody: string
  radius: string
}

export const THEMES: Record<string, ThemeTokens> = {
  renuevo: {
    background: '#FAF7F3',
    surface: '#F6F2ED',
    txPrimary: '#3F352C',
    txSecondary: '#8C8073',
    txFaint: '#B3A799',
    border: '#E7DFD5',
    borderSoft: '#EFE9E1',
    brand: '#8A7A68',
    brandHover: '#766857',
    success: '#7F9A70',
    error: '#B96363',
    footerBg: '#5A4B3F',
    hoverSoft: '#EEE7DF',
    accentSecondary: '#A7B09A',
    overlayDark: '63,53,44',
    fontHead: "'Cormorant Garamond', Georgia, serif",
    fontBody: "'Poppins', system-ui, sans-serif",
    radius: '14px',
  },
  senal: {
    background: '#F4F6F8',
    surface: '#FFFFFF',
    txPrimary: '#1B2430',
    txSecondary: '#5A6675',
    txFaint: '#98A2B2',
    border: '#D9E0E8',
    borderSoft: '#E8EDF2',
    brand: '#2563EB',
    brandHover: '#1D4FC7',
    success: '#16A34A',
    error: '#DC2626',
    footerBg: '#101826',
    hoverSoft: '#EBF0F5',
    accentSecondary: '#7FA8C9',
    overlayDark: '16,24,38',
    fontHead: "'Space Grotesk', system-ui, sans-serif",
    fontBody: "'Inter', system-ui, sans-serif",
    radius: '12px',
  },
}

export const DEFAULT_THEME_ID = 'renuevo'
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd impulso_ecommerce_app && npx vitest run src/lib/themes.test.ts`
Expected: PASS (los 4 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/themes.ts src/lib/themes.test.ts
git commit -m "feat: add curated theme catalog (renuevo, senal)"
```

---

### Task 7: `globals.css` — capa de alias semántica + `tailwind.config.ts`

**Files:**
- Modify: `impulso_ecommerce_app/src/app/globals.css:7-32`
- Modify: `impulso_ecommerce_app/tailwind.config.ts:12`

**Interfaces:**
- Consumes: nombres de token de `ThemeTokens` (Task 6) — deben coincidir 1:1 con las variables
  CSS inyectadas en Task 8.
- Produces: fallback de `:root` fuera del wrapper de tenant (páginas de error, `/sites/unknown`).

- [ ] **Step 1: Reemplazar el `:root` de `globals.css`**

Reemplazar:

```css
:root {
  --taupe: #8A7A68;
  --taupe-hover: #766857;
  --marfil: #F6F2ED;
  --beige: #EEE7DF;
  --crema: #FAF7F3;
  --marron: #5A4B3F;
  --gris-taupe: #8E8275;
  --arena: #D8CFC5;
  --salvia: #A7B09A;
  --exito: #7F9A70;
  --error: #B96363;

  --tx: #3F352C;
  --tx-soft: #8C8073;
  --tx-faint: #B3A799;
  --line: #E7DFD5;
  --line-soft: #EFE9E1;

  --font-head: 'Cormorant Garamond', Georgia, serif;
  --font-ui: 'Poppins', system-ui, sans-serif;
  --radius: 14px;

  --sh-card: 0 1px 2px rgba(90,75,63,.04), 0 8px 24px rgba(90,75,63,.06);
  --sh-frame: 0 4px 14px rgba(74,61,49,.08), 0 24px 60px rgba(74,61,49,.12);
}
```

por (fallback fuera del wrapper de tenant — dentro del wrapper, `[tenant]/layout.tsx` de Task 8
pisa estas mismas variables con los valores de `THEMES[tenantConfig.theme_id]`):

```css
:root {
  /* Tokens semánticos — fallback (tema "renuevo"). Nombres deben coincidir 1:1 con
     ThemeTokens en src/lib/themes.ts y con la inyección de [tenant]/layout.tsx. */
  --background: #FAF7F3;
  --surface: #F6F2ED;
  --brand: #8A7A68;
  --brand-hover: #766857;
  --success: #7F9A70;
  --error: #B96363;
  --footer-bg: #5A4B3F;
  --hover-soft: #EEE7DF;
  --accent-secondary: #A7B09A;
  --overlay-dark: 63,53,44;

  --tx: #3F352C;
  --tx-soft: #8C8073;
  --tx-faint: #B3A799;
  --line: #E7DFD5;
  --line-soft: #EFE9E1;

  --font-head: 'Cormorant Garamond', Georgia, serif;
  --font-ui: 'Poppins', system-ui, sans-serif;
  --radius: 14px;

  --sh-card: 0 1px 2px rgba(90,75,63,.04), 0 8px 24px rgba(90,75,63,.06);
  --sh-frame: 0 4px 14px rgba(74,61,49,.08), 0 24px 60px rgba(74,61,49,.12);

  /* Alias legacy — ~90 usos de estos nombres en componentes quedan sin tocar,
     heredan el tema porque ya son variables CSS, no valores hex fijos. */
  --taupe: var(--brand);
  --taupe-hover: var(--brand-hover);
  --marfil: var(--surface);
  --beige: var(--hover-soft);
  --crema: var(--background);
  --marron: var(--footer-bg);
  --gris-taupe: var(--tx-soft);
  --arena: var(--line);
  --salvia: var(--accent-secondary);
  --exito: var(--success);
  --accent: var(--brand);
}
```

- [ ] **Step 2: Arreglar `tailwind.config.ts`**

Reemplazar:

```ts
        brand: 'var(--brand-color)',
```

por:

```ts
        brand: 'var(--brand)',
```

(`--brand-color` no tiene ningún consumidor real hoy — grep confirmado durante el diseño; el
token real que usa todo lo demás es `--brand`.)

- [ ] **Step 3: Verificar visualmente que Renuevo no cambió**

Run: `cd impulso_ecommerce_app && npm run dev`, abrir `http://localhost:3000` (tenant
`el-renuevo` vía `DEV_FALLBACK_DOMAINS`) y confirmar que el home se ve igual que antes del
cambio (mismos colores crema/marrón/taupe).

- [ ] **Step 4: Run full test suite + typecheck**

Run: `cd impulso_ecommerce_app && npx vitest run && npx tsc --noEmit`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/app/globals.css tailwind.config.ts
git commit -m "refactor: turn Renuevo palette into semantic tokens with legacy aliases"
```

---

### Task 8: Inyección de tema server-side en `[tenant]/layout.tsx`

**Files:**
- Modify: `impulso_ecommerce_app/src/app/sites/[tenant]/layout.tsx`

**Interfaces:**
- Consumes: `THEMES`, `DEFAULT_THEME_ID` (Task 6); `tenantConfig.theme_id`, `tenantConfig.brand_color`,
  `tenantConfig.tagline` (Task 5).
- Produces: variables CSS completas inyectadas en el wrapper — consumidas por todos los
  componentes vía `var(--tx)`, `var(--brand)`, etc. (ya funcionan hoy, solo cambia qué valores
  reciben).

- [ ] **Step 1: Reemplazar la inyección de `--brand-color` por el set completo de tokens**

Reemplazar:

```tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { fetchTenantConfigBySlug, fetchAllTenantSlugs } from '@/lib/tenant-config'
import { TenantConfigProvider } from '@/components/providers/TenantConfigProvider'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { BottomNav } from '@/components/layout/BottomNav'
import { PromoBanner } from '@/components/layout/PromoBanner'
import { CartDrawer } from '@/components/cart/CartDrawer'
import { ToastContainer } from '@/components/ui/Toast'
```

por:

```tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { fetchTenantConfigBySlug, fetchAllTenantSlugs } from '@/lib/tenant-config'
import { TenantConfigProvider } from '@/components/providers/TenantConfigProvider'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { BottomNav } from '@/components/layout/BottomNav'
import { PromoBanner } from '@/components/layout/PromoBanner'
import { CartDrawer } from '@/components/cart/CartDrawer'
import { ToastContainer } from '@/components/ui/Toast'
import { THEMES, DEFAULT_THEME_ID, type ThemeTokens } from '@/lib/themes'

function resolveThemeStyle(theme: ThemeTokens, brandColorOverride: string): React.CSSProperties {
  return {
    '--background': theme.background,
    '--surface': theme.surface,
    '--tx': theme.txPrimary,
    '--tx-soft': theme.txSecondary,
    '--tx-faint': theme.txFaint,
    '--line': theme.border,
    '--line-soft': theme.borderSoft,
    '--brand': brandColorOverride || theme.brand,
    '--brand-hover': theme.brandHover,
    '--success': theme.success,
    '--error': theme.error,
    '--footer-bg': theme.footerBg,
    '--hover-soft': theme.hoverSoft,
    '--accent-secondary': theme.accentSecondary,
    '--overlay-dark': theme.overlayDark,
    '--font-head': theme.fontHead,
    '--font-ui': theme.fontBody,
    '--radius': theme.radius,
  } as React.CSSProperties
}
```

Reemplazar el `generateMetadata`:

```tsx
export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const { tenant } = await params
  const tenantConfig = await fetchTenantConfigBySlug(tenant)
  if (!tenantConfig) return {}

  return {
    title: {
      default: tenantConfig.client_name,
      template: `%s | ${tenantConfig.client_name}`,
    },
    description: `Tienda online de ${tenantConfig.client_name}. Diseños para espacios que inspiran.`,
    icons: tenantConfig.favicon_url ? { icon: tenantConfig.favicon_url } : undefined,
    openGraph: {
      siteName: tenantConfig.client_name,
      locale: 'es_AR',
      type: 'website',
    },
  }
}
```

por:

```tsx
export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const { tenant } = await params
  const tenantConfig = await fetchTenantConfigBySlug(tenant)
  if (!tenantConfig) return {}

  return {
    title: {
      default: tenantConfig.client_name,
      template: `%s | ${tenantConfig.client_name}`,
    },
    description: tenantConfig.tagline ?? `Tienda online de ${tenantConfig.client_name}`,
    icons: tenantConfig.favicon_url ? { icon: tenantConfig.favicon_url } : undefined,
    openGraph: {
      siteName: tenantConfig.client_name,
      locale: 'es_AR',
      type: 'website',
    },
  }
}
```

Reemplazar el render:

```tsx
  return (
    <TenantConfigProvider value={tenantConfig}>
      <div style={{ '--brand-color': tenantConfig.brand_color } as React.CSSProperties}>
        <PromoBanner />
        <Header />
        <main className="pb-20 md:pb-0">{children}</main>
        <Footer />
        <BottomNav />
        <CartDrawer />
        <ToastContainer />
      </div>
    </TenantConfigProvider>
  )
```

por:

```tsx
  const theme = THEMES[tenantConfig.theme_id] ?? THEMES[DEFAULT_THEME_ID]

  return (
    <TenantConfigProvider value={tenantConfig}>
      <div style={resolveThemeStyle(theme, tenantConfig.brand_color)}>
        <PromoBanner />
        <Header />
        <main className="pb-20 md:pb-0">{children}</main>
        <Footer />
        <BottomNav />
        <CartDrawer />
        <ToastContainer />
      </div>
    </TenantConfigProvider>
  )
```

- [ ] **Step 2: Verificar visualmente**

Run: `cd impulso_ecommerce_app && npm run dev` — confirmar que `el-renuevo` sigue igual (tema
`renuevo` es el default, `brand_color` de Renuevo en la DB sigue pisando `--brand` igual que
antes).

- [ ] **Step 3: Run full test suite + typecheck**

Run: `cd impulso_ecommerce_app && npx vitest run && npx tsc --noEmit`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add src/app/sites/\[tenant\]/layout.tsx
git commit -m "feat: inject full theme token set per tenant instead of only brand_color"
```

---

### Task 9: `Header.tsx` — nav por `nav_sections`, logo fallback neutro, colores a tokens

**Files:**
- Modify: `impulso_ecommerce_app/src/components/layout/Header.tsx`
- Modify: `impulso_ecommerce_app/src/components/layout/Header.test.tsx`

**Interfaces:**
- Consumes: `useTenantConfig()` → `nav_sections`, `logo_url`, `client_name` (ya disponibles
  desde Task 5).

- [ ] **Step 1: Write the failing tests**

Agregar a `Header.test.tsx` (después del test existente "renderiza el CartButton"):

```ts
  it('oculta los links de nav que no están en nav_sections', () => {
    render(
      <TenantConfigProvider value={{ ...testTenantConfig, nav_sections: ['catalogo', 'contacto'] }}>
        <Header />
      </TenantConfigProvider>,
    )
    expect(screen.queryByRole('link', { name: 'Colecciones' })).toBeNull()
    expect(screen.queryByRole('link', { name: 'Inspiración' })).toBeNull()
    expect(screen.queryByRole('link', { name: 'Nosotros' })).toBeNull()
    expect(screen.getByRole('link', { name: 'Catálogo' })).toBeDefined()
    expect(screen.getByRole('link', { name: 'Contacto' })).toBeDefined()
  })

  it('sin logo_url, muestra el nombre del tenant en vez del wordmark de Renuevo', () => {
    render(
      <TenantConfigProvider value={{ ...testTenantConfig, client_name: 'Distribuidora Nehemías', logo_url: null }}>
        <Header />
      </TenantConfigProvider>,
    )
    expect(screen.getAllByText('Distribuidora Nehemías').length).toBeGreaterThan(0)
    expect(screen.queryByAltText('RENUEVO')).toBeNull()
  })
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd impulso_ecommerce_app && npx vitest run src/components/layout/Header.test.tsx`
Expected: FAIL — nav no filtra todavía, logo fallback sigue siendo la imagen "RENUEVO".

- [ ] **Step 3: Filtrar `NAV_LINKS` por `nav_sections`**

Reemplazar:

```tsx
const NAV_LINKS = [
  { href: '/productos', label: 'Catálogo', hasMega: true },
  { href: '/colecciones', label: 'Colecciones' },
  { href: '/inspiracion', label: 'Inspiración' },
  { href: '/nosotros', label: 'Nosotros' },
  { href: '/contacto', label: 'Contacto' },
]

export function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()
  const favIds = useFavoritesStore((s) => s.ids)
  const tenantConfig = useTenantConfig()
```

por:

```tsx
import type { NavSection } from '@/lib/nav-sections'

const NAV_LINKS: { href: string; label: string; section: NavSection; hasMega?: boolean }[] = [
  { href: '/productos', label: 'Catálogo', section: 'catalogo', hasMega: true },
  { href: '/colecciones', label: 'Colecciones', section: 'colecciones' },
  { href: '/inspiracion', label: 'Inspiración', section: 'inspiracion' },
  { href: '/nosotros', label: 'Nosotros', section: 'nosotros' },
  { href: '/contacto', label: 'Contacto', section: 'contacto' },
]

export function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()
  const favIds = useFavoritesStore((s) => s.ids)
  const tenantConfig = useTenantConfig()
  const navLinks = NAV_LINKS.filter((link) => tenantConfig.nav_sections.includes(link.section))
```

Y más abajo, reemplazar `{NAV_LINKS.map(({ href, label, hasMega }) =>` por
`{navLinks.map(({ href, label, hasMega }) =>` (el resto del bloque del `.map` no cambia).

- [ ] **Step 4: Logo fallback neutro (texto, no el wordmark de Renuevo)**

Reemplazar el bloque del logo mobile:

```tsx
          {/* Logo mobile — monograma centrado */}
          <Link
            href="/"
            className="md:hidden absolute left-1/2 -translate-x-1/2 flex items-center"
            aria-label={tenantConfig.client_name}
          >
            <Image
              src={tenantConfig.logo_url ?? '/logos/wm-mono.png'}
              alt={tenantConfig.client_name}
              width={36}
              height={36}
              className="object-contain"
            />
          </Link>
```

por:

```tsx
          {/* Logo mobile — monograma centrado */}
          <Link
            href="/"
            className="md:hidden absolute left-1/2 -translate-x-1/2 flex items-center"
            aria-label={tenantConfig.client_name}
          >
            {tenantConfig.logo_url ? (
              <Image
                src={tenantConfig.logo_url}
                alt={tenantConfig.client_name}
                width={36}
                height={36}
                className="object-contain"
              />
            ) : (
              <span
                className="text-[15px] font-semibold"
                style={{ fontFamily: 'var(--font-head)', color: 'var(--brand)' }}
              >
                {tenantConfig.client_name}
              </span>
            )}
          </Link>
```

Reemplazar el bloque del logo desktop:

```tsx
          {/* Logo desktop — lockup horizontal izquierda */}
          <Link
            href="/"
            className="hidden md:flex items-center gap-[15px] flex-shrink-0"
          >
            {tenantConfig.logo_url ? (
              <Image
                src={tenantConfig.logo_url}
                alt={tenantConfig.client_name}
                width={0}
                height={0}
                unoptimized
                style={{ height: '42px', width: 'auto' }}
                className="object-contain"
                priority
              />
            ) : (
              <>
                <Image
                  src="/logos/wm-mono.png"
                  alt=""
                  width={42}
                  height={42}
                  className="object-contain"
                  aria-hidden
                />
                <Image
                  src="/logos/wm-word.png"
                  alt="RENUEVO"
                  width={0}
                  height={0}
                  unoptimized
                  style={{ height: '42px', width: 'auto' }}
                  className="object-contain"
                  priority
                />
              </>
            )}
          </Link>
```

por:

```tsx
          {/* Logo desktop — lockup horizontal izquierda */}
          <Link
            href="/"
            className="hidden md:flex items-center gap-[15px] flex-shrink-0"
          >
            {tenantConfig.logo_url ? (
              <Image
                src={tenantConfig.logo_url}
                alt={tenantConfig.client_name}
                width={0}
                height={0}
                unoptimized
                style={{ height: '42px', width: 'auto' }}
                className="object-contain"
                priority
              />
            ) : (
              <span
                className="text-[19px] font-semibold"
                style={{ fontFamily: 'var(--font-head)', color: 'var(--brand)' }}
              >
                {tenantConfig.client_name}
              </span>
            )}
          </Link>
```

- [ ] **Step 5: Gatear el link "Ver colecciones →" dentro del mega-menú de Catálogo**

El mega-menú de "Catálogo" (el `hasMega` de `NAV_LINKS`) tiene, además de las categorías de
`MOCK_CATEGORIES`, un link fijo al final: `<Link href="/colecciones">Ver colecciones →</Link>`.
Como "Catálogo" sigue habilitado incluso para tenants sin "colecciones" (ej. Nehemías:
`nav_sections: ['catalogo', 'contacto']`), ese link quedaría expuesto igual sin este fix.
Agregar el test primero, en `Header.test.tsx`:

```ts
  it('oculta "Ver colecciones" del mega-menú cuando colecciones no está en nav_sections', () => {
    render(
      <TenantConfigProvider value={{ ...testTenantConfig, nav_sections: ['catalogo', 'contacto'] }}>
        <Header />
      </TenantConfigProvider>,
    )
    expect(screen.queryByText('Ver colecciones →')).toBeNull()
  })
```

Run: `cd impulso_ecommerce_app && npx vitest run src/components/layout/Header.test.tsx`
Expected: FAIL — el link se renderiza siempre hoy.

Reemplazar, dentro del bloque del mega-menú:

```tsx
                      <div style={{ height: 1, background: 'var(--line-soft)', margin: '6px 12px' }} />
                      <Link
                        href="/colecciones"
                        className="flex items-center gap-2 px-3 py-2 mx-1 rounded-[10px] hover:bg-beige transition-colors text-[12.5px] font-medium"
                        style={{ color: 'var(--taupe)' }}
                      >
                        Ver colecciones →
                      </Link>
```

por:

```tsx
                      {tenantConfig.nav_sections.includes('colecciones') && (
                        <>
                          <div style={{ height: 1, background: 'var(--line-soft)', margin: '6px 12px' }} />
                          <Link
                            href="/colecciones"
                            className="flex items-center gap-2 px-3 py-2 mx-1 rounded-[10px] hover:bg-beige transition-colors text-[12.5px] font-medium"
                            style={{ color: 'var(--taupe)' }}
                          >
                            Ver colecciones →
                          </Link>
                        </>
                      )}
```

- [ ] **Step 6: Swap de colores literales a tokens**

Reemplazar `background: 'rgba(250,247,243,.94)',` (línea ~43) por:
`background: 'color-mix(in srgb, var(--surface) 94%, transparent)',`

Reemplazar `boxShadow: '0 8px 32px rgba(63,53,44,.12)',` (línea ~146) por:
`boxShadow: '0 8px 32px rgba(var(--overlay-dark),.12)',`

- [ ] **Step 7: Run tests to verify they pass**

Run: `cd impulso_ecommerce_app && npx vitest run src/components/layout/Header.test.tsx`
Expected: PASS (los 4 tests nuevos + el existente).

- [ ] **Step 8: Run full test suite + typecheck**

Run: `cd impulso_ecommerce_app && npx vitest run && npx tsc --noEmit`
Expected: PASS.

- [ ] **Step 9: Commit**

```bash
git add src/components/layout/Header.tsx src/components/layout/Header.test.tsx
git commit -m "feat: filter Header nav by nav_sections, neutral logo fallback, token colors"
```

---

### Task 10: `Footer.tsx` — nav, logo, tagline/ciudad, medios de pago, colores a tokens

**Files:**
- Modify: `impulso_ecommerce_app/src/components/layout/Footer.tsx`
- Create: `impulso_ecommerce_app/src/components/layout/Footer.test.tsx`

**Interfaces:**
- Consumes: `useTenantConfig()` → `nav_sections`, `logo_url`, `tagline`, `city`,
  `checkout_methods`, `client_name` (Task 5).

- [ ] **Step 1: Write the failing tests — `Footer.test.tsx` (archivo nuevo)**

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Footer } from './Footer'
import { TenantConfigProvider } from '@/components/providers/TenantConfigProvider'
import type { TenantConfig } from '@/lib/tenant-config'

const baseTenantConfig: TenantConfig = {
  tenant_id: 'tenant-1',
  client_name: 'Distribuidora Nehemías',
  brand_color: '#2563EB',
  logo_url: null,
  favicon_url: null,
  email_from: null,
  whatsapp_number: '5492664000000',
  whatsapp_message: 'Hola!',
  checkout_methods: ['whatsapp'],
  nav_sections: ['catalogo', 'contacto'],
  tagline: null,
  city: 'San Luis',
  default_product_image_url: null,
  theme_id: 'senal',
}

function renderFooter(config: Partial<TenantConfig> = {}) {
  return render(
    <TenantConfigProvider value={{ ...baseTenantConfig, ...config }}>
      <Footer />
    </TenantConfigProvider>,
  )
}

describe('Footer', () => {
  it('oculta los links de Tienda/Información que no están en nav_sections', () => {
    renderFooter()
    expect(screen.queryByRole('link', { name: 'Colecciones' })).toBeNull()
    expect(screen.queryByRole('link', { name: 'Inspiración' })).toBeNull()
    expect(screen.queryByRole('link', { name: 'Nosotros' })).toBeNull()
    expect(screen.getByRole('link', { name: 'Catálogo' })).toBeDefined()
  })

  it('sin tagline, no renderiza el párrafo de marca', () => {
    renderFooter({ tagline: null })
    expect(screen.queryByText(/Diseños para espacios/i)).toBeNull()
  })

  it('con tagline, renderiza el párrafo de marca', () => {
    renderFooter({ tagline: 'Repuestos y accesorios al mejor precio.' })
    expect(screen.getByText('Repuestos y accesorios al mejor precio.')).toBeDefined()
  })

  it('el copyright incluye la ciudad cuando está seteada', () => {
    renderFooter({ city: 'San Luis' })
    expect(screen.getByText((_, el) => el?.textContent === '© 2026 Distribuidora Nehemías · San Luis')).toBeDefined()
  })

  it('checkout_methods whatsapp: muestra el bloque de WhatsApp, sin badges de tarjeta', () => {
    renderFooter({ checkout_methods: ['whatsapp'] })
    expect(screen.getByText(/consultas y pedidos por whatsapp/i)).toBeDefined()
    expect(screen.queryByText('VISA')).toBeNull()
    expect(screen.queryByText('MASTER')).toBeNull()
    expect(screen.queryByText('AMEX')).toBeNull()
  })

  it('checkout_methods mobbex: muestra los badges de tarjeta', () => {
    renderFooter({ checkout_methods: ['mobbex'] })
    expect(screen.getByText('VISA')).toBeDefined()
    expect(screen.getByText('MASTER')).toBeDefined()
    expect(screen.getByText('AMEX')).toBeDefined()
    expect(screen.queryByText(/consultas y pedidos por whatsapp/i)).toBeNull()
  })

  it('sin logo_url, muestra el nombre del tenant en vez del wordmark de Renuevo', () => {
    renderFooter({ logo_url: null })
    expect(screen.getAllByText('Distribuidora Nehemías').length).toBeGreaterThan(0)
    expect(screen.queryByAltText('RENUEVO')).toBeNull()
  })
})
```

> Nota: el test del copyright fija el año en el texto esperado (`© 2026 ...`) porque
> `Footer.tsx` usa `new Date().getFullYear()` — si este test se corre después de que cambie el
> año del sistema, actualizar el literal `2026` del test (no vale la pena mockear `Date` para
> un solo dígito de año en un test de contenido).

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd impulso_ecommerce_app && npx vitest run src/components/layout/Footer.test.tsx`
Expected: FAIL — ninguno de los comportamientos existe todavía.

- [ ] **Step 3: Nav filtrado + logo fallback + tagline/ciudad**

Reemplazar el bloque de imports y constantes:

```tsx
import Link from 'next/link';
import Image from 'next/image';
import { useTenantConfig } from '@/components/providers/TenantConfigProvider';
import { buildGenericWhatsAppUrl } from '@/lib/whatsapp';

const LINKS_TIENDA = [
  { href: '/productos', label: 'Catálogo' },
  { href: '/colecciones', label: 'Colecciones' },
  { href: '/inspiracion', label: 'Inspiración' },
];

const LINKS_INFO = [
  { href: '/nosotros', label: 'Nosotros' },
  { href: '/contacto', label: 'Contacto' },
  { href: '/cuenta', label: 'Mi cuenta' },
  { href: '/cuenta/pedidos', label: 'Mis pedidos' },
];
```

por:

```tsx
import Link from 'next/link';
import Image from 'next/image';
import { useTenantConfig } from '@/components/providers/TenantConfigProvider';
import { buildGenericWhatsAppUrl } from '@/lib/whatsapp';
import type { NavSection } from '@/lib/nav-sections';

const LINKS_TIENDA: { href: string; label: string; section: NavSection }[] = [
  { href: '/productos', label: 'Catálogo', section: 'catalogo' },
  { href: '/colecciones', label: 'Colecciones', section: 'colecciones' },
  { href: '/inspiracion', label: 'Inspiración', section: 'inspiracion' },
];

// "Mi cuenta"/"Mis pedidos" no dependen de nav_sections — existen para cualquier tenant.
const LINKS_INFO: { href: string; label: string; section: NavSection | null }[] = [
  { href: '/nosotros', label: 'Nosotros', section: 'nosotros' },
  { href: '/contacto', label: 'Contacto', section: 'contacto' },
  { href: '/cuenta', label: 'Mi cuenta', section: null },
  { href: '/cuenta/pedidos', label: 'Mis pedidos', section: null },
];
```

Reemplazar el inicio del componente:

```tsx
export function Footer() {
  const tenantConfig = useTenantConfig();
  const whatsappUrl = buildGenericWhatsAppUrl(tenantConfig);
  const year = new Date().getFullYear();
  const cuotasText =
    process.env.NEXT_PUBLIC_CUOTAS_TEXT ?? '6 cuotas sin interés';
```

por:

```tsx
export function Footer() {
  const tenantConfig = useTenantConfig();
  const whatsappUrl = buildGenericWhatsAppUrl(tenantConfig);
  const year = new Date().getFullYear();
  const usesMobbex = tenantConfig.checkout_methods.includes('mobbex');
  const linksTienda = LINKS_TIENDA.filter((l) => tenantConfig.nav_sections.includes(l.section));
  const linksInfo = LINKS_INFO.filter((l) => !l.section || tenantConfig.nav_sections.includes(l.section));
```

(La línea `cuotasText` se elimina de acá — el newsletter ya no promete cuotas fijas; ver Step 4.)

Reemplazar el párrafo del newsletter:

```tsx
          <p className='text-sm mb-6' style={{ color: 'rgba(246,242,237,.7)' }}>
            Suscribite y recibí {cuotasText} en tu primera compra.
          </p>
```

por:

```tsx
          <p className='text-sm mb-6' style={{ color: 'rgba(255,255,255,.7)' }}>
            Suscribite y enterate primero de nuestras novedades.
          </p>
```

Reemplazar el bloque del logo de marca (dentro del `<footer>`, sección "Marca"):

```tsx
            <div className='flex items-center gap-[12px] mb-3'>
              {tenantConfig.logo_url ? (
                <Image
                  src={tenantConfig.logo_url}
                  alt={tenantConfig.client_name}
                  width={0}
                  height={0}
                  unoptimized
                  style={{ height: '32px', width: 'auto' }}
                  className='object-contain'
                />
              ) : (
                <>
                  <Image
                    src='/logos/wm-mono-light.png'
                    alt=''
                    width={36}
                    height={36}
                    className='object-contain'
                    aria-hidden
                  />
                  <Image
                    src='/logos/wm-word-light.png'
                    alt='RENUEVO'
                    width={0}
                    height={0}
                    unoptimized
                    style={{ height: '32px', width: 'auto' }}
                    className='object-contain'
                  />
                </>
              )}
            </div>
            <p
              className='text-sm leading-relaxed mb-5'
              style={{ color: 'rgba(246,242,237,.7)' }}>
              Diseños para espacios que inspiran. Juegos de living premium
              para el hogar, pensados al detalle.
            </p>
```

por:

```tsx
            <div className='flex items-center gap-[12px] mb-3'>
              {tenantConfig.logo_url ? (
                <Image
                  src={tenantConfig.logo_url}
                  alt={tenantConfig.client_name}
                  width={0}
                  height={0}
                  unoptimized
                  style={{ height: '32px', width: 'auto' }}
                  className='object-contain'
                />
              ) : (
                <span
                  className='text-[17px] font-semibold'
                  style={{ fontFamily: 'var(--font-head)', color: '#fff' }}
                >
                  {tenantConfig.client_name}
                </span>
              )}
            </div>
            {tenantConfig.tagline && (
              <p
                className='text-sm leading-relaxed mb-5'
                style={{ color: 'rgba(255,255,255,.7)' }}>
                {tenantConfig.tagline}
              </p>
            )}
```

- [ ] **Step 4: Medios de pago condicionales**

Reemplazar el bloque completo de "Pagos":

```tsx
          {/* Pagos */}
          <div>
            <h5
              className='text-[11px] tracking-[.16em] uppercase mb-4 font-semibold'
              style={{ color: 'rgba(246,242,237,.55)' }}>
              Medios de pago
            </h5>
            <div className='flex gap-2 flex-wrap'>
              {['VISA', 'MASTER', 'AMEX'].map((b) => (
                <div
                  key={b}
                  className='w-12 h-8 rounded-[7px] flex items-center justify-center text-[9px] font-bold tracking-[.04em]'
                  style={{ background: '#fff', color: 'var(--gris-taupe)' }}>
                  {b}
                </div>
              ))}
            </div>
            <div
              className='mt-3 text-[11px]'
              style={{ color: 'rgba(246,242,237,.55)' }}>
              Transferencia · Talo
            </div>
            <div
              className='mt-4 flex items-center gap-2 text-[11px]'
              style={{ color: 'rgba(246,242,237,.5)' }}>
              <svg
                width='12'
                height='12'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth={2}>
                <rect x='3' y='11' width='18' height='11' rx='2' ry='2' />
                <path d='M7 11V7a5 5 0 0110 0v4' strokeLinecap='round' />
              </svg>
              Sitio protegido con SSL
            </div>
          </div>
```

por:

```tsx
          {/* Pagos */}
          <div>
            <h5
              className='text-[11px] tracking-[.16em] uppercase mb-4 font-semibold'
              style={{ color: 'rgba(255,255,255,.55)' }}>
              Medios de pago
            </h5>
            {usesMobbex ? (
              <>
                <div className='flex gap-2 flex-wrap'>
                  {['VISA', 'MASTER', 'AMEX'].map((b) => (
                    <div
                      key={b}
                      className='w-12 h-8 rounded-[7px] flex items-center justify-center text-[9px] font-bold tracking-[.04em]'
                      style={{ background: '#fff', color: 'var(--gris-taupe)' }}>
                      {b}
                    </div>
                  ))}
                </div>
                <div
                  className='mt-3 text-[11px]'
                  style={{ color: 'rgba(255,255,255,.55)' }}>
                  Transferencia · Talo
                </div>
              </>
            ) : (
              <a
                href={whatsappUrl}
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center gap-2 text-[13px] font-medium hover:opacity-80'
                style={{ color: '#fff' }}
              >
                <svg width='16' height='16' viewBox='0 0 24 24' fill='currentColor'>
                  <path d='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z' />
                </svg>
                Consultas y pedidos por WhatsApp
              </a>
            )}
            <div
              className='mt-4 flex items-center gap-2 text-[11px]'
              style={{ color: 'rgba(255,255,255,.5)' }}>
              <svg
                width='12'
                height='12'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth={2}>
                <rect x='3' y='11' width='18' height='11' rx='2' ry='2' />
                <path d='M7 11V7a5 5 0 0110 0v4' strokeLinecap='round' />
              </svg>
              Sitio protegido con SSL
            </div>
          </div>
```

- [ ] **Step 5: Copyright con ciudad + resto de swaps de color literal a token**

Reemplazar:

```tsx
        <div
          className='pt-6 text-center text-[11px]'
          style={{ color: 'rgba(246,242,237,.4)' }}>
          © {year} {tenantConfig.client_name} · Buenos Aires
        </div>
```

por:

```tsx
        <div
          className='pt-6 text-center text-[11px]'
          style={{ color: 'rgba(255,255,255,.4)' }}>
          © {year} {tenantConfig.client_name}{tenantConfig.city ? ` · ${tenantConfig.city}` : ''}
        </div>
```

Reemplazar el resto de las ocurrencias `rgba(246,242,237,` (bordes del newsletter y separadores,
labels "Tienda"/"Información"/"Newsletter", links de esas listas) por el mismo alpha sobre
`rgba(255,255,255,`:
- `borderColor: 'rgba(246,242,237,.12)'` (2 ocurrencias) → `borderColor: 'rgba(255,255,255,.12)'`
- `color: 'rgba(246,242,237,.55)'` (labels de sección) → `color: 'rgba(255,255,255,.55)'`
- `color: 'rgba(246,242,237,.7)'` (links de Tienda/Información) → `color: 'rgba(255,255,255,.7)'`
- `border: '1px solid rgba(246,242,237,.2)'` (input newsletter) → `border: '1px solid rgba(255,255,255,.2)'`

- [ ] **Step 6: Usar `linksTienda`/`linksInfo` filtrados en el JSX**

Reemplazar `{LINKS_TIENDA.map(({ href, label }) => (` por `{linksTienda.map(({ href, label }) => (`,
y `{LINKS_INFO.map(({ href, label }) => (` por `{linksInfo.map(({ href, label }) => (`.

- [ ] **Step 7: Run tests to verify they pass**

Run: `cd impulso_ecommerce_app && npx vitest run src/components/layout/Footer.test.tsx`
Expected: PASS (los 7 tests).

- [ ] **Step 8: Run full test suite + typecheck**

Run: `cd impulso_ecommerce_app && npx vitest run && npx tsc --noEmit`
Expected: PASS.

- [ ] **Step 9: Commit**

```bash
git add src/components/layout/Footer.tsx src/components/layout/Footer.test.tsx
git commit -m "feat: parametrize Footer nav, logo, tagline, city, and payment methods by tenant"
```

---

### Task 11: `ProductCard.tsx` — cuotas condicionales, fallback de imagen rota, colores a tokens

**Files:**
- Modify: `impulso_ecommerce_app/src/components/product/ProductCard.tsx`
- Modify: `impulso_ecommerce_app/src/components/product/ProductCard.test.tsx`

**Interfaces:**
- Consumes: `useTenantConfig()` → `checkout_methods`, `default_product_image_url` (Task 5).

- [ ] **Step 1: Write the failing tests — reescribir `ProductCard.test.tsx`**

Reemplazar el archivo completo (agrega el wrapper de `TenantConfigProvider`, requerido porque
`ProductCard` va a consumir `useTenantConfig()`):

```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ProductCard } from './ProductCard'
import { TenantConfigProvider } from '@/components/providers/TenantConfigProvider'
import type { PublicProduct } from '@/types/product'
import type { TenantConfig } from '@/lib/tenant-config'
import { useCartStore } from '@/store/cartStore'

vi.mock('next/link', () => ({
  default: ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => (
    <a href={href} className={className}>{children}</a>
  ),
}))

vi.mock('next/image', () => ({
  // eslint-disable-next-line @next/next/no-img-element -- mock de test, no es <Image> real en producción
  default: ({ src, alt, onError }: { src: string; alt: string; onError?: () => void }) => (
    <img src={src} alt={alt} onError={onError} />
  ),
}))

const baseProduct: PublicProduct = {
  id: '1',
  name: 'Almohada Escandinava',
  description: 'Una descripción',
  price: 15000,
  image_url: 'https://example.com/image.jpg',
  slug: 'almohada-escandinava',
  category: 'Almohadas',
  stock: 3,
  is_featured: false,
  seo_title: 'Almohada Escandinava',
  seo_description: null,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
}

const baseTenantConfig: TenantConfig = {
  tenant_id: 'tenant-1',
  client_name: 'Test Store',
  brand_color: '#000',
  logo_url: null,
  favicon_url: null,
  email_from: null,
  whatsapp_number: null,
  whatsapp_message: null,
  checkout_methods: ['mobbex'],
  nav_sections: ['catalogo', 'colecciones', 'inspiracion', 'nosotros', 'contacto'],
  tagline: null,
  city: null,
  default_product_image_url: null,
  theme_id: 'renuevo',
}

function renderCard(
  product: Partial<PublicProduct> = {},
  config: Partial<TenantConfig> = {},
  cardProps: { badge?: 'Más vendido' | 'Novedad' | 'Oferta' | ''; comparePrice?: number } = {},
) {
  return render(
    <TenantConfigProvider value={{ ...baseTenantConfig, ...config }}>
      <ProductCard product={{ ...baseProduct, ...product }} {...cardProps} />
    </TenantConfigProvider>,
  )
}

describe('ProductCard', () => {
  beforeEach(() => {
    useCartStore.setState({ items: [], total: 0, itemCount: 0, isOpen: false })
  })

  it('renderiza el nombre del producto', () => {
    renderCard()
    expect(screen.getByText('Almohada Escandinava')).toBeTruthy()
  })

  it('renderiza el precio', () => {
    renderCard()
    expect(screen.getByText(/\$15/)).toBeTruthy()
  })

  it('enlaza a /productos/[slug] cuando el slug existe', () => {
    renderCard()
    const links = screen.getAllByRole('link')
    expect(links.some(l => l.getAttribute('href') === '/productos/almohada-escandinava')).toBe(true)
  })

  it('enlaza a # cuando el slug es null', () => {
    renderCard({ slug: null })
    const links = screen.getAllByRole('link')
    expect(links.some(l => l.getAttribute('href') === '#')).toBe(true)
  })

  it('renderiza la imagen cuando image_url está disponible', () => {
    renderCard()
    expect(screen.getByRole('img', { name: 'Almohada Escandinava' })).toBeTruthy()
  })

  it('renderiza el placeholder cuando image_url es null', () => {
    renderCard({ image_url: null })
    expect(screen.queryByRole('img', { name: 'Almohada Escandinava' })).toBeNull()
  })

  it('muestra el badge Destacado cuando is_featured es true', () => {
    renderCard({ is_featured: true })
    expect(screen.getByText('Destacado')).toBeTruthy()
  })

  it('no muestra el badge Destacado cuando is_featured es false', () => {
    renderCard()
    expect(screen.queryByText('Destacado')).toBeNull()
  })

  it('botón "Agregar al carrito" llama addItem del store', () => {
    renderCard()
    fireEvent.click(screen.getByRole('button', { name: /agregar al carrito/i }))
    expect(useCartStore.getState().items).toHaveLength(1)
    expect(useCartStore.getState().items[0].product.id).toBe('1')
  })

  it('muestra el texto de cuotas cuando checkout_methods incluye mobbex', () => {
    renderCard({}, { checkout_methods: ['mobbex'] })
    expect(screen.getByText(/cuotas sin interés/i)).toBeTruthy()
  })

  it('no muestra el texto de cuotas cuando checkout_methods es solo whatsapp', () => {
    renderCard({}, { checkout_methods: ['whatsapp'] })
    expect(screen.queryByText(/cuotas sin interés/i)).toBeNull()
  })

  it('imagen rota sin default_product_image_url: cae al placeholder genérico', () => {
    renderCard({}, { default_product_image_url: null })
    fireEvent.error(screen.getByRole('img', { name: 'Almohada Escandinava' }))
    expect(screen.queryByRole('img', { name: 'Almohada Escandinava' })).toBeNull()
  })

  it('imagen rota con default_product_image_url: usa la imagen de marca del tenant', () => {
    renderCard({}, { default_product_image_url: 'https://example.com/fallback.png' })
    fireEvent.error(screen.getByRole('img', { name: 'Almohada Escandinava' }))
    expect(screen.getByRole('img', { name: 'Almohada Escandinava' })).toHaveAttribute(
      'src',
      'https://example.com/fallback.png',
    )
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd impulso_ecommerce_app && npx vitest run src/components/product/ProductCard.test.tsx`
Expected: FAIL — `ProductCard` no consume `useTenantConfig()` todavía, cuotas siempre visibles,
sin manejo de `onError`.

- [ ] **Step 3: Implementar cuotas condicionales + `onError` + colores a token**

Reemplazar:

```tsx
'use client'

import Link from 'next/link'
import Image from 'next/image'
import type { PublicProduct } from '@/types/product'
import { useCartStore } from '@/store/cartStore'
import { useFavoritesStore } from '@/store/favoritesStore'
import { useToastStore } from '@/store/toastStore'
import { formatPrice } from '@/lib/format'

const TAG_COLORS: Record<string, string> = {
  Destacado: 'rgba(63,53,44,.85)',
}
```

por:

```tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { PublicProduct } from '@/types/product'
import { useCartStore } from '@/store/cartStore'
import { useFavoritesStore } from '@/store/favoritesStore'
import { useToastStore } from '@/store/toastStore'
import { useTenantConfig } from '@/components/providers/TenantConfigProvider'
import { formatPrice } from '@/lib/format'

const TAG_COLORS: Record<string, string> = {
  Destacado: 'rgba(var(--overlay-dark),.85)',
}
```

Reemplazar el inicio del componente:

```tsx
export function ProductCard({ product, badge, comparePrice }: ProductCardProps) {
  const href = product.slug ? `/productos/${product.slug}` : '#'
  const addItem = useCartStore((s) => s.addItem)
  const isFav = useFavoritesStore((s) => s.isFavorite(product.id))
  const toggleFav = useFavoritesStore((s) => s.toggleFavorite)
  const addToast = useToastStore((s) => s.addToast)

  const tagLabel = badge ?? (product.is_featured ? 'Destacado' : '')
  const cuotasText = process.env.NEXT_PUBLIC_CUOTAS_TEXT ?? '6 cuotas sin interés'
  const cuotaValue = `${cuotasText} de $${formatPrice(Math.round(product.price / 6))}`
```

por:

```tsx
export function ProductCard({ product, badge, comparePrice }: ProductCardProps) {
  const tenantConfig = useTenantConfig()
  const href = product.slug ? `/productos/${product.slug}` : '#'
  const addItem = useCartStore((s) => s.addItem)
  const isFav = useFavoritesStore((s) => s.isFavorite(product.id))
  const toggleFav = useFavoritesStore((s) => s.toggleFavorite)
  const addToast = useToastStore((s) => s.addToast)
  const [imgError, setImgError] = useState(false)

  const tagLabel = badge ?? (product.is_featured ? 'Destacado' : '')
  const showCuotas = tenantConfig.checkout_methods.includes('mobbex')
  const cuotasText = process.env.NEXT_PUBLIC_CUOTAS_TEXT ?? '6 cuotas sin interés'
  const cuotaValue = `${cuotasText} de $${formatPrice(Math.round(product.price / 6))}`
  const imageSrc = imgError ? tenantConfig.default_product_image_url : product.image_url
```

Reemplazar el bloque de imagen:

```tsx
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:-translate-y-1"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
```

por:

```tsx
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:-translate-y-1"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              onError={() => setImgError(true)}
            />
          ) : (
```

Reemplazar la línea del badge fallback:

```tsx
                  tagLabel === 'Oferta' ? 'var(--error)' : TAG_COLORS[tagLabel] ?? 'rgba(63,53,44,.82)',
```

por:

```tsx
                  tagLabel === 'Oferta' ? 'var(--error)' : TAG_COLORS[tagLabel] ?? 'rgba(var(--overlay-dark),.82)',
```

Reemplazar el párrafo de cuotas:

```tsx
      <p className="text-[10px] font-medium mt-0.5" style={{ color: 'var(--exito)' }}>
        {cuotaValue}
      </p>
```

por:

```tsx
      {showCuotas && (
        <p className="text-[10px] font-medium mt-0.5" style={{ color: 'var(--exito)' }}>
          {cuotaValue}
        </p>
      )}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd impulso_ecommerce_app && npx vitest run src/components/product/ProductCard.test.tsx`
Expected: PASS (los 13 tests).

- [ ] **Step 5: Actualizar los consumidores de `<ProductCard>` que no pasan por un tenant wrapper**

Run: `cd impulso_ecommerce_app && grep -rl "<ProductCard" src --include=*.test.tsx`
Si aparece algún test fuera de `ProductCard.test.tsx` que renderiza `<ProductCard>` sin
`TenantConfigProvider`, envolverlo igual que en Step 1 (mismo patrón `baseTenantConfig` +
`TenantConfigProvider`).

- [ ] **Step 6: Run full test suite + typecheck**

Run: `cd impulso_ecommerce_app && npx vitest run && npx tsc --noEmit`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/components/product/ProductCard.tsx src/components/product/ProductCard.test.tsx
git commit -m "feat: gate installment copy by checkout_methods, add broken-image fallback to ProductCard"
```

---

### Task 12: `ProductDetail.tsx` — cuotas condicionales

**Files:**
- Modify: `impulso_ecommerce_app/src/components/product/ProductDetail.tsx`
- Create: `impulso_ecommerce_app/src/components/product/ProductDetail.test.tsx`

**Interfaces:**
- Consumes: `useTenantConfig()` → `checkout_methods` (Task 5).

- [ ] **Step 1: Write the failing test — archivo nuevo, mínimo (sin test previo de este componente)**

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProductDetail } from './ProductDetail'
import { TenantConfigProvider } from '@/components/providers/TenantConfigProvider'
import type { PublicProduct } from '@/types/product'
import type { TenantConfig } from '@/lib/tenant-config'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}))

vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}))

const baseProduct: PublicProduct = {
  id: '1',
  name: 'Almohada Escandinava',
  description: 'Una descripción',
  price: 15000,
  image_url: null,
  slug: 'almohada-escandinava',
  category: 'Almohadas',
  stock: 3,
  is_featured: false,
  seo_title: 'Almohada Escandinava',
  seo_description: null,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
}

const baseTenantConfig: TenantConfig = {
  tenant_id: 'tenant-1',
  client_name: 'Test Store',
  brand_color: '#000',
  logo_url: null,
  favicon_url: null,
  email_from: null,
  whatsapp_number: null,
  whatsapp_message: null,
  checkout_methods: ['mobbex'],
  nav_sections: ['catalogo', 'colecciones', 'inspiracion', 'nosotros', 'contacto'],
  tagline: null,
  city: null,
  default_product_image_url: null,
  theme_id: 'renuevo',
}

function renderDetail(config: Partial<TenantConfig> = {}) {
  return render(
    <TenantConfigProvider value={{ ...baseTenantConfig, ...config }}>
      <ProductDetail product={baseProduct} />
    </TenantConfigProvider>,
  )
}

describe('ProductDetail', () => {
  it('muestra el texto de cuotas cuando checkout_methods incluye mobbex', () => {
    renderDetail({ checkout_methods: ['mobbex'] })
    expect(screen.getByText(/cuotas sin interés/i)).toBeTruthy()
  })

  it('no muestra el texto de cuotas cuando checkout_methods es solo whatsapp', () => {
    renderDetail({ checkout_methods: ['whatsapp'] })
    expect(screen.queryByText(/cuotas sin interés/i)).toBeNull()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd impulso_ecommerce_app && npx vitest run src/components/product/ProductDetail.test.tsx`
Expected: FAIL — el texto de cuotas se renderiza siempre hoy.

- [ ] **Step 3: Gatear el párrafo de cuotas**

Reemplazar:

```tsx
import { COLOR_VARIANTS, CONFIGURATIONS, getRelatedMockProducts } from '@/lib/mock-data'
import { formatPrice } from '@/lib/format'
```

por:

```tsx
import { COLOR_VARIANTS, CONFIGURATIONS, getRelatedMockProducts } from '@/lib/mock-data'
import { formatPrice } from '@/lib/format'
import { useTenantConfig } from '@/components/providers/TenantConfigProvider'
```

Reemplazar:

```tsx
export function ProductDetail({ product }: ProductDetailProps) {
  const [imgIdx, setImgIdx] = useState(0)
  const [openDesc, setOpenDesc] = useState(true)
  const [quantity, setQuantity] = useState(1)
```

por:

```tsx
export function ProductDetail({ product }: ProductDetailProps) {
  const tenantConfig = useTenantConfig()
  const [imgIdx, setImgIdx] = useState(0)
  const [openDesc, setOpenDesc] = useState(true)
  const [quantity, setQuantity] = useState(1)
```

Reemplazar:

```tsx
  const cuotasText = process.env.NEXT_PUBLIC_CUOTAS_TEXT ?? '6 cuotas sin interés'
```

por:

```tsx
  const showCuotas = tenantConfig.checkout_methods.includes('mobbex')
  const cuotasText = process.env.NEXT_PUBLIC_CUOTAS_TEXT ?? '6 cuotas sin interés'
```

Reemplazar:

```tsx
            <p className="text-sm font-medium mt-1" style={{ color: 'var(--exito)' }}>
              {cuotasText} de ${formatPrice(Math.round(product.price / 6))}
            </p>
```

por:

```tsx
            {showCuotas && (
              <p className="text-sm font-medium mt-1" style={{ color: 'var(--exito)' }}>
                {cuotasText} de ${formatPrice(Math.round(product.price / 6))}
              </p>
            )}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd impulso_ecommerce_app && npx vitest run src/components/product/ProductDetail.test.tsx`
Expected: PASS.

- [ ] **Step 5: Run full test suite + typecheck**

Run: `cd impulso_ecommerce_app && npx vitest run && npx tsc --noEmit`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/product/ProductDetail.tsx src/components/product/ProductDetail.test.tsx
git commit -m "feat: gate ProductDetail installment copy by checkout_methods"
```

---

### Task 13: Swap de colores literales a tokens — componentes decorativos del home/drawers

**Files:**
- Modify: `impulso_ecommerce_app/src/components/home/HeroBanner.tsx:52`
- Modify: `impulso_ecommerce_app/src/components/home/CategorySection.tsx:74`
- Modify: `impulso_ecommerce_app/src/components/home/InspirationBanner.tsx:130`
- Modify: `impulso_ecommerce_app/src/components/cart/CartDrawer.tsx:30,44`
- Modify: `impulso_ecommerce_app/src/components/layout/MobileDrawer.tsx:33`

**Interfaces:**
- Consumes: `--overlay-dark` (Task 6/7/8 — ya inyectado por tenant, ningún cambio de props).
- Sin cambios de comportamiento — solo el color resuelto cambia por tenant.

- [ ] **Step 1: `HeroBanner.tsx`**

Reemplazar:

```tsx
            style={{ background: 'linear-gradient(90deg, rgba(63,53,44,.42), rgba(63,53,44,.05) 60%)' }}
```

por:

```tsx
            style={{ background: 'linear-gradient(90deg, rgba(var(--overlay-dark),.72), rgba(var(--overlay-dark),.12) 60%)' }}
```

(El alpha sube de `.42/.05` a `.72/.12` — el azul de Señal necesita más contraste que el marrón
de Renuevo para que el texto blanco del hero siga siendo legible; a `.42` sobre `#2563EB`-ish el
overlay queda demasiado tenue. Verificar visualmente en el Step 6 de esta tarea.)

- [ ] **Step 2: `CategorySection.tsx`**

Reemplazar:

```tsx
                      background: 'linear-gradient(to top, rgba(63,53,44,.55), transparent 55%)',
```

por:

```tsx
                      background: 'linear-gradient(to top, rgba(var(--overlay-dark),.62), transparent 55%)',
```

- [ ] **Step 3: `InspirationBanner.tsx`**

Reemplazar:

```tsx
              background: 'linear-gradient(to top, rgba(63,53,44,.55), transparent 60%)',
```

por:

```tsx
              background: 'linear-gradient(to top, rgba(var(--overlay-dark),.62), transparent 60%)',
```

- [ ] **Step 4: `CartDrawer.tsx`**

Reemplazar:

```tsx
          background: 'rgba(63,53,44,.32)',
```

por:

```tsx
          background: 'rgba(var(--overlay-dark),.32)',
```

Reemplazar:

```tsx
          boxShadow: '-8px 0 40px rgba(63,53,44,.12)',
```

por:

```tsx
          boxShadow: '-8px 0 40px rgba(var(--overlay-dark),.12)',
```

- [ ] **Step 5: `MobileDrawer.tsx`**

Reemplazar:

```tsx
          background: 'rgba(63,53,44,.32)',
```

por:

```tsx
          background: 'rgba(var(--overlay-dark),.32)',
```

- [ ] **Step 6: Verificar visualmente + grep de la spec**

Run: `cd impulso_ecommerce_app && npm run dev`, confirmar que `el-renuevo` no cambió (mismo
overlay marrón, ya que `--overlay-dark` del tema `renuevo` es `63,53,44` — idéntico al literal
que reemplaza).

Run: `grep -rn "rgba(63,53,44" src/components src/app`
Expected: sin resultados fuera de `Header.tsx`/`Footer.tsx`/`ProductCard.tsx` (ya migrados en
tareas anteriores) — si aparece alguno acá, falta una ocurrencia por cubrir.

- [ ] **Step 7: Run full test suite + typecheck**

Run: `cd impulso_ecommerce_app && npx vitest run && npx tsc --noEmit`
Expected: PASS (estos 5 archivos no tienen lógica nueva, solo el valor de color cambia).

- [ ] **Step 8: Commit**

```bash
git add src/components/home/HeroBanner.tsx src/components/home/CategorySection.tsx \
  src/components/home/InspirationBanner.tsx src/components/cart/CartDrawer.tsx \
  src/components/layout/MobileDrawer.tsx
git commit -m "refactor: replace literal overlay colors with --overlay-dark token"
```

---

### Task 14: Gate de `nav_sections` en Colecciones/Inspiración/Nosotros

**Files:**
- Modify: `impulso_ecommerce_app/src/app/sites/[tenant]/nosotros/page.tsx`
- Modify: `impulso_ecommerce_app/src/app/sites/[tenant]/colecciones/page.tsx`
- Modify: `impulso_ecommerce_app/src/app/sites/[tenant]/colecciones/[slug]/page.tsx`
- Modify: `impulso_ecommerce_app/src/app/sites/[tenant]/inspiracion/page.tsx`
- Modify: `impulso_ecommerce_app/src/app/sites/[tenant]/inspiracion/[slug]/page.tsx`
- Create: `impulso_ecommerce_app/src/app/sites/[tenant]/nosotros/page.test.tsx`

**Interfaces:**
- Consumes: `assertNavSectionEnabled(tenantSlug, section)` de Task 5.

- [ ] **Step 1: Write the failing test — patrón representativo con `nosotros/page.tsx`**

```tsx
import { describe, it, expect, vi } from 'vitest'
import { notFound } from 'next/navigation'
import AboutPage from './page'

vi.mock('next/navigation', () => ({
  notFound: vi.fn(() => {
    throw new Error('NEXT_NOT_FOUND')
  }),
}))

const mockAssertNavSectionEnabled = vi.fn()
vi.mock('@/lib/nav-sections', () => ({
  assertNavSectionEnabled: (...args: unknown[]) => mockAssertNavSectionEnabled(...args),
}))

describe('AboutPage', () => {
  it('llama a assertNavSectionEnabled con la sección nosotros', async () => {
    mockAssertNavSectionEnabled.mockResolvedValue(undefined)
    await AboutPage({ params: { tenant: 'el-renuevo' } })
    expect(mockAssertNavSectionEnabled).toHaveBeenCalledWith('el-renuevo', 'nosotros')
  })

  it('propaga notFound() cuando la sección no está habilitada', async () => {
    mockAssertNavSectionEnabled.mockImplementation(() => {
      notFound()
      return Promise.resolve()
    })
    await expect(AboutPage({ params: { tenant: 'distribuidora-nehemias' } })).rejects.toThrow('NEXT_NOT_FOUND')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd impulso_ecommerce_app && npx vitest run src/app/sites/\[tenant\]/nosotros/page.test.tsx`
Expected: FAIL — `AboutPage` no toma `params` ni llama `assertNavSectionEnabled` todavía.

- [ ] **Step 3: `nosotros/page.tsx` — agregar el gate**

Reemplazar:

```tsx
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Nosotros — RENUEVO',
  description: 'Conocé la historia y los valores detrás de RENUEVO. Juegos de living de calidad para inspirar tus espacios.',
}
```

por:

```tsx
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { assertNavSectionEnabled } from '@/lib/nav-sections'

export const metadata: Metadata = {
  title: 'Nosotros',
  description: 'Conocé nuestra historia y valores.',
}
```

(La meta description específica por tenant ya la resuelve `generateMetadata` de
`[tenant]/layout.tsx` — Task 8 — este `metadata` estático solo aplica como fallback si Next no
usa el de arriba; se deja genérico, sin "RENUEVO" hardcodeado.)

Reemplazar:

```tsx
export default function AboutPage() {
  return (
```

por:

```tsx
export default async function AboutPage({ params }: { params: { tenant: string } }) {
  await assertNavSectionEnabled(params.tenant, 'nosotros')
  return (
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd impulso_ecommerce_app && npx vitest run src/app/sites/\[tenant\]/nosotros/page.test.tsx`
Expected: PASS.

- [ ] **Step 5: Aplicar el mismo patrón a los otros 4 archivos**

`colecciones/page.tsx` — reemplazar:

```tsx
import Image from 'next/image'
import Link from 'next/link'
import { MOCK_COLLECTIONS } from '@/lib/mock-data'

export default function CollectionsPage() {
```

por:

```tsx
import Image from 'next/image'
import Link from 'next/link'
import { MOCK_COLLECTIONS } from '@/lib/mock-data'
import { assertNavSectionEnabled } from '@/lib/nav-sections'

export default async function CollectionsPage({ params }: { params: { tenant: string } }) {
  await assertNavSectionEnabled(params.tenant, 'colecciones')
```

`inspiracion/page.tsx` — mismo patrón, `assertNavSectionEnabled(params.tenant, 'inspiracion')`.

`colecciones/[slug]/page.tsx` — reemplazar:

```tsx
interface Props {
  params: { slug: string }
}
```

```tsx
export default function CollectionDetailPage({ params }: Props) {
  const collection = MOCK_COLLECTIONS.find((c) => c.id === params.slug)
  if (!collection) notFound()
```

por:

```tsx
interface Props {
  params: { tenant: string; slug: string }
}
```

```tsx
export default async function CollectionDetailPage({ params }: Props) {
  await assertNavSectionEnabled(params.tenant, 'colecciones')
  const collection = MOCK_COLLECTIONS.find((c) => c.id === params.slug)
  if (!collection) notFound()
```

Y agregar el import `import { assertNavSectionEnabled } from '@/lib/nav-sections'` junto a los
demás imports del archivo.

`inspiracion/[slug]/page.tsx` — mismo patrón:
`interface Props { params: { tenant: string; slug: string } }`,
`export default async function InspirationDetailPage({ params }: Props)`,
`await assertNavSectionEnabled(params.tenant, 'inspiracion')` como primera línea del cuerpo,
antes de `const item = MOCK_INSPIRATION.find(...)`.

- [ ] **Step 6: Run full test suite + typecheck**

Run: `cd impulso_ecommerce_app && npx vitest run && npx tsc --noEmit`
Expected: PASS. Si `tsc` marca `generateStaticParams` de `colecciones/[slug]` o
`inspiracion/[slug]` como incompatible con el nuevo shape de `Props`, es porque
`generateStaticParams` solo devuelve `{ slug }` — Next.js completa `tenant` en cada ruta
generada automáticamente; no requiere cambios en `generateStaticParams` (esto es el mismo
comportamiento que ya tenía el archivo antes de esta tarea, con `params.tenant` sin usar).

- [ ] **Step 7: Verificación manual del comportamiento**

Run: `cd impulso_ecommerce_app && npm run dev`, con `EDGE_CONFIG` sin setear (fallback dev
apunta a `el-renuevo`) confirmar que `/nosotros`, `/colecciones`, `/inspiracion` siguen
funcionando igual que antes (todas están en el `nav_sections` default). Esto no cubre el caso
Nehemías end-to-end (requiere Edge Config + Supabase reales, fuera del alcance de este plan
local) — la cobertura de ese caso queda en los tests unitarios del Step 1/5.

- [ ] **Step 8: Commit**

```bash
git add src/app/sites/\[tenant\]/nosotros/page.tsx src/app/sites/\[tenant\]/nosotros/page.test.tsx \
  src/app/sites/\[tenant\]/colecciones/page.tsx src/app/sites/\[tenant\]/colecciones/\[slug\]/page.tsx \
  src/app/sites/\[tenant\]/inspiracion/page.tsx src/app/sites/\[tenant\]/inspiracion/\[slug\]/page.tsx
git commit -m "feat: 404 nosotros/colecciones/inspiracion pages when disabled in nav_sections"
```

---

### Task 15: Verificación final contra los criterios de aceptación del spec

**Files:** ninguno nuevo — solo comandos de verificación.

- [ ] **Step 1: Suite completa + build de `impulso_ecommerce_app`**

Run: `cd impulso_ecommerce_app && npx vitest run && npx tsc --noEmit && npm run build`
Expected: todo en verde.

- [ ] **Step 2: Suite completa + build de `impulso_ecommerce_api`**

Run: `cd impulso_ecommerce_api && npm test && npm run typecheck && npm run build`
Expected: todo en verde.

- [ ] **Step 3: Grep de literales de color (criterio de aceptación del spec)**

Run: `cd impulso_ecommerce_app && grep -rn "rgba(63,53,44" src/components src/app`
Expected: sin resultados.

Run: `cd impulso_ecommerce_app && grep -rn "rgba(246,242,237" src/components`
Expected: sin resultados.

- [ ] **Step 4: Chequeo manual de Renuevo sin regresión**

Run: `cd impulso_ecommerce_app && npm run dev`, recorrer home, `/productos`, `/colecciones`,
`/nosotros`, checkout — confirmar visualmente que nada cambió respecto a antes de este plan.

- [ ] **Step 5: Commit final (si quedó algo suelto)**

```bash
git status
```

Si hay cambios sin commitear (no debería, cada tarea commitea al final), revisarlos y
commitearlos con un mensaje descriptivo antes de cerrar el plan.

---

## Fuera de alcance (recordatorio del spec)

- Contenido curado del hero (headline propio, tiles de categoría con imagen propia, banner de
  inspiración) y la página "Nosotros" con historia de marca real de Nehemías — Spec B, pendiente
  de diseño separado con su propio gate de "sitio en preparación".
- CRUD de admin para `theme_id`/`nav_sections`/`tagline`/`city`/`default_product_image_url` —
  sigue siendo carga manual vía seed/SQL hasta que exista ese sprint.
- Onboarding real de Nehemías en Edge Config + Vercel (dominio, DNS) y logo real — deuda
  preexistente sin cambios.
