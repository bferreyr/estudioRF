import { db } from '@/prisma/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { FeeForm } from '../../FeeForm'

export default async function EditarHonorarioPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  
  const feeData = await db.orm.public.Fee.include('case', c => c.select('caratula').include('client', cl => cl.select('nombre'))).first({ id })
  
  if (!feeData) {
    notFound()
  }

  return (
    <div className="animate-fade-in" style={{ padding: '1rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link href={`/dashboard/casos/${feeData.caseId}`} style={{ color: 'var(--accent)', textDecoration: 'none', fontSize: '0.9rem', marginBottom: '1rem', display: 'inline-block' }}>
          ← Volver al Expediente
        </Link>
        <h1 style={{ marginBottom: '0.5rem' }}>Editar Honorario</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Caso: <strong>{feeData.case?.caratula}</strong> - Cliente: <strong>{feeData.case?.client?.nombre}</strong>
        </p>
      </div>

      <div style={{ maxWidth: '800px' }}>
        <FeeForm initialData={feeData} caseId={feeData.caseId} actionType="update" />
      </div>
    </div>
  )
}
