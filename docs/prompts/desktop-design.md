# Prompt — Aplicar diseño desktop (Renuevo Desktop.html)

## Contexto

El rediseño anterior aplicó únicamente el archivo `Renuevo Prototipo.html` (mobile). Existe un segundo archivo `Renuevo Desktop.html` con el diseño desktop que no fue implementado. Tu tarea es aplicar ese diseño desktop al codebase existente usando Tailwind responsive breakpoints (`md:`, `lg:`).

Leé estos archivos antes de empezar:
- `CLAUDE.md` (raíz del repo)
- `impulso_ecommerce_app/CLAUDE.md`
- `impulso_ecommerce_app/docs/TECHNICAL_DEBT.md`

---

## Principio fundamental

**No reescribas los componentes — extendelos.** El diseño mobile ya funciona. Agregá clases `md:` y `lg:` a los elementos existentes para que el layout cambie en breakpoints mayores. Solo creá componentes nuevos si el desktop tiene secciones que no existen en mobile.

Breakpoints a respetar:
- Mobile: `< 768px` (ya implementado)
- Tablet/Desktop: `md: ≥ 768px`
- Desktop grande: `lg: ≥ 1024px`

---

## Cambios esperados por sección

### Layout global
- **PromoBanner**: ya funciona en ambos — verificar alineación centrada en desktop
- **Header desktop**: logo a la izquierda + nav central + iconos a la derecha. En mobile ya tiene hamburger. En `md:` mostrar la nav horizontal y ocultar hamburger. Mega-menú desplegable en hover sobre "Catálogo".
- **BottomNav**: `md:hidden` — solo visible en mobile
- **Footer desktop**: 4 columnas en grid (`md:grid-cols-4`). En mobile ya es stack vertical.
- **MobileDrawer**: solo se abre desde mobile — no cambia

### Home (`/`)
- **HeroBanner desktop**: layout split (imagen a la derecha, texto a la izquierda) en `md:`. En mobile ya es full-bleed vertical.
- **Barra de beneficios**: en mobile stack vertical, en `md:` fila horizontal de 3 columnas
- **Categorías destacadas**: en mobile 2 cols, en `md:` 4 cols o carrusel
- **FeaturedProducts**: en mobile 2 cols, en `md:` 3-4 cols
- **Sección novedades**: solo visible en `md:` (`hidden md:block`). En mobile no existe.
- **Banner Inspiración**: en desktop puede ser más prominente (full-width con overlay de texto)

### Catálogo (`/productos` o página principal con filtros)
- **Sidebar de filtros desktop**: en mobile son chips horizontales. En `md:` mostrar sidebar fija a la izquierda (`md:w-64`) y el grid a la derecha (`md:flex-1`). Usar `hidden md:block` para el sidebar y `md:hidden` para los chips.
- **Grid de productos**: `grid-cols-2 md:grid-cols-3 lg:grid-cols-4`
- **Quick-add en hover**: en desktop (no touch), mostrar botón "Agregar al carrito" al hacer hover sobre la card (`group-hover:opacity-100`). En mobile ya tiene el botón visible.
- **Ordenamiento**: en mobile dropdown, en desktop puede ser inline con botones

### Detalle de producto (`/productos/[slug]`)
- **Layout desktop**: dos columnas — galería a la izquierda (`md:w-1/2`), info a la derecha (`md:w-1/2`). En mobile ya es stack vertical.
- **Galería con miniaturas**: en desktop las miniaturas van a la izquierda de la imagen principal (columna vertical). En mobile van abajo en fila horizontal.
- **Rating/reseñas**: en desktop visible debajo del nombre. En mobile podría estar en acordeón.
- **Badges de envío/retiro/pago seguro**: `hidden md:flex` — solo desktop
- **Descripción/ficha/cuidados**: en mobile acordeón, en `md:` tabs horizontales
- **Productos relacionados**: en mobile 2 cols, en `md:` 4 cols

### Carrito (drawer)
- **CartDrawer**: en mobile ocupa 85% del ancho. En `md:` ancho fijo de 420px (`md:w-[420px]`).
- **Resumen lateral en desktop**: el diseño desktop puede tener el resumen como sidebar (no drawer). Evaluar según el archivo Desktop.html — si es así, crear variante desktop del carrito.

### Checkout (`/checkout`)
- **Layout desktop 2 columnas**: formulario a la izquierda + resumen del pedido sticky a la derecha (`md:grid-cols-[1fr_380px]`). En mobile el resumen va arriba colapsado.
- **Progress indicator**: en mobile simplificado (solo paso actual), en desktop todos los pasos visibles.

### Páginas secundarias
- **Colecciones**: en desktop grid de 3 columnas con imagen hero grande
- **Inspiración**: en desktop masonry de 3 columnas (en mobile ya es 2)
- **Nosotros**: en desktop layout con imagen a la derecha del texto
- **Contacto**: en desktop mostrar mapa/dirección del showroom (`hidden md:block`)
- **Mi Cuenta**: en desktop sidebar de navegación a la izquierda + contenido a la derecha (`md:grid-cols-[220px_1fr]`)
- **Favoritos**: en mobile 2 cols, en `md:` 3-4 cols

---

## Lo que NO hay que cambiar

- La lógica de negocio (stores, API calls, validaciones)
- Los design tokens (colores, tipografía) — son los mismos en mobile y desktop
- Los archivos de test — no rompas los tests existentes
- `src/lib/mock-data.ts`

---

## Al finalizar

Actualizá `impulso_ecommerce_app/docs/progress.md` marcando como `[DONE] desktop-design` y agregando una línea por cada componente modificado con el formato:

```
[DONE] desktop-layout-header — Header.tsx: nav horizontal md:, mega-menú hover
[DONE] desktop-layout-footer — Footer.tsx: grid 4 cols md:
...
```
