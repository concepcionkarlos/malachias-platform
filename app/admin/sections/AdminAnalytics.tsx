'use client'

import { useEffect, useState } from 'react'
import type { BookingRequest, BookingStatus, Show } from '@/lib/data'

const CARD: React.CSSProperties = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8 }

const STATUS_COLOR: Record<BookingStatus, string> = {
  'New': '#c9a84c',
  'Contacted': '#60a5fa',
  'Quote Sent': '#a78bfa',
  'Follow-up': '#fb923c',
  'Negotiating': '#f472b6',
  'Confirmed': '#34d399',
  'Advance Sent': '#10b981',
  'Paid': '#059669',
  'Completed': '#8a7f70',
  'Lost': '#c04020',
  'Archived': '#5c5044',
  'Spam': '#6b2020',
}

const BOOKING_STATUSES: BookingStatus[] = ['New','Contacted','Quote Sent','Follow-up','Negotiating','Confirmed','Advance Sent','Paid','Completed','Lost','Archived']

function StatCard({ label, value, sub, accent }: { label: string; value: string|number; sub?: string; accent?: string }) {
  return (
    <div style={{ ...CARD, padding: '16px 20px' }}>
      <div style={{ fontSize: 11, color: '#8a7f70', letterSpacing: '0.1em', marginBottom: 8, fontFamily: 'var(--font-display)' }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700, color: accent ?? '#e8ddd0', fontFamily: 'var(--font-display)', letterSpacing: '0.04em' }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: '#5c5044', marginTop: 4 }}>{sub}</div>}
    </div>
  )
}

