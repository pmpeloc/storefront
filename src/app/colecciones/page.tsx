import Link from 'next/link'
import { MOCK_COLLECTIONS } from '@/lib/mock-data'

// TODO: collections - reemplazar con GET /public/collections?tenantSlug= cuando exista en la API — ver TECHNICAL_DEBT.md

const TONE_COLORS: Record<string, string> = {
  natural: 'var(--arena)',
  terracota: '#C4825A',
  gris: 'var(--gris-taupe)',
}

export default function ColeccionesPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <p className="text-[10px] tracking-[.22em] uppercase font-semibold mb-2" style={{ color: 'var(--taupe)' }}>
          Universos de color
        </p>
        <h1
          style={{ fontFamily: 'var(--font-head)', fontSize: 'clamp(26px,4vw,38px)', color: 'var(--marron)', fontWeight: 600, lineHeight: 1.15 }}
        >
          Colecciones
        </h1>
        <p className="text-[13px] mt-3" style={{ color: 'var(--tx-soft)' }}>
          Paletas pensadas para combinarse entre sí.
        </p>
      </div>

      <div className="space-y-4">
        {MOCK_COLLECTIONS.map((c) => (
          <Link
            key={c.id}
            href={`/colecciones/${c.id}`}
            className="flex gap-4 rounded-[18px] overflow-hidden transition-all hover:shadow-card"
            style={{ background: '#fff', border: '1px solid var(--line-soft)' }}
          >
            <div
              className="w-[110px] flex-shrink-0"
              style={{ background: TONE_COLORS[c.tone] ?? 'var(--beige)' }}
            />
            <div className="py-5 pr-4 flex-1">
              <h2 style={{ fontFamily: 'var(--font-head)', fontSize: 18, color: 'var(--marron)', fontWeight: 600 }} className="mb-1.5">
                {c.name}
              </h2>
              <p className="text-[12.5px] leading-relaxed" style={{ color: 'var(--tx-soft)' }}>
                {c.description}
              </p>
              <span
                className="inline-block mt-3 text-[10px] font-semibold tracking-[.12em] uppercase"
                style={{ color: 'var(--taupe)' }}
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
