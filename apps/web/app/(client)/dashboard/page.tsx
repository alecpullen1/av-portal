'use client'

import { useSession } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { trpc } from '@/lib/trpc'
import ClientPortalView from '@/components/ClientPortalView'

function statusStyle(status: string) {
  switch (status) {
    case 'approved':          return 'bg-green-50 text-green-700 border-green-200'
    case 'changes_requested': return 'bg-red-50 text-red-700 border-red-200'
    default:                  return 'bg-amber-50 text-amber-700 border-amber-200'
  }
}

function statusLabel(status: string) {
  switch (status) {
    case 'approved':          return 'Approved'
    case 'changes_requested': return 'Changes Requested'
    default:                  return 'Quote Pending'
  }
}

export default function DashboardPage() {
  const { data: session, isPending } = useSession()
  const router = useRouter()
  const { data: projects, isLoading } = trpc.projects.list.useQuery()
  const [viewMode, setViewMode] = useState<'functional' | 'client'>('functional')

  useEffect(() => {
    if (!isPending && !session) {
      router.push('/login')
    }
  }, [session, isPending, router])

  if (isPending || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-gray-400">Loading...</p>
      </div>
    )
  }

  const firstProject = projects?.[0]

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Top nav — always visible */}
      <nav className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <span className="font-semibold text-gray-900">AV Portal</span>

        <div className="flex items-center gap-4">
          {/* View toggle */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('functional')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                viewMode === 'functional'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              ⚙ Internal view
            </button>
            <button
              onClick={() => setViewMode('client')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                viewMode === 'client'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              👤 Client view
            </button>
          </div>

          <span className="text-sm text-gray-500">{session?.user?.email}</span>
        </div>
      </nav>

      {/* Client view */}
      {viewMode === 'client' && firstProject ? (
        <ClientPortalView
          project={firstProject}
          userName={session?.user?.name ?? 'there'}
        />
      ) : viewMode === 'client' && !firstProject ? (
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-sm text-gray-400">No events to preview client view</p>
        </div>
      ) : (

        /* Functional / internal view */
        <main className="max-w-4xl mx-auto px-6 py-10">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Welcome back{session?.user?.name ? `, ${session.user.name}` : ''}
          </h1>
          <p className="text-gray-500 text-sm mb-8">Your upcoming events</p>

          {projects && projects.length > 0 ? (
            <div className="space-y-3">
              {projects.map(project => {
                const latestQuote = project.quotes?.[0]
                return (
                  <div
                    key={project.id}
                    onClick={() =>
                      latestQuote &&
                      router.push(`/events/${project.id}/quote/${latestQuote.id}`)
                    }
                    className="bg-white border rounded-xl px-6 py-5 flex items-center justify-between hover:border-amber-300 transition-colors cursor-pointer"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{project.name}</p>
                      <p className="text-sm text-gray-400 mt-1">
                        {project.venue ?? 'Venue TBC'}
                        {project.eventDate
                          ? ` · ${new Date(project.eventDate).toLocaleDateString('en-AU', {
                              weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
                            })}`
                          : ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      {latestQuote && (
                        <span className="text-sm font-medium text-gray-700">
                          ${latestQuote.totalAmount.toLocaleString()}
                        </span>
                      )}
                      <button
                        onClick={e => {
                          e.stopPropagation()
                          router.push(`/events/${project.id}/files`)
                        }}
                        className="text-xs text-gray-400 hover:text-amber-600 transition-colors"
                      >
                        Files
                      </button>
                      <span className={`text-xs font-medium px-3 py-1 rounded-full border capitalize ${
                        latestQuote
                          ? statusStyle(latestQuote.status)
                          : 'bg-gray-50 text-gray-400 border-gray-200'
                      }`}>
                        {latestQuote ? statusLabel(latestQuote.status) : 'No quote yet'}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-12 text-center">
              <p className="text-gray-400 text-sm">No events yet</p>
            </div>
          )}
        </main>
      )}
    </div>
  )
}
