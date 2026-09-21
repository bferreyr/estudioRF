'use server'

import { db } from '@/prisma/db'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { or } from '@prisma/orm-postgres/orm-client'

const PAGE_SIZE = 10

export async function getMaterias(query = '', page = 1) {
  const skip = (page - 1) * PAGE_SIZE
  
  const baseQuery = db.orm.public.Materia.where((m) => {
    if (query) {
      return or(
        m.nombre.ilike(`%${query}%`),
        m.descripcion.ilike(`%${query}%`)
      )
    }
    return m.id.isNotNull()
  })

  const [materias, totalAgg] = await Promise.all([
    baseQuery
      .orderBy((m) => m.nombre.asc())
      .limit(PAGE_SIZE)
      .offset(skip)
      .all(),
    baseQuery.aggregate((m) => ({ count: m.count() }))
  ])

  return {
    materias,
    totalPages: Math.ceil(totalAgg.count / PAGE_SIZE),
    totalCount: totalAgg.count
  }
}

export async function createMateria(prevState: any, formData: FormData) {
  const nombre = formData.get('nombre') as string
  const descripcion = formData.get('descripcion') as string

  if (!nombre) {
    return { error: 'El nombre es obligatorio.' }
  }

  let newId = ''

  try {
    const materia = await db.orm.public.Materia.create({
      nombre,
      descripcion: descripcion || null
    })
    newId = materia.id
  } catch (error: any) {
    console.error('Error creating materia:', error)
    if (error?.code === 'P2002' || error?.message?.includes('Unique constraint failed')) {
        return { error: 'Ya existe una materia con este nombre.' }
    }
    return { error: 'Ocurrió un error al crear la materia.' }
  }

  revalidatePath('/dashboard/materias')
  redirect(`/dashboard/materias/${newId}`)
}

export async function updateMateria(id: string, prevState: any, formData: FormData) {
  const nombre = formData.get('nombre') as string
  const descripcion = formData.get('descripcion') as string

  if (!nombre) {
    return { error: 'El nombre es obligatorio.' }
  }

  try {
    await db.orm.public.Materia.where({ id }).update({
      nombre,
      descripcion: descripcion || null
    })
  } catch (error: any) {
    console.error('Error updating materia:', error)
    if (error?.code === 'P2002' || error?.message?.includes('Unique constraint failed')) {
        return { error: 'Ya existe una materia con este nombre.' }
    }
    return { error: 'Ocurrió un error al actualizar la materia.' }
  }

  revalidatePath('/dashboard/materias')
  revalidatePath(`/dashboard/materias/${id}`)
  return { success: 'Materia actualizada correctamente.' }
}

export async function deleteMateria(id: string) {
  try {
    await db.orm.public.Materia.where({ id }).delete()
    revalidatePath('/dashboard/materias')
    redirect('/dashboard/materias')
  } catch (error: any) {
    if (error.message === 'NEXT_REDIRECT') throw error
    console.error('Error deleting materia:', error)
    return { error: 'Ocurrió un error al eliminar la materia.' }
  }
}
