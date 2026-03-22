import { httpBatchLink } from '@trpc/client'
import { trpc } from './trpc'
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient()

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: '/api/trpc',
    }),
  ],
})