'use client'

import { useRouter } from 'next/navigation'

type Project = {
  id: string
  name: string
  venue: string | null
  eventDate: Date | string | null
  status: string
  quotes: Array<{
    id: string
    status: string
    totalAmount: number
    version: number
  }>
}

type Props = {
  project: Project
  userName: string
}

function getDaysUntil(date: Date | string | null): number | null {
  if (!date) return null
  const diff = new Date(date).getTime() - new Date().getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

function getJourneyStage(project: Project): number {
  const quote = project.quotes?.[0]
  if (!quote) return 1
  if (quote.status === 'approved') return 3
  if (quote.status === 'changes_requested') return 2
  return 2
}

function getChecklist(project: Project) {
  const quote = project.quotes?.[0]
  const quoteApproved = quote?.status === 'approved'
  return [
    { label: 'Booking confirmed',       done: true,         pending: false },
    { label: 'Event brief submitted',   done: true,         pending: false },
    { label: 'Approve quote',           done: quoteApproved, pending: !quoteApproved },
    { label: 'Upload presentation files', done: false,      pending: true  },
    { label: 'Sign off run sheet',      done: false,        pending: false },
    { label: 'Event day 🎉',            done: false,        pending: false },
  ]
}

const JOURNEY_STEPS = [
  { label: 'Booking',  desc: 'Request confirmed'         },
  { label: 'Brief',    desc: 'Event details received'    },
  { label: 'Approve',  desc: 'Quote & run sheet sign-off'},
  { label: 'Files',    desc: 'Upload presentations'      },
  { label: 'Event Day',desc: "We've got it covered"      },
]

export default function ClientPortalView({ project, userName }: Props) {
  const router = useRouter()
  const quote  = project.quotes?.[0]
  const days   = getDaysUntil(project.eventDate)
  const stage  = getJourneyStage(project)
  const checklist = getChecklist(project)

  const formattedDate = project.eventDate
    ? new Date(project.eventDate).toLocaleDateString('en-AU', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
      })
    : null

  return (
    <div style={{ fontFamily: "'Outfit', 'DM Sans', sans-serif", background: '#f7f4ef', minHeight: '100vh' }}>

      {/* ── Hero ───────────────────────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(135deg, #2b1f14 0%, #3d2e1c 50%, #2e3828 100%)',
        padding: '44px 40px 40px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.18em', color: 'rgba(255,255,255,0.45)', marginBottom: 8 }}>
          Your upcoming event
        </div>
        <div style={{ fontFamily: 'Georgia, serif', fontSize: 30, fontWeight: 500, color: '#fff', marginBottom: 6, letterSpacing: '-0.02em' }}>
          {project.name}
        </div>
        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', marginBottom: 28 }}>
          {formattedDate ?? 'Date TBC'}{project.venue ? ` · ${project.venue}` : ''}
        </div>

        {/* Chips */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {project.venue && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'rgba(255,255,255,0.09)', border: '1px solid rgba(255,255,255,0.12)', padding: '7px 14px', borderRadius: 20, fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>
              🏛 {project.venue}
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'rgba(255,255,255,0.09)', border: '1px solid rgba(255,255,255,0.12)', padding: '7px 14px', borderRadius: 20, fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>
            🎙 Full AV Production
          </div>
          {quote && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'rgba(255,255,255,0.09)', border: '1px solid rgba(255,255,255,0.12)', padding: '7px 14px', borderRadius: 20, fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>
              💰 ${quote.totalAmount.toLocaleString()} incl. GST
            </div>
          )}
        </div>

        {/* Countdown badge */}
        {days !== null && days > 0 && (
          <div style={{
            position: 'absolute', right: 40, top: '50%', transform: 'translateY(-50%)',
            textAlign: 'center', background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.12)', borderRadius: 16,
            padding: '20px 28px', backdropFilter: 'blur(8px)',
          }}>
            <div style={{ fontFamily: 'Georgia, serif', fontSize: 52, lineHeight: 1, color: '#e8c97a', fontWeight: 500 }}>
              {days}
            </div>
            <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.45)', marginTop: 4 }}>
              Days to go
            </div>
          </div>
        )}
      </div>

      {/* ── Body ───────────────────────────────────────────────── */}
      <div style={{ maxWidth: 1060, margin: '0 auto', padding: '32px 40px 60px' }}>

        {/* Journey tracker */}
        <div style={{ background: '#fff', borderRadius: 20, border: '1px solid rgba(0,0,0,0.08)', padding: '28px 32px', marginBottom: 24, boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
            <div>
              <div style={{ fontFamily: 'Georgia, serif', fontSize: 19, fontWeight: 500, color: '#1e1c1a' }}>Your event journey</div>
              <div style={{ fontSize: 13, color: '#8a8480', marginTop: 2 }}>
                {stage < 3 ? "Just a couple of things to confirm" : "You're all set — we'll take it from here"}
              </div>
            </div>
            <div style={{ fontSize: 12, fontWeight: 500, color: '#3e7c6e', background: '#e5f3f0', padding: '4px 12px', borderRadius: 20 }}>
              ✓ {stage} of 5 steps done
            </div>
          </div>

          {/* Steps */}
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            {JOURNEY_STEPS.map((step, i) => {
              const stepNum  = i + 1
              const isDone   = stepNum < stage
              const isCurrent = stepNum === stage
              const isUpcoming = stepNum > stage

              const nodeColor = isDone ? '#3e7c6e' : isCurrent ? '#c17f3e' : '#e8e4dc'
              const labelColor = isDone ? '#3e7c6e' : isCurrent ? '#c17f3e' : '#8a8480'
              const lineColor  = isDone ? '#3e7c6e' : '#e8e4dc'

              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                  {/* Connector line */}
                  {i < JOURNEY_STEPS.length - 1 && (
                    <div style={{
                      position: 'absolute', top: 22, left: '50%', width: '100%',
                      height: 3, background: lineColor, zIndex: 0,
                    }} />
                  )}

                  {/* Node */}
                  <div style={{
                    width: 44, height: 44, borderRadius: '50%',
                    background: nodeColor,
                    boxShadow: isCurrent ? `0 0 0 5px rgba(193,127,62,0.15)` : isDone ? '0 0 0 5px rgba(62,124,110,0.12)' : '0 0 0 5px #f7f4ef',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: isDone ? 16 : isUpcoming ? 14 : 18,
                    color: isDone || isCurrent ? '#fff' : '#8a8480',
                    zIndex: 1, position: 'relative', marginBottom: 10,
                    transition: 'all 0.2s',
                  }}>
                    {isDone ? '✓' : isCurrent ? '★' : ['📁', '🎉'][i - 3] ?? '○'}
                  </div>

                  <div style={{ fontSize: 12, fontWeight: 600, color: labelColor, textAlign: 'center' }}>
                    {step.label}
                  </div>
                  <div style={{ fontSize: 11, color: '#8a8480', textAlign: 'center', maxWidth: 90, lineHeight: 1.4, marginTop: 2 }}>
                    {step.desc}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Two-col layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, alignItems: 'start' }}>

          {/* Left — action cards */}
          <div>
            <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.14em', color: '#8a8480', fontWeight: 500, marginBottom: 14 }}>
              Things to do
            </div>

            {/* Quote action */}
            {quote && quote.status === 'pending' && (
              <div
                onClick={() => router.push(`/events/${project.id}/quote/${quote.id}`)}
                style={{
                  background: 'linear-gradient(135deg, #fff 80%, #fdf6ec)',
                  border: '1px solid rgba(193,127,62,0.3)', borderRadius: 16,
                  padding: '22px 24px', marginBottom: 14,
                  display: 'flex', gap: 16, alignItems: 'flex-start',
                  cursor: 'pointer', boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                  transition: 'all 0.18s',
                }}
              >
                <div style={{ width: 44, height: 44, borderRadius: 12, background: '#fdf0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                  📋
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#c17f3e', background: '#fdf0e0', display: 'inline-block', padding: '2px 8px', borderRadius: 10, marginBottom: 6 }}>
                    ⏰ Action required
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#1e1c1a', marginBottom: 4 }}>
                    Your quote is ready to approve
                  </div>
                  <div style={{ fontSize: 13, color: '#8a8480', lineHeight: 1.5, marginBottom: 12 }}>
                    We've put together everything your event needs. Take a look and approve when you're happy, or let us know if anything needs tweaking.
                  </div>
                  <button style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 10, background: '#c17f3e', color: '#fff', border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                    Review &amp; Approve Quote →
                  </button>
                </div>
              </div>
            )}

            {/* Quote approved state */}
            {quote && quote.status === 'approved' && (
              <div style={{
                background: '#f0faf8', border: '1px solid rgba(62,124,110,0.25)',
                borderRadius: 16, padding: '22px 24px', marginBottom: 14,
                display: 'flex', gap: 16, alignItems: 'flex-start',
                boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
              }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: '#e5f3f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                  ✅
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#1e1c1a', marginBottom: 4 }}>Quote approved</div>
                  <div style={{ fontSize: 13, color: '#8a8480' }}>
                    You've approved the quote for ${quote.totalAmount.toLocaleString()} incl. GST. Your AV team is on it.
                  </div>
                </div>
              </div>
            )}

            {/* Upload files action */}
            <div
              onClick={() => router.push(`/events/${project.id}/files`)}
              style={{
                background: '#fff', border: '1px solid rgba(0,0,0,0.08)',
                borderRadius: 16, padding: '22px 24px', marginBottom: 14,
                display: 'flex', gap: 16, alignItems: 'flex-start',
                cursor: 'pointer', boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                transition: 'all 0.18s',
              }}
            >
              <div style={{ width: 44, height: 44, borderRadius: 12, background: '#f0ece4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                📂
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#1e1c1a', marginBottom: 4 }}>
                  Upload your presentation files
                </div>
                <div style={{ fontSize: 13, color: '#8a8480', lineHeight: 1.5, marginBottom: 12 }}>
                  Upload your slide decks, videos, or logos so our team can prepare everything ahead of time.
                </div>
                <button style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 10, background: '#f0ece4', color: '#1e1c1a', border: '1px solid rgba(0,0,0,0.08)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                  Upload Files
                </button>
              </div>
            </div>

            {/* Quick access tiles */}
            <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.14em', color: '#8a8480', fontWeight: 500, marginBottom: 14, marginTop: 28 }}>
              Quick access
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {[
                { icon: '📁', label: 'My Files',   sub: 'Uploads',       path: `/events/${project.id}/files`  },
                { icon: '📋', label: 'Quote',      sub: quote ? `v${quote.version}` : 'Pending', path: quote ? `/events/${project.id}/quote/${quote.id}` : '#' },
                { icon: '📄', label: 'Documents',  sub: 'Invoice, terms', path: '#' },
              ].map((tile, i) => (
                <div
                  key={i}
                  onClick={() => router.push(tile.path)}
                  style={{
                    background: '#fff', border: '1px solid rgba(0,0,0,0.08)',
                    borderRadius: 12, padding: '14px 16px',
                    cursor: 'pointer', boxShadow: '0 1px 6px rgba(0,0,0,0.04)',
                    transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 10,
                  }}
                >
                  <span style={{ fontSize: 22 }}>{tile.icon}</span>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#1e1c1a' }}>{tile.label}</div>
                    <div style={{ fontSize: 11, color: '#8a8480', marginTop: 1 }}>{tile.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — checklist */}
          <div>
            <div style={{ background: '#fff', borderRadius: 16, border: '1px solid rgba(0,0,0,0.08)', padding: '22px 24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <div style={{ fontFamily: 'Georgia, serif', fontSize: 15, fontWeight: 500, color: '#1e1c1a', marginBottom: 16 }}>
                Event checklist
              </div>
              {checklist.map((item, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '9px 0',
                  borderBottom: i < checklist.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none',
                }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 600,
                    background: item.done ? '#3e7c6e' : item.pending ? '#fdf0e0' : '#f0ece4',
                    color: item.done ? '#fff' : item.pending ? '#c17f3e' : '#8a8480',
                    border: item.pending ? '2px solid rgba(193,127,62,0.3)' : 'none',
                  }}>
                    {item.done ? '✓' : item.pending ? '!' : ''}
                  </div>
                  <span style={{
                    fontSize: 13,
                    color: item.done ? '#8a8480' : item.pending ? '#1e1c1a' : '#8a8480',
                    fontWeight: item.pending ? 500 : 400,
                    textDecoration: item.done ? 'line-through' : 'none',
                  }}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Quote summary card */}
            {quote && (
              <div style={{
                background: 'linear-gradient(135deg, #2b1f14, #3d2e1c)',
                borderRadius: 14, padding: 20, marginTop: 16, color: '#fff',
              }}>
                <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'rgba(255,255,255,0.45)', marginBottom: 6 }}>
                  Your quote total
                </div>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: 32, color: '#e8c97a', marginBottom: 4 }}>
                  ${quote.totalAmount.toLocaleString()}
                </div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 16 }}>
                  incl. GST · Version {quote.version}
                </div>
                <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 4, height: 4, marginBottom: 6, overflow: 'hidden' }}>
                  <div style={{ height: '100%', borderRadius: 4, background: 'linear-gradient(90deg, #e8c97a, #c17f3e)', width: quote.status === 'approved' ? '100%' : '40%' }} />
                </div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginBottom: 16 }}>
                  {quote.status === 'approved' ? 'Approved ✓' : 'Approval pending'}
                </div>
                {quote.status !== 'approved' && (
                  <button
                    onClick={() => router.push(`/events/${project.id}/quote/${quote.id}`)}
                    style={{
                      width: '100%', padding: 11, borderRadius: 10,
                      background: '#e8c97a', color: '#2b1f14',
                      fontFamily: 'inherit', fontSize: 13, fontWeight: 700,
                      border: 'none', cursor: 'pointer',
                    }}
                  >
                    ✓ Approve Quote
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
