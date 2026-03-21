import { router, publicProcedure } from '../trpc'
import { prisma } from '@av-portal/db'
import { z } from 'zod'
import { sendEmail } from '../email/send'
import { quoteApprovedEmail } from '../email/templates'

const PORTAL_URL = process.env.PORTAL_URL ?? 'http://localhost:3000'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'admin@av-portal.com.au'

export const quotesRouter = router({
  forProject: publicProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ input }) => {
      return prisma.quote.findMany({
        where: { projectId: input.projectId },
        orderBy: { version: 'desc' },
      })
    }),

  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return prisma.quote.findUnique({
        where: { id: input.id },
        include: { project: true },
      })
    }),

  approve: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const quote = await prisma.quote.update({
        where: { id: input.id },
        data: { status: 'approved', approvedAt: new Date() },
        include: { project: true },
      })

      // Notify the AV company admin
      const template = quoteApprovedEmail({
        adminName:   'Admin',
        clientName:  'Client',
        eventName:   quote.project.name,
        totalAmount: quote.totalAmount,
        approvedAt:  quote.approvedAt!,
      })

      await sendEmail({
        to:      ADMIN_EMAIL,
        subject: template.subject,
        html:    template.html,
      })

      return quote
    }),

  requestChanges: publicProcedure
    .input(z.object({ id: z.string(), comment: z.string() }))
    .mutation(async ({ input }) => {
      return prisma.quote.update({
        where: { id: input.id },
        data: { status: 'changes_requested' },
      })
    }),
})