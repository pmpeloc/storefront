import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Nosotros — RENUEVO',
  description: 'Conocé la historia y los valores detrás de RENUEVO. Juegos de living de calidad para inspirar tus espacios.',
}

const VALUES = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: 'Diseños exclusivos',
    body: 'Piezas pensadas al detalle, con materiales nobles y líneas atemporales que transforman cualquier espacio.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4l3 3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: 'Calidad que se siente',
    body: 'Madera maciza de paraíso y tapizados de chenille. Confort real, durabilidad probada, carácter garantizado.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}>
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: 'Transformá tu hogar',
    body: 'Cada juego de living RENUEVO está pensado para crear ambientes que inspiran. Tu espacio merece lo mejor.',
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
          Living con alma,<br />
          <em>diseñado para quedarse</em>
        </h1>
        <p className="max-w-md mx-auto text-[14px]" style={{ color: 'var(--tx-soft)', lineHeight: 1.7 }}>
          En RENUEVO creemos que los detalles tienen el poder de transformar tu hogar. Diseñamos y
          creamos juegos de living de calidad para inspirar tus espacios, con materiales nobles y una
          mirada atemporal.
        </p>
      </section>

      {/* Historia */}
      <section className="max-w-2xl mx-auto px-4 py-14">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div
            className="aspect-[4/5] rounded-[18px] overflow-hidden relative"
            style={{ background: 'var(--beige)' }}
          >
            {/* Placeholder para foto del taller/equipo */}
          </div>
          <div>
            <p className="text-[10px] tracking-[.2em] uppercase font-semibold mb-3" style={{ color: 'var(--taupe)' }}>
              Cómo empezamos
            </p>
            <h2 style={{ fontFamily: 'var(--font-head)', fontSize: 26, color: 'var(--marron)', fontWeight: 600, lineHeight: 1.2 }} className="mb-4">
              Desde nuestro taller<br />a tu hogar
            </h2>
            <p className="text-[13px] leading-relaxed mb-4" style={{ color: 'var(--tx-soft)' }}>
              Acercamos diseño y confort a cada hogar, con muebles que combinan estética, calidez y
              calidad. Cada pieza pasa por nuestras manos antes de llegar a la tuya.
            </p>
            <p className="text-[13px] leading-relaxed" style={{ color: 'var(--tx-soft)' }}>
              Sin intermediarios. Sin compromisos. Solo living premium pensado al detalle.
            </p>
          </div>
        </div>
      </section>

      {/* Misión y Visión */}
      <section style={{ background: 'var(--beige)' }} className="py-12 px-4">
        <div className="max-w-2xl mx-auto grid md:grid-cols-2 gap-8">
          <div className="rounded-[16px] p-6" style={{ background: '#fff', border: '1px solid var(--line-soft)' }}>
            <p className="text-[10px] tracking-[.18em] uppercase font-semibold mb-2" style={{ color: 'var(--taupe)' }}>
              Misión
            </p>
            <p className="text-[13px] leading-relaxed" style={{ color: 'var(--tx-soft)' }}>
              Acercar diseño y confort a cada hogar, con muebles que combinan estética, calidez y calidad.
            </p>
          </div>
          <div className="rounded-[16px] p-6" style={{ background: '#fff', border: '1px solid var(--line-soft)' }}>
            <p className="text-[10px] tracking-[.18em] uppercase font-semibold mb-2" style={{ color: 'var(--taupe)' }}>
              Visión
            </p>
            <p className="text-[13px] leading-relaxed" style={{ color: 'var(--tx-soft)' }}>
              Ser la marca de referencia en living y decoración premium en Argentina y la región.
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
