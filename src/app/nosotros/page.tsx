import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Nosotros — RENUEVO',
  description: 'Conocé la historia y los valores detrás de RENUEVO. Juegos de living de calidad para inspirar tus espacios.',
}

const VALUES = [
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path d="M12 2a10 10 0 010 20 10 10 0 010-20z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 6c-1.5 2-2 4.5-2 6s.5 4 2 6M12 6c1.5 2 2 4.5 2 6s-.5 4-2 6M2 12h20" strokeLinecap="round" />
      </svg>
    ),
    title: 'Diseño',
    body: 'Cada pieza pensada al detalle',
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: 'Cercanía',
    body: 'Acompañamos cada hogar',
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: 'Calidad',
    body: 'Materiales nobles y durables',
  },
]

export default function AboutPage() {
  return (
    <main>
      {/* Hero foto full-bleed */}
      <div className="relative" style={{ height: 'clamp(280px,40vw,460px)' }}>
        <Image
          src="/productos/natural-amb2.jpg"
          alt="Ambiente RENUEVO"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0" style={{ background: 'rgba(63,53,44,.35)' }} />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <p
            className="text-[13px] md:text-[15px] font-light tracking-[.3em] uppercase"
            style={{ color: '#fff', fontFamily: 'var(--font-ui)' }}
          >
            RENUEVO
          </p>
          <h1
            className="max-w-xl mt-4"
            style={{
              fontFamily: 'var(--font-head)',
              color: '#fff',
              fontSize: 'clamp(28px,4vw,48px)',
              fontWeight: 600,
              lineHeight: 1.1,
            }}
          >
            Diseños para espacios que <em>inspiran</em>
          </h1>
        </div>
      </div>

      {/* Historia — texto centrado */}
      <section style={{ maxWidth: 820, margin: '0 auto', padding: 'clamp(40px,5vw,72px) 24px' }}>
        <p
          className="text-center text-[11px] tracking-[.24em] uppercase font-semibold"
          style={{ color: 'var(--taupe)' }}
        >
          Nuestra historia
        </p>
        <p
          className="text-center mt-5"
          style={{
            fontFamily: 'var(--font-head)',
            fontSize: 'clamp(18px,2vw,26px)',
            lineHeight: 1.5,
            color: 'var(--marron)',
            fontWeight: 500,
          }}
        >
          En RENUEVO creemos que los detalles tienen el poder de transformar tu hogar.
        </p>
        <p
          className="text-center mt-4 text-[15px] leading-relaxed"
          style={{ color: 'var(--tx-soft)' }}
        >
          Diseñamos y creamos juegos de living de calidad para inspirar tus espacios, combinando madera
          maciza, tapizados nobles, tonos cálidos y una mirada atemporal. Cada pieza es una invitación a
          habitar tu casa con más confort y belleza.
        </p>
      </section>

      {/* Misión y Visión */}
      <section style={{ background: 'var(--marfil)', padding: 'clamp(32px,4vw,56px) 24px' }}>
        <div
          className="md:grid md:grid-cols-2"
          style={{ maxWidth: 1000, margin: '0 auto', gap: 50 }}
        >
          <div className="mb-8 md:mb-0">
            <p className="text-[11px] tracking-[.22em] uppercase font-semibold" style={{ color: 'var(--taupe)' }}>
              Misión
            </p>
            <p className="mt-3 text-[15px] leading-relaxed" style={{ color: 'var(--tx-soft)' }}>
              Acercar diseño y confort a cada hogar, con muebles que combinan estética, calidez y calidad.
            </p>
          </div>
          <div>
            <p className="text-[11px] tracking-[.22em] uppercase font-semibold" style={{ color: 'var(--taupe)' }}>
              Visión
            </p>
            <p className="mt-3 text-[15px] leading-relaxed" style={{ color: 'var(--tx-soft)' }}>
              Ser la marca de referencia en living y decoración premium en Argentina y la región.
            </p>
          </div>
        </div>
      </section>

      {/* Valores — círculos + ícono */}
      <section style={{ padding: 'clamp(40px,5vw,72px) 24px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div className="text-center mb-11">
            <p className="text-[11px] tracking-[.24em] uppercase font-semibold" style={{ color: 'var(--taupe)' }}>
              Lo que nos define
            </p>
            <h2
              style={{
                fontFamily: 'var(--font-head)',
                fontSize: 'clamp(24px,3vw,40px)',
                color: 'var(--marron)',
                fontWeight: 600,
                marginTop: 10,
              }}
            >
              Nuestros valores
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-8 md:gap-12">
            {VALUES.map((v) => (
              <div key={v.title} className="text-center">
                <div
                  className="flex items-center justify-center mx-auto mb-4"
                  style={{
                    width: 68,
                    height: 68,
                    borderRadius: '50%',
                    border: '1px solid var(--arena)',
                    color: 'var(--taupe)',
                  }}
                >
                  {v.icon}
                </div>
                <h3
                  style={{
                    fontFamily: 'var(--font-head)',
                    fontSize: 22,
                    color: 'var(--marron)',
                    fontWeight: 600,
                  }}
                >
                  {v.title}
                </h3>
                <p className="text-[13px] mt-1.5" style={{ color: 'var(--tx-soft)' }}>
                  {v.body}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/productos"
              className="inline-flex items-center justify-center transition-opacity hover:opacity-90"
              style={{
                fontFamily: 'var(--font-ui)',
                fontWeight: 600,
                fontSize: 13,
                letterSpacing: '.1em',
                textTransform: 'uppercase',
                borderRadius: 11,
                padding: '16px 40px',
                background: 'var(--marron)',
                color: 'var(--marfil)',
                textDecoration: 'none',
              }}
            >
              Ver la colección
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
