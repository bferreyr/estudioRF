'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { createFee } from '@/app/actions/honorarios'

export function FeeForm({ caseId }: { caseId: string }) {
  const [state, formAction, isPending] = useActionState(createFee, null)

  return (
    <form action={formAction} className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-md)' }}>
      <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Registrar Pago o Vencimiento</h2>
      
      <input type="hidden" name="caseId" value={caseId} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div>
          <label className="input-label" htmlFor="monto">Monto ($) *</label>
          <input type="number" step="0.01" id="monto" name="monto" className="input-field" required />
        </div>
        
        <div>
          <label className="input-label" htmlFor="metodo">Medio de Pago</label>
          <input type="text" id="metodo" name="metodo" className="input-field" placeholder="Transferencia, Efectivo..." />
        </div>

        <div>
          <label className="input-label" htmlFor="fechaVenc">Fecha de Vencimiento</label>
          <input type="date" id="fechaVenc" name="fechaVenc" className="input-field" />
        </div>

        <div>
          <label className="input-label" htmlFor="fechaPago">Fecha de Pago (Dejar vacío si es deuda)</label>
          <input type="date" id="fechaPago" name="fechaPago" className="input-field" />
        </div>

        <div style={{ gridColumn: '1 / -1' }}>
          <label className="input-label" htmlFor="recibo">Nro. de Recibo / Comprobante</label>
          <input type="text" id="recibo" name="recibo" className="input-field" />
        </div>
        
        <div style={{ gridColumn: '1 / -1' }}>
          <label className="input-label" htmlFor="notas">Notas u Observaciones</label>
          <textarea 
            id="notas" 
            name="notas" 
            className="input-field" 
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
