'use client'

import { useActionState, useState } from 'react'
import Link from 'next/link'
import { createCase, updateCase, deleteCase } from '@/app/actions/casos'

type Client = { id: string; nombre: string }
type Case = {
  id?: string
  clientId?: string
  asociadoId?: string | null
  caratula?: string | null
  materiaId?: string | null
  juzgadoId?: string | null
  estado?: string | null
  nroExpediente?: string | null
  contraparte?: string | null
  descripcionCaso?: string | null
  moroso?: boolean
  honorariosTotales?: number | null
  honorariosDolares?: number | null
  honorariosJus?: number | null
  anticipo?: number | null
  cuotasPactadas?: number | null
  interesCuotas?: number | null
}

export function CaseForm({ 
  caseData, 
  clients, 
  asociados,
  materias,
  juzgados,
  jusValue,
  preSelectedClientId, 
  actionType 
}: { 
  caseData?: Case
  clients: Client[]
  asociados: { id: string; nombre: string }[]
  materias: { id: string; nombre: string }[]
  juzgados: { id: string; nombre: string }[]
  jusValue?: number
  preSelectedClientId?: string
  actionType: 'create' | 'update' 
}) {
  const boundAction = actionType === 'update' && caseData?.id 
    ? updateCase.bind(null, caseData.id) 
    : createCase

  const [state, formAction, isPending] = useActionState(boundAction, null)
  const [jusAmount, setJusAmount] = useState<number | ''>(caseData?.honorariosJus || '')

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
          <label className="input-label" htmlFor="materiaId">Materia / Fuero</label>
          <select id="materiaId" name="materiaId" className="input-field" defaultValue={caseData?.materiaId || ''}>
            <option value="">Seleccione materia...</option>
            {materias?.map(m => (
              <option key={m.id} value={m.id}>{m.nombre}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="input-label" htmlFor="estado">Estado</label>
          <select id="estado" name="estado" className="input-field" defaultValue={caseData?.estado || 'Activo'}>
            <option value="Activo">Activo</option>
            <option value="Finalizado">Finalizado</option>
            <option value="Archivado">Archivado</option>
          </select>
        </div>

        <div>
          <label className="input-label" htmlFor="asociadoId">Asociado a (Abogado, Estudio o Mutual)</label>
          <select id="asociadoId" name="asociadoId" className="input-field" defaultValue={caseData?.asociadoId || ''}>
            <option value="">Ninguno / Propio</option>
            {asociados?.map(a => (
              <option key={a.id} value={a.id}>{a.nombre}</option>
            ))}
          </select>
        </div>

        {/* Judicial */}
        <div>
          <label className="input-label" htmlFor="juzgadoId">Juzgado / Tribunal</label>
          <select id="juzgadoId" name="juzgadoId" className="input-field" defaultValue={caseData?.juzgadoId || ''}>
            <option value="">Seleccione juzgado...</option>
            {juzgados?.map(j => (
              <option key={j.id} value={j.id}>{j.nombre}</option>
            ))}
          </select>
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
            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 200px' }}>
                <label className="input-label" htmlFor="honorariosTotales">Honorarios Pactados ($)</label>
                <input type="number" step="0.01" id="honorariosTotales" name="honorariosTotales" className="input-field" defaultValue={caseData?.honorariosTotales || ''} />
              </div>
              <div style={{ flex: '1 1 200px' }}>
                <label className="input-label" htmlFor="honorariosDolares">Honorarios Pactados (U$S)</label>
                <input type="number" step="0.01" id="honorariosDolares" name="honorariosDolares" className="input-field" defaultValue={caseData?.honorariosDolares || ''} />
              </div>
              <div style={{ flex: '1 1 200px' }}>
                <label className="input-label" htmlFor="honorariosJus">Honorarios Pactados (JUS)</label>
                <input 
                  type="number" 
                  step="0.01" 
                  id="honorariosJus" 
                  name="honorariosJus" 
                  className="input-field" 
                  value={jusAmount}
                  onChange={(e) => setJusAmount(e.target.value === '' ? '' : parseFloat(e.target.value))}
                />
                {jusValue && jusAmount !== '' && (
                  <div style={{ fontSize: '0.8rem', color: 'var(--accent)', marginTop: '0.25rem' }}>
                    Equivale a ${(jusAmount * jusValue).toLocaleString('es-AR')}
                  </div>
                )}
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1.5rem' }}>
              <div>
                <label className="input-label" htmlFor="cuotasPactadas">Cuotas Pactadas (Cantidad)</label>
                <input type="number" id="cuotasPactadas" name="cuotasPactadas" className="input-field" defaultValue={caseData?.cuotasPactadas || ''} placeholder="Ej: 3, 6, 12" />
              </div>
              <div>
                <label className="input-label" htmlFor="interesCuotas">Interés (%)</label>
                <input type="number" step="0.1" id="interesCuotas" name="interesCuotas" className="input-field" defaultValue={caseData?.interesCuotas || ''} placeholder="Ej: 10, 15.5" />
              </div>
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

      <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', justifyContent: 'flex-end', alignItems: 'center' }}>
        {actionType === 'update' && caseData?.id && (
          <button 
            type="button" 
            className="btn btn-outline" 
            style={{ color: '#ef4444', borderColor: '#ef4444', marginRight: 'auto' }}
            onClick={async () => {
              if (confirm('¿Estás seguro de eliminar este expediente? Esto borrará también todos los honorarios asociados de forma permanente.')) {
                await deleteCase(caseData.id!)
              }
            }}
          >
            Eliminar
          </button>
        )}
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
