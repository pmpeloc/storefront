import Link from 'next/link'
import { clientConfig } from '@/config/client'
import { buildGenericWhatsAppUrl } from '@/lib/whatsapp'

export function HeroBanner() {
  const whatsappUrl = buildGenericWhatsAppUrl(clientConfig)

  return (
    <section className="max-w-6xl mx-auto px-4 pt-8 pb-6">
      {/* Desktop: split layout — Mobile: stack */}
      <div className="md:grid md:grid-cols-2 md:gap-12 md:items-center">

        {/* Texto */}
        <div className="text-center md:text-left">
          <p
            className="text-[11px] tracking-[.26em] uppercase mb-4"
            style={{ color: 'var(--tx-faint)', fontWeight: 500 }}
          >
            Diseños para espacios que inspiran
          </p>

          <h1
            style={{
              fontFamily: 'var(--font-head)',
              fontSize: 'clamp(40px, 7vw, 68px)',
              color: 'var(--marron)',
              fontWeight: 600,
              lineHeight: 1.05,
              letterSpacing: '.01em',
            }}
          >
            {clientConfig.clientName}
            <em
              className="block"
              style={{ color: 'var(--taupe)', fontStyle: 'italic' }}
            >
              Almohadones
            </em>
          </h1>

          <p className="mt-4 text-[13px] max-w-sm md:max-w-none mx-auto md:mx-0 leading-relaxed" style={{ color: 'var(--tx-soft)' }}>
            Textiles premium para el hogar, en tonos cálidos pensados al detalle.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start mt-7">
            <Link
              href="/#catalog"
              className="inline-flex items-center justify-center px-7 py-3.5 rounded-[10px] text-[12.5px] font-semibold tracking-[.1em] uppercase text-white transition-opacity hover:opacity-90"
              style={{ background: 'var(--marron)' }}
            >
              Descubrí nuestra colección
            </Link>
            {clientConfig.whatsappNumber && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-[10px] text-[12.5px] font-semibold tracking-[.08em] uppercase transition-colors"
                style={{
                  border: '1px solid var(--line)',
                  color: 'var(--marron)',
                  background: 'transparent',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp
              </a>
            )}
          </div>
        </div>

        {/* Imagen hero — mobile: debajo del texto, desktop: derecha */}
        <div
          className="mt-8 md:mt-0 rounded-[18px] overflow-hidden relative"
          style={{
            height: 'clamp(220px, 45vw, 500px)',
            background: 'linear-gradient(135deg, rgba(255,255,255,.45) 0%, rgba(255,255,255,0) 55%), linear-gradient(160deg, #EFE7DD, #D5C8B5)',
          }}
        >
          <div
            className="absolute inset-0 flex flex-col items-start justify-end p-8"
            style={{ background: 'linear-gradient(to top, rgba(63,53,44,.25), transparent 60%)' }}
          >
            <p className="text-white text-[11px] font-medium tracking-[.1em] uppercase opacity-80">
              Ambientes que inspiran
            </p>
          </div>
        </div>
      </div>

      {/* Barra de beneficios — mobile: 3 cols compactos, desktop: fila completa */}
      <div
        className="grid grid-cols-3 gap-4 py-5 mt-8 border-t border-b"
        style={{ borderColor: 'var(--line-soft)' }}
      >
        {[
          { icon: '◈', label: 'Diseños exclusivos', sub: 'Piezas pensadas al detalle' },
          { icon: '✦', label: 'Calidad que se siente', sub: 'Materiales nobles y durables' },
          { icon: '⌂', label: 'Transformá tu hogar', sub: 'Ambientes que inspiran' },
        ].map((b) => (
          <div key={b.label} className="text-center flex flex-col items-center gap-2">
            <div
              className="w-10 h-10 rounded-full border flex items-center justify-center text-xs"
              style={{ borderColor: 'var(--line)', color: 'var(--taupe)' }}
            >
              {b.icon}
            </div>
            <div>
              <p className="text-[9.5px] font-semibold tracking-[.06em] uppercase leading-tight" style={{ color: 'var(--gris-taupe)' }}>
                {b.label}
              </p>
              <p className="hidden md:block text-[11px] mt-0.5" style={{ color: 'var(--tx-faint)' }}>
                {b.sub}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
