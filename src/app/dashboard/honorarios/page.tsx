import Link from 'next/link'
import { getFees, markFeeAsPaid } from '@/app/actions/honorarios'

export default async function HonorariosPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const resolvedParams = await searchParams
  const currentPage = Number(resolvedParams.page) || 1

  const { fees, totalPages, totalCount, stats } = await getFees(currentPage)
  const saldoPendiente = stats.totalPactado - stats.totalPagado

  return (
    <div className="animate-fade-in" style={{ padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ marginBottom: '0.5rem' }}>Control de Honorarios</h1>
          <p style={{ color: 'var(--text-muted)' }}>Registro general de cobros del estudio.</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
          <div className="stat-icon" style={{ color: '#10b981', backgroundColor: '#ecfdf5' }}>💵</div>
          <div className="stat-info">
            <div className="stat-value">${stats.totalPagado.toLocaleString()}</div>
            <div className="stat-label">Ingresos Totales (Cobrados)</div>
          </div>
        </div>
        <div className="stat-card glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
          <div className="stat-icon" style={{ color: '#f59e0b', backgroundColor: '#fffbeb' }}>⏳</div>
          <div className="stat-info">
            <div className="stat-value">${saldoPendiente.toLocaleString()}</div>
            <div className="stat-label">Saldo Pendiente de Cobro</div>
          </div>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
        <h3 style={{ marginBottom: '1.5rem' }}>Últimos Registros ({totalCount})</h3>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '1rem 0.5rem' }}>Fecha (Venc/Pago)</th>
                <th style={{ padding: '1rem 0.5rem' }}>Monto</th>
                <th style={{ padding: '1rem 0.5rem' }}>Cliente y Caso</th>
                <th style={{ padding: '1rem 0.5rem' }}>Estado</th>
                <th style={{ padding: '1rem 0.5rem', textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {fees.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No hay honorarios registrados en el sistema.
                  </td>
                </tr>
              ) : (
                fees.map((fee) => (
                  <tr key={fee.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '1rem 0.5rem' }}>
                      {fee.fechaPago ? (
                        <div>
                          <span style={{ color: '#34d399', fontWeight: 'bold' }}>{fee.fechaPago}</span>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Pagado</div>
                        </div>
                      ) : (
                        <div>
                          <span>{fee.fechaVenc || '-'}</span>
                          <div style={{ fontSize: '0.75rem', color: '#f59e0b' }}>Vencimiento</div>
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '1rem 0.5rem', fontWeight: 'bold', fontSize: '1.1rem' }}>
                      {fee.moneda === 'Dólares' ? 'U$S' : (fee.moneda === 'JUS' ? '' : '$')}{fee.monto.toLocaleString()} {fee.moneda === 'JUS' ? 'JUS' : ''}
                    </td>
                    <td style={{ padding: '1rem 0.5rem' }}>
                      <Link href={`/dashboard/casos/${fee.caseId}`} style={{ color: 'var(--text-main)', textDecoration: 'none', fontWeight: 500 }}>
                        {fee.case?.caratula || 'Sin carátula'}
                      </Link>
                      <div style={{ fontSize: '0.8rem', color: 'var(--accent)' }}>
                        {fee.case?.client?.nombre}
                      </div>
                    </td>
                    <td style={{ padding: '1rem 0.5rem' }}>
                      {fee.fechaPago ? (
                        <span style={{ padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.8rem', backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#34d399' }}>
                          Cobrado
                        </span>
                      ) : (
                        <span style={{ padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.8rem', backgroundColor: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b' }}>
                          Pendiente
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '1rem 0.5rem', textAlign: 'right', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', alignItems: 'center' }}>
                      {!fee.fechaPago && (
                        <form action={async () => {
                          'use server'
                          await markFeeAsPaid(fee.id)
                        }}>
                          <button type="submit" className="btn btn-sm" style={{ backgroundColor: '#10b981', color: '#fff', border: 'none' }}>
                            Pagar
                          </button>
                        </form>
                      )}
                      <Link href={`/dashboard/honorarios/editar/${fee.id}`} className="btn btn-sm btn-outline">
                        Editar
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2rem' }}>
            {Array.from({ length: totalPages }).map((_, i) => (
              <Link
                key={i}
                href={`/dashboard/honorarios?page=${i + 1}`}
                className={`btn btn-sm ${currentPage === i + 1 ? 'btn-primary' : 'btn-outline'}`}
              >
                {i + 1}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
