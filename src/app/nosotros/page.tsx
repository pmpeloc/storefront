import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Nosotros — Renuevo Almohadones',
  description: 'Conocé la historia y los valores detrás de Renuevo Almohadones.',
}

const VALUES = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: 'Materiales naturales',
    body: 'Trabajamos con lino, algodón, bouclé y fibras crudas. Nada sintético, nada apresurado.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4l3 3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: 'Producción pequeña',
    body: 'Cada pieza se hace por pedido o en tiradas cortas. Eso garantiza calidad y evita el desperdicio.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}>
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: 'Hecho con cuidado',
    body: 'Controlamos cada costura, cada cierre, cada detalle. Porque lo que llega a tu casa tiene que durar.',
  },
]

export default function NosotrosPage() {
  return (
    <main>
      {/* Hero */}
      <section
        className="relative py-20 px-4 text-center overflow-hidden"
        style={{ background: 'var(--marfil)' }}
      >
        <p className="text-[10px] tracking-[.22em] uppercase font-semibold mb-3" style={{ color: 'var(--taupe)' }}>
          Nuestra historia
        </p>
        <h1
          className="max-w-xl mx-auto mb-4"
          style={{ fontFamily: 'var(--font-head)', fontSize: 'clamp(30px,5vw,44px)', color: 'var(--marron)', fontWeight: 600, lineHeight: 1.15 }}
        >
          Textiles con alma,<br />
          <em>hechos para quedarse</em>
        </h1>
        <p className="max-w-md mx-auto text-[14px]" style={{ color: 'var(--tx-soft)', lineHeight: 1.7 }}>
          Renuevo nació de un amor por los espacios simples y bien habitados. Empezamos diseñando almohadones
          para nuestra propia casa — y nunca paramos.
        </p>
      </section>

      {/* Historia */}
      <section className="max-w-2xl mx-auto px-4 py-14">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div
            className="aspect-[4/5] rounded-[18px]"
            style={{ background: 'var(--beige)' }}
          />
          <div>
            <p className="text-[10px] tracking-[.2em] uppercase font-semibold mb-3" style={{ color: 'var(--taupe)' }}>
              Cómo empezamos
            </p>
            <h2 style={{ fontFamily: 'var(--font-head)', fontSize: 26, color: 'var(--marron)', fontWeight: 600, lineHeight: 1.2 }} className="mb-4">
              Desde nuestra casa<br />a la tuya
            </h2>
            <p className="text-[13px] leading-relaxed mb-4" style={{ color: 'var(--tx-soft)' }}>
              Empezamos en 2022 con una máquina de coser y una obsesión: encontrar textiles que se vean bien
              y que aguanten el paso del tiempo sin perder su carácter.
            </p>
            <p className="text-[13px] leading-relaxed" style={{ color: 'var(--tx-soft)' }}>
              Hoy somos un equipo pequeño, pero cada producto pasa por nuestras manos antes de llegar a la tuya.
              Sin intermediarios, sin compromisos.
            </p>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section style={{ background: 'var(--crema)' }} className="py-14 px-4">
        <div className="max-w-2xl mx-auto">
          <p className="text-center text-[10px] tracking-[.2em] uppercase font-semibold mb-2" style={{ color: 'var(--taupe)' }}>
            Lo que nos mueve
          </p>
          <h2
            className="text-center mb-10"
            style={{ fontFamily: 'var(--font-head)', fontSize: 28, color: 'var(--marron)', fontWeight: 600 }}
          >
            Nuestros valores
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {VALUES.map((v) => (
              <div key={v.title} className="rounded-[14px] p-5" style={{ background: '#fff', border: '1px solid var(--line-soft)' }}>
                <div
                  className="w-10 h-10 rounded-[10px] flex items-center justify-center mb-3"
                  style={{ background: 'var(--beige)', color: 'var(--marron)' }}
                >
                  {v.icon}
                </div>
                <h3 style={{ fontFamily: 'var(--font-head)', fontSize: 16, color: 'var(--marron)', fontWeight: 600 }} className="mb-1.5">
                  {v.title}
                </h3>
                <p className="text-[12.5px] leading-relaxed" style={{ color: 'var(--tx-soft)' }}>
                  {v.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 text-center" style={{ background: 'var(--marfil)' }}>
        <h2 style={{ fontFamily: 'var(--font-head)', fontSize: 24, color: 'var(--marron)', fontWeight: 600 }} className="mb-2">
          ¿Querés conocer más?
        </h2>
        <p className="text-[13px] mb-6" style={{ color: 'var(--tx-soft)' }}>
          Escribinos por WhatsApp o visitá nuestra página de contacto.
        </p>
        <a
          href="/contacto"
          className="inline-flex px-8 py-3.5 rounded-[10px] text-[12px] font-semibold tracking-[.1em] uppercase text-white transition-opacity hover:opacity-90"
          style={{ background: 'var(--taupe)' }}
        >
          Contactarnos
        </a>
      </section>
    </main>
  )
}
