import Link from 'next/link'
import Image from 'next/image'
import { clientConfig } from '@/config/client'

export function Header() {
  return (
    <header className="border-b border-stone-200 bg-white sticky top-0 z-50 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          {clientConfig.logoUrl ? (
            <Image
              src={clientConfig.logoUrl}
              alt={clientConfig.clientName}
              width={40}
              height={40}
              className="object-contain"
            />
          ) : null}
          <span className="font-bold text-stone-900 text-lg leading-tight">
            {clientConfig.clientName}
          </span>
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/#catalog" className="text-stone-500 hover:text-stone-900 transition-colors">
            Catálogo
          </Link>
        </nav>
      </div>
    </header>
  )
}
