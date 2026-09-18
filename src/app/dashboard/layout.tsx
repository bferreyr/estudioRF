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
