'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { encrypt } from '@/lib/session'
import { db } from '@/prisma/db'
import bcrypt from 'bcrypt'

export async function login(formData: FormData) {
  const username = formData.get('username') as string
  const password = formData.get('password') as string

  if (!username || !password) {
    return { error: 'Por favor, completá todos los campos.' }
  }

  try {
    const user = await db.orm.public.User.where({ username }).first()
    
    if (!user) {
      return { error: 'Credenciales inválidas.' }
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash)

    if (!passwordMatch) {
      return { error: 'Credenciales inválidas.' }
    }

    // Create session
    const sessionData = {
      userId: user.id,
      username: user.username,
      name: user.name
    }
    
    const sessionToken = await encrypt(sessionData)
    const cookieStore = await cookies()
    
    cookieStore.set('session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
      path: '/',
    })
  } catch (error) {
    console.error('Login error:', error)
    return { error: 'Ocurrió un error en el servidor.' }
  }
  
  redirect('/dashboard')
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete('session')
  redirect('/login')
}
