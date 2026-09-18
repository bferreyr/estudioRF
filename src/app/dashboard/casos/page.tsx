import Link from 'next/link'
import { getCases } from '@/app/actions/casos'

export default async function CasosPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; page?: string; estado?: string }>
}) {
  const resolvedParams = await searchParams
  const query = resolvedParams.query || ''
  const filterState = resolvedParams.estado || ''
  const currentPage = Number(resolvedParams.page) || 1

  const { cases, totalPages, totalCount } = await getCases(query, currentPage, filterState)

  return (
    <div className="animate-fade-in" style={{ padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ marginBottom: '0.5rem' }}>Gestión de Casos</h1>
          <p style={{ color: 'var(--text-muted)' }}>{totalCount} expedientes encontrados.</p>
        </div>
        <Link href="/dashboard/casos/nuevo" className="btn btn-primary">
          + Nuevo Caso
        </Link>
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
        <form style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <input
            type="text"
            name="query"
            defaultValue={query}
            placeholder="Buscar carátula o expediente..."
            className="input-field"
            style={{ maxWidth: '300px' }}
          />
          <select name="estado" className="input-field" defaultValue={filterState} style={{ maxWidth: '200px' }}>
            <option value="">Todos los estados</option>
            <option value="Activo">Activo</option>
            <option value="Finalizado">Finalizado</option>
            <option value="Archivado">Archivado</option>
          </select>
          <button type="submit" className="btn btn-outline">
            Filtrar
          </button>
        </form>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '1rem 0.5rem' }}>Carátula</th>
                <th style={{ padding: '1rem 0.5rem' }}>Cliente</th>
                <th style={{ padding: '1rem 0.5rem' }}>Materia</th>
                <th style={{ padding: '1rem 0.5rem' }}>Estado</th>
                <th style={{ padding: '1rem 0.5rem', textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {cases.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No se encontraron casos.
                  </td>
                </tr>
              ) : (
                cases.map((c) => (
                  <tr key={c.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '1rem 0.5rem', fontWeight: 500 }}>
                      <Link href={`/dashboard/casos/${c.id}`} style={{ color: '#fff', textDecoration: 'none' }}>
                        {c.caratula || 'Sin carátula'}
                      </Link>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                        Exp: {c.nroExpediente || '-'}
                      </div>
                    </td>
                    <td style={{ padding: '1rem 0.5rem' }}>
                      <Link href={`/dashboard/clientes/${c.clientId}`} style={{ color: 'var(--accent)', textDecoration: 'none' }}>
                        {c.client?.nombre}
                      </Link>
                    </td>
                    <td style={{ padding: '1rem 0.5rem' }}>{c.materia || '-'}</td>
                    <td style={{ padding: '1rem 0.5rem' }}>
                      <span style={{ 
                        padding: '0.2rem 0.6rem', 
                        borderRadius: '999px', 
                        fontSize: '0.8rem',
                        backgroundColor: c.estado === 'Activo' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                        color: c.estado === 'Activo' ? '#34d399' : '#fff'
                      }}>
                        {c.estado || 'S/E'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 0.5rem', textAlign: 'right' }}>
                      <Link href={`/dashboard/casos/${c.id}`} className="btn btn-sm btn-outline">
                        Gestionar
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
                href={`/dashboard/casos?page=${i + 1}${query ? `&query=${query}` : ''}${filterState ? `&estado=${filterState}` : ''}`}
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
