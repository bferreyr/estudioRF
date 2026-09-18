import { db } from '@/prisma/db'
import Link from 'next/link'
import { not } from '@prisma/orm-postgres/orm-client'

export default async function DashboardHome() {
  const clientsAgg = await db.orm.public.Client.aggregate((a) => ({ total: a.count() }))
  const clientsCount = clientsAgg.total

  const activeCasesAgg = await db.orm.public.Case.where((c) => 
    not(c.estado.in(['Finalizado', 'Archivado']))
  ).aggregate((a) => ({ total: a.count() }))
  const activeCasesCount = activeCasesAgg.total
  
  // En un sistema real esto sumaría la BD
  const pendingFeesAgg = await db.orm.public.Fee.where((f) => 
    f.fechaPago.isNull()
  ).aggregate((a) => ({ total: a.count() }))
  const pendingFees = pendingFeesAgg.total

  const recentCases = await db.orm.public.Case
    .include('client', c => c.select('nombre'))
    .orderBy(c => c.createdAt.desc())
    .limit(5)
    .all()

  return (
    <div className="animate-fade-in">
      <h1 style={{ marginBottom: '1.5rem' }}>Resumen del Estudio</h1>
      
      <div className="stats-grid">
        <div className="stat-card glass-panel">
          <div className="stat-icon" style={{ color: '#3b82f6', backgroundColor: '#eff6ff' }}>👥</div>
          <div className="stat-info">
            <div className="stat-value">{clientsCount}</div>
            <div className="stat-label">Clientes Activos</div>
          </div>
        </div>
        
        <div className="stat-card glass-panel">
          <div className="stat-icon" style={{ color: '#8b5cf6', backgroundColor: '#f5f3ff' }}>📁</div>
          <div className="stat-info">
            <div className="stat-value">{activeCasesCount}</div>
            <div className="stat-label">Casos en Curso</div>
          </div>
        </div>
        
        <div className="stat-card glass-panel">
          <div className="stat-icon" style={{ color: '#f59e0b', backgroundColor: '#fffbeb' }}>⏳</div>
          <div className="stat-info">
            <div className="stat-value">{pendingFees}</div>
            <div className="stat-label">Honorarios Pendientes</div>
          </div>
        </div>
        
        <div className="stat-card glass-panel">
          <div className="stat-icon" style={{ color: '#10b981', backgroundColor: '#ecfdf5' }}>✅</div>
          <div className="stat-info">
            <div className="stat-value">0</div>
            <div className="stat-label">Casos Cerrados</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Casos Recientes</h2>
          {recentCases.length === 0 ? (
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '2rem 0' }}>
              Aún no hay casos cargados. Usá el botón "+ Nuevo Caso" para empezar.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {recentCases.map(c => (
                <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: 'var(--radius-sm)' }}>
                  <div>
                    <Link href={`/dashboard/casos/${c.id}`} style={{ fontWeight: 600, color: 'var(--text-main)', textDecoration: 'none' }}>
                      {c.caratula || 'Sin carátula'}
                    </Link>
                    <div style={{ fontSize: '0.8rem', color: 'var(--accent)' }}>{c.client?.nombre}</div>
                  </div>
                  <div>
                    <span style={{ 
                      padding: '0.2rem 0.5rem', 
                      borderRadius: '999px', 
                      fontSize: '0.75rem',
                      backgroundColor: c.estado === 'Activo' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(0, 0, 0, 0.05)',
                      color: c.estado === 'Activo' ? '#34d399' : 'var(--text-muted)'
                    }}>
                      {c.estado || 'S/E'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Vencimientos</h2>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '2rem 0' }}>
            No hay vencimientos próximos.
          </div>
        </div>
      </div>
    </div>
  )
}
