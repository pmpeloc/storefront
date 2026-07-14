// Formato de moneda AR: punto de miles, coma decimal, siempre 2 decimales.
export function formatPrice(value: number): string {
  return value.toLocaleString('es-AR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}
