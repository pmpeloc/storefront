// Landing institucional cuando el dominio de la request no matchea ningún
// tenant_domain conocido (DNS mal configurado, dominio dado de baja, etc).
// El middleware reescribe acá en vez de dejar caer un 404 genérico.
export default function UnknownTenantPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 text-center">
      <div>
        <h1 className="text-2xl font-semibold mb-2">Red Impulso</h1>
        <p className="text-stone-500">
          Este dominio todavía no está configurado. Si creés que esto es un error, contactanos.
        </p>
      </div>
    </main>
  )
}
