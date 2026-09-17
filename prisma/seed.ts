import { db } from '../src/prisma/db'
import bcrypt from 'bcrypt'

async function main() {
  const passwordHash = await bcrypt.hash('admin123', 10)
  
  const user = await db.orm.public.User.create({
    username: 'admin',
    passwordHash,
    name: 'Administrador',
  })
  
  console.log({ user })
}

main()
  .catch(async (e) => {
    console.error(e)
    process.exit(1)
  })
