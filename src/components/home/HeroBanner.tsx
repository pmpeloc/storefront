import Image from 'next/image'
import Link from 'next/link'

const BENEFITS = [
  {
    label: 'Diseños exclusivos',
    sub: 'Piezas pensadas al detalle',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: 'Calidad que se siente',
    sub: 'Madera maciza y tapizados nobles',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}>
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: 'Transformá tu hogar',
    sub: 'Ambientes que inspiran',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}>
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
]

export function HeroBanner() {
  return (
    <>
      {/* ── DESKTOP: hero full-bleed con texto sobre imagen ── */}
      <section className="relative hidden md:block">
        <div className="relative overflow-hidden" style={{ height: 'clamp(520px, 43vw, 620px)' }}>
          <Image
            src="/productos/turquesa-amb.jpg"
            alt="Juego de Living Provenzal — ambiente"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          {/* gradiente L→R para legibilidad del texto */}
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(90deg, rgba(63,53,44,.42), rgba(63,53,44,.05) 60%)' }}
          />
          {/* texto centrado dentro del wrap */}
          <div className="absolute inset-0 flex flex-col justify-center">
            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px', width: '100%' }}>
              <div style={{ maxWidth: 540 }}>
                <p
                  style={{
                    fontSize: 11,
                    letterSpacing: '.24em',
                    textTransform: 'uppercase',
                    color: '#fff',
                    opacity: 0.9,
                    fontWeight: 600,
                    margin: 0,
                  }}
                >
                  Nueva temporada · Otoño 2026
                </p>
                <h1
                  style={{
                    fontFamily: 'var(--font-head)',
                    fontSize: 68,
                    lineHeight: 1.02,
                    fontWeight: 600,
                    color: '#fff',
                    margin: '18px 0 0',
                    letterSpacing: '.005em',
                  }}
                >
                  Diseños para espacios que <em>inspiran</em>
                </h1>
                <p
                  style={{
                    color: 'rgba(255,255,255,.9)',
                    fontSize: 17,
                    lineHeight: 1.6,
                    maxWidth: 440,
                    marginTop: 20,
                  }}
                >
                  Juegos de living de madera maciza y tapizados premium en tonos cálidos.
                  Confort, calidez y diseño para tu hogar.
                </p>
                <div style={{ display: 'flex', gap: 14, marginTop: 34 }}>
                  <Link
                    href="/productos"
                    className="inline-flex items-center justify-center transition-opacity hover:opacity-90"
                    style={{
                      fontFamily: 'var(--font-ui)',
                      fontWeight: 600,
                      fontSize: 13.5,
                      letterSpacing: '.1em',
                      textTransform: 'uppercase',
                      borderRadius: 11,
                      padding: '17px 36px',
                      background: 'var(--accent, var(--taupe))',
                      color: '#fff',
                      textDecoration: 'none',
                    }}
                  >
                    Descubrí nuestra colección
                  </Link>
                  <Link
                    href="/colecciones"
                    className="inline-flex items-center justify-center transition-colors hover:bg-white/10"
                    style={{
                      fontFamily: 'var(--font-ui)',
                      fontWeight: 600,
                      fontSize: 13.5,
                      letterSpacing: '.1em',
                      textTransform: 'uppercase',
                      borderRadius: 11,
                      padding: '17px 36px',
                      background: 'transparent',
                      color: '#fff',
                      border: '1.5px solid rgba(255,255,255,.5)',
                      textDecoration: 'none',
                    }}
                  >
                    Ver colecciones
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MOBILE: editorial hero — variante A ── */}
      <div className="md:hidden" style={{ padding: '26px 18px 8px', textAlign: 'center' }}>
        {/* Logo lockup vertical: monograma arriba + wordmark abajo */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <Image
            src="/logos/wm-mono.png"
            alt=""
            width={52}
            height={52}
            className="object-contain"
            aria-hidden
          />
          <Image
            src="/logos/wm-word.png"
            alt="RENUEVO"
            width={0}
            height={0}
            unoptimized
            style={{ height: '22px', width: 'auto' }}
            className="object-contain"
          />
        </div>
        {/* Slogan con "inspiran." en bold italic */}
        <p
          style={{
            fontFamily: 'var(--font-head)',
            fontStyle: 'italic',
            color: 'var(--tx-soft)',
            fontSize: 15,
            letterSpacing: '.02em',
            marginTop: 10,
          }}
        >
          Diseños para espacios que{' '}
          <strong>
            <em>inspiran.</em>
          </strong>
        </p>
        <Link
          href="/productos"
          className="inline-flex items-center justify-center transition-opacity hover:opacity-90"
          style={{
            margin: '20px auto 0',
            padding: '13px 26px',
            fontFamily: 'var(--font-ui)',
            fontWeight: 600,
            fontSize: 12.5,
            letterSpacing: '.12em',
            textTransform: 'uppercase',
            background: 'var(--marron)',
            color: 'var(--marfil)',
            borderRadius: 10,
            textDecoration: 'none',
          }}
        >
          Descubrí nuestra colección
        </Link>
        {/* Foto ambiente debajo */}
        <div
          className="relative overflow-hidden"
          style={{ marginTop: 20, borderRadius: 16, height: 210 }}
        >
          <Image
            src="/productos/verde-amb.jpg"
            alt="Ambiente living"
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </div>
      </div>

      {/* ── Benefits ── */}
      <section style={{ background: 'var(--marfil)', borderBottom: '1px solid var(--line-soft)' }}>
        {/* Desktop: icono + texto a la derecha, 3 columnas */}
        <div
          className="hidden md:grid"
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            padding: '0 40px',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 40,
          }}
        >
          {BENEFITS.map((b) => (
            <div
              key={b.label}
              style={{
                display: 'flex',
                gap: 16,
                alignItems: 'center',
                justifyContent: 'center',
                padding: '38px 0',
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: '50%',
                  border: '1px solid var(--arena)',
                  display: 'grid',
                  placeItems: 'center',
                  color: 'var(--accent, var(--taupe))',
                  flexShrink: 0,
                }}
              >
                {b.icon}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--marron)' }}>
                  {b.label}
                </div>
                <div style={{ fontSize: 13, color: 'var(--tx-soft)' }}>{b.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile: ícono arriba + label centrado, fila */}
        <div
          className="flex md:hidden"
          style={{ justifyContent: 'space-around', padding: '20px 4px' }}
        >
          {BENEFITS.map((b) => (
            <div key={b.label} style={{ textAlign: 'center', flex: 1, padding: '0 6px' }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  border: '1px solid var(--line)',
                  display: 'grid',
                  placeItems: 'center',
                  margin: '0 auto 8px',
                  color: 'var(--accent, var(--taupe))',
                }}
              >
                {b.icon}
              </div>
              <div
                style={{
                  fontSize: 9.5,
                  fontWeight: 600,
                  letterSpacing: '.06em',
                  textTransform: 'uppercase',
                  color: 'var(--gris-taupe)',
                  lineHeight: 1.4,
                }}
              >
                {b.label}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
