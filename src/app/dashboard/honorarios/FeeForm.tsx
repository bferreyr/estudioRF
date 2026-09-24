'use client'

import { useActionState, useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createFee, updateFee, deleteFee } from '@/app/actions/honorarios'
import { createExpense, updateExpense, deleteExpense } from '@/app/actions/gastos'

type Fee = {
  id?: string
  caseId: string
  monto: number
  fechaVenc?: string | null
  fechaPago?: string | null
  metodo?: string | null
  recibo?: string | null
  notas?: string | null
  moneda?: string | null
  archivoUrl?: string | null
}

type Expense = {
  id?: string
  caseId: string
  concepto: string
  monto: number
  fecha?: string | null
  comprobante?: string | null
  notas?: string | null
  archivoUrl?: string | null
}

function FileInput({ id, name, label, existingUrl }: { id: string, name: string, label: string, existingUrl?: string | null }) {
  const [fileName, setFileName] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleClear = (e: any) => {
    e.preventDefault()
    e.stopPropagation()
    setFileName(null)
    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  return (
    <div>
      <label className="input-label" htmlFor={id}>{label}</label>
      <div style={{ position: 'relative' }}>
        <input 
          ref={inputRef}
          type="file" 
          id={id} 
          name={name} 
          className="input-field" 
          accept="image/*,application/pdf"
          style={{ 
            opacity: 0, 
            position: 'absolute', 
            top: 0, left: 0, width: '100%', height: '100%', 
            cursor: 'pointer',
            zIndex: 2
          }} 
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              setFileName(e.target.files[0].name)
            } else {
              setFileName(null)
            }
          }}
        />
        <div 
          className="input-field" 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            backgroundColor: fileName ? 'rgba(59, 130, 246, 0.1)' : undefined,
            borderColor: fileName ? 'var(--accent)' : undefined,
            color: fileName ? 'var(--text-main)' : 'var(--text-muted)',
            minWidth: 0
          }}
        >
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0, flex: 1, paddingRight: '0.5rem' }}>
            {fileName ? fileName : 'Seleccionar archivo...'}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', position: 'relative', zIndex: 3, flexShrink: 0 }}>
            {fileName && (
              <button 
                type="button" 
                onClick={handleClear}
                style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '4px', color: '#ef4444', cursor: 'pointer', padding: '0.1rem 0.4rem', display: 'flex', alignItems: 'center', fontSize: '0.75rem', fontWeight: 'bold' }}
                title="Quitar archivo"
              >
                ✕
              </button>
            )}
            <span style={{ fontSize: '1.1rem' }}>{fileName ? '📄' : '📎'}</span>
          </div>
        </div>
      </div>
      {existingUrl && !fileName && (
        <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', position: 'relative', zIndex: 3 }}>
          Archivo actual: <a href={existingUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>Ver archivo</a>
        </div>
      )}
    </div>
  )
}

