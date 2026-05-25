'use client'

import { useEffect, useState } from 'react'
import type { BookingRequest, BookingStatus } from '@/lib/data'

interface ContentStore {
  bookingRequests: BookingRequest[]
  subscribers?: { email: string; joinedAt: string }[]
  monthlyGoal?: { month: string; bookingTarget: number; revenueTarget: number }
}

function statusColor(status: BookingStatus): string {
  if (status === 'New') return '#c9a84c'
  if (['Contacted', 'Quote Sent', 'Follow-up', 'Negotiating'].includes(status)) return '#60a5fa'
  if (['Confirmed', 'Advance Sent', 'Paid'].includes(status)) return '#34d399'
  if (status === 'Completed') return '#8a7f70'
  return '#5c5044'
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

const card: React.CSSProperties = {
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: 8,
  padding: '20px 24px',
}

export default function AdminDashboard() {
  const [data, setData] = useState<ContentStore | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/content')
      .then(r => r.json())
      .then(setData)
      .catch(() => setError('Failed to load dashboard data'))
  }, [])

  if (error) return <p style={{ color: '#c04020', fontFamily: 'var(--font-body)' }}>{error}</p>
  if (!data) return <p style={{ color: '#5c5044', fontFamily: 'var(--font-body)' }}>Loading…</p>

  const bookings = data.bookingRequests ?? []
  const now = Date.now()
  const thirtyDays = 30 * 24 * 60 * 60 * 1000
  const total = bookings.length
  const upcoming = bookings.filter(b => new Date(b.eventDate).getTime() > now).length
  const newThisMonth = bookings.filter(b => now - new Date(b.createdAt).getTime() < thirtyDays).length
  const pending = bookings.filter(b => b.status === 'New').length

  const recent5 = [...bookings].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5)

  const goal = data.monthlyGoal
  const goalProgress = goal ? Math.min(100, Math.round((newThisMonth / goal.bookingTarget) * 100)) : null

  const subscribers = data.subscribers?.length ?? 0

  const stats = [
    { label: 'TOTAL BOOKINGS', value: total },
    { label: 'UPCOMING EVENTS', value: upcoming },
    { label: 'NEW THIS MONTH', value: newThisMonth },
    { label: 'PENDING', value: pending },
    { label: 'SUBSCRIBERS', value: subscribers },
  ]

  return (
    <div style={{ fontFamily: 'var(--font-body)', color: '#e8ddd0' }}>
      <h2 style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.18em', fontSize: 13, color: '#8a7f70', marginBottom: 24, textTransform: 'uppercase' }}>
        Dashboard
      </h2>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 32 }}>
        {stats.map(s => (
          <div key={s.label} style={card}>
            <div style={{ fontSize: 11, letterSpacing: '0.12em', color: '#8a7f70', marginBottom: 8, fontFamily: 'var(--font-display)' }}>{s.label}</div>
            <div style={{ fontSize: 36, fontWeight: 700, color: '#c9a84c' }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Monthly goal */}
      {goal && goalProgress !== null && (
        <div style={{ ...card, marginBottom: 32 }}>
          <div style={{ fontSize: 11, letterSpacing: '0.12em', color: '#8a7f70', marginBottom: 12, fontFamily: 'var(--font-display)' }}>
            MONTHLY GOAL — {goal.month.toUpperCase()}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1, background: 'rgba(255,255,255,0.05)', borderRadius: 4, height: 8, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${goalProgress}%`, background: '#c9a84c', borderRadius: 4, transition: 'width 0.3s' }} />
            </div>
            <span style={{ fontSize: 13, color: '#c9a84c', minWidth: 48, textAlign: 'right' }}>{goalProgress}%</span>
          </div>
          <div style={{ fontSize: 12, color: '#5c5044', marginTop: 6 }}>
            {newThisMonth} / {goal.bookingTarget} bookings target
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Recent bookings table */}
        <div style={card}>
          <div style={{ fontSize: 11, letterSpacing: '0.12em', color: '#8a7f70', marginBottom: 16, fontFamily: 'var(--font-display)' }}>RECENT BOOKINGS</div>
          {recent5.length === 0 ? (
            <p style={{ color: '#5c5044', fontSize: 13 }}>No bookings yet.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  {['Org', 'Type', 'Date', 'Status'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '4px 8px', color: '#5c5044', fontWeight: 500, fontSize: 11 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recent5.map(b => (
                  <tr key={b.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '8px 8px', color: '#e8ddd0', maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.venueOrOrg}</td>
                    <td style={{ padding: '8px 8px', color: '#8a7f70' }}>{b.eventType}</td>
                    <td style={{ padding: '8px 8px', color: '#8a7f70' }}>{b.eventDate}</td>
                    <td style={{ padding: '8px 8px' }}>
                      <span style={{ fontSize: 11, color: statusColor(b.status), background: `${statusColor(b.status)}18`, padding: '2px 8px', borderRadius: 12, border: `1px solid ${statusColor(b.status)}30` }}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Recent activity feed */}
        <div style={card}>
          <div style={{ fontSize: 11, letterSpacing: '0.12em', color: '#8a7f70', marginBottom: 16, fontFamily: 'var(--font-display)' }}>RECENT ACTIVITY</div>
          {recent5.length === 0 ? (
            <p style={{ color: '#5c5044', fontSize: 13 }}>No activity yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {recent5.map(b => (
                <div key={b.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: statusColor(b.status), marginTop: 4, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: '#e8ddd0' }}>{b.fullName}</div>
                    <div style={{ fontSize: 11, color: '#8a7f70', marginTop: 2 }}>
                      <span style={{ color: statusColor(b.status) }}>{b.status}</span>
                      {' · '}
                      {b.venueOrOrg}
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: '#5c5044', flexShrink: 0 }}>{timeAgo(b.createdAt)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
