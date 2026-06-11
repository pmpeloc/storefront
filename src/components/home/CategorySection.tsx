import Image from 'next/image'
import Link from 'next/link'

const CATS = [
  { id: 'juegos',      name: 'Juegos de Living', img: '/productos/turquesa-amb.jpg', count: 6,  href: '/productos' },
  { id: 'sillones',    name: 'Sillones',          img: '/productos/azul-close.jpg',   count: 6,  href: '/productos' },
  { id: 'sofas',       name: 'Sofás 3 cuerpos',   img: '/productos/rojo-amb.jpg',     count: 6,  href: '/productos' },
  { id: 'mesas',       name: 'Mesas ratonas',     img: '/productos/natural-amb2.jpg', count: 4,  href: '/productos' },
  { id: 'almohadones', name: 'Almohadones',       img: '/productos/verde-close.jpg',  count: 18, href: '/productos' },
]

export function CategorySection() {
  return (
    <section>
      {/* ── Desktop: 3 columnas con foto y texto overlay ── */}
      <div className="hidden md:block" style={{ padding: '64px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
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
              Explorá
            </p>
            <h2
              style={{
                fontFamily: 'var(--font-head)',
                fontWeight: 600,
                color: 'var(--marron)',
                fontSize: 40,
                lineHeight: 1.05,
                letterSpacing: '.005em',
                marginTop: 10,
                marginBottom: 0,
              }}
            >
              Comprá por categoría
            </h2>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '30px 26px',
            }}
          >
            {CATS.slice(0, 3).map((c) => (
              <Link
                key={c.id}
                href={c.href}
                style={{ display: 'block', textDecoration: 'none', cursor: 'pointer' }}
              >
                <div
                  className="relative overflow-hidden group"
                  style={{ borderRadius: 16, height: 300 }}
                >
                  <Image
                    src={c.img}
                    alt={c.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 1200px) 33vw, 380px"
                  />
                  <div
                    className="absolute inset-0 flex flex-col justify-end"
                    style={{
                      padding: 26,
                      background: 'linear-gradient(to top, rgba(63,53,44,.55), transparent 55%)',
                    }}
                  >
                    <div
                      style={{
                        fontFamily: 'var(--font-head)',
                        color: '#fff',
                        fontSize: 28,
                        fontWeight: 600,
                      }}
                    >
                      {c.name}
                    </div>
                    <div style={{ color: 'rgba(255,255,255,.85)', fontSize: 13, marginTop: 2 }}>
                      {c.count} productos
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── Mobile: scroll horizontal de círculos de categoría ── */}
      <div className="md:hidden" style={{ marginTop: 26 }}>
        <div style={{ padding: '0 18px', marginBottom: 12 }}>
          <p
            style={{
              fontSize: 10,
              letterSpacing: '.22em',
              textTransform: 'uppercase',
              color: 'var(--tx-faint)',
              fontWeight: 500,
              margin: 0,
            }}
          >
            Comprá por categoría
          </p>
        </div>
        <div
          className="scrollbar-none"
          style={{
            display: 'flex',
            gap: 12,
            overflowX: 'auto',
            padding: '0 18px 4px',
          }}
        >
          {CATS.map((c) => (
            <Link
              key={c.id}
              href={c.href}
              style={{ flexShrink: 0, textAlign: 'center', textDecoration: 'none' }}
            >
              <div
                className="relative overflow-hidden"
                style={{ width: 84, height: 84, borderRadius: 16 }}
              >
                <Image
                  src={c.img}
                  alt={c.name}
                  fill
                  className="object-cover"
                  sizes="84px"
                />
              </div>
              <div
                style={{
                  fontSize: 10.5,
                  fontWeight: 500,
                  color: 'var(--tx)',
                  marginTop: 7,
                  maxWidth: 84,
                  lineHeight: 1.3,
                }}
              >
                {c.name}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
