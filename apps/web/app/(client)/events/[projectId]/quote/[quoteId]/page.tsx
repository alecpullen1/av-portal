'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { trpc } from '@/lib/trpc'

type LineItem = {
  name: string
  category: string
  qty: number
  unit: number
  total: number
}

function categoryStyle(category: string) {
  switch (category) {
    case 'Audio':    return 'bg-green-50 text-green-700'
    case 'Lighting': return 'bg-amber-50 text-amber-700'
    case 'Video':    return 'bg-blue-50 text-blue-700'
    case 'Crew':     return 'bg-red-50 text-red-700'
    default:         return 'bg-gray-50 text-gray-600'
  }
}

export default function QuotePage() {
  const { projectId, quoteId } = useParams<{ projectId: string; quoteId: string }>()
  const router = useRouter()
  const [comment, setComment] = useState('')
  const [confirming, setConfirming] = useState(false)

  const { data: quote, isLoading, refetch } = trpc.quotes.byId.useQuery({ id: quoteId })
  const approve = trpc.quotes.approve.useMutation({ onSuccess: () => refetch() })
  const requestChanges = trpc.quotes.requestChanges.useMutation({ onSuccess: () => refetch() })

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-gray-400">Loading...</p>
      </div>
    )
  }

  if (!quote) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-gray-400">Quote not found</p>
      </div>
    )
  }

  const lineItems = quote.lineItems as LineItem[]
  const gst = quote.totalAmount * 0.1
  const subtotal = quote.totalAmount - gst
  const isApproved = quote.status === 'approved'
  const isChangesRequested = quote.status === 'changes_requested'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <nav className="bg-white border-b px-6 py-4 flex items-center gap-3">
        <button
          onClick={() => router.push('/dashboard')}
          className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          ← Back
        </button>
        <span className="text-gray-200">/</span>
        <span className="text-sm font-medium text-gray-900">
          {quote.project.name}
        </span>
        <span className="text-gray-200">/</span>
        <span className="text-sm text-gray-500">Quote v{quote.version}</span>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="bg-white border rounded-xl px-6 py-5 mb-6 flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-amber-600 uppercase tracking-widest mb-1">
              Quote · Version {quote.version}
            </p>
            <h1 className="text-xl font-semibold text-gray-900">{quote.project.name}</h1>
            <p className="text-sm text-gray-400 mt-1">
              {quote.project.venue}
              {quote.project.eventDate
                ? ` · ${new Date(quote.project.eventDate).toLocaleDateString('en-AU', {
                    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
                  })}`
                : ''}
            </p>
          </div>
          {isApproved && (
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-green-50 text-green-700 border border-green-200">
              ✓ Approved {quote.approvedAt
                ? new Date(quote.approvedAt).toLocaleDateString('en-AU')
                : ''}
            </span>
          )}
          {isChangesRequested && (
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-red-50 text-red-700 border border-red-200">
              Changes Requested
            </span>
          )}
        </div>

        {/* Line items */}
        <div className="bg-white border rounded-xl overflow-hidden mb-6">
          <div className="px-6 py-4 border-b">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
              Line Items
            </h2>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50 text-xs text-gray-400 uppercase tracking-wide">
              <tr>
                <th className="px-6 py-3 text-left font-medium">Item</th>
                <th className="px-6 py-3 text-left font-medium">Category</th>
                <th className="px-6 py-3 text-right font-medium">Qty</th>
                <th className="px-6 py-3 text-right font-medium">Unit</th>
                <th className="px-6 py-3 text-right font-medium">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {lineItems.map((item, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {item.name}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-medium px-2 py-1 rounded-md ${categoryStyle(item.category)}`}>
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 text-right">{item.qty}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 text-right">
                    ${item.unit.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 text-right">
                    ${item.total.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="border-t border-gray-100">
              <tr>
                <td colSpan={4} className="px-6 py-3 text-sm text-gray-400 text-right">Subtotal</td>
                <td className="px-6 py-3 text-sm text-gray-700 text-right font-medium">
                  ${subtotal.toLocaleString()}
                </td>
              </tr>
              <tr>
                <td colSpan={4} className="px-6 py-3 text-sm text-gray-400 text-right">GST (10%)</td>
                <td className="px-6 py-3 text-sm text-gray-400 text-right">
                  ${gst.toLocaleString()}
                </td>
              </tr>
              <tr className="bg-gray-50">
                <td colSpan={4} className="px-6 py-4 text-sm font-semibold text-gray-900 text-right">
                  Total (incl. GST)
                </td>
                <td className="px-6 py-4 text-sm font-bold text-amber-700 text-right">
                  ${quote.totalAmount.toLocaleString()}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Approval actions — only show if pending */}
        {!isApproved && !isChangesRequested && (
          <div className="bg-white border rounded-xl px-6 py-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">
              Ready to proceed?
            </h2>

            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Add a comment or note (optional)"
              rows={3}
              className="w-full border rounded-lg px-3 py-2 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400 mb-4 resize-none"
            />

            {confirming ? (
              <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-4 mb-4">
                <p className="text-sm font-medium text-amber-800 mb-3">
                  Confirm approval of ${quote.totalAmount.toLocaleString()} incl. GST?
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      approve.mutate({ id: quoteId })
                      setConfirming(false)
                    }}
                    disabled={approve.isPending}
                    className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                  >
                    {approve.isPending ? 'Approving...' : 'Yes, approve'}
                  </button>
                  <button
                    onClick={() => setConfirming(false)}
                    className="px-4 py-2 border text-sm text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirming(true)}
                  className="px-5 py-2.5 bg-amber-600 text-white text-sm font-semibold rounded-lg hover:bg-amber-700 transition-colors"
                >
                  ✓ Approve Quote
                </button>
                <button
                  onClick={() => requestChanges.mutate({ id: quoteId, comment })}
                  disabled={requestChanges.isPending}
                  className="px-5 py-2.5 border text-sm text-gray-600 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
                >
                  Request Changes
                </button>
              </div>
            )}
          </div>
        )}

        {/* Approved state */}
        {isApproved && (
          <div className="bg-green-50 border border-green-200 rounded-xl px-6 py-5 text-center">
            <p className="text-green-800 font-medium">
              ✓ You approved this quote on {quote.approvedAt
                ? new Date(quote.approvedAt).toLocaleDateString('en-AU', {
                    day: 'numeric', month: 'long', year: 'numeric'
                  })
                : 'record'}
            </p>
            <p className="text-green-600 text-sm mt-1">
              Your AV team has been notified and will be in touch shortly.
            </p>
          </div>
        )}

      </main>
    </div>
  )
}