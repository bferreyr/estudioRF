import { JuzgadoForm } from '../JuzgadoForm'
import Link from 'next/link'

export default function NuevoJuzgadoPage() {
  return (
    <div className="animate-fade-in" style={{ padding: '1rem', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/dashboard/juzgados" style={{ color: 'var(--accent)', textDecoration: 'none', fontSize: '0.9rem', marginBottom: '1rem', display: 'inline-block' }}>
          ← Volver a Juzgados
        </Link>
        <h1 style={{ marginBottom: '0.5rem' }}>Alta de Juzgado</h1>
        <p style={{ color: 'var(--text-muted)' }}>Complete los datos del Juzgado \/ Tribunal.</p>
      </div>

      <JuzgadoForm actionType="create" />
    </div>
  )
}
