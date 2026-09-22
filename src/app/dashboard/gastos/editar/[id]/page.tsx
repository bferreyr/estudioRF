import { db } from '@/prisma/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { FeeForm } from '../../../honorarios/FeeForm'

export default async function EditarGastoPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const expense = await db.orm.public.Expense.include('case', c => c.select('caratula').include('client', cl => cl.select('nombre'))).first({ id })
  
  if (!expense) {
    notFound()
  }

  return (
    <div className="animate-fade-in" style={{ padding: '1rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link href={`/dashboard/casos/${expense.caseId}`} style={{ color: 'var(--accent)', textDecoration: 'none', fontSize: '0.9rem', marginBottom: '1rem', display: 'inline-block' }}>
          ← Volver al Expediente
        </Link>
        <h1 style={{ marginBottom: '0.5rem' }}>Editar Gasto</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Caso: <strong>{expense.case?.caratula}</strong> - Cliente: <strong>{expense.case?.client?.nombre}</strong>
        </p>
      </div>

      <div style={{ maxWidth: '800px' }}>
        <FeeForm initialData={expense} caseId={expense.caseId} actionType="update" isExpense={true} />
      </div>
    </div>
  )
}
