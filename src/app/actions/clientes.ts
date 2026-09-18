'use server'

import { db } from '@/prisma/db'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { or, and } from '@prisma/orm-postgres/orm-client'

const PAGE_SIZE = 10

export async function getClients(query = '', page = 1) {
  const skip = (page - 1) * PAGE_SIZE
  
  const baseQuery = db.orm.public.Client.where((c) => {
    if (!query) return c.id.isNotNull() // dummy true condition
    
    // search in name or DNI
    return or(
      c.nombre.ilike(`%${query}%`),
      c.dni.ilike(`%${query}%`)
    )
  })

  const [clients, totalAgg] = await Promise.all([
    baseQuery
      .orderBy((c) => c.createdAt.desc())
      .limit(PAGE_SIZE)
      .offset(skip)
      .all(),
    baseQuery.aggregate((a) => ({ count: a.count() }))
  ])

  return {
    clients,
    totalPages: Math.ceil(totalAgg.count / PAGE_SIZE),
    totalCount: totalAgg.count
  }
}

export async function createClient(prevState: any, formData: FormData) {
  const nombre = formData.get('nombre') as string
  const dni = formData.get('dni') as string
  const telefono = formData.get('telefono') as string
  const telefonoAlt = formData.get('telefonoAlt') as string
  const email = formData.get('email') as string
  const ocupacion = formData.get('ocupacion') as string
  const fechaNacimiento = formData.get('fechaNacimiento') as string
  const estadoCivil = formData.get('estadoCivil') as string
  const direccion = formData.get('direccion') as string
  const localidad = formData.get('localidad') as string
  const observaciones = formData.get('observaciones') as string

  if (!nombre) {
    return { error: 'El nombre es obligatorio.' }
  }

  let newClientId = ''

  try {
    const client = await db.orm.public.Client.create({
      nombre,
      dni: dni || null,
      telefono: telefono || null,
      telefonoAlt: telefonoAlt || null,
      email: email || null,
      ocupacion: ocupacion || null,
      fechaNacimiento: fechaNacimiento || null,
      estadoCivil: estadoCivil || null,
      direccion: direccion || null,
      localidad: localidad || null,
      observaciones: observaciones || null
    })
    newClientId = client.id
  } catch (error) {
    console.error('Error creating client:', error)
    return { error: 'Ocurrió un error al guardar el cliente.' }
  }

  revalidatePath('/dashboard/clientes')
  redirect(`/dashboard/clientes/${newClientId}`)
}

export async function updateClient(id: string, prevState: any, formData: FormData) {
  const nombre = formData.get('nombre') as string
  const dni = formData.get('dni') as string
  const telefono = formData.get('telefono') as string
  const telefonoAlt = formData.get('telefonoAlt') as string
  const email = formData.get('email') as string
  const ocupacion = formData.get('ocupacion') as string
  const fechaNacimiento = formData.get('fechaNacimiento') as string
  const estadoCivil = formData.get('estadoCivil') as string
  const direccion = formData.get('direccion') as string
  const localidad = formData.get('localidad') as string
  const observaciones = formData.get('observaciones') as string

  if (!nombre) {
    return { error: 'El nombre es obligatorio.' }
  }

  try {
    await db.orm.public.Client.where({ id }).update({
      nombre,
      dni: dni || null,
      telefono: telefono || null,
      telefonoAlt: telefonoAlt || null,
      email: email || null,
      ocupacion: ocupacion || null,
      fechaNacimiento: fechaNacimiento || null,
      estadoCivil: estadoCivil || null,
      direccion: direccion || null,
      localidad: localidad || null,
      observaciones: observaciones || null
    })
  } catch (error) {
    console.error('Error updating client:', error)
    return { error: 'Ocurrió un error al actualizar el cliente.' }
  }

  revalidatePath('/dashboard/clientes')
  revalidatePath(`/dashboard/clientes/${id}`)
  return { success: 'Cliente actualizado correctamente.' }
}

export async function deleteClient(id: string) {
  try {
    await db.orm.public.Client.where({ id }).delete()
    revalidatePath('/dashboard/clientes')
    redirect('/dashboard/clientes')
  } catch (error: any) {
    if (error.message === 'NEXT_REDIRECT') throw error
    console.error('Error deleting client:', error)
    return { error: 'Ocurrió un error al eliminar el cliente.' }
  }
}
