import Link from 'next/link'
import { getMaterias } from '@/app/actions/materias'

export default async function MateriasPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; page?: string }>
}) {
  const resolvedParams = await searchParams
  const query = resolvedParams.query || ''
  const currentPage = Number(resolvedParams.page) || 1

  const { materias, totalPages, totalCount } = await getMaterias(query, currentPage)

  return (
    <div className="animate-fade-in" style={{ padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ marginBottom: '0.5rem' }}>Catálogo de Materias</h1>
          <p style={{ color: 'var(--text-muted)' }}>{totalCount} materias registradas.</p>
        </div>
        <Link href="/dashboard/materias/nuevo" className="btn btn-primary">
          + Nuevo Materia
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
                <th>Descripción</th>
                
                <th style={{ padding: '1rem 0.5rem', textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {materias.length === 0 ? (
                <tr>
                  <td colSpan={3} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No se encontraron materias.
                  </td>
                </tr>
              ) : (
                materias.map((m) => (
                  <tr key={m.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '1rem 0.5rem', fontWeight: 600 }}>
                      <Link href={`/dashboard/materias/${m.id}`} style={{ color: 'var(--text-main)', textDecoration: 'none' }}>
                        {m.nombre}
                      </Link>
                    </td>
                    <td style={{ padding: '1rem 0.5rem' }}>{m.descripcion || '-'}</td>
                    <td style={{ padding: '1rem 0.5rem', textAlign: 'right' }}>
                      <Link href={`/dashboard/materias/${m.id}`} className="btn btn-sm btn-outline">
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
                href={`/dashboard/materias?page=${i + 1}${query ? `&query=${query}` : ''}`}
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
