'use server'

import { db } from '@/prisma/db'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { or, and } from '@prisma/orm-postgres/orm-client'

const PAGE_SIZE = 10

export async function getAsociados(query = '', page = 1) {
  const skip = (page - 1) * PAGE_SIZE
  
  const baseQuery = db.orm.public.Asociado.where((a) => {
    if (query) {
      return or(
        a.nombre.ilike(`%${query}%`),
        a.tipo.ilike(`%${query}%`)
      )
    }
    return a.id.isNotNull()
  })

  const [asociados, totalAgg] = await Promise.all([
    baseQuery
      .orderBy((a) => a.nombre.asc())
      .limit(PAGE_SIZE)
      .offset(skip)
      .all(),
    baseQuery.aggregate((a) => ({ count: a.count() }))
  ])

  return {
    asociados,
    totalPages: Math.ceil(totalAgg.count / PAGE_SIZE),
    totalCount: totalAgg.count
  }
}

export async function createAsociado(prevState: any, formData: FormData) {
  const nombre = formData.get('nombre') as string
  const tipo = formData.get('tipo') as string
  const telefono = formData.get('telefono') as string
  const email = formData.get('email') as string

  if (!nombre) {
    return { error: 'El nombre es obligatorio.' }
  }

  let newId = ''

  try {
    const asociado = await db.orm.public.Asociado.create({
      nombre,
      tipo: tipo || null,
      telefono: telefono || null,
      email: email || null
    })
    newId = asociado.id
  } catch (error: any) {
    console.error('Error creating asociado:', error)
    if (error?.code === 'P2002' || error?.message?.includes('Unique constraint failed')) {
        return { error: 'Ya existe un asociado con este nombre.' }
    }
    return { error: 'Ocurrió un error al crear el asociado.' }
  }

  revalidatePath('/dashboard/asociados')
  redirect(`/dashboard/asociados/${newId}`)
}

export async function updateAsociado(id: string, prevState: any, formData: FormData) {
  const nombre = formData.get('nombre') as string
  const tipo = formData.get('tipo') as string
  const telefono = formData.get('telefono') as string
  const email = formData.get('email') as string

  if (!nombre) {
    return { error: 'El nombre es obligatorio.' }
  }

  try {
    await db.orm.public.Asociado.where({ id }).update({
      nombre,
      tipo: tipo || null,
      telefono: telefono || null,
      email: email || null
    })
  } catch (error: any) {
    console.error('Error updating asociado:', error)
    if (error?.code === 'P2002' || error?.message?.includes('Unique constraint failed')) {
        return { error: 'Ya existe un asociado con este nombre.' }
    }
    return { error: 'Ocurrió un error al actualizar el asociado.' }
  }

  revalidatePath('/dashboard/asociados')
  revalidatePath(`/dashboard/asociados/${id}`)
  return { success: 'Asociado actualizado correctamente.' }
}
