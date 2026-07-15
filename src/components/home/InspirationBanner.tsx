import Image from 'next/image'
import Link from 'next/link'

export function InspirationBanner() {
  return (
    <section style={{ background: 'var(--beige)' }}>
      {/* ── Desktop: split editorial — texto izq + fotos der ── */}
      <div
        className="hidden md:grid"
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '72px 40px',
          gridTemplateColumns: '1fr 1fr',
          gap: 60,
          alignItems: 'center',
        }}
      >
        {/* Texto */}
        <div>
          <p
            style={{
              fontSize: 11,
              letterSpacing: '.24em',
              textTransform: 'uppercase',
              color: 'var(--accent, var(--taupe))',
              fontWeight: 600,
              margin: 0,
            }}
          >
            Inspiración
          </p>
          <h2
            style={{
              fontFamily: 'var(--font-head)',
              fontWeight: 600,
              color: 'var(--marron)',
              fontSize: 40,
              lineHeight: 1.05,
              letterSpacing: '.005em',
              marginTop: 12,
              marginBottom: 0,
            }}
          >
            Transformá tu hogar en un espacio que te inspire
          </h2>
          <p
            style={{
              fontSize: 15,
              lineHeight: 1.7,
              marginTop: 18,
              maxWidth: 440,
              color: 'var(--tx-soft)',
            }}
          >
            Descubrí ideas para cada ambiente —living, dormitorio, oficina y exterior—
            y recreá los looks con nuestros productos.
          </p>
          <Link
            href="/inspiracion"
            className="inline-flex items-center justify-center transition-opacity hover:opacity-90"
            style={{
              marginTop: 28,
              fontFamily: 'var(--font-ui)',
              fontWeight: 600,
              fontSize: 13.5,
              letterSpacing: '.1em',
              textTransform: 'uppercase',
              borderRadius: 11,
              padding: '17px 36px',
              background: 'var(--marron)',
              color: 'var(--marfil)',
              textDecoration: 'none',
            }}
          >
            Explorar inspiración
          </Link>
        </div>

        {/* Fotos en grid 2×2 asimétrico */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {/* Foto grande izquierda */}
          <div className="relative overflow-hidden" style={{ borderRadius: 16, height: 260 }}>
            <Image
              src="/productos/verde-amb.jpg"
              alt="Living verde ambiente"
              fill
              className="object-cover"
              sizes="300px"
            />
          </div>
          {/* Dos fotos pequeñas derecha */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="relative overflow-hidden" style={{ borderRadius: 16, height: 120 }}>
              <Image
                src="/productos/terracota-close.jpg"
                alt="Detalle terracota"
                fill
                className="object-cover"
                sizes="200px"
              />
            </div>
            <div className="relative overflow-hidden" style={{ borderRadius: 16, height: 120 }}>
              <Image
                src="/productos/azul-close.jpg"
                alt="Detalle azul noche"
                fill
                className="object-cover"
                sizes="200px"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile: foto con texto overlay + CTA ── */}
      <div className="md:hidden" style={{ padding: '28px 18px' }}>
        <div className="relative overflow-hidden" style={{ borderRadius: 18, height: 190 }}>
          <Image
            src="/productos/turquesa-amb.jpg"
            alt="Inspiración living"
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div
            className="absolute inset-0 flex flex-col justify-end"
            style={{
              padding: 18,
              background: 'linear-gradient(to top, rgba(var(--overlay-dark),.62), transparent 60%)',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-head)',
                color: '#fff',
                fontSize: 22,
                lineHeight: 1.1,
              }}
            >
              Transformá tu hogar
            </div>
            <div style={{ color: 'rgba(255,255,255,.85)', fontSize: 11, marginTop: 4 }}>
              Ideas para cada ambiente
            </div>
            <Link
              href="/inspiracion"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf: 'flex-start',
                marginTop: 12,
                padding: '10px 14px',
                fontFamily: 'var(--font-ui)',
                fontWeight: 600,
                fontSize: 11,
                letterSpacing: '.12em',
                textTransform: 'uppercase',
                background: 'var(--accent, var(--taupe))',
                color: '#fff',
                borderRadius: 10,
                textDecoration: 'none',
              }}
            >
              Explorar inspiración
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
