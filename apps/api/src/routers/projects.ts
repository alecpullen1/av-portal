import { router, publicProcedure } from '../trpc'
import { prisma } from '@av-portal/db'

export const projectsRouter = router({
  list: publicProcedure.query(async () => {
    return prisma.project.findMany({
      orderBy: { eventDate: 'asc' },
      include: {
        quotes: {
          orderBy: { version: 'desc' },
          take: 1,
        },
      },
    })
  }),
})