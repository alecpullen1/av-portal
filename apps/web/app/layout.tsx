'use client'

import { useState } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { trpc, } from '@/lib/trpc'
import { trpcClient, queryClient } from '@/lib/trpc-client'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </trpc.Provider>
      </body>
    </html>
  )
}