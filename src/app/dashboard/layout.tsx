import { logout } from '@/app/actions/auth'
import Link from 'next/link'
import './dashboard.css'
import { getSession } from '@/lib/session'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header" style={{ padding: '2rem 1.5rem', display: 'flex', justifyContent: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textDecoration: 'none' }}>
            <div style={{ 
              fontFamily: 'Cinzel, serif', 
              fontSize: '2.8rem', 
              lineHeight: '1',
              color: '#faf6f1',
              display: 'flex',
              alignItems: 'center'
            }}>
              R<span style={{ fontSize: '1.2rem', margin: '0 -0.2rem 0 -0.1rem', color: 'var(--accent)' }}>&</span>F
            </div>
            <div style={{ 
              fontFamily: 'Tenor Sans, sans-serif', 
              fontSize: '0.55rem', 
              letterSpacing: '0.2em', 
              color: 'var(--accent)', 
              marginTop: '0.3rem' 
            }}>
              ESTUDIO JURÍDICO
            </div>
          </div>
        </div>
        
        <nav className="sidebar-nav">
          <Link href="/dashboard" className="nav-item active">
            <span className="icon">🏠</span> Inicio
          </Link>
          <Link href="/dashboard/clientes" className="nav-item">
            <span className="icon">👥</span> Clientes
          </Link>
          <Link href="/dashboard/casos" className="nav-item">
            <span className="icon">📁</span> Casos
          </Link>
          <Link href="/dashboard/asociados" className="nav-item">
            <span className="icon">🤝</span> Asociados
          </Link>
          <Link href="/dashboard/honorarios" className="nav-item">
            <span className="icon">💰</span> Honorarios
          </Link>
        </nav>
        
        <div className="sidebar-footer">
          <div className="user-info">
            <div className="avatar">{session?.name?.charAt(0) || 'A'}</div>
            <div className="user-details">
              <span className="name">{session?.name || 'Administrador'}</span>
              <span className="role">Dueño</span>
            </div>
          </div>
          <form action={logout}>
            <button type="submit" className="logout-btn">
              Cerrar Sesión
            </button>
          </form>
          
          <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Desarrollado por Rincón TECH<br/>
            <a href="https://wa.me/543425305025" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: '#25D366', textDecoration: 'none', marginTop: '0.5rem', fontWeight: 600 }}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
              </svg>
              Soporte
            </a>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="topbar glass-panel">
          <div className="topbar-left">
            {/* Contextual title could go here */}
          </div>
          <div className="topbar-right">
            <Link href="/dashboard/casos/nuevo" className="btn btn-primary btn-sm">+ Nuevo Caso</Link>
          </div>
        </header>
        
        <div className="content-area">
          {children}
        </div>
      </main>
    </div>
  )
}
