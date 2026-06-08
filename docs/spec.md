# Storefront Sprint 2 — Carrito + Checkout Mobbex + Email

## Objetivo de negocio

Convertir visitas en ventas. Sprint 1 dejó el catálogo funcionando con CTA por WhatsApp. Sprint 2 agrega checkout nativo con Mobbex para que el cliente pueda comprar directamente en renuevohogar.com sin salir a otra app.

---

## Decisiones de producto

- **Carrito:** client-side con Zustand + persistencia en localStorage. Drawer deslizable desde la derecha.
- **Checkout:** Mobbex Checkout (redirect a página de pago de Mobbex). Las credenciales se configuran por env var — el sprint implementa la integración completa; si no hay credenciales al momento del desarrollo, se usa modo stub que simula el flujo completo.
- **Email de confirmación:** Resend + React Email. Se envía al cliente y al negocio.
- **Órdenes:** nueva tabla `orders` + `order_items` en Supabase. Creación vía nuevo endpoint público en prodcast_api (`POST /api/v1/public/orders`). Sin panel de órdenes en Sprint 2 — solo email.
- **Sin stock blocking en Sprint 2:** el stock se muestra como badge informativo pero no bloquea la compra. Gestión de stock real → Sprint 3.

---

## Flujo completo

```
[Catálogo] → [Add to Cart] → [Cart Drawer] → [Checkout page]
  → [POST /api/v1/public/orders] → [Mobbex redirect]
  → [Mobbex webhook → POST /api/v1/public/orders/webhook]
  → [Order status: paid] → [Email vía Resend al cliente + al negocio]
  → [Success page]
```

---

## Componentes nuevos (storefront)

### Cart Store
`src/store/cartStore.ts`

```typescript
interface CartItem {
  product: PublicProduct
  quantity: number
}

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  addItem: (product: PublicProduct) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clear: () => void
  toggleDrawer: () => void
  total: number        // computed
  itemCount: number    // computed
}
```

Persistencia: middleware `persist` de Zustand v5 → localStorage, key `renuevo-cart`.

### CartDrawer
`src/components/cart/CartDrawer.tsx`
- Slide-over desde la derecha, overlay oscuro
- Lista de items con imagen, nombre, precio, cantidad (stepper +/-), botón eliminar
- Total al pie + botón "Finalizar compra" → `/checkout`
- Badge en Header con `itemCount`

### CartButton (en Header)
`src/components/cart/CartButton.tsx`
- Ícono carrito + badge numérico si `itemCount > 0`
- Al click → `cartStore.toggleDrawer()`

### CheckoutPage
`src/app/checkout/page.tsx` — `'use client'`

Formulario con:
- Nombre completo
- Email
- Teléfono
- Dirección de envío (calle, número, ciudad, provincia, CP)

Al submit:
1. `POST /api/v1/public/orders` con items del carrito + datos del formulario
2. La API retorna `{ orderId, checkoutUrl }`
3. `window.location.href = checkoutUrl` — redirect a Mobbex

Validación: Zod + React Hook Form (mismo patrón que prodcast_app).

### OrderSuccessPage
`src/app/checkout/success/page.tsx`
- Muestra mensaje de confirmación
- Lee `?orderId=` del query string (lo pasa Mobbex como return URL)
- Limpia el carrito (`cartStore.clear()`)

### OrderFailurePage
`src/app/checkout/failure/page.tsx`
- Mensaje de error + botón volver al carrito

---

## API — Nuevos endpoints en prodcast_api

> ⚠️ Estos endpoints se implementan en **prodcast_api**, no en el storefront.
> Superpowers debe abrir el repo prodcast_api y trabajar en paralelo o primero.

### `POST /api/v1/public/orders`
Crea una orden y genera el checkout de Mobbex.

