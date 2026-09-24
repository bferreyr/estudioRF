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

export async function getFees(page = 1) {
  const PAGE_SIZE = 20
  const skip = (page - 1) * PAGE_SIZE

  const [fees, totalAgg] = await Promise.all([
    db.orm.public.Fee
      .include('case', c => c.select('caratula', 'nroExpediente').include('client', cl => cl.select('nombre')))
      .orderBy((f) => f.fechaVenc.desc())
      .limit(PAGE_SIZE)
      .offset(skip)
      .all(),
    db.orm.public.Fee.aggregate((a) => ({ count: a.count() }))
  ])

  // Get total stats (using lossless sum over float columns returns number | null in Prisma 8)
  const statsAgg = await db.orm.public.Fee.aggregate((a) => ({
    totalPactado: a.sum('monto')
  }))
  
  // Calculate paid total in DB by using where and aggregate
  const pagadosAgg = await db.orm.public.Fee.where(f => f.fechaPago.isNotNull()).aggregate((a) => ({
    totalPagado: a.sum('monto')
  }))

  return {
    fees,
    totalPages: Math.ceil(totalAgg.count / PAGE_SIZE),
    totalCount: totalAgg.count,
    stats: {
      totalPactado: statsAgg.totalPactado || 0,
      totalPagado: pagadosAgg.totalPagado || 0
    }
  }
}

export async function createFee(prevState: any, formData: FormData) {
  const caseId = formData.get('caseId') as string
  const monto = parseFloat(formData.get('monto') as string)
  const fechaVenc = formData.get('fechaVenc') as string
  const fechaPago = formData.get('fechaPago') as string
  const metodo = formData.get('metodo') as string
  const recibo = formData.get('recibo') as string
  const notas = formData.get('notas') as string
  const moneda = (formData.get('moneda') as string) || 'Pesos'
  const archivo = formData.get('archivo') as File | null

  if (!caseId || isNaN(monto)) {
    return { error: 'El caso y el monto son obligatorios.' }
  }

  try {
    let archivoUrl = null;
    if (archivo && typeof archivo === 'object' && archivo.size > 0) {
      archivoUrl = await saveFile(archivo);
    }

    await db.orm.public.Fee.create({
      caseId,
      monto,
      fechaVenc: fechaVenc || null,
      fechaPago: fechaPago || null,
      metodo: metodo || null,
      recibo: recibo || null,
      notas: notas || null,
      moneda,
      archivoUrl
    })
  } catch (error) {
    console.error('Error creating fee:', error)
    return { error: 'Ocurrió un error al registrar el honorario.' }
  }

  revalidatePath('/dashboard/honorarios')
  revalidatePath(`/dashboard/casos/${caseId}`)
  redirect(`/dashboard/casos/${caseId}`)
}

export async function updateFee(id: string, prevState: any, formData: FormData) {
  const monto = parseFloat(formData.get('monto') as string)
  const fechaVenc = formData.get('fechaVenc') as string
  const fechaPago = formData.get('fechaPago') as string
  const metodo = formData.get('metodo') as string
  const recibo = formData.get('recibo') as string
  const notas = formData.get('notas') as string
  const moneda = (formData.get('moneda') as string) || 'Pesos'
  const archivo = formData.get('archivo') as File | null

  if (isNaN(monto)) {
    return { error: 'El monto es obligatorio.' }
  }

  try {
    const updateData: any = {
      monto,
      fechaVenc: fechaVenc || null,
      fechaPago: fechaPago || null,
      metodo: metodo || null,
      recibo: recibo || null,
      notas: notas || null,
      moneda
    }

    if (archivo && typeof archivo === 'object' && archivo.size > 0) {
      const archivoUrl = await saveFile(archivo)
      if (archivoUrl) {
        updateData.archivoUrl = archivoUrl
      }
    }

    const fee = await db.orm.public.Fee.where({ id }).update(updateData)
    
    revalidatePath('/dashboard/honorarios')
    revalidatePath(`/dashboard/casos/${fee?.caseId}`)
    return { success: 'Honorario actualizado correctamente.', caseId: fee?.caseId }
  } catch (error) {
    console.error('Error updating fee:', error)
    return { error: 'Ocurrió un error al actualizar el honorario.' }
  }
}

export async function markFeeAsPaid(id: string) {
  try {
    const today = new Date().toISOString().split('T')[0]
    const fee = await db.orm.public.Fee.where({ id }).update({
      fechaPago: today
    })
    revalidatePath('/dashboard/honorarios')
    revalidatePath(`/dashboard/casos/${fee?.caseId}`)
  } catch (error) {
    console.error('Error marking fee as paid:', error)
  }
}

export async function deleteFee(id: string) {
  try {
    const fee = await db.orm.public.Fee.where({ id }).delete()
    revalidatePath('/dashboard/honorarios')
    revalidatePath(`/dashboard/casos/${fee?.caseId}`)
    redirect(`/dashboard/casos/${fee?.caseId}`)
  } catch (error: any) {
    if (error.message === 'NEXT_REDIRECT') throw error
    console.error('Error deleting fee:', error)
    return { error: 'Ocurrió un error al eliminar el honorario.' }
  }
}
