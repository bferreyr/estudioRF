'use server'

import { db } from '@/prisma/db'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

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

  if (!caseId || isNaN(monto)) {
    return { error: 'El caso y el monto son obligatorios.' }
  }

  try {
    await db.orm.public.Fee.create({
      caseId,
      monto,
      fechaVenc: fechaVenc || null,
      fechaPago: fechaPago || null,
      metodo: metodo || null,
      recibo: recibo || null,
      notas: notas || null
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

  if (isNaN(monto)) {
    return { error: 'El monto es obligatorio.' }
  }

  try {
    const fee = await db.orm.public.Fee.where({ id }).update({
      monto,
      fechaVenc: fechaVenc || null,
      fechaPago: fechaPago || null,
      metodo: metodo || null,
      recibo: recibo || null,
      notas: notas || null
    })
    
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
