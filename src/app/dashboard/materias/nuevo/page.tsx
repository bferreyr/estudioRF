import { MateriaForm } from '../MateriaForm'
import Link from 'next/link'

export default function NuevoMateriaPage() {
  return (
    <div className="animate-fade-in" style={{ padding: '1rem', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/dashboard/materias" style={{ color: 'var(--accent)', textDecoration: 'none', fontSize: '0.9rem', marginBottom: '1rem', display: 'inline-block' }}>
          ← Volver a Materias
        </Link>
        <h1 style={{ marginBottom: '0.5rem' }}>Alta de Materia</h1>
        <p style={{ color: 'var(--text-muted)' }}>Complete los datos del Materia \/ Fuero.</p>
      </div>

      <MateriaForm actionType="create" />
    </div>
  )
}
