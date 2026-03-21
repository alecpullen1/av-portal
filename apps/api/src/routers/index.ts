import { router } from '../trpc'
import { projectsRouter } from './projects'
import { quotesRouter } from './quotes'
import { filesRouter } from './files'

export const appRouter = router({
  projects: projectsRouter,
  quotes: quotesRouter,
  files: filesRouter,
})

export type AppRouter = typeof appRouter