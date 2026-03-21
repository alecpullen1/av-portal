import { router, publicProcedure } from '../trpc'
import { prisma } from '@av-portal/db'
import { z } from 'zod'

export const filesRouter = router({
  // List files for a project
  forProject: publicProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ input }) => {
      return prisma.file.findMany({
        where: { projectId: input.projectId },
        orderBy: { createdAt: 'desc' },
      })
    }),

  // Delete a file
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const file = await prisma.file.findUnique({ where: { id: input.id } })
      if (!file) throw new Error('File not found')
      return prisma.file.delete({ where: { id: input.id } })
    }),
})