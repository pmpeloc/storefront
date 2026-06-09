'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MOCK_INSPIRATION, INSPIRATION_CATEGORIES } from '@/lib/mock-data'

// TODO: inspiracion - reemplazar con GET /public/inspirations?tenantSlug= cuando exista — ver TECHNICAL_DEBT.md

const HEIGHTS = ['h-52', 'h-36', 'h-44', 'h-56', 'h-40', 'h-48']

export default function InspiraccionPage() {
  const [active, setActive] = useState<string | null>(null)

  const filtered = active
    ? MOCK_INSPIRATION.filter((i) => i.category === active)
    : MOCK_INSPIRATION

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <p className="text-[10px] tracking-[.22em] uppercase font-semibold mb-2" style={{ color: 'var(--taupe)' }}>
          Ambientes que inspiran
        </p>
        <h1
          style={{ fontFamily: 'var(--font-head)', fontSize: 'clamp(26px,4vw,38px)', color: 'var(--marron)', fontWeight: 600 }}
        >
          Inspiración
        </h1>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
        <button
          onClick={() => setActive(null)}
          className="flex-shrink-0 px-4 py-2 rounded-full text-[11.5px] font-medium transition-all"
          style={{
            background: !active ? 'var(--marron)' : 'var(--beige)',
            color: !active ? '#fff' : 'var(--marron)',
          }}
        >
          Todos
        </button>
        {INSPIRATION_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(active === cat ? null : cat)}
            className="flex-shrink-0 px-4 py-2 rounded-full text-[11.5px] font-medium transition-all"
            style={{
              background: active === cat ? 'var(--marron)' : 'var(--beige)',
              color: active === cat ? '#fff' : 'var(--marron)',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Masonry: 2 cols mobile, 3 cols desktop */}
      <div className="columns-2 md:columns-3 gap-3">
        {filtered.map((item, idx) => (
          <Link
            key={item.id}
            href={`/inspiracion/${item.id}`}
            className={`block rounded-[14px] overflow-hidden mb-3 transition-all hover:opacity-90 ${HEIGHTS[idx % HEIGHTS.length]}`}
            style={{ background: 'var(--beige)', breakInside: 'avoid' }}
          >
            <div className="w-full h-full relative flex items-end">
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(to top, rgba(63,53,44,.5) 0%, transparent 50%)' }}
              />
              <div className="relative p-3">
                <span
                  className="text-[9px] tracking-[.14em] uppercase font-medium text-white/80 block mb-0.5"
                >
                  {item.category}
                </span>
                <p
                  className="text-white font-semibold text-[12px] leading-snug"
                  style={{ fontFamily: 'var(--font-head)' }}
                >
                  {item.title}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}
