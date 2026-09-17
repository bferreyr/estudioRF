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
        <div className="sidebar-header">
          <div className="logo-placeholder small">RF</div>
          <div className="brand-text">
            <h2>Estudio Jurídico</h2>
            <p>Panel de Gestión</p>
          </div>
        </div>
        
        <nav className="sidebar-nav">
          <Link href="/dashboard" className="nav-item active">
            <span className="icon">📊</span>
            Inicio
          </Link>
          <Link href="/dashboard/clientes" className="nav-item">
            <span className="icon">👥</span>
            Clientes
          </Link>
          <Link href="/dashboard/casos" className="nav-item">
            <span className="icon">📁</span>
            Casos
          </Link>
          <Link href="/dashboard/honorarios" className="nav-item">
            <span className="icon">💰</span>
            Honorarios
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
            <button className="btn btn-primary btn-sm">+ Nuevo Caso</button>
          </div>
        </header>
        
        <div className="content-area">
          {children}
        </div>
      </main>
    </div>
  )
}
