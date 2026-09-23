import { db } from '@/prisma/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { CaseForm } from '../CaseForm'
import { markFeeAsPaid } from '@/app/actions/honorarios'

export default async function DetalleCasoPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const caseData = await db.orm.public.Case.include('client', c => c.select('nombre')).include('asociado', a => a.select('nombre')).include('materia', m => m.select('nombre')).include('juzgado', j => j.select('nombre')).include('fees').include('expenses').first({ id })
  const asociados = await db.orm.public.Asociado.orderBy((a) => a.nombre.asc()).all()
  const materias = await db.orm.public.Materia.orderBy((m) => m.nombre.asc()).all()
  const juzgados = await db.orm.public.Juzgado.orderBy((j) => j.nombre.asc()).all()

  const jusSetting = await db.orm.public.Setting.where({ key: 'JUS_QUOTE' }).first()
  const jusValue = jusSetting?.value ? parseFloat(jusSetting.value) : undefined

  if (!caseData) {
    notFound()
  }

  // Determine active currency
  let activeCurrency = '$'
  let honorariosPactados = 0
  
  if (caseData.honorariosJus) {
    activeCurrency = 'JUS'
    honorariosPactados = caseData.honorariosJus
  } else if (caseData.honorariosDolares) {
    activeCurrency = 'U$S'
    honorariosPactados = caseData.honorariosDolares
  } else if (caseData.honorariosTotales) {
    activeCurrency = '$'
    honorariosPactados = caseData.honorariosTotales
  }

  // Calculate totals
  const totalPagado = caseData.fees?.filter(f => f.fechaPago).reduce((acc, f) => acc + f.monto, 0) || 0
  const saldoPendiente = honorariosPactados - totalPagado
  const totalGastos = caseData.expenses?.reduce((acc, e) => acc + e.monto, 0) || 0

  return (
    <div className="animate-fade-in" style={{ padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <Link href="/dashboard/casos" style={{ color: 'var(--accent)', textDecoration: 'none', fontSize: '0.9rem', marginBottom: '1rem', display: 'inline-block' }}>
            ← Volver a Casos
          </Link>
          <h1 style={{ marginBottom: '0.5rem' }}>{caseData.caratula || 'Expediente Sin Carátula'}</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Cliente: <Link href={`/dashboard/clientes/${caseData.clientId}`} style={{ color: 'var(--accent)', textDecoration: 'none' }}>{caseData.client?.nombre}</Link> 
            {' • '} Exp: {caseData.nroExpediente || 'N/A'} 
            {' • '} Fuero: {caseData.materia?.nombre || 'N/A'}
            {caseData.asociado && <> {' • '} Asociado a: <strong>{caseData.asociado.nombre}</strong></>}
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
        {/* Formulario / Edición */}
        <div>
          <CaseForm caseData={caseData} actionType="update" clients={[]} asociados={asociados} materias={materias} juzgados={juzgados} jusValue={jusValue} />
        </div>

        {/* Panel lateral: Finanzas del Caso */}
        <div>
          <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Resumen Financiero</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Honorarios Pactados</span>
                <span style={{ fontWeight: 600 }}>
                  {activeCurrency === '$' || activeCurrency === 'U$S' ? activeCurrency : ''} {honorariosPactados.toLocaleString()} {activeCurrency === 'JUS' ? 'JUS' : ''}
                  {activeCurrency === 'JUS' && jusValue ? <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'right' }}>aprox. ${(honorariosPactados * jusValue).toLocaleString('es-AR')}</div> : null}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Total Pagado</span>
                <span style={{ fontWeight: 600, color: '#34d399' }}>
                  {activeCurrency === '$' || activeCurrency === 'U$S' ? activeCurrency : ''} {totalPagado.toLocaleString()} {activeCurrency === 'JUS' ? 'JUS' : ''}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.5rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Saldo Pendiente</span>
                <span style={{ fontWeight: 'bold', color: saldoPendiente > 0 ? '#f59e0b' : 'var(--text-main)' }}>
                  {activeCurrency === '$' || activeCurrency === 'U$S' ? activeCurrency : ''} {saldoPendiente.toLocaleString()} {activeCurrency === 'JUS' ? 'JUS' : ''}
                </span>
              </div>

              {/* Planes de Cuotas */}
              {honorariosPactados > 0 && (
                <div style={{ marginTop: '0.5rem', padding: '1rem', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-sm)' }}>
                  {caseData.cuotasPactadas ? (
                    <>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem', fontWeight: 600 }}>Plan de pago acordado ({caseData.cuotasPactadas} cuotas{caseData.interesCuotas ? ` con ${caseData.interesCuotas}% de interés` : ''}):</div>
                      <div style={{ padding: '0.75rem', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-sm)', textAlign: 'center', border: '1px solid var(--accent)' }}>
                        <div style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-main)' }}>
                          {activeCurrency === '$' || activeCurrency === 'U$S' ? activeCurrency : ''} {((honorariosPactados * (1 + (caseData.interesCuotas || 0) / 100)) / caseData.cuotasPactadas).toLocaleString(undefined, { maximumFractionDigits: 2 })} {activeCurrency === 'JUS' ? 'JUS' : ''} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>x {caseData.cuotasPactadas}</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem', fontWeight: 600 }}>Planes de pago sugeridos (s/ Honorario Pactado):</div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', textAlign: 'center' }}>
                        <div style={{ padding: '0.5rem', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-sm)' }}>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>3 MESES</div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                            {activeCurrency === '$' || activeCurrency === 'U$S' ? activeCurrency : ''} {(honorariosPactados / 3).toLocaleString(undefined, { maximumFractionDigits: 2 })} {activeCurrency === 'JUS' ? 'JUS' : ''}
                          </div>
                        </div>
                        <div style={{ padding: '0.5rem', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-sm)' }}>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>6 MESES</div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                            {activeCurrency === '$' || activeCurrency === 'U$S' ? activeCurrency : ''} {(honorariosPactados / 6).toLocaleString(undefined, { maximumFractionDigits: 2 })} {activeCurrency === 'JUS' ? 'JUS' : ''}
                          </div>
                        </div>
                        <div style={{ padding: '0.5rem', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-sm)' }}>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>12 MESES</div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                            {activeCurrency === '$' || activeCurrency === 'U$S' ? activeCurrency : ''} {(honorariosPactados / 12).toLocaleString(undefined, { maximumFractionDigits: 2 })} {activeCurrency === 'JUS' ? 'JUS' : ''}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Total Gastos Abonados</span>
                <span style={{ fontWeight: 600, color: '#60a5fa' }}>
                  $ {totalGastos.toLocaleString()}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h4 style={{ fontSize: '1rem' }}>Movimientos Registrados</h4>
              <Link href={`/dashboard/honorarios/nuevo?caseId=${caseData.id}`} className="btn btn-sm btn-primary">
                + Nuevo
              </Link>
            </div>
            
            {(caseData.fees?.length || 0) > 0 || (caseData.expenses?.length || 0) > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {caseData.fees?.map(f => (
                  <div key={f.id} style={{ padding: '0.75rem', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 600 }}>
                        {f.moneda === 'Dólares' ? 'U$S' : (f.moneda === 'JUS' ? '' : '$')}{f.monto.toLocaleString()} {f.moneda === 'JUS' ? 'JUS' : ''} <span style={{ fontSize: '0.7rem', color: '#10b981', padding: '0.1rem 0.3rem', borderRadius: '4px', backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>HONORARIOS</span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{f.fechaPago ? `Pagado: ${f.fechaPago}` : `Vence: ${f.fechaVenc}`}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      {f.fechaPago ? (
                        <span style={{ color: '#34d399', fontSize: '1.2rem' }} title="Pagado">✓</span>
                      ) : (
                        <>
                          <span style={{ color: '#f59e0b', fontSize: '0.75rem', padding: '0.1rem 0.4rem', border: '1px solid #f59e0b', borderRadius: '4px' }}>Pendiente</span>
                          <form action={async () => {
                            'use server'
                            await markFeeAsPaid(f.id)
                          }}>
                            <button type="submit" style={{ background: 'none', border: 'none', color: '#10b981', cursor: 'pointer', fontSize: '0.75rem', textDecoration: 'underline' }}>Pagar Hoy</button>
                          </form>
                        </>
                      )}
                      <Link href={`/dashboard/honorarios/editar/${f.id}`} style={{ color: 'var(--accent)', fontSize: '0.75rem', textDecoration: 'underline' }}>Editar</Link>
                    </div>
                  </div>
                ))}
                
                {caseData.expenses?.map(e => (
                  <div key={e.id} style={{ padding: '0.75rem', backgroundColor: 'rgba(59, 130, 246, 0.05)', borderRadius: 'var(--radius-sm)', borderLeft: '2px solid #60a5fa', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 600 }}>${e.monto.toLocaleString()} <span style={{ fontSize: '0.7rem', color: '#60a5fa', padding: '0.1rem 0.3rem', borderRadius: '4px', backgroundColor: 'rgba(96, 165, 250, 0.1)' }}>GASTO</span></div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{e.concepto} {e.fecha && `• ${e.fecha}`}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <Link href={`/dashboard/gastos/editar/${e.id}`} style={{ color: 'var(--accent)', fontSize: '0.75rem', textDecoration: 'underline' }}>Editar</Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '1rem 0' }}>
                No hay movimientos registrados.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
