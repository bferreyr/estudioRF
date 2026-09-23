'use server'

import { db } from '@/prisma/db'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { or, and } from '@prisma/orm-postgres/orm-client'

const PAGE_SIZE = 10

export async function getCases(query = '', page = 1, filterState = '', filterAsociadoId = '') {
  const skip = (page - 1) * PAGE_SIZE
  
  const baseQuery = db.orm.public.Case.where((c) => {
    let q: any = c.id.isNotNull()
    
    if (filterState) {
      q = and(q, c.estado.eq(filterState))
    }
    
    if (filterAsociadoId) {
      q = and(q, c.asociadoId.eq(filterAsociadoId))
    }
    
    if (query) {
      q = and(q, 
        or(
          c.caratula.ilike(`%${query}%`),
          c.nroExpediente.ilike(`%${query}%`)
        )
      )
    }
    return q
  })

  const [cases, totalAgg] = await Promise.all([
    baseQuery
      .include('client', client => client.select('nombre'))
      .include('asociado', a => a.select('nombre'))
      .include('materia', m => m.select('nombre'))
      .orderBy((c) => c.createdAt.desc())
      .limit(PAGE_SIZE)
      .offset(skip)
      .all(),
    baseQuery.aggregate((a) => ({ count: a.count() }))
  ])

  return {
    cases,
    totalPages: Math.ceil(totalAgg.count / PAGE_SIZE),
    totalCount: totalAgg.count
  }
}

export async function createCase(prevState: any, formData: FormData) {
  const clientId = formData.get('clientId') as string
  const caratula = formData.get('caratula') as string
  const materiaId = formData.get('materiaId') as string
  const estado = formData.get('estado') as string
  const juzgadoId = formData.get('juzgadoId') as string
  const nroExpediente = formData.get('nroExpediente') as string
  const contraparte = formData.get('contraparte') as string
  const descripcionCaso = formData.get('descripcionCaso') as string
  const asociadoId = formData.get('asociadoId') as string

  if (!clientId) {
    return { error: 'Debes seleccionar un cliente.' }
  }

  let newCaseId = ''

  try {
    const c = await db.orm.public.Case.create({
      clientId,
      caratula: caratula || null,
      materiaId: materiaId || null,
      estado: estado || 'Activo',
      juzgadoId: juzgadoId || null,
      nroExpediente: nroExpediente || null,
      contraparte: contraparte || null,
      descripcionCaso: descripcionCaso || null,
      asociadoId: asociadoId || null
    })
    newCaseId = c.id
  } catch (error) {
    console.error('Error creating case:', error)
    return { error: 'Ocurrió un error al crear el caso.' }
  }

  revalidatePath('/dashboard/casos')
  revalidatePath(`/dashboard/clientes/${clientId}`)
  redirect(`/dashboard/casos/${newCaseId}`)
}

export async function updateCase(id: string, prevState: any, formData: FormData) {
  const caratula = formData.get('caratula') as string
  const materiaId = formData.get('materiaId') as string
  const estado = formData.get('estado') as string
  const juzgadoId = formData.get('juzgadoId') as string
  const nroExpediente = formData.get('nroExpediente') as string
  const contraparte = formData.get('contraparte') as string
  const descripcionCaso = formData.get('descripcionCaso') as string
  const asociadoId = formData.get('asociadoId') as string
  const moroso = formData.get('moroso') === 'true'
  const honorariosTotales = formData.get('honorariosTotales') ? parseFloat(formData.get('honorariosTotales') as string) : null
  const honorariosDolares = formData.get('honorariosDolares') ? parseFloat(formData.get('honorariosDolares') as string) : null
  const honorariosJus = formData.get('honorariosJus') ? parseFloat(formData.get('honorariosJus') as string) : null
  const anticipo = formData.get('anticipo') ? parseFloat(formData.get('anticipo') as string) : null
  const cuotasPactadas = formData.get('cuotasPactadas') ? parseInt(formData.get('cuotasPactadas') as string) : null
  const interesCuotas = formData.get('interesCuotas') ? parseFloat(formData.get('interesCuotas') as string) : null

  try {
    await db.orm.public.Case.where({ id }).update({
      caratula: caratula || null,
      materiaId: materiaId || null,
      estado: estado || 'Activo',
      juzgadoId: juzgadoId || null,
      nroExpediente: nroExpediente || null,
      contraparte: contraparte || null,
      descripcionCaso: descripcionCaso || null,
      asociadoId: asociadoId || null,
      moroso,
      honorariosTotales,
      honorariosDolares,
      honorariosJus,
      anticipo,
      cuotasPactadas,
      interesCuotas
    })
  } catch (error) {
    console.error('Error updating case:', error)
    return { error: 'Ocurrió un error al actualizar el caso.' }
  }

  revalidatePath('/dashboard/casos')
  revalidatePath(`/dashboard/casos/${id}`)
  return { success: 'Caso actualizado correctamente.' }
}

export async function deleteCase(id: string) {
  try {
    await db.orm.public.Case.where({ id }).delete()
    revalidatePath('/dashboard/casos')
    redirect('/dashboard/casos')
  } catch (error: any) {
    if (error.message === 'NEXT_REDIRECT') throw error
    console.error('Error deleting case:', error)
    return { error: 'Ocurrió un error al eliminar el expediente.' }
  }
}
