import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(__dirname, '../.env') })

import { prisma } from '@av-portal/db'
import { auth } from './auth'

async function main() {
  const ctx = await auth.api.signUpEmail({
    body: {
      email: 'admin@av-portal.com.au',
      password: 'changeme123',
      name: 'Admin',
    },
  })

  // Promote to admin role after creation
  await prisma.user.update({
    where: { email: 'admin@av-portal.com.au' },
    data: { role: 'admin' },
  })

  console.log('Admin created:', ctx.user)
  process.exit(0)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})