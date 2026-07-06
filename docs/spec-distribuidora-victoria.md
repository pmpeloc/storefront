# Spec — Checkout configurable + imágenes externas (Distribuidora Nahuel)

**Sprint:** Distribuidora Nahuel (fuente externa de productos)
**Fecha:** 2026-07-06
**Depende de:** `impulso_ecommerce_api` — `orders.service.ts` debe devolver `checkoutUrl` apuntando a
`wa.me` cuando corresponda (ver su spec, sección "Diseño > 8") antes de que esto tenga efecto real; el
frontend puede construirse en paralelo con la respuesta mockeada.
**Estado:** Brainstorming cerrado con Misael

---

## Contexto

El checkout de `impulso_ecommerce_app` (`src/app/sites/[tenant]/checkout/page.tsx`) está 100%
hardcodeado a un flujo de 3 pasos: Datos → Envío → Pago (Mobbex: crédito/débito/transferencia). Para
Distribuidora Nahuel el pago con tarjeta no existe todavía — el pedido se cierra por WhatsApp. El flujo
debe quedar controlado por `tenant_config.checkout_methods` (array jsonb, ya definido en la spec de la
API) para que:
- Tenants existentes (Renuevo, Antonello) sigan viendo exactamente el checkout actual
  (`checkout_methods: ["mobbex"]`, default — sin cambio de comportamiento).
- Distribuidora Nahuel (`checkout_methods: ["whatsapp"]`) salte el step de pago con tarjeta y en su
  lugar muestre un resumen + botón "Confirmar pedido por WhatsApp".

Además, los productos de Distribuidora Nahuel traen imágenes hosteadas en el CDN de Distribuidora
Victoria (`api.distribuidora-victoria.com.ar`). Decisión ya cerrada con Misael: hotlink directo vía
`next/image`, sin proxy propio — pero `next/image` **requiere** que el hostname esté en
`images.remotePatterns` de `next.config.mjs`, si no tira error en build/runtime. Hoy ese archivo no
incluye ese dominio.

## Decisiones ya cerradas (no volver a preguntar)

1. `checkout_methods` extensible (no un enum simple) — hoy puede tener más de un método a la vez a
   futuro, el diseño debe soportar eso aunque Nahuel arranque con uno solo.
2. Sin proxy de imágenes — agregar el hostname de Victoria a `remotePatterns` alcanza. Misael aceptó que
   la URL de origen quede visible en la pestaña de red del navegador (vía el query param `url=` que
   genera `/_next/image`).
3. El pedido igual se persiste en `orders` (vía `POST /public/orders`, sin cambios de contrato del lado
   del frontend) aunque no haya pago online — el frontend simplemente redirige a lo que devuelva
   `checkoutUrl`, sea Mobbex o `wa.me`.

## Diseño

### 1. `next.config.mjs`

```javascript
{
  protocol: 'https',
  hostname: 'api.distribuidora-victoria.com.ar',
  pathname: '/uploads/**',
}
```

Agregar al array `remotePatterns` existente, sin tocar las entradas actuales.

### 2. `TenantConfig` (`src/lib/tenant-config.ts`)

Agregar `checkout_methods: string[]` a la interfaz (espejo del contrato de la API, snake_case por regla
de excepción de contrato del CLAUDE.md raíz).

### 3. Checkout condicional (`src/app/sites/[tenant]/checkout/page.tsx`)

El componente hoy tiene 3 steps fijos (`StepCustomerData` → `StepShipping` → `StepPayment`). Cambio:

- Leer `checkout_methods` del `TenantConfigProvider` (ya existe el provider, revisar
  `src/components/providers/TenantConfigProvider.tsx` para el hook de consumo exacto).
- Si `checkout_methods` **no incluye** `'mobbex'` (caso `["whatsapp"]`): el step 3 renderiza
  `StepWhatsAppConfirm` en vez de `StepPayment` — mismo lugar en el flujo, mismo `ProgressBar`, pero sin
  selector de método de tarjeta. Label del step 3 cambia de "Pago" a algo como "Confirmar".
- Si incluye `'mobbex'` (default, tenants existentes): sin cambios, `StepPayment` como está hoy.
- Si en el futuro incluye ambos: fuera de alcance de esta spec (Nahuel solo tiene whatsapp) — dejar el
  `if` escrito de forma que agregar ese caso después no requiera reescribir todo el componente (ej.
  derivar `availableMethods` de `checkout_methods` y mapear a una lista de tabs en vez de un solo booleano
  `isMobbex`).

### 4. `StepWhatsAppConfirm` (nuevo componente)

Mismo layout visual que `StepPayment` (reusar `OrderSummary`, `PrimaryButton`, `GhostButton` ya
existentes en el archivo) pero:
- Sin selector de método de pago.
- Botón principal dice "Confirmar pedido por WhatsApp".
- Al click, llama a `handleOrder('whatsapp')` (mismo `handleOrder` que ya existe en el componente padre,
  pasado por prop) — el backend decide qué URL devolver según `tenant_config.checkout_methods`, el
  frontend no arma el link de WhatsApp por su cuenta (evita duplicar lógica de formato de mensaje en dos
  lugares).
- `window.location.href = json.checkoutUrl` sin cambios — funciona igual sea Mobbex o `wa.me`.

---

## Archivos a crear/modificar

| Archivo | Acción |
|---|---|
| `next.config.mjs` | MODIFICAR — agregar hostname de Victoria |
| `src/lib/tenant-config.ts` | MODIFICAR — agregar `checkout_methods` |
| `src/app/sites/[tenant]/checkout/page.tsx` | MODIFICAR — render condicional del step 3 |
| `src/app/sites/[tenant]/checkout/page.test.tsx` | MODIFICAR — casos nuevos |
| `src/components/checkout/StepWhatsAppConfirm.tsx` + `.test.tsx` | CREAR (si se decide extraer del
  archivo monolítico actual — recomendado dado que `page.tsx` ya tiene ~670 líneas) |

---

## Tests requeridos

- `checkout/page.test.tsx`: tenant con `checkout_methods: ["mobbex"]` (o sin el campo, default) renderiza
  `StepPayment` sin cambios — test de regresión explícito
- `checkout/page.test.tsx`: tenant con `checkout_methods: ["whatsapp"]` renderiza `StepWhatsAppConfirm`,
  no renderiza selector de tarjeta/débito/transferencia
- `StepWhatsAppConfirm.test.tsx`: click en botón dispara `onSubmit('whatsapp')`
- Smoke visual: imagen de un producto con `image_url` de `api.distribuidora-victoria.com.ar` carga sin
  error de Next (`next/image` no tira "hostname not configured")

## Definición de Done

- [ ] `next.config.mjs` actualizado, imagen de Victoria carga en dev (`npm run dev`)
- [ ] Checkout de Renuevo/Antonello sin ningún cambio de comportamiento (regresión verde)
- [ ] Checkout con `checkout_methods: ["whatsapp"]` completo end-to-end contra la API en staging
- [ ] `docs/progress.md` actualizado
