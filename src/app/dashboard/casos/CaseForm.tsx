'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { createCase, updateCase } from '@/app/actions/casos'

type Client = { id: string; nombre: string }
type Case = {
  id?: string
  clientId?: string
  caratula?: string | null
  materia?: string | null
  estado?: string | null
  tribunal?: string | null
  nroExpediente?: string | null
  contraparte?: string | null
  descripcionCaso?: string | null
  moroso?: boolean
  honorariosTotales?: number | null
  anticipo?: number | null
}

export function CaseForm({ 
  caseData, 
  clients, 
  preSelectedClientId, 
  actionType 
}: { 
  caseData?: Case
  clients: Client[]
  preSelectedClientId?: string
  actionType: 'create' | 'update' 
}) {
  const boundAction = actionType === 'update' && caseData?.id 
    ? updateCase.bind(null, caseData.id) 
    : createCase

  const [state, formAction, isPending] = useActionState(boundAction, null)

  return (
    <form action={formAction} className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-md)' }}>
      <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>
        {actionType === 'create' ? 'Apertura de Expediente' : 'Modificar Expediente'}
      </h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Identificación */}
        {actionType === 'create' && (
          <div style={{ gridColumn: '1 / -1' }}>
            <label className="input-label" htmlFor="clientId">Cliente *</label>
            <select id="clientId" name="clientId" className="input-field" defaultValue={preSelectedClientId || ''} required>
              <option value="" disabled>Seleccione un cliente...</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
          </div>
        )}

        <div style={{ gridColumn: '1 / -1' }}>
          <label className="input-label" htmlFor="caratula">Carátula del Caso</label>
          <input type="text" id="caratula" name="caratula" className="input-field" defaultValue={caseData?.caratula || ''} placeholder="Ej: PEREZ C/ GOMEZ S/ DAÑOS Y PERJUICIOS" />
        </div>

        <div>
          <label className="input-label" htmlFor="materia">Materia / Fuero</label>
          <input type="text" id="materia" name="materia" className="input-field" defaultValue={caseData?.materia || ''} placeholder="Civil, Penal, Laboral..." />
        </div>
        
        <div>
          <label className="input-label" htmlFor="estado">Estado Actual</label>
          <select id="estado" name="estado" className="input-field" defaultValue={caseData?.estado || 'Activo'}>
            <option value="Activo">Activo</option>
            <option value="Finalizado">Finalizado</option>
            <option value="Archivado">Archivado</option>
          </select>
        </div>

        {/* Judicial */}
        <div>
          <label className="input-label" htmlFor="tribunal">Juzgado / Tribunal</label>
          <input type="text" id="tribunal" name="tribunal" className="input-field" defaultValue={caseData?.tribunal || ''} />
        </div>
        <div>
          <label className="input-label" htmlFor="nroExpediente">Nro. de Expediente</label>
          <input type="text" id="nroExpediente" name="nroExpediente" className="input-field" defaultValue={caseData?.nroExpediente || ''} />
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <label className="input-label" htmlFor="contraparte">Contraparte (y Abogados)</label>
          <input type="text" id="contraparte" name="contraparte" className="input-field" defaultValue={caseData?.contraparte || ''} />
        </div>

        {/* Financiero (Básico) */}
        {actionType === 'update' && (
          <>
            <div>
              <label className="input-label" htmlFor="honorariosTotales">Honorarios Totales Pactados ($)</label>
              <input type="number" step="0.01" id="honorariosTotales" name="honorariosTotales" className="input-field" defaultValue={caseData?.honorariosTotales || ''} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.5rem' }}>
              <input type="checkbox" id="moroso" name="moroso" value="true" defaultChecked={caseData?.moroso} style={{ width: '1.25rem', height: '1.25rem' }} />
              <label htmlFor="moroso" style={{ color: '#ef4444', fontWeight: 'bold' }}>Marcar como Moroso</label>
            </div>
          </>
        )}
        
        {/* Descripción */}
        <div style={{ gridColumn: '1 / -1' }}>
          <label className="input-label" htmlFor="descripcionCaso">Descripción / Hechos</label>
          <textarea 
            id="descripcionCaso" 
            name="descripcionCaso" 
            className="input-field" 
            defaultValue={caseData?.descripcionCaso || ''} 
            rows={5}
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
        <Link href={caseData?.id ? `/dashboard/casos/${caseData.id}` : '/dashboard/casos'} className="btn btn-outline">
          Cancelar
        </Link>
        <button type="submit" className="btn btn-primary" disabled={isPending}>
          {isPending ? 'Guardando...' : 'Guardar Expediente'}
        </button>
      </div>
    </form>
  )
}
