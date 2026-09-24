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
            maxWidth: '1000px',
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
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '120px 100px 100px 100px 1fr 100px', gap: '1rem', padding: '0 1rem', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold', textTransform: 'uppercase' }}>
                        <span>Monto</span>
                        <span>Fecha</span>
                        <span>Método</span>
                        <span>Recibo</span>
                        <span>Notas</span>
                        <span style={{ textAlign: 'center' }}>Estado</span>
                      </div>
                      {fees.map(f => (
                        <div key={f.id} style={{ display: 'grid', gridTemplateColumns: '120px 100px 100px 100px 1fr 100px', alignItems: 'center', gap: '1rem', padding: '0.5rem 1rem', backgroundColor: 'rgba(16, 185, 129, 0.05)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(16, 185, 129, 0.2)', fontSize: '0.85rem' }}>
                          <span style={{ fontWeight: 'bold' }}>
                            {f.moneda === 'Dólares' ? 'U$S ' : (f.moneda === 'JUS' ? '' : '$ ')}
                            {f.monto.toLocaleString()} {f.moneda === 'JUS' ? 'JUS' : ''}
                          </span>
                          <span style={{ color: 'var(--text-muted)' }}>{f.fechaPago ? f.fechaPago : (f.fechaVenc || '-')}</span>
                          <span style={{ color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{f.metodo || '-'}</span>
                          <span style={{ color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{f.recibo || '-'}</span>
                          <span style={{ color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={f.notas || ''}>{f.notas || '-'}</span>
                          <span style={{ padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', textAlign: 'center', backgroundColor: f.fechaPago ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)', color: f.fechaPago ? '#34d399' : '#f59e0b', fontWeight: 600 }}>
                            {f.fechaPago ? 'PAGADO' : 'PENDIENTE'}
                          </span>
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
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '120px 200px 100px 100px 1fr', gap: '1rem', padding: '0 1rem', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold', textTransform: 'uppercase' }}>
                        <span>Monto</span>
                        <span>Concepto</span>
                        <span>Fecha</span>
                        <span>Comprobante</span>
                        <span>Notas</span>
                      </div>
                      {expenses.map(e => (
                        <div key={e.id} style={{ display: 'grid', gridTemplateColumns: '120px 200px 100px 100px 1fr', alignItems: 'center', gap: '1rem', padding: '0.5rem 1rem', backgroundColor: 'rgba(59, 130, 246, 0.05)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(59, 130, 246, 0.2)', fontSize: '0.85rem' }}>
                          <span style={{ fontWeight: 'bold' }}>
                            $ {e.monto.toLocaleString()}
                          </span>
                          <span style={{ fontWeight: 500, color: '#93c5fd', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={e.concepto}>
                            {e.concepto}
                          </span>
                          <span style={{ color: 'var(--text-muted)' }}>{e.fecha || '-'}</span>
                          <span style={{ color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.comprobante || '-'}</span>
                          <span style={{ color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={e.notas || ''}>{e.notas || '-'}</span>
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
