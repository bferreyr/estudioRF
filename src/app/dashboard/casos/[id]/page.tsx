import { db } from '@/prisma/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { CaseForm } from '../CaseForm'

export default async function DetalleCasoPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const caseData = await db.orm.public.Case.include('client', c => c.select('nombre')).include('fees').first({ id })

  if (!caseData) {
    notFound()
  }

  // Calculate totals
  const totalPagado = caseData.fees?.filter(f => f.fechaPago).reduce((acc, f) => acc + f.monto, 0) || 0
  const honorariosPactados = caseData.honorariosTotales || 0
  const saldoPendiente = honorariosPactados - totalPagado

  return (
    <div className="animate-fade-in" style={{ padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <Link href="/dashboard/casos" style={{ color: 'var(--accent)', textDecoration: 'none', fontSize: '0.9rem', marginBottom: '1rem', display: 'inline-block' }}>
            ← Volver a Casos
          </Link>
          <h1 style={{ marginBottom: '0.5rem' }}>{caseData.caratula || 'Expediente Sin Carátula'}</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Cliente: <Link href={`/dashboard/clientes/${caseData.clientId}`} style={{ color: 'var(--accent)', textDecoration: 'none' }}>{caseData.client?.nombre}</Link> 
            {' • '} Exp: {caseData.nroExpediente || 'N/A'} 
            {' • '} Fuero: {caseData.materia || 'N/A'}
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
        {/* Formulario / Edición */}
        <div>
          <CaseForm caseData={caseData} actionType="update" clients={[]} />
        </div>

        {/* Panel lateral: Finanzas del Caso */}
        <div>
          <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Resumen Financiero</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Honorarios Pactados</span>
                <span style={{ fontWeight: 600 }}>${honorariosPactados.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Total Pagado</span>
                <span style={{ fontWeight: 600, color: '#34d399' }}>${totalPagado.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.5rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Saldo Pendiente</span>
                <span style={{ fontWeight: 'bold', color: saldoPendiente > 0 ? '#f59e0b' : '#fff' }}>
                  ${saldoPendiente.toLocaleString()}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h4 style={{ fontSize: '1rem' }}>Pagos Registrados</h4>
              <Link href={`/dashboard/honorarios/nuevo?caseId=${caseData.id}`} className="btn btn-sm btn-primary">
                + Pago
              </Link>
            </div>
            
            {caseData.fees && caseData.fees.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {caseData.fees.map(f => (
                  <div key={f.id} style={{ padding: '0.75rem', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 600 }}>${f.monto.toLocaleString()}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{f.fechaPago ? `Pagado: ${f.fechaPago}` : `Vence: ${f.fechaVenc}`}</div>
                    </div>
                    <div>
                      {f.fechaPago ? (
                        <span style={{ color: '#34d399', fontSize: '1.2rem' }}>✓</span>
                      ) : (
                        <span style={{ color: '#f59e0b', fontSize: '0.75rem', padding: '0.1rem 0.4rem', border: '1px solid #f59e0b', borderRadius: '4px' }}>Pendiente</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '1rem 0' }}>
                No hay pagos registrados.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
