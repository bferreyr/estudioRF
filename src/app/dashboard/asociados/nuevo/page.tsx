import { AsociadoForm } from '../AsociadoForm'
import Link from 'next/link'

export default function NuevoAsociadoPage() {
  return (
    <div className="animate-fade-in" style={{ padding: '1rem', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/dashboard/asociados" style={{ color: 'var(--accent)', textDecoration: 'none', fontSize: '0.9rem', marginBottom: '1rem', display: 'inline-block' }}>
          ← Volver a Asociados
        </Link>
        <h1 style={{ marginBottom: '0.5rem' }}>Alta de Asociado</h1>
        <p style={{ color: 'var(--text-muted)' }}>Complete los datos del Abogado, Estudio o Mutual.</p>
      </div>

      <AsociadoForm actionType="create" />
    </div>
  )
}
