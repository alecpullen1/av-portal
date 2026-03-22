import 'dotenv/config'
import { prisma } from '@av-portal/db'
import { auth } from '../src/auth'

async function main() {
  // Remove any existing admin user (sessions and accounts cascade-delete via schema)
  const existing = await prisma.user.findUnique({
    where: { email: 'admin@av-portal.com.au' },
  })

  if (existing) {
    await prisma.user.delete({ where: { email: 'admin@av-portal.com.au' } })
    console.log('Deleted existing admin user')
  }

  // Create a fresh user via better-auth so the password is hashed correctly
  const ctx = await auth.api.signUpEmail({
    body: {
      email: 'admin@av-portal.com.au',
      password: 'changeme123',
      name: 'Admin',
    },
  })

  // Promote to admin role
  await prisma.user.update({
    where: { email: 'admin@av-portal.com.au' },
    data: { role: 'admin' },
  })

  console.log('Admin user created successfully:', ctx.user.email)
  process.exit(0)
}

main().catch(err => {
  console.error('Failed to seed admin user:', err)
  process.exit(1)
})
