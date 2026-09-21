'use server'

import { db } from '@/prisma/db'
import { revalidatePath } from 'next/cache'

export async function updateJusQuote(value: string) {
  try {
    await db.orm.public.Setting.upsert({
      create: {
        key: 'JUS_QUOTE',
        value
      },
      update: {
        value
      }
    })
    
    revalidatePath('/dashboard')
    return { success: true }
  } catch (error) {
    console.error('Error updating JUS quote:', error)
    return { success: false, error: 'Error al actualizar la cotización.' }
  }
}
