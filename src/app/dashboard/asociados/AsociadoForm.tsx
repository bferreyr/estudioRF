'use client'

import { useActionState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createAsociado, updateAsociado, deleteAsociado } from '@/app/actions/asociados'

type Asociado = {
  id?: string
  nombre?: string
  tipo?: string | null
  telefono?: string | null
  email?: string | null
}

export function AsociadoForm({ 
  asociado, 
  actionType 
}: { 
  asociado?: Asociado
  actionType: 'create' | 'update' 
}) {
  const boundAction = actionType === 'update' && asociado?.id 
    ? updateAsociado.bind(null, asociado.id) 
    : createAsociado

  const [state, formAction, isPending] = useActionState(boundAction, null)

  return (
    <form action={formAction} className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-md)' }}>
      <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>
        {actionType === 'create' ? 'Nuevo Asociado' : 'Modificar Asociado'}
      </h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div style={{ gridColumn: '1 / -1' }}>
          <label className="input-label" htmlFor="nombre">Nombre (Abogado, Estudio o Mutual) *</label>
          <input type="text" id="nombre" name="nombre" className="input-field" defaultValue={asociado?.nombre || ''} required />
        </div>

        <div>
          <label className="input-label" htmlFor="tipo">Tipo de Asociado</label>
          <select id="tipo" name="tipo" className="input-field" defaultValue={asociado?.tipo || 'Abogado'}>
            <option value="Abogado">Abogado</option>
            <option value="Estudio Jurídico">Estudio Jurídico</option>
            <option value="Mutual">Mutual</option>
            <option value="Gestor">Gestor</option>
            <option value="Otro">Otro</option>
          </select>
        </div>

        <div>
          <label className="input-label" htmlFor="telefono">Teléfono</label>
          <input type="text" id="telefono" name="telefono" className="input-field" defaultValue={asociado?.telefono || ''} />
        </div>

        <div style={{ gridColumn: '1 / -1' }}>
          <label className="input-label" htmlFor="email">Correo Electrónico</label>
          <input type="email" id="email" name="email" className="input-field" defaultValue={asociado?.email || ''} />
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
        {actionType === 'update' && asociado?.id && (
          <button 
            type="button" 
            className="btn btn-outline" 
            style={{ color: '#ef4444', borderColor: '#ef4444', marginRight: 'auto' }}
            onClick={async () => {
              if (confirm('¿Estás seguro de eliminar este asociado? Los expedientes vinculados quedarán sin asociado.')) {
                await deleteAsociado(asociado.id!)
              }
            }}
          >
            Eliminar
          </button>
        )}
        <Link href={asociado?.id ? `/dashboard/asociados/${asociado.id}` : '/dashboard/asociados'} className="btn btn-outline">
          Cancelar
        </Link>
        <button type="submit" className="btn btn-primary" disabled={isPending}>
          {isPending ? 'Guardando...' : 'Guardar Asociado'}
        </button>
      </div>
    </form>
  )
}
