import Link from 'next/link'
import { getAsociados } from '@/app/actions/asociados'

export default async function AsociadosPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; page?: string }>
}) {
  const resolvedParams = await searchParams
  const query = resolvedParams.query || ''
  const currentPage = Number(resolvedParams.page) || 1

  const { asociados, totalPages, totalCount } = await getAsociados(query, currentPage)

  return (
    <div className="animate-fade-in" style={{ padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ marginBottom: '0.5rem' }}>Catálogo de Asociados</h1>
          <p style={{ color: 'var(--text-muted)' }}>{totalCount} entidades registradas.</p>
        </div>
        <Link href="/dashboard/asociados/nuevo" className="btn btn-primary">
          + Nuevo Asociado
        </Link>
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
        <form style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <input
            type="text"
            name="query"
            defaultValue={query}
            placeholder="Buscar por nombre o tipo..."
            className="input-field"
            style={{ maxWidth: '300px' }}
          />
          <button type="submit" className="btn btn-outline">
            Filtrar
          </button>
        </form>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '1rem 0.5rem' }}>Nombre</th>
                <th style={{ padding: '1rem 0.5rem' }}>Tipo</th>
                <th style={{ padding: '1rem 0.5rem' }}>Contacto</th>
                <th style={{ padding: '1rem 0.5rem', textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {asociados.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No se encontraron asociados.
                  </td>
                </tr>
              ) : (
                asociados.map((a) => (
                  <tr key={a.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '1rem 0.5rem', fontWeight: 600 }}>
                      <Link href={`/dashboard/asociados/${a.id}`} style={{ color: 'var(--text-main)', textDecoration: 'none' }}>
                        {a.nombre}
                      </Link>
                    </td>
                    <td style={{ padding: '1rem 0.5rem' }}>
                      <span style={{ 
                        padding: '0.2rem 0.6rem', 
                        borderRadius: '999px', 
                        fontSize: '0.8rem',
                        backgroundColor: 'rgba(0, 0, 0, 0.05)',
                        color: 'var(--text-muted)'
                      }}>
                        {a.tipo || 'S/E'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 0.5rem' }}>
                      <div style={{ fontSize: '0.85rem' }}>{a.telefono || '-'}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{a.email || '-'}</div>
                    </td>
                    <td style={{ padding: '1rem 0.5rem', textAlign: 'right' }}>
                      <Link href={`/dashboard/asociados/${a.id}`} className="btn btn-sm btn-outline">
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
                href={`/dashboard/asociados?page=${i + 1}${query ? `&query=${query}` : ''}`}
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
