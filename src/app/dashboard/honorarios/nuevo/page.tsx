import { db } from '@/prisma/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { FeeForm } from '../FeeForm'

export default async function NuevoHonorarioPage({
  searchParams
}: {
  searchParams: Promise<{ caseId?: string }>
}) {
  const { caseId } = await searchParams
  
  if (!caseId) {
    return (
      <div style={{ padding: '2rem' }}>
        <h2>Error: Se requiere un ID de caso.</h2>
        <Link href="/dashboard/casos" className="btn btn-outline">Ir a Casos</Link>
      </div>
    )
  }

  const caseData = await db.orm.public.Case.include('client', c => c.select('nombre')).first({ id: caseId })
  if (!caseData) notFound()

  return (
    <div className="animate-fade-in" style={{ padding: '1rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link href={`/dashboard/casos/${caseId}`} style={{ color: 'var(--accent)', textDecoration: 'none', fontSize: '0.9rem', marginBottom: '1rem', display: 'inline-block' }}>
          ← Volver al Expediente
        </Link>
        <h1 style={{ marginBottom: '0.5rem' }}>Nuevo Cobro / Honorario</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Caso: <strong>{caseData.caratula}</strong> - Cliente: <strong>{caseData.client?.nombre}</strong>
        </p>
      </div>

      <div style={{ maxWidth: '1200px' }}>
        <FeeForm caseId={caseId} />
      </div>
    </div>
  )
}
