'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'

type Fee = {
  id: string
  monto: number
  moneda?: string | null
  fechaVenc?: string | null
  fechaPago?: string | null
  metodo?: string | null
  recibo?: string | null
  notas?: string | null
}

type Expense = {
  id: string
  monto: number
  concepto: string
  fecha?: string | null
  comprobante?: string | null
  notas?: string | null
}

interface Props {
  fees: Fee[]
  expenses: Expense[]
}

export function MovimientosModal({ fees, expenses }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const hasItems = fees.length > 0 || expenses.length > 0

  return (
    <>
      <h4 
        style={{ fontSize: '1rem', cursor: 'pointer', textDecoration: 'underline', color: 'var(--text-main)', transition: 'color 0.2s' }}
        onClick={() => setIsOpen(true)}
        title="Ver todos los detalles"
        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent)'}
        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-main)'}
      >
        Movimientos Registrados 🔍
      </h4>

      {isOpen && mounted && createPortal(
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem',
          backdropFilter: 'blur(4px)'
        }} onClick={() => setIsOpen(false)}>
          <div style={{
            backgroundColor: 'var(--bg-card, #1e1e24)',
            padding: '2rem',
            borderRadius: 'var(--radius-lg, 12px)',
            width: '100%',
            maxWidth: '700px',
            maxHeight: '85vh',
            overflowY: 'auto',
            position: 'relative',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
          }} onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setIsOpen(false)}
              style={{
                position: 'absolute',
                top: '1.5rem',
                right: '1.5rem',
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                color: 'var(--text-main)',
                cursor: 'pointer',
                fontSize: '1.25rem',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            >
              ×
            </button>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 'bold', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
              Detalles de Movimientos
            </h3>

            {!hasItems ? (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>
                No hay movimientos registrados para este caso.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {fees.length > 0 && (
                  <div>
                    <h4 style={{ color: '#10b981', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }}></span>
                      Honorarios
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {fees.map(f => (
                        <div key={f.id} style={{ padding: '1rem', backgroundColor: 'rgba(16, 185, 129, 0.05)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                            <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
                              {f.moneda === 'Dólares' ? 'U$S ' : (f.moneda === 'JUS' ? '' : '$ ')}
                              {f.monto.toLocaleString()} {f.moneda === 'JUS' ? 'JUS' : ''}
                            </span>
                            <span style={{ padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', backgroundColor: f.fechaPago ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)', color: f.fechaPago ? '#34d399' : '#f59e0b', fontWeight: 600 }}>
                              {f.fechaPago ? 'PAGADO' : 'PENDIENTE'}
                            </span>
                          </div>
                          
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                            {f.fechaVenc && <div><strong>Vencimiento:</strong> {f.fechaVenc}</div>}
                            {f.fechaPago && <div><strong>Fecha de Pago:</strong> {f.fechaPago}</div>}
                            {f.metodo && <div><strong>Método:</strong> {f.metodo}</div>}
                            {f.recibo && <div><strong>Recibo:</strong> {f.recibo}</div>}
                          </div>
                          
                          {f.notas && (
                            <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: '0.9rem' }}>
                              <strong>Notas:</strong> <span style={{ color: 'var(--text-muted)' }}>{f.notas}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {expenses.length > 0 && (
                  <div>
                    <h4 style={{ color: '#60a5fa', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#60a5fa' }}></span>
                      Gastos
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {expenses.map(e => (
                        <div key={e.id} style={{ padding: '1rem', backgroundColor: 'rgba(59, 130, 246, 0.05)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                            <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
                              $ {e.monto.toLocaleString()}
                            </span>
                            <span style={{ fontWeight: 500, color: '#93c5fd' }}>
                              {e.concepto}
                            </span>
                          </div>
                          
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                            {e.fecha && <div><strong>Fecha:</strong> {e.fecha}</div>}
                            {e.comprobante && <div><strong>Comprobante:</strong> {e.comprobante}</div>}
                          </div>
                          
                          {e.notas && (
                            <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: '0.9rem' }}>
                              <strong>Notas:</strong> <span style={{ color: 'var(--text-muted)' }}>{e.notas}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