function HBar({ label, count, max, color, pct }: { label: string; count: number; max: number; color: string; pct?: string }) {
  const width = max > 0 ? Math.max(2, (count / max) * 100) : 0
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
      <div style={{ width: 120, fontSize: 12, color: '#8a7f70', textAlign: 'right', flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</div>
      <div style={{ flex: 1, height: 18, background: 'rgba(255,255,255,0.04)', borderRadius: 4, overflow: 'hidden', position: 'relative' }}>
        <div style={{ height: '100%', width: `${width}%`, background: color, borderRadius: 4, transition: 'width 0.4s ease', opacity: 0.85 }} />
      </div>
      <div style={{ width: 36, fontSize: 12, color: '#e8ddd0', flexShrink: 0, textAlign: 'right' }}>{count}</div>
      {pct && <div style={{ width: 40, fontSize: 11, color: '#5c5044', flexShrink: 0 }}>{pct}</div>}
    </div>
  )
}

function getMonthKey(dateStr: string) {
  const d = new Date(dateStr)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

function getMonthLabel(key: string) {
  const [y, m] = key.split('-')
  return new Date(Number(y), Number(m) - 1, 1).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
}

function getLast6MonthKeys(): string[] {
  const keys: string[] = []
  const now = new Date()
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    keys.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`)
  }
  return keys
}

export default function AdminAnalytics() {
  const [bookings, setBookings] = useState<BookingRequest[]>([])
  const [shows, setShows] = useState<Show[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/content')
      .then(r => r.json())
      .then(d => {
        setBookings(d.bookingRequests ?? [])
        setShows(d.shows ?? [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <div style={{ color: '#8a7f70', padding: 40, textAlign: 'center' }}>Loading analytics…</div>

  // ── Computed stats ─────────────────────────────────────────────────────────
  const total = bookings.length
  const converted = bookings.filter(b => ['Confirmed','Advance Sent','Paid','Completed'].includes(b.status)).length
  const conversionRate = total > 0 ? Math.round((converted / total) * 100) : 0
  const quotedBookings = bookings.filter(b => b.quoteAmount)
  const avgQuote = quotedBookings.length > 0
    ? Math.round(quotedBookings.reduce((s, b) => s + (b.quoteAmount ?? 0), 0) / quotedBookings.length)
    : 0
  const totalRevenue = shows.reduce((s, sh) => s + (sh.guarantee ?? 0), 0)
  const totalAttendance = shows.reduce((s, sh) => s + (sh.attendance ?? 0), 0)

  // ── Bookings by status ─────────────────────────────────────────────────────
  const byStatus = BOOKING_STATUSES.map(s => ({
    status: s,
    count: bookings.filter(b => b.status === s).length,
    color: STATUS_COLOR[s],
  })).filter(x => x.count > 0)
  const maxByStatus = Math.max(...byStatus.map(x => x.count), 1)

  // ── Bookings by month (last 6) ─────────────────────────────────────────────
  const monthKeys = getLast6MonthKeys()
  const byMonth = monthKeys.map(key => ({
    key, label: getMonthLabel(key),
    count: bookings.filter(b => getMonthKey(b.createdAt) === key).length,
  }))
  const maxByMonth = Math.max(...byMonth.map(x => x.count), 1)

  // ── Shows stats ────────────────────────────────────────────────────────────
  const confirmedShows = shows.filter(s => s.showStatus === 'Confirmed').length
  const completedShows = shows.filter(s => ['Confirmed','Pending'].includes(s.showStatus ?? '')).length

  return (
    <div style={{ fontFamily: 'var(--font-body)', color: '#e8ddd0' }}>
      <h2 style={{ margin: '0 0 24px', fontFamily: 'var(--font-display)', letterSpacing: '0.18em', fontSize: 18, fontWeight: 700 }}>
        ANALYTICS
      </h2>

      {/* Summary stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14, marginBottom: 32 }}>
        <StatCard label="TOTAL BOOKINGS" value={total} sub="All time" />
        <StatCard label="CONVERSION RATE" value={`${conversionRate}%`} sub={`${converted} confirmed+`} accent="#34d399" />
        <StatCard label="AVG QUOTE" value={avgQuote > 0 ? `$${avgQuote.toLocaleString()}` : '—'} sub={`from ${quotedBookings.length} quotes`} accent="#c9a84c" />
        <StatCard label="TOTAL REVENUE" value={totalRevenue > 0 ? `$${totalRevenue.toLocaleString()}` : '$0'} sub="Sum of guarantees" accent="#10b981" />
        <StatCard label="TOTAL SHOWS" value={shows.length} sub={`${confirmedShows} confirmed`} />
        <StatCard label="TOTAL ATTENDANCE" value={totalAttendance > 0 ? totalAttendance.toLocaleString() : '—'} sub="Across all shows" accent="#60a5fa" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        {/* Bookings by status */}
        <div style={{ ...CARD, padding: '20px 24px' }}>
          <div style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.14em', fontSize: 12, color: '#8a7f70', marginBottom: 18 }}>BOOKINGS BY STATUS</div>
          {byStatus.length === 0 ? (
            <div style={{ color: '#5c5044', fontSize: 13 }}>No booking data yet.</div>
          ) : (
            byStatus.map(x => (
              <HBar key={x.status} label={x.status} count={x.count} max={maxByStatus} color={x.color}
                pct={total > 0 ? `${Math.round((x.count / total) * 100)}%` : ''} />
            ))
          )}
        </div>

        {/* Bookings by month */}
        <div style={{ ...CARD, padding: '20px 24px' }}>
          <div style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.14em', fontSize: 12, color: '#8a7f70', marginBottom: 18 }}>BOOKINGS BY MONTH (LAST 6)</div>
          {byMonth.every(x => x.count === 0) ? (
            <div style={{ color: '#5c5044', fontSize: 13 }}>No bookings in last 6 months.</div>
          ) : (
            byMonth.map(x => (
              <HBar key={x.key} label={x.label} count={x.count} max={maxByMonth} color="#c9a84c" />
            ))
          )}
        </div>
      </div>

      {/* Shows breakdown */}
      {shows.length > 0 && (
        <div style={{ ...CARD, padding: '20px 24px', marginBottom: 24 }}>
          <div style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.14em', fontSize: 12, color: '#8a7f70', marginBottom: 18 }}>SHOWS BREAKDOWN</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 14 }}>
            {[
              { label: 'Total Shows', value: shows.length, color: '#e8ddd0' },
              { label: 'Confirmed', value: shows.filter(s => s.showStatus === 'Confirmed').length, color: '#34d399' },
              { label: 'Pending', value: shows.filter(s => s.showStatus === 'Pending').length, color: '#c9a84c' },
              { label: 'On Hold', value: shows.filter(s => s.showStatus === 'Hold').length, color: '#60a5fa' },
              { label: 'Cancelled', value: shows.filter(s => s.showStatus === 'Cancelled').length, color: '#c04020' },
            ].map(item => (
              <div key={item.label} style={{ ...CARD, padding: '12px 16px', textAlign: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: item.color, fontFamily: 'var(--font-display)' }}>{item.value}</div>
                <div style={{ fontSize: 11, color: '#5c5044', marginTop: 4 }}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Revenue tracker */}
      {shows.length > 0 && (
        <div style={{ ...CARD, padding: '20px 24px' }}>
          <div style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.14em', fontSize: 12, color: '#8a7f70', marginBottom: 18 }}>REVENUE TRACKER</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14 }}>
            <div style={{ ...CARD, padding: '12px 16px' }}>
              <div style={{ fontSize: 11, color: '#5c5044', marginBottom: 6 }}>TOTAL GUARANTEES</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#10b981' }}>${shows.reduce((s, sh) => s + (sh.guarantee ?? 0), 0).toLocaleString()}</div>
            </div>
            <div style={{ ...CARD, padding: '12px 16px' }}>
              <div style={{ fontSize: 11, color: '#5c5044', marginBottom: 6 }}>TOTAL PAYOUTS</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#34d399' }}>${shows.reduce((s, sh) => s + (sh.payout ?? 0), 0).toLocaleString()}</div>
            </div>
            <div style={{ ...CARD, padding: '12px 16px' }}>
              <div style={{ fontSize: 11, color: '#5c5044', marginBottom: 6 }}>MERCH AT SHOWS</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#a78bfa' }}>${shows.reduce((s, sh) => s + (sh.merchSoldAtShow ?? 0), 0).toLocaleString()}</div>
            </div>
            <div style={{ ...CARD, padding: '12px 16px' }}>
              <div style={{ fontSize: 11, color: '#5c5044', marginBottom: 6 }}>SHOWS WITH PAYOUT</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#e8ddd0' }}>{shows.filter(s => s.payout).length}</div>
            </div>
          </div>
          {/* Per-show guarantee bars */}
          {shows.filter(s => s.guarantee && s.guarantee > 0).length > 0 && (
            <div style={{ marginTop: 18 }}>
              <div style={{ fontSize: 11, color: '#5c5044', marginBottom: 12, letterSpacing: '0.08em' }}>GUARANTEE PER SHOW</div>
              {shows
                .filter(s => s.guarantee && s.guarantee > 0)
                .sort((a, b) => (b.guarantee ?? 0) - (a.guarantee ?? 0))
                .slice(0, 10)
                .map(s => {
                  const maxG = Math.max(...shows.map(sh => sh.guarantee ?? 0), 1)
                  return (
                    <HBar
                      key={s.id}
                      label={`${s.venue} ${s.date ? `(${new Date(s.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })})` : ''}`}
                      count={s.guarantee ?? 0}
                      max={maxG}
                      color="#10b981"
                    />
                  )
                })}
            </div>
          )}
        </div>
      )}

      {total === 0 && shows.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#5c5044' }}>
          No data yet. Analytics will populate as bookings and shows are added.
        </div>
      )}
    </div>
  )
}
