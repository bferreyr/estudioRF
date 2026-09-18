'use client'

import { useActionState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createFee, updateFee } from '@/app/actions/honorarios'

type Fee = {
  id?: string
  caseId: string
  monto: number
  fechaVenc?: string | null
  fechaPago?: string | null
  metodo?: string | null
  recibo?: string | null
  notas?: string | null
}

export function FeeForm({ feeData, caseId, actionType = 'create' }: { feeData?: Fee; caseId: string; actionType?: 'create' | 'update' }) {
  const router = useRouter()
  const boundAction = actionType === 'update' && feeData?.id 
    ? updateFee.bind(null, feeData.id) 
    : createFee

  const [state, formAction, isPending] = useActionState(boundAction, null)

  // Redirect on success if editing
  useEffect(() => {
    if (state?.success && state?.caseId && actionType === 'update') {
      router.push(`/dashboard/casos/${state.caseId}`)
    }
  }, [state, actionType, router])

  return (
    <form action={formAction} className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-md)' }}>
      <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>
        {actionType === 'create' ? 'Registrar Pago o Vencimiento' : 'Editar Honorario'}
      </h2>
      
      <input type="hidden" name="caseId" value={caseId} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div>
          <label className="input-label" htmlFor="monto">Monto ($) *</label>
          <input type="number" step="0.01" id="monto" name="monto" className="input-field" defaultValue={feeData?.monto || ''} required />
        </div>
        
        <div>
          <label className="input-label" htmlFor="metodo">Medio de Pago</label>
          <input type="text" id="metodo" name="metodo" className="input-field" defaultValue={feeData?.metodo || ''} placeholder="Transferencia, Efectivo..." />
        </div>

        <div>
          <label className="input-label" htmlFor="fechaVenc">Fecha de Vencimiento</label>
          <input type="date" id="fechaVenc" name="fechaVenc" className="input-field" defaultValue={feeData?.fechaVenc || ''} />
        </div>

        <div>
          <label className="input-label" htmlFor="fechaPago">Fecha de Pago (Dejar vacío si es deuda)</label>
          <input type="date" id="fechaPago" name="fechaPago" className="input-field" defaultValue={feeData?.fechaPago || ''} />
        </div>

        <div style={{ gridColumn: '1 / -1' }}>
          <label className="input-label" htmlFor="recibo">Nro. de Recibo / Comprobante</label>
          <input type="text" id="recibo" name="recibo" className="input-field" defaultValue={feeData?.recibo || ''} />
        </div>
        
        <div style={{ gridColumn: '1 / -1' }}>
          <label className="input-label" htmlFor="notas">Notas u Observaciones</label>
          <textarea 
            id="notas" 
            name="notas" 
            className="input-field" 
            defaultValue={feeData?.notas || ''}
            rows={3}
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
        <Link href={`/dashboard/casos/${caseId}`} className="btn btn-outline">
          Cancelar
        </Link>
        <button type="submit" className="btn btn-primary" disabled={isPending}>
          {isPending ? 'Guardando...' : 'Guardar Honorario'}
        </button>
      </div>
    </form>
  )
}
