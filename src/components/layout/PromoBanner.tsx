export function PromoBanner() {
  const text = process.env.NEXT_PUBLIC_PROMO_BANNER ?? 'Envío gratis desde $60.000 · 6 cuotas sin interés'
  return (
    <div
      className="text-center text-marfil text-[10.5px] tracking-[0.14em] uppercase font-medium py-2 px-3"
      style={{ background: 'var(--marron)' }}
    >
      {text}
    </div>
  )
}
