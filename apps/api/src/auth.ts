import { betterAuth } from 'better-auth'
import { prismaAdapter } from '@better-auth/prisma-adapter'
import { prisma } from '@av-portal/db'

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: 'postgresql',
    }),
    emailAndPassword: {
        enabled: true,
    },
    user: {
        additionalFields: {
            role: {
                type: 'string',
                defaultValue: 'client',
            },
            tenantId: {
                type: 'string',
                required: false,
            },
        },
    },
    secret: process.env.AUTH_SECRET!,
    baseURL: process.env.API_URL ?? 'http://localhost:3001',
    trustedOrigins: [
        'http://localhost:3000',
        'https://av-portal.vercel.app',
        'https://av-portal-alecpullen1s-projects.vercel.app',
        'https://av-portal-git-main-alecpullen1s-projects.vercel.app',
        ...(process.env.PORTAL_URL ? [process.env.PORTAL_URL] : []),
        ...(process.env.RAILWAY_PUBLIC_DOMAIN ? [`https://${process.env.RAILWAY_PUBLIC_DOMAIN}`] : []),
    ],
    advanced: {
    crossSubdomainCookies: {
      enabled: false,
    },
    defaultCookieAttributes: {
      sameSite: 'none',
      secure: true,
      partitioned: true,
    },
  },
})

export type Auth = typeof auth