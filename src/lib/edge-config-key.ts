// Edge Config solo acepta keys alfanuméricas + "_" + "-" — un dominio real
// trae "." y a veces ":puerto", así que hay que codificarlo. Usado tanto por
// el middleware (lookup) como por scripts/sync-edge-config.ts (write) — debe
// ser la MISMA función en los dos lados o el lookup nunca matchea.
export function domainToEdgeConfigKey(domain: string): string {
  return `domain-${domain.replace(/[^a-zA-Z0-9_-]/g, '-')}`
}
