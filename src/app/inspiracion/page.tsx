'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MOCK_INSPIRATION, INSPIRATION_CATEGORIES } from '@/lib/mock-data'

// TODO: inspiracion - reemplazar con GET /public/inspirations?tenantSlug= cuando exista — ver TECHNICAL_DEBT.md

// Spans para el grid desktop: [cols, rows] — alterna piezas anchas y angostas
const SPANS = [[2, 1], [1, 1], [1, 1], [2, 1], [1, 1], [1, 1]]
// Alturas para masonry mobile
const MOBILE_HEIGHTS = [150, 200, 170, 220, 160, 190]

export default function InspirationPage() {
  const [active, setActive] = useState<string>('Todos')

  const filtered =
    active === 'Todos'
      ? MOCK_INSPIRATION
      : MOCK_INSPIRATION.filter((i) => i.category === active)

  return (
    <main>
      {/* Header centrado */}
      <div className="text-center" style={{ padding: 'clamp(40px,5vw,64px) 40px 0' }}>
        <p className="text-[11px] tracking-[.24em] uppercase font-semibold" style={{ color: 'var(--taupe)' }}>
          Inspiración
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
          Ideas para cada ambiente
        </h1>
        <p className="text-[15px] mt-3 max-w-lg mx-auto" style={{ color: 'var(--tx-soft)' }}>
          Explorá ambientes reales y comprá los productos directamente desde cada foto.
        </p>

        {/* Chips filtro — centrado en desktop, scroll en mobile */}
        <div
          className="flex gap-2.5 overflow-x-auto scrollbar-none justify-start md:justify-center mt-6 pb-1"
          style={{ paddingLeft: 'clamp(18px,5vw,0px)' }}
        >
          <button
            onClick={() => setActive('Todos')}
            className="flex-shrink-0 px-4 py-1.5 rounded-full text-[12px] font-medium transition-all"
            style={{
              background: active === 'Todos' ? 'var(--marron)' : 'var(--beige)',
              color: active === 'Todos' ? '#fff' : 'var(--marron)',
            }}
          >
            Todos
          </button>
          {INSPIRATION_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(active === cat ? 'Todos' : cat)}
              className="flex-shrink-0 px-4 py-1.5 rounded-full text-[12px] font-medium transition-all"
              style={{
                background: active === cat ? 'var(--marron)' : 'var(--beige)',
                color: active === cat ? '#fff' : 'var(--marron)',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop: grid 3 cols con spans variables */}
      <div
        className="hidden md:block"
        style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 40px 80px' }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gridAutoRows: 240,
            gap: 20,
          }}
        >
          {filtered.map((ins, i) => {
            const sp = SPANS[i % SPANS.length]
            return (
              <Link
                key={ins.id}
                href={`/inspiracion/${ins.id}`}
                className="relative overflow-hidden block transition-opacity hover:opacity-90"
                style={{
                  gridColumn: `span ${sp[0]}`,
                  gridRow: `span ${sp[1]}`,
                  borderRadius: 16,
                  cursor: 'pointer',
                }}
              >
                <Image
                  src={ins.image}
                  alt={ins.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1200px) 66vw, 800px"
                />
                <div
                  className="absolute inset-0 flex flex-col justify-end"
                  style={{
                    padding: 22,
                    background: 'linear-gradient(to top, rgba(63,53,44,.55), transparent 55%)',
                  }}
                >
                  <span
                    className="px-2.5 py-1 rounded-full text-[10px] font-semibold self-start mb-2"
                    style={{ background: 'rgba(255,255,255,.9)', color: 'var(--marron)' }}
                  >
                    {ins.category}
                  </span>
                  <div
                    style={{
                      fontFamily: 'var(--font-head)',
                      color: '#fff',
                      fontSize: 22,
                      fontWeight: 600,
                    }}
                  >
                    {ins.title}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Mobile: masonry 2 cols con alturas variables */}
      <div className="md:hidden px-[18px] pt-5 pb-10">
        <div style={{ columnCount: 2, columnGap: 12 }}>
          {filtered.map((ins, i) => (
            <Link
              key={ins.id}
              href={`/inspiracion/${ins.id}`}
              className="block relative overflow-hidden mb-3 transition-opacity hover:opacity-90"
              style={{
                height: MOBILE_HEIGHTS[i % MOBILE_HEIGHTS.length],
                borderRadius: 14,
                breakInside: 'avoid',
              }}
            >
              <Image
                src={ins.image}
                alt={ins.title}
                fill
                className="object-cover"
                sizes="50vw"
              />
              <div
                className="absolute inset-0 flex flex-col justify-end"
                style={{
                  padding: 12,
                  background: 'linear-gradient(to top, rgba(63,53,44,.55), transparent 55%)',
                }}
              >
                <div style={{ color: '#fff', fontSize: 12, fontWeight: 600 }}>
                  {ins.title}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
