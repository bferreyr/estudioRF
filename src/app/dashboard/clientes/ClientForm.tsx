'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { createClient, updateClient } from '@/app/actions/clientes'

type Client = {
  id?: string
  nombre?: string
  dni?: string | null
  telefono?: string | null
  telefonoAlt?: string | null
  email?: string | null
  ocupacion?: string | null
  fechaNacimiento?: string | null
  estadoCivil?: string | null
  direccion?: string | null
  localidad?: string | null
  observaciones?: string | null
}

export function ClientForm({ client, actionType }: { client?: Client; actionType: 'create' | 'update' }) {
  const boundAction = actionType === 'update' && client?.id 
    ? updateClient.bind(null, client.id) 
    : createClient

  const [state, formAction, isPending] = useActionState(boundAction, null)

  return (
    <form action={formAction} className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-md)' }}>
      <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>
        {actionType === 'create' ? 'Datos del Cliente' : 'Editar Cliente'}
      </h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Personal info */}
        <div>
          <label className="input-label" htmlFor="nombre">Nombre Completo *</label>
          <input type="text" id="nombre" name="nombre" className="input-field" defaultValue={client?.nombre} required />
        </div>
        <div>
          <label className="input-label" htmlFor="dni">DNI</label>
          <input type="text" id="dni" name="dni" className="input-field" defaultValue={client?.dni || ''} />
        </div>
        <div>
          <label className="input-label" htmlFor="email">Email</label>
          <input type="email" id="email" name="email" className="input-field" defaultValue={client?.email || ''} />
        </div>
        <div>
          <label className="input-label" htmlFor="fechaNacimiento">Fecha de Nacimiento</label>
          <input type="date" id="fechaNacimiento" name="fechaNacimiento" className="input-field" defaultValue={client?.fechaNacimiento || ''} />
        </div>
        <div>
          <label className="input-label" htmlFor="estadoCivil">Estado Civil</label>
          <input type="text" id="estadoCivil" name="estadoCivil" className="input-field" defaultValue={client?.estadoCivil || ''} />
        </div>
        <div>
          <label className="input-label" htmlFor="ocupacion">Ocupación</label>
          <input type="text" id="ocupacion" name="ocupacion" className="input-field" defaultValue={client?.ocupacion || ''} />
        </div>

        {/* Contact & Location */}
        <div>
          <label className="input-label" htmlFor="telefono">Teléfono</label>
          <input type="text" id="telefono" name="telefono" className="input-field" defaultValue={client?.telefono || ''} />
        </div>
        <div>
          <label className="input-label" htmlFor="telefonoAlt">Teléfono Alternativo</label>
          <input type="text" id="telefonoAlt" name="telefonoAlt" className="input-field" defaultValue={client?.telefonoAlt || ''} />
        </div>
        <div>
          <label className="input-label" htmlFor="direccion">Dirección</label>
          <input type="text" id="direccion" name="direccion" className="input-field" defaultValue={client?.direccion || ''} />
        </div>
        <div>
          <label className="input-label" htmlFor="localidad">Localidad</label>
          <input type="text" id="localidad" name="localidad" className="input-field" defaultValue={client?.localidad || ''} />
        </div>
        
        {/* Full width */}
        <div style={{ gridColumn: '1 / -1' }}>
          <label className="input-label" htmlFor="observaciones">Observaciones</label>
          <textarea 
            id="observaciones" 
            name="observaciones" 
            className="input-field" 
            defaultValue={client?.observaciones || ''} 
            rows={4}
            style={{ resize: 'vertical' }}
          ></textarea>
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

      <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', justifyContent: 'flex-end' }}>
        <Link href={client?.id ? `/dashboard/clientes/${client.id}` : '/dashboard/clientes'} className="btn btn-outline">
          Cancelar
        </Link>
        <button type="submit" className="btn btn-primary" disabled={isPending}>
          {isPending ? 'Guardando...' : 'Guardar Cliente'}
        </button>
      </div>
    </form>
  )
}
