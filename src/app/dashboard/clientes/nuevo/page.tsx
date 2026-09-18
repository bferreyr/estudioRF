import { ClientForm } from '../ClientForm'
import Link from 'next/link'

export default function NuevoClientePage() {
  return (
    <div className="animate-fade-in" style={{ padding: '1rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/dashboard/clientes" style={{ color: 'var(--accent)', textDecoration: 'none', fontSize: '0.9rem', marginBottom: '1rem', display: 'inline-block' }}>
          ← Volver a Clientes
        </Link>
        <h1 style={{ marginBottom: '0.5rem' }}>Registrar Nuevo Cliente</h1>
        <p style={{ color: 'var(--text-muted)' }}>Completa la ficha con los datos del nuevo cliente.</p>
      </div>

      <ClientForm actionType="create" />
    </div>
  )
}
