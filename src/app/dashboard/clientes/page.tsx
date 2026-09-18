import Link from 'next/link'
import { getClients } from '@/app/actions/clientes'
import { redirect } from 'next/navigation'

export default async function ClientesPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; page?: string }>
}) {
  const resolvedParams = await searchParams
  const query = resolvedParams.query || ''
  const currentPage = Number(resolvedParams.page) || 1

  const { clients, totalPages, totalCount } = await getClients(query, currentPage)

  return (
    <div className="animate-fade-in" style={{ padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ marginBottom: '0.5rem' }}>Directorio de Clientes</h1>
          <p style={{ color: 'var(--text-muted)' }}>{totalCount} clientes registrados en el sistema.</p>
        </div>
        <Link href="/dashboard/clientes/nuevo" className="btn btn-primary">
          + Nuevo Cliente
        </Link>
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
        <form style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <input
            type="text"
            name="query"
            defaultValue={query}
            placeholder="Buscar por nombre o DNI..."
            className="input-field"
            style={{ maxWidth: '400px' }}
          />
          <button type="submit" className="btn btn-outline">
            Buscar
          </button>
        </form>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '1rem 0.5rem' }}>Nombre</th>
                <th style={{ padding: '1rem 0.5rem' }}>DNI</th>
                <th style={{ padding: '1rem 0.5rem' }}>Teléfono</th>
                <th style={{ padding: '1rem 0.5rem' }}>Email</th>
                <th style={{ padding: '1rem 0.5rem', textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clients.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No se encontraron clientes.
                  </td>
                </tr>
              ) : (
                clients.map((client) => (
                  <tr key={client.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '1rem 0.5rem', fontWeight: 500 }}>{client.nombre}</td>
                    <td style={{ padding: '1rem 0.5rem' }}>{client.dni || '-'}</td>
                    <td style={{ padding: '1rem 0.5rem' }}>{client.telefono || '-'}</td>
                    <td style={{ padding: '1rem 0.5rem' }}>{client.email || '-'}</td>
                    <td style={{ padding: '1rem 0.5rem', textAlign: 'right' }}>
                      <Link
                        href={`/dashboard/clientes/${client.id}`}
                        className="btn btn-sm btn-outline"
                      >
                        Ver Perfil
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
                href={`/dashboard/clientes?page=${i + 1}${query ? `&query=${query}` : ''}`}
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
