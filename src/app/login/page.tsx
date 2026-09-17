'use client'

import { useActionState, useEffect, useState } from 'react'
import { login } from '@/app/actions/auth'
import Image from 'next/image'
import './login.css'

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(login, null)
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="login-container">
      <div className="login-bg-pattern"></div>
      
      <div className="login-card glass-panel animate-fade-in">
        <div className="login-header">
          <div className="logo-placeholder">RF</div>
          <h1>Ramírez Ferrero</h1>
          <p className="subtitle">Estudio Jurídico</p>
        </div>
        
        <form action={formAction} className="login-form">
          <div className="input-group">
            <label htmlFor="username" className="input-label">Usuario</label>
            <input 
              type="text" 
              id="username" 
              name="username" 
              className="input-field" 
              placeholder="admin"
              required 
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="password" className="input-label">Contraseña</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              className="input-field" 
              placeholder="••••••••"
              required 
            />
          </div>

          {state?.error && (
            <div className="error-message">
              {state.error}
            </div>
          )}
          
          <button type="submit" className="btn btn-primary w-full mt-4" disabled={isPending}>
            {isPending ? 'Ingresando...' : 'Ingresar al sistema'}
          </button>
        </form>
        
        <div className="login-footer">
          <p>Sistema de Gestión Exclusivo</p>
        </div>
      </div>
    </div>
  )
}
