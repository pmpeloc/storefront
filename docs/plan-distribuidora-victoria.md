# Impulso Ecommerce App — Plan de Tareas (Distribuidora Nehemías / fuente externa)

**Spec de referencia:** `docs/spec-distribuidora-victoria.md`
**Generado:** 2026-07-06

> TDD estricto: RED -> GREEN -> REFACTOR -> COMMIT en cada tarea.

---

## Fase 0 — Imágenes externas

## [PENDING] next-config-victoria-hostname
- Archivo: `next.config.mjs`
- Test primero: N/A — configuración
- Implementación: agregar `{ protocol: 'https', hostname: 'api.distribuidora-victoria.com.ar',
  pathname: '/uploads/**' }` a `images.remotePatterns`, sin tocar las entradas existentes
- Verificación: `npm run dev`, renderizar un `<Image>` con una URL real de Victoria, confirmar que carga
  sin el error "hostname is not configured"

---

## Fase 1 — Tipos

## [PENDING] tenant-config-checkout-methods
- Archivo: `src/lib/tenant-config.ts`
- Test primero: N/A — solo tipo
- Implementación: agregar `checkout_methods: string[]` a la interfaz `TenantConfig`
- Verificación: `npx tsc --noEmit` sin errores

---

## Fase 2 — Checkout condicional

## [PENDING] extract-step-whatsapp-confirm
- Archivo: `src/components/checkout/StepWhatsAppConfirm.tsx` (nuevo)
- Test primero: `StepWhatsAppConfirm.test.tsx` — renderiza resumen del pedido, botón "Confirmar pedido
  por WhatsApp", click dispara `onSubmit('whatsapp')`, muestra `apiError` si viene seteado, estado
  `isSubmitting` deshabilita el botón
- Implementación: extraer visualmente de `StepPayment` (mismo `OrderSummary`, `PrimaryButton`,
  `GhostButton`) pero sin el selector de métodos de tarjeta
- Verificación: tests en verde

## [PENDING] checkout-page-conditional-step3
- Archivo: `src/app/sites/[tenant]/checkout/page.tsx`
- Test primero: `page.test.tsx` — dos casos:
  1. tenant con `checkout_methods` ausente o `["mobbex"]` → step 3 renderiza `StepPayment` (regresión,
     comportamiento idéntico al actual)
  2. tenant con `checkout_methods: ["whatsapp"]` → step 3 renderiza `StepWhatsAppConfirm`, no aparece
     ningún método de tarjeta/débito/transferencia en el DOM
- Implementación: leer `checkout_methods` del `TenantConfigProvider` (confirmar hook exacto de consumo
  en `src/components/providers/TenantConfigProvider.tsx` antes de escribir esto), derivar qué componente
  renderizar en el step 3. Diseñar el `if` pensando en extensibilidad futura (lista de métodos, no un
  booleano binario) aunque hoy solo se use un método a la vez — ver spec sección "Diseño > 3"
- Verificación: ambos casos del test en verde

---

## Fase 3 — Regresión y validación end-to-end

## [PENDING] regresion-checkout-existente
- Archivo: N/A — suite de tests existente
- Test primero: correr `npm test` completo
- Implementación: N/A
- Verificación: 0 regresiones; smoke manual en `renuevohogar.com` (o staging) del flujo de pago con
  tarjeta sin cambios visibles

## [PENDING] e2e-whatsapp-checkout-staging
- Archivo: N/A — validación manual contra staging, no test automatizado
- Test primero: N/A
- Implementación: N/A
- Verificación: con el tenant Distribuidora Nehemías seedeado (ver plan de `impulso_ecommerce_api`, Fase
  9) y `checkout_methods: ["whatsapp"]` configurado, completar un pedido de punta a punta y confirmar que
  abre WhatsApp con el mensaje correcto y el pedido queda persistido en `orders`
