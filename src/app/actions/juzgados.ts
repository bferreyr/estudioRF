'use server'

import { db } from '@/prisma/db'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { or } from '@prisma/orm-postgres/orm-client'

const PAGE_SIZE = 10

export async function getJuzgados(query = '', page = 1) {
  const skip = (page - 1) * PAGE_SIZE
  
  const baseQuery = db.orm.public.Juzgado.where((j) => {
    if (query) {
      return or(
        j.nombre.ilike(`%${query}%`),
        j.ubicacion.ilike(`%${query}%`)
      )
    }
    return j.id.isNotNull()
  })

  const [juzgados, totalAgg] = await Promise.all([
    baseQuery
      .orderBy((j) => j.nombre.asc())
      .limit(PAGE_SIZE)
      .offset(skip)
      .all(),
    baseQuery.aggregate((j) => ({ count: j.count() }))
  ])

  return {
    juzgados,
    totalPages: Math.ceil(totalAgg.count / PAGE_SIZE),
    totalCount: totalAgg.count
  }
}

export async function createJuzgado(prevState: any, formData: FormData) {
  const nombre = formData.get('nombre') as string
  const ubicacion = formData.get('ubicacion') as string

  if (!nombre) {
    return { error: 'El nombre es obligatorio.' }
  }

  let newId = ''

  try {
    const juzgado = await db.orm.public.Juzgado.create({
      nombre,
      ubicacion: ubicacion || null
    })
    newId = juzgado.id
  } catch (error: any) {
    console.error('Error creating juzgado:', error)
    if (error?.code === 'P2002' || error?.message?.includes('Unique constraint failed')) {
        return { error: 'Ya existe un juzgado con este nombre.' }
    }
    return { error: 'Ocurrió un error al crear el juzgado.' }
  }

  revalidatePath('/dashboard/juzgados')
  redirect(`/dashboard/juzgados/${newId}`)
}

export async function updateJuzgado(id: string, prevState: any, formData: FormData) {
  const nombre = formData.get('nombre') as string
  const ubicacion = formData.get('ubicacion') as string

  if (!nombre) {
    return { error: 'El nombre es obligatorio.' }
  }

  try {
    await db.orm.public.Juzgado.where({ id }).update({
      nombre,
      ubicacion: ubicacion || null
    })
  } catch (error: any) {
    console.error('Error updating juzgado:', error)
    if (error?.code === 'P2002' || error?.message?.includes('Unique constraint failed')) {
        return { error: 'Ya existe un juzgado con este nombre.' }
    }
    return { error: 'Ocurrió un error al actualizar el juzgado.' }
  }

  revalidatePath('/dashboard/juzgados')
  revalidatePath(`/dashboard/juzgados/${id}`)
  return { success: 'Juzgado actualizado correctamente.' }
}

export async function deleteJuzgado(id: string) {
  try {
    await db.orm.public.Juzgado.where({ id }).delete()
    revalidatePath('/dashboard/juzgados')
    redirect('/dashboard/juzgados')
  } catch (error: any) {
    if (error.message === 'NEXT_REDIRECT') throw error
    console.error('Error deleting juzgado:', error)
    return { error: 'Ocurrió un error al eliminar el juzgado.' }
  }
}
