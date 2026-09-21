'use client'

import { useState } from 'react'
import { updateJusQuote } from './actions'

interface JusWidgetProps {
  initialValue: string | null
  updatedAt: string | null
}

export function JusWidget({ initialValue, updatedAt }: JusWidgetProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState(initialValue || '')
  const [isLoading, setIsLoading] = useState(false)

  const handleSave = async () => {
    if (!value.trim()) return
    setIsLoading(true)
    const result = await updateJusQuote(value.trim())
    if (result.success) {
      setIsEditing(false)
    } else {
      alert(result.error)
    }
    setIsLoading(false)
  }

  const formattedDate = updatedAt 
    ? new Date(updatedAt).toLocaleDateString('es-AR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    : 'Nunca'

  return (
    <div className="stat-card glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="stat-label">Cotización JUS</div>
        <div className="stat-icon" style={{ color: '#ec4899', backgroundColor: '#fdf2f8', width: '2rem', height: '2rem', fontSize: '1rem' }}>⚖️</div>
      </div>
      
      {isEditing ? (
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Monto"
            className="input-field"
            style={{ width: '100%', padding: '0.25rem 0.5rem' }}
            disabled={isLoading}
            autoFocus
          />
          <button 
            onClick={handleSave}
            disabled={isLoading}
            style={{
              padding: '0.25rem 0.75rem',
              backgroundColor: 'var(--accent)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
          >
            {isLoading ? '...' : 'Ok'}
          </button>
          <button 
            onClick={() => { setIsEditing(false); setValue(initialValue || ''); }}
            disabled={isLoading}
            style={{
              padding: '0.25rem 0.75rem',
              backgroundColor: 'transparent',
              color: 'var(--text-muted)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer'
            }}
          >
            x
          </button>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <div className="stat-value" style={{ fontSize: '1.5rem' }}>
              ${initialValue ? Number(initialValue).toLocaleString('es-AR') : '---'}
            </div>
            <button 
              onClick={() => setIsEditing(true)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--accent)',
                cursor: 'pointer',
                fontSize: '0.8rem',
                textDecoration: 'underline'
              }}
            >
              Editar
            </button>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Actualizado: {formattedDate}
          </div>
        </>
      )}
    </div>
  )
}
