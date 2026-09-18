'use server'

import { db } from '@/prisma/db'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { or, and } from '@prisma/orm-postgres/orm-client'

const PAGE_SIZE = 10

export async function getCases(query = '', page = 1, filterState = '', filterEntidad = '') {
  const skip = (page - 1) * PAGE_SIZE
  
  const baseQuery = db.orm.public.Case.where((c) => {
    let q: any = c.id.isNotNull()
    
    if (filterState) {
      q = and(q, c.estado.eq(filterState))
    }
    
    if (filterEntidad) {
      q = and(q, c.entidadAsociada.ilike(`%${filterEntidad}%`))
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
  const materia = formData.get('materia') as string
  const estado = formData.get('estado') as string
  const tribunal = formData.get('tribunal') as string
  const nroExpediente = formData.get('nroExpediente') as string
  const contraparte = formData.get('contraparte') as string
  const descripcionCaso = formData.get('descripcionCaso') as string
  const entidadAsociada = formData.get('entidadAsociada') as string

  if (!clientId) {
    return { error: 'Debes seleccionar un cliente.' }
  }

  let newCaseId = ''

  try {
    const c = await db.orm.public.Case.create({
      clientId,
      caratula: caratula || null,
      materia: materia || null,
      estado: estado || 'Activo',
      tribunal: tribunal || null,
      nroExpediente: nroExpediente || null,
      contraparte: contraparte || null,
      descripcionCaso: descripcionCaso || null,
      entidadAsociada: entidadAsociada || null
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
  const materia = formData.get('materia') as string
  const estado = formData.get('estado') as string
  const tribunal = formData.get('tribunal') as string
  const nroExpediente = formData.get('nroExpediente') as string
  const contraparte = formData.get('contraparte') as string
  const descripcionCaso = formData.get('descripcionCaso') as string
  const entidadAsociada = formData.get('entidadAsociada') as string
  const moroso = formData.get('moroso') === 'true'
  const honorariosTotales = formData.get('honorariosTotales') ? parseFloat(formData.get('honorariosTotales') as string) : null
  const anticipo = formData.get('anticipo') ? parseFloat(formData.get('anticipo') as string) : null

  try {
    await db.orm.public.Case.where({ id }).update({
      caratula: caratula || null,
      materia: materia || null,
      estado: estado || 'Activo',
      tribunal: tribunal || null,
      nroExpediente: nroExpediente || null,
      contraparte: contraparte || null,
      descripcionCaso: descripcionCaso || null,
      entidadAsociada: entidadAsociada || null,
      moroso,
      honorariosTotales,
      anticipo
    })
  } catch (error) {
    console.error('Error updating case:', error)
    return { error: 'Ocurrió un error al actualizar el caso.' }
  }

  revalidatePath('/dashboard/casos')
  revalidatePath(`/dashboard/casos/${id}`)
  return { success: 'Caso actualizado correctamente.' }
}
