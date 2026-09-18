import { db } from '@/prisma/db'
import { CaseForm } from '../CaseForm'
import Link from 'next/link'

export default async function NuevoCasoPage({
  searchParams
}: {
  searchParams: Promise<{ clientId?: string }>
}) {
  const { clientId } = await searchParams
  
  // We need to fetch all clients to populate the dropdown
  const clients = await db.orm.public.Client.select('id', 'nombre').orderBy(c => c.nombre.asc()).all()

  return (
    <div className="animate-fade-in" style={{ padding: '1rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/dashboard/casos" style={{ color: 'var(--accent)', textDecoration: 'none', fontSize: '0.9rem', marginBottom: '1rem', display: 'inline-block' }}>
          ← Volver a Casos
        </Link>
        <h1 style={{ marginBottom: '0.5rem' }}>Registrar Nuevo Expediente</h1>
        <p style={{ color: 'var(--text-muted)' }}>Abre un nuevo caso y asócialo a un cliente existente.</p>
      </div>

      <CaseForm actionType="create" clients={clients} preSelectedClientId={clientId} />
    </div>
  )
}