export function FeeForm({ 
  initialData, 
  caseId, 
  actionType = 'create',
  isExpense = false
}: { 
  initialData?: Fee | Expense; 
  caseId: string; 
  actionType?: 'create' | 'update';
  isExpense?: boolean
}) {
  const router = useRouter()
  
  // State for toggling form type when creating
  const [type, setType] = useState<'honorario' | 'gasto'>(isExpense ? 'gasto' : 'honorario')
  
  const [expenseRows, setExpenseRows] = useState([1])
  const addExpenseRow = () => setExpenseRows([...expenseRows, Date.now()])
  const removeExpenseRow = (id: number) => setExpenseRows(expenseRows.filter(r => r !== id))

  // We bind the action based on the current type (or isExpense prop when updating)
  let boundAction: any;
  if (actionType === 'update') {
    if (isExpense) {
      boundAction = updateExpense.bind(null, initialData?.id!)
    } else {
      boundAction = updateFee.bind(null, initialData?.id!)
    }
  } else {
    if (type === 'gasto') {
      boundAction = createExpense
    } else {
      boundAction = createFee
    }
  }

  const [state, formAction, isPending] = useActionState(boundAction as any, null as any)

  // Redirect on success if editing
  useEffect(() => {
    if (state?.success && state?.caseId && actionType === 'update') {
      router.push(`/dashboard/casos/${state.caseId}`)
    }
  }, [state, actionType, router])

  const handleDelete = async () => {
    if (confirm('¿Estás seguro de eliminar este registro?')) {
      if (isExpense) {
        await deleteExpense(initialData?.id!)
      } else {
        await deleteFee(initialData?.id!)
      }
    }
  }

  const dataAsFee = type === 'honorario' ? (initialData as Fee) : undefined
  const dataAsExpense = type === 'gasto' ? (initialData as Expense) : undefined

  return (
    <form action={formAction} className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-md)' }} encType="multipart/form-data">
      <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>
        {actionType === 'create' 
          ? 'Registrar Movimiento' 
          : (isExpense ? 'Editar Gasto' : 'Editar Honorario')}
      </h2>
      
      <input type="hidden" name="caseId" value={caseId} />

      {actionType === 'create' && (
        <div style={{ marginBottom: '1.5rem' }}>
          <label className="input-label">Tipo de Registro</label>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input 
                type="radio" 
                name="tipoRegistro" 
                value="honorario" 
                checked={type === 'honorario'} 
                onChange={() => setType('honorario')}
                style={{ cursor: 'pointer' }}
              />
              Pago de Honorarios
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input 
                type="radio" 
                name="tipoRegistro" 
                value="gasto" 
                checked={type === 'gasto'} 
                onChange={() => setType('gasto')}
                style={{ cursor: 'pointer' }}
              />
              Gasto
            </label>
          </div>
        </div>
      )}

      {type === 'gasto' && (
        <div style={{ marginBottom: '1.5rem' }}>
          <label className="input-label" htmlFor="concepto">Concepto del Gasto *</label>
          <select id="concepto" name="concepto" className="input-field" defaultValue={dataAsExpense?.concepto || ''} required>
            <option value="" disabled>Seleccione el concepto...</option>
            <option value="GASTOS DE INICIACION">GASTOS DE INICIACION</option>
            <option value="APORTES - CAJA FORENSE">APORTES - CAJA FORENSE</option>
            <option value="APORTES - CAJA DE SEGURIDAD SOCIAL">APORTES - CAJA DE SEGURIDAD SOCIAL</option>
            <option value="Otros">Otros</option>
          </select>
        </div>
      )}

      {type === 'gasto' && actionType === 'create' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
          {expenseRows.map((rowId, index) => (
            <div key={rowId} style={{ display: 'grid', gridTemplateColumns: '100px 140px 1.2fr 1.8fr auto', gap: '1rem', alignItems: 'end', padding: '1rem', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div>
                <label className="input-label" htmlFor={`monto-${index}`}>Monto *</label>
                <input type="number" step="0.01" id={`monto-${index}`} name="monto" className="input-field" required />
              </div>
              <div>
                <label className="input-label" htmlFor={`fecha-${index}`}>Fecha</label>
                <input type="date" id={`fecha-${index}`} name="fecha" className="input-field" />
              </div>
              <div>
                <label className="input-label" htmlFor={`notas-${index}`}>Breve nombre (Notas)</label>
                <input type="text" id={`notas-${index}`} name="notas" className="input-field" placeholder="Ej. Tasa de justicia" />
              </div>
              <FileInput id={`archivo-${index}`} name="archivo" label="Adjunto (Opcional)" />
              <input type="hidden" name="comprobante" value="" />
              {expenseRows.length > 1 && (
                <button type="button" className="btn btn-outline" style={{ padding: '0.65rem 1rem', color: '#ef4444', borderColor: '#ef4444' }} onClick={() => removeExpenseRow(rowId)}>
                  X
                </button>
              )}
            </div>
          ))}
          <button type="button" className="btn btn-outline btn-sm" style={{ alignSelf: 'flex-start', marginTop: '0.5rem' }} onClick={addExpenseRow}>
            + Agregar otro pago
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          {type === 'honorario' && (
            <div>
              <label className="input-label" htmlFor="moneda">Moneda / Denominación</label>
              <select id="moneda" name="moneda" className="input-field" defaultValue={dataAsFee?.moneda || 'Pesos'}>
                <option value="Pesos">Pesos ($)</option>
                <option value="Dólares">Dólares (U$S)</option>
                <option value="JUS">JUS</option>
              </select>
            </div>
          )}
          
          <div>
            <label className="input-label" htmlFor="monto">Monto *</label>
            <input type="number" step="0.01" id="monto" name="monto" className="input-field" defaultValue={initialData?.monto || ''} required />
          </div>
          
          {type === 'honorario' && (
            <div>
              <label className="input-label" htmlFor="metodo">Medio de Pago</label>
              <input type="text" id="metodo" name="metodo" className="input-field" defaultValue={dataAsFee?.metodo || ''} placeholder="Transferencia, Efectivo..." />
            </div>
          )}

          {type === 'honorario' && (
            <div>
              <label className="input-label" htmlFor="fechaVenc">Fecha de Vencimiento</label>
              <input type="date" id="fechaVenc" name="fechaVenc" className="input-field" defaultValue={dataAsFee?.fechaVenc || ''} />
            </div>
          )}

          {type === 'honorario' ? (
            <div>
              <label className="input-label" htmlFor="fechaPago">Fecha de Pago (Dejar vacío si es deuda)</label>
              <input type="date" id="fechaPago" name="fechaPago" className="input-field" defaultValue={dataAsFee?.fechaPago || ''} />
            </div>
          ) : (
            <div>
              <label className="input-label" htmlFor="fecha">Fecha del Gasto</label>
              <input type="date" id="fecha" name="fecha" className="input-field" defaultValue={dataAsExpense?.fecha || ''} />
            </div>
          )}

          {type === 'honorario' ? (
            <div style={{ gridColumn: '1 / -1' }}>
              <label className="input-label" htmlFor="recibo">Nro. de Recibo / Comprobante</label>
              <input type="text" id="recibo" name="recibo" className="input-field" defaultValue={dataAsFee?.recibo || ''} />
            </div>
          ) : (
            <div style={{ gridColumn: '1 / -1' }}>
              <label className="input-label" htmlFor="comprobante">Nro. de Comprobante / Ticket</label>
              <input type="text" id="comprobante" name="comprobante" className="input-field" defaultValue={dataAsExpense?.comprobante || ''} />
            </div>
          )}
          
          <div style={{ gridColumn: '1 / -1' }}>
            <FileInput id="archivo" name="archivo" label="Archivo Adjunto (Opcional)" existingUrl={initialData?.archivoUrl} />
          </div>
          
          <div style={{ gridColumn: '1 / -1' }}>
            <label className="input-label" htmlFor="notas">Notas u Observaciones</label>
            <textarea 
              id="notas" 
              name="notas" 
              className="input-field" 
              defaultValue={initialData?.notas || ''}
              rows={3}
              style={{ resize: 'vertical' }}
            ></textarea>
          </div>
        </div>
      )}

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
        {actionType === 'update' && initialData?.id && (
          <button 
            type="button" 
            className="btn btn-outline" 
            style={{ color: '#ef4444', borderColor: '#ef4444', marginRight: 'auto' }}
            onClick={handleDelete}
          >
            Eliminar
          </button>
        )}
        <Link href={`/dashboard/casos/${caseId}`} className="btn btn-outline">
          Cancelar
        </Link>
        <button type="submit" className="btn btn-primary" disabled={isPending}>
          {isPending ? 'Guardando...' : (type === 'gasto' ? 'Guardar Gasto' : 'Guardar Honorario')}
        </button>
      </div>
    </form>
  )
}
