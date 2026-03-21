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
    'https://av-portal-bi28sjtyv-alecpullen1s-projects.vercel.app/',
    ],
})

export type Auth = typeof auth