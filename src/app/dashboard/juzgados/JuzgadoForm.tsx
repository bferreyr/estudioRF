'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { createJuzgado, updateJuzgado, deleteJuzgado } from '@/app/actions/juzgados'

type Juzgado = {
  id?: string
  nombre?: string
  ubicacion?: string | null
}

export function JuzgadoForm({ 
  juzgado, 
  actionType 
}: { 
  juzgado?: Juzgado
  actionType: 'create' | 'update' 
}) {
  const boundAction = actionType === 'update' && juzgado?.id 
    ? updateJuzgado.bind(null, juzgado.id) 
    : createJuzgado

  const [state, formAction, isPending] = useActionState(boundAction, null)

  return (
    <form action={formAction} className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-md)' }}>
      <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>
        {actionType === 'create' ? 'Nuevo Juzgado / Tribunal' : 'Modificar Juzgado / Tribunal'}
      </h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <label className="input-label" htmlFor="nombre">Nombre del Juzgado *</label>
          <input type="text" id="nombre" name="nombre" className="input-field" defaultValue={juzgado?.nombre || ''} required />
        </div>

        <div>
          <label className="input-label" htmlFor="ubicacion">Ubicación</label>
          <input type="text" id="ubicacion" name="ubicacion" className="input-field" defaultValue={juzgado?.ubicacion || ''} />
        </div>
      </div>

      {state?.error && (
        <div style={{ color: '#ef4444', backgroundColor: '#fee2e2', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginTop: '1.5rem' }}>
          {state.error}
        </div>
      )}
      
      {state?.success && (
        <div style={{ color: '#10b981', backgroundColor: '#ecfdf5', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginTop: '1.5rem' }}>
          {state.success}
        </div>
      )}

      <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', justifyContent: 'flex-end', alignItems: 'center' }}>
        {actionType === 'update' && juzgado?.id && (
          <button 
            type="button" 
            className="btn btn-outline" 
            style={{ color: '#ef4444', borderColor: '#ef4444', marginRight: 'auto' }}
            onClick={async () => {
              if (confirm('¿Estás seguro de eliminar este juzgado? Los expedientes vinculados quedarán sin juzgado.')) {
                await deleteJuzgado(juzgado.id!)
              }
            }}
          >
            Eliminar
          </button>
        )}
        <Link href={juzgado?.id ? `/dashboard/juzgados/${juzgado.id}` : '/dashboard/juzgados'} className="btn btn-outline">
          Cancelar
        </Link>
        <button type="submit" className="btn btn-primary" disabled={isPending}>
          {isPending ? 'Guardando...' : 'Guardar Juzgado'}
        </button>
      </div>
    </form>
  )
}
