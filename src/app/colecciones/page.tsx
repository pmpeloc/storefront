import Image from 'next/image'
import Link from 'next/link'
import { MOCK_COLLECTIONS } from '@/lib/mock-data'

export default function ColeccionesPage() {
  return (
    <main>
      {/* Header centrado */}
      <div className="text-center" style={{ padding: '64px 40px 0' }}>
        <p
          className="text-[11px] tracking-[.24em] uppercase font-semibold"
          style={{ color: 'var(--taupe)' }}
        >
          Nuestras colecciones
        </p>
        <h1
          style={{
            fontFamily: 'var(--font-head)',
            fontSize: 'clamp(26px,3vw,46px)',
            color: 'var(--marron)',
            fontWeight: 600,
            lineHeight: 1.1,
            marginTop: 12,
          }}
        >
          Tres universos para vestir tu hogar
        </h1>
        <p
          className="text-[15px] mt-3 max-w-xl mx-auto"
          style={{ color: 'var(--tx-soft)' }}
        >
          Cada colección reúne texturas, colores y piezas pensadas para crear ambientes con carácter propio.
        </p>
      </div>

      {/* Desktop: alternating split layout */}
      <div
        className="hidden md:flex flex-col"
        style={{ maxWidth: 1200, margin: '0 auto', padding: '56px 40px 80px', gap: 48 }}
      >
        {MOCK_COLLECTIONS.map((c, i) => (
          <div
            key={c.id}
            style={{
              display: 'grid',
              gridTemplateColumns: i % 2 ? '1fr 1.2fr' : '1.2fr 1fr',
              gap: 50,
              alignItems: 'center',
            }}
          >
            {/* Imagen */}
            <div
              className="relative overflow-hidden"
              style={{ height: 380, borderRadius: 18, order: i % 2 ? 2 : 1 }}
            >
              <Image
                src={c.imagenHero}
                alt={c.name}
                fill
                className="object-cover transition-transform duration-500 hover:scale-105"
                sizes="600px"
              />
            </div>

            {/* Texto */}
            <div style={{ order: i % 2 ? 1 : 2 }}>
              <p
                className="text-[11px] tracking-[.24em] uppercase font-semibold"
                style={{ color: 'var(--taupe)' }}
              >
                Colección {String(i + 1).padStart(2, '0')}
              </p>
              <h2
                style={{
                  fontFamily: 'var(--font-head)',
                  fontSize: 40,
                  color: 'var(--marron)',
                  fontWeight: 600,
                  lineHeight: 1.1,
                  marginTop: 12,
                }}
              >
                {c.name}
              </h2>
              <p
                className="text-[15px] leading-relaxed mt-4"
                style={{ color: 'var(--tx-soft)', maxWidth: 420 }}
              >
                {c.description}
              </p>
              <Link
                href={`/colecciones/${c.id}`}
                className="inline-flex items-center justify-center mt-7 transition-opacity hover:opacity-90"
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontWeight: 600,
                  fontSize: 13,
                  letterSpacing: '.1em',
                  textTransform: 'uppercase',
                  borderRadius: 11,
                  padding: '16px 36px',
                  background: 'var(--marron)',
                  color: 'var(--marfil)',
                  textDecoration: 'none',
                }}
              >
                Ver colección
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile: stacked photo cards with overlay */}
      <div className="md:hidden px-[18px] py-8 space-y-4">
        {MOCK_COLLECTIONS.map((c) => (
          <Link
            key={c.id}
            href={`/colecciones/${c.id}`}
            className="block relative overflow-hidden"
            style={{ borderRadius: 18, height: 170 }}
          >
            <Image
              src={c.imagenHero}
              alt={c.name}
              fill
              className="object-cover"
              sizes="100vw"
            />
            <div
              className="absolute inset-0 flex flex-col justify-end"
              style={{
                padding: 18,
                background: 'linear-gradient(to top, rgba(63,53,44,.6), transparent 55%)',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-head)',
                  color: '#fff',
                  fontSize: 26,
                  fontWeight: 600,
                  lineHeight: 1,
                }}
              >
                {c.name}
              </div>
              <div style={{ color: 'rgba(255,255,255,.85)', fontSize: 11, marginTop: 6 }}>
                {c.description}
              </div>
              <span
                style={{
                  color: '#fff',
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: '.1em',
                  textTransform: 'uppercase',
                  marginTop: 10,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                Ver colección →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}
