import { db } from '@/prisma/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MateriaForm } from '../MateriaForm'

export default async function DetalleMateriaPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const materia = await db.orm.public.Materia.include('cases', c => c.select('id', 'caratula', 'estado', 'nroExpediente')).first({ id })

  if (!materia) {
    notFound()
  }

  return (
    <div className="animate-fade-in" style={{ padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <Link href="/dashboard/materias" style={{ color: 'var(--accent)', textDecoration: 'none', fontSize: '0.9rem', marginBottom: '1rem', display: 'inline-block' }}>
            ← Volver a Materias
          </Link>
          <h1 style={{ marginBottom: '0.5rem' }}>Perfil: {materia.nombre}</h1>
          <p style={{ color: 'var(--text-muted)' }}>Tipo: {materia.descripcion || ''}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }}>
        {/* Formulario / Edición */}
        <div>
          <MateriaForm materia={materia} actionType="update" />
        </div>

        {/* Panel lateral: Casos del materia */}
        <div>
          <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem' }}>Casos Derivados</h3>
            </div>
            
            {materia.cases && materia.cases.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {materia.cases.map((c: any) => (
                  <div key={c.id} style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}>
                    <Link href={`/dashboard/casos/${c.id}`} style={{ fontWeight: 600, color: 'var(--text-main)', textDecoration: 'none', display: 'block', marginBottom: '0.25rem' }}>
                      {c.caratula || 'Caso sin carátula'}
                    </Link>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      <span>Exp: {c.nroExpediente || '-'}</span>
                      <span style={{ 
                        padding: '0.1rem 0.5rem', 
                        borderRadius: '999px', 
                        backgroundColor: c.estado === 'Activo' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(0, 0, 0, 0.05)',
                        color: c.estado === 'Activo' ? '#34d399' : 'var(--text-muted)'
                      }}>
                        {c.estado || 'S/E'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '1rem 0' }}>
                Este materia no tiene casos derivados.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
