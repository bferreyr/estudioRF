import { db } from './src/prisma/db'

async function main() {
  const expenses = await db.orm.public.Expense.orderBy(e => e.id.desc()).limit(5).all()
  console.log("Expenses:", expenses.map(e => ({ id: e.id, archivoUrl: e.archivoUrl })))
  
  const fees = await db.orm.public.Fee.orderBy(f => f.id.desc()).limit(5).all()
  console.log("Fees:", fees.map(f => ({ id: f.id, archivoUrl: f.archivoUrl })))
}

main().catch(console.error).finally(() => process.exit(0))
