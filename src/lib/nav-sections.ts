import { notFound } from 'next/navigation'
import { fetchTenantConfigBySlug } from './tenant-config'

export type NavSection = 'catalogo' | 'colecciones' | 'inspiracion' | 'nosotros' | 'contacto'

// Gate de contenido: llama notFound() si la sección no está habilitada para el tenant, para que
// un link directo por URL (fuera del nav filtrado) tampoco exponga el contenido de otro tenant.
export async function assertNavSectionEnabled(tenantSlug: string, section: NavSection): Promise<void> {
  const config = await fetchTenantConfigBySlug(tenantSlug)
  if (!config || !config.nav_sections.includes(section)) notFound()
}
