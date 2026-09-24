'use server'

import { db } from '@/prisma/db'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { promises as fs } from 'fs'
import path from 'path'

async function saveFile(file: File | null): Promise<string | null> {
  if (!file || file.size === 0 || file.name === 'undefined') return null;
  const buffer = Buffer.from(await file.arrayBuffer());
  const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  const filename = `${uniquePrefix}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
  const dir = path.join(process.cwd(), 'public', 'uploads');
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, filename), buffer);
  return `/api/archivos/${filename}`;
}

export async function createExpense(prevState: any, formData: FormData) {
  const caseId = formData.get('caseId') as string
  const concepto = formData.get('concepto') as string
  const montos = formData.getAll('monto')
  const fechas = formData.getAll('fecha')
  const comprobantes = formData.getAll('comprobante')
  const notasList = formData.getAll('notas')
  const archivos = formData.getAll('archivo') as File[]

  if (!caseId || !concepto || montos.length === 0) {
    return { error: 'El caso, concepto y al menos un monto son obligatorios.' }
  }

  try {
    for (let i = 0; i < montos.length; i++) {
      const monto = parseFloat(montos[i] as string)
      if (isNaN(monto)) continue

      let archivoUrl = null;
      const file = archivos[i];
      if (file && typeof file === 'object' && file.size > 0) {
        archivoUrl = await saveFile(file);
      }

      await db.orm.public.Expense.create({
        caseId,
        concepto,
        monto,
        fecha: (fechas[i] as string) || null,
        comprobante: (comprobantes[i] as string) || null,
        notas: (notasList[i] as string) || null,
        archivoUrl
      })
    }
  } catch (error) {
    console.error('Error creating expense:', error)
    return { error: 'Ocurrió un error al registrar el gasto.' }
  }

  revalidatePath(`/dashboard/casos/${caseId}`)
  redirect(`/dashboard/casos/${caseId}`)
}

export async function updateExpense(id: string, prevState: any, formData: FormData) {
  const concepto = formData.get('concepto') as string
  const monto = parseFloat(formData.get('monto') as string)
  const fecha = formData.get('fecha') as string
  const comprobante = formData.get('comprobante') as string
  const notas = formData.get('notas') as string
  const archivo = formData.get('archivo') as File | null

  if (!concepto || isNaN(monto)) {
    return { error: 'El concepto y monto son obligatorios.' }
  }

  try {
    const updateData: any = {
      concepto,
      monto,
      fecha: fecha || null,
      comprobante: comprobante || null,
      notas: notas || null
    }

    if (archivo && typeof archivo === 'object' && archivo.size > 0) {
      const archivoUrl = await saveFile(archivo)
      if (archivoUrl) {
        updateData.archivoUrl = archivoUrl
      }
    }

    const expense = await db.orm.public.Expense.where({ id }).update(updateData)
    
    revalidatePath(`/dashboard/casos/${expense?.caseId}`)
    return { success: 'Gasto actualizado correctamente.', caseId: expense?.caseId }
  } catch (error) {
    console.error('Error updating expense:', error)
    return { error: 'Ocurrió un error al actualizar el gasto.' }
  }
}

export async function deleteExpense(id: string) {
  try {
    const expense = await db.orm.public.Expense.where({ id }).delete()
    revalidatePath(`/dashboard/casos/${expense?.caseId}`)
    redirect(`/dashboard/casos/${expense?.caseId}`)
  } catch (error: any) {
    if (error.message === 'NEXT_REDIRECT') throw error
    console.error('Error deleting expense:', error)
    return { error: 'Ocurrió un error al eliminar el gasto.' }
  }
}
