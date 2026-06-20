'use client'

import { createContext, useContext } from 'react'
import type { TenantConfig } from '@/lib/tenant-config'

const TenantConfigContext = createContext<TenantConfig | null>(null)

export function TenantConfigProvider({
  value,
  children,
}: {
  value: TenantConfig
  children: React.ReactNode
}) {
  return <TenantConfigContext.Provider value={value}>{children}</TenantConfigContext.Provider>
}

// Lanza si se usa fuera de TenantConfigProvider — todo el árbol bajo sites/[tenant] está envuelto
export function useTenantConfig(): TenantConfig {
  const config = useContext(TenantConfigContext)
  if (!config) throw new Error('useTenantConfig debe usarse dentro de TenantConfigProvider')
  return config
}
