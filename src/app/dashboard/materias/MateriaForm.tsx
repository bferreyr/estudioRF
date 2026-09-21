'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { createMateria, updateMateria, deleteMateria } from '@/app/actions/materias'

type Materia = {
  id?: string
  nombre?: string
  descripcion?: string | null
}

export function MateriaForm({ 
  materia, 
  actionType 
}: { 
  materia?: Materia
  actionType: 'create' | 'update' 
}) {
  const boundAction = actionType === 'update' && materia?.id 
    ? updateMateria.bind(null, materia.id) 
    : createMateria

  const [state, formAction, isPending] = useActionState(boundAction, null)

  return (
    <form action={formAction} className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-md)' }}>
      <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>
        {actionType === 'create' ? 'Nueva Materia / Fuero' : 'Modificar Materia / Fuero'}
      </h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <label className="input-label" htmlFor="nombre">Nombre de la Materia *</label>
          <input type="text" id="nombre" name="nombre" className="input-field" defaultValue={materia?.nombre || ''} required />
        </div>

        <div>
          <label className="input-label" htmlFor="descripcion">Descripción</label>
          <textarea id="descripcion" name="descripcion" className="input-field" defaultValue={materia?.descripcion || ''} rows={3}></textarea>
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
        {actionType === 'update' && materia?.id && (
          <button 
            type="button" 
            className="btn btn-outline" 
            style={{ color: '#ef4444', borderColor: '#ef4444', marginRight: 'auto' }}
            onClick={async () => {
              if (confirm('¿Estás seguro de eliminar esta materia? Los expedientes vinculados quedarán sin materia.')) {
                await deleteMateria(materia.id!)
              }
            }}
          >
            Eliminar
          </button>
        )}
        <Link href={materia?.id ? `/dashboard/materias/${materia.id}` : '/dashboard/materias'} className="btn btn-outline">
          Cancelar
        </Link>
        <button type="submit" className="btn btn-primary" disabled={isPending}>
          {isPending ? 'Guardando...' : 'Guardar Materia'}
        </button>
      </div>
    </form>
  )
}
