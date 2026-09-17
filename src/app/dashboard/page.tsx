import { db } from '@/prisma/db'

export default async function DashboardHome() {
  const clientsCount = await db.orm.public.Client.count()
  const activeCasesCount = await db.orm.public.Case.count({
    where: { estado: { notIn: ['Finalizado', 'Archivado'] } }
  })
  
  // En un sistema real esto sumaría la BD
  const pendingFees = await db.orm.public.Fee.count({
    where: { fechaPago: null }
  })

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
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '2rem 0' }}>
            Aún no hay casos cargados. Usá el botón "+ Nuevo Caso" para empezar.
          </div>
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