**Body:**
```json
{
  "tenantSlug": "el-renuevo",
  "customer": {
    "name": "string",
    "email": "string",
    "phone": "string"
  },
  "shippingAddress": {
    "street": "string",
    "city": "string",
    "province": "string",
    "zip": "string"
  },
  "items": [
    { "productId": "uuid", "quantity": 2 }
  ]
}
```

**Lógica:**
1. Resolver `tenantSlug` → `tenantId`
2. Verificar que todos los productos existen, pertenecen al tenant y tienen `status = 'published'`
3. Calcular total desde precios en DB — nunca confiar en precio enviado por el cliente
4. Insertar `orders` + `order_items` con `status: 'pending'`
5. Llamar a Mobbex API para crear checkout session
6. Retornar `{ orderId, checkoutUrl }`

**Response:**
```json
{
  "orderId": "uuid",
  "checkoutUrl": "https://mobbex.com/checkout/..."
}
```

### `POST /api/v1/public/orders/webhook`
Webhook que Mobbex llama cuando el pago se procesa.

**Lógica:**
1. Verificar firma del webhook (header `x-mobbex-signature`)
2. Si `status: paid` → actualizar `orders.status = 'paid'`
3. Disparar envío de email de confirmación (Resend) en background con `setImmediate`

---

## Schema DB — Nuevas tablas (migration 005)

Archivo: `prodcast_api/supabase/migrations/005_orders.sql`

```sql
CREATE TABLE orders (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id        uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  status           text NOT NULL DEFAULT 'pending'
                   CHECK (status IN ('pending', 'paid', 'failed', 'refunded')),
  customer_name    text NOT NULL,
  customer_email   text NOT NULL,
  customer_phone   text NOT NULL,
  shipping_address jsonb NOT NULL,
  total            numeric(10,2) NOT NULL,
  mobbex_id        text,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE order_items (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id      uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id    uuid NOT NULL REFERENCES products(id),
  product_name  text NOT NULL,
  product_price numeric(10,2) NOT NULL,
  quantity      integer NOT NULL CHECK (quantity > 0),
  subtotal      numeric(10,2) NOT NULL
);

CREATE INDEX idx_orders_tenant_id ON orders(tenant_id);
CREATE INDEX idx_orders_status    ON orders(tenant_id, status);
CREATE INDEX idx_order_items_order ON order_items(order_id);

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

> `product_name` y `product_price` en `order_items` son snapshots al momento de compra.

---

## Integración Mobbex

Documentación: https://mobbex.dev/docs

**Variables de entorno nuevas en prodcast_api:**
```bash
MOBBEX_API_KEY=
MOBBEX_ACCESS_TOKEN=
MOBBEX_WEBHOOK_SECRET=
```

**Modo sin credenciales (desarrollo):** si `MOBBEX_API_KEY` no está seteada, el servicio retorna una URL simulada (`/checkout/success?orderId=...`) para desarrollar el flujo sin cuenta real. Mismo patrón que los publisher stubs.

---

## Email (Resend + React Email)

**Templates:**
- `OrderConfirmationCustomer` — para el cliente: resumen de pedido, total, datos de envío
- `OrderNotificationBusiness` — para el negocio: alerta de nueva venta, datos del cliente

**Variables de entorno nuevas en prodcast_api:**
```bash
RESEND_API_KEY=
RESEND_FROM_EMAIL=ventas@renuevohogar.com
RESEND_NOTIFY_EMAIL=   # email del negocio
```

**Cuándo se envía:** en el webhook handler, cuando `status = 'paid'`, via `setImmediate`.

---

## Variables de entorno — storefront (nuevas)

```bash
NEXT_PUBLIC_CHECKOUT_SUCCESS_URL=https://renuevohogar.com/checkout/success
NEXT_PUBLIC_CHECKOUT_FAILURE_URL=https://renuevohogar.com/checkout/failure
```

---

## Fuera de scope para Sprint 2

- Panel de administración de órdenes
- Gestión de stock (decrementar al pagar)
- Devoluciones / refunds
- Múltiples métodos de pago
- Cupones de descuento
- Cálculo de envío dinámico
