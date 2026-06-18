'use client'

// Admin section — Drip Campaigns: manages automated multi-step email sequences. Shows
// each campaign's trigger/steps with an active/paused toggle, lists enrollments with
// completed steps and next-send timing, lets the band pause/resume/unsubscribe people,
// and exposes a manual "Run Now" trigger for the daily drip cron.

import { useState, useEffect } from 'react'
import { Mail, Play, Pause, XCircle, RefreshCw } from 'lucide-react'
import type { DripEnrollment, DripCampaign } from '@/lib/data'

const CARD: React.CSSProperties = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8 }
const INPUT: React.CSSProperties = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: '#e8ddd0', padding: '7px 11px', fontSize: 13, width: '100%', boxSizing: 'border-box', fontFamily: 'var(--font-body)' }
const LABEL: React.CSSProperties = { fontSize: 11, color: '#8a7f70', letterSpacing: '0.08em', display: 'block', marginBottom: 4 }
const BTN: React.CSSProperties = { border: 'none', cursor: 'pointer', padding: '6px 12px', borderRadius: 5, fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: 'var(--font-body)', fontWeight: 600 }

const STATUS_COLOR: Record<DripEnrollment['status'], string> = {
  active: '#34d399',
  completed: '#8a7f70',
  paused: '#fb923c',
  unsubscribed: '#c04020',
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function nextStepLabel(enrollment: DripEnrollment, campaign: DripCampaign | undefined): string {
  if (!campaign || enrollment.status !== 'active') return '—'
  const pending = campaign.steps.filter((s) => !enrollment.completedSteps.includes(s.day))
  if (!pending.length) return 'All done'
  const next = pending[0]
  const enrolledMs = new Date(enrollment.enrolledAt).getTime()
  const sendAt = new Date(enrolledMs + next.day * 24 * 60 * 60 * 1000)
  const daysLeft = Math.ceil((sendAt.getTime() - Date.now()) / (24 * 60 * 60 * 1000))
  if (daysLeft <= 0) return `Day ${next.day} — overdue`
  return `Day ${next.day} in ${daysLeft}d`
}

export default function AdminDrip() {
  const [campaigns, setCampaigns] = useState<DripCampaign[]>([])
  const [enrollments, setEnrollments] = useState<DripEnrollment[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<string>('active')
  const [runningCron, setRunningCron] = useState(false)
  const [cronResult, setCronResult] = useState<string>('')

  useEffect(() => {
    Promise.all([
      fetch('/api/drip/campaigns').then((r) => r.json()),
      fetch('/api/drip/enrollments').then((r) => r.json()),
    ])
      .then(([c, e]) => { setCampaigns(c); setEnrollments(e); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  async function toggleCampaign(campaign: DripCampaign) {
    const res = await fetch(`/api/drip/campaigns/${campaign.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !campaign.active }),
    })
    if (res.ok) {
      const updated: DripCampaign = await res.json()
      setCampaigns((prev) => prev.map((c) => (c.id === updated.id ? updated : c)))
    }
  }

  async function updateEnrollmentStatus(id: string, status: DripEnrollment['status']) {
    const res = await fetch(`/api/drip/enrollments/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    if (res.ok) {
      const updated: DripEnrollment = await res.json()
      setEnrollments((prev) => prev.map((e) => (e.id === updated.id ? updated : e)))
    }
  }

  async function runCronNow() {
    setRunningCron(true)
    setCronResult('')
    try {
      const res = await fetch('/api/cron/drip')
      const data = await res.json()
      setCronResult(`Processed ${data.processed} enrollments — sent ${data.sent}, skipped ${data.skipped}, errors ${data.errors}`)
    } catch {
      setCronResult('Failed to run')
    }
    setRunningCron(false)
  }

  const filtered = enrollments.filter((e) => !filterStatus || e.status === filterStatus)

  if (loading) return <div style={{ color: '#8a7f70', padding: 40, textAlign: 'center' }}>Loading…</div>

  return (
    <div style={{ fontFamily: 'var(--font-body)', color: '#e8ddd0' }}>
      <h2 style={{ margin: '0 0 24px', fontFamily: 'var(--font-display)', letterSpacing: '0.18em', fontSize: 18, color: '#e8ddd0' }}>
        DRIP CAMPAIGNS
      </h2>

      {/* Campaign cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 14, marginBottom: 32 }}>
        {campaigns.map((c) => (
          <div key={c.id} style={{ ...CARD, padding: '18px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#e8ddd0', marginBottom: 3 }}>{c.name}</div>
                <div style={{ fontSize: 11, color: '#5c5044', letterSpacing: '0.08em' }}>
                  TRIGGER: {c.trigger === 'booking-new' ? 'New Booking (auto)' : 'Manual'}
                </div>
              </div>
              <button
                onClick={() => toggleCampaign(c)}
                style={{ ...BTN, background: c.active ? 'rgba(52,211,153,0.12)' : 'rgba(255,255,255,0.06)', color: c.active ? '#34d399' : '#8a7f70' }}
              >
                {c.active ? <><Play size={11} /> Active</> : <><Pause size={11} /> Paused</>}
              </button>
            </div>
            {c.description && (
              <p style={{ fontSize: 12, color: '#5c5044', lineHeight: 1.5, marginBottom: 12 }}>{c.description}</p>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {c.steps.map((step, i) => (
                <div key={step.day} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12 }}>
                  <span style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#c9a84c', flexShrink: 0 }}>
                    {i + 1}
                  </span>
                  <span style={{ color: '#8a7f70' }}>Day {step.day}</span>
                  <span style={{ color: '#5c5044' }}>—</span>
                  <span style={{ color: '#e8ddd0', fontFamily: 'monospace', fontSize: 11 }}>{step.templateSlug}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 14, fontSize: 11, color: '#5c5044' }}>
              {enrollments.filter((e) => e.campaignId === c.id && e.status === 'active').length} active ·{' '}
              {enrollments.filter((e) => e.campaignId === c.id && e.status === 'completed').length} completed ·{' '}
              {enrollments.filter((e) => e.campaignId === c.id).length} total
            </div>
          </div>
        ))}
      </div>

      {/* Manual cron trigger */}
      <div style={{ ...CARD, padding: '14px 18px', marginBottom: 28, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: 12, color: '#e8ddd0', fontWeight: 600, marginBottom: 2 }}>Manual Drip Run</div>
          <div style={{ fontSize: 11, color: '#5c5044' }}>Vercel cron fires daily at 10:00 AM ET. Run manually to test or catch up.</div>
        </div>
        <button onClick={runCronNow} disabled={runningCron}
          style={{ ...BTN, background: 'rgba(201,168,76,0.15)', color: '#c9a84c', border: '1px solid rgba(201,168,76,0.3)', padding: '8px 16px', flexShrink: 0 }}>
          <RefreshCw size={13} style={{ animation: runningCron ? 'spin 1s linear infinite' : 'none' }} />
          {runningCron ? 'Running…' : 'Run Now'}
        </button>
        {cronResult && (
          <span style={{ fontSize: 12, color: '#34d399' }}>{cronResult}</span>
        )}
      </div>

      {/* Enrollments table */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <span style={{ fontSize: 11, letterSpacing: '0.14em', color: '#5c5044', textTransform: 'uppercase' }}>
          Enrollments ({filtered.length})
        </span>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{ ...INPUT, width: 'auto', cursor: 'pointer', fontSize: 12, padding: '5px 10px' }}
        >
          <option value="">All</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="paused">Paused</option>
          <option value="unsubscribed">Unsubscribed</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: '#5c5044', fontSize: 13 }}>
          No enrollments yet. They appear automatically when new booking requests are submitted.
        </div>
      ) : (
        <div style={{ ...CARD, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                {['Name', 'Email', 'Campaign', 'Enrolled', 'Steps Done', 'Next Send', 'Status', ''].map((h) => (
                  <th key={h} style={{ padding: '9px 14px', textAlign: 'left', fontSize: 10, color: '#5c5044', letterSpacing: '0.10em', fontWeight: 600, textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((e, i) => {
                const campaign = campaigns.find((c) => c.id === e.campaignId)
                return (
                  <tr key={e.id}
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                    <td style={{ padding: '10px 14px', color: '#e8ddd0', fontWeight: 600 }}>{e.entityName}</td>
                    <td style={{ padding: '10px 14px', color: '#8a7f70', fontSize: 12 }}>{e.toEmail}</td>
                    <td style={{ padding: '10px 14px', color: '#8a7f70', fontSize: 12 }}>{campaign?.name ?? e.campaignId}</td>
                    <td style={{ padding: '10px 14px', color: '#5c5044', fontSize: 12 }}>{fmtDate(e.enrolledAt)}</td>
                    <td style={{ padding: '10px 14px' }}>
                      <div style={{ display: 'flex', gap: 4 }}>
                        {campaign?.steps.map((s) => (
                          <span key={s.day} style={{
                            width: 20, height: 20, borderRadius: '50%', fontSize: 9, fontWeight: 700,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: e.completedSteps.includes(s.day) ? 'rgba(52,211,153,0.2)' : 'rgba(255,255,255,0.06)',
                            color: e.completedSteps.includes(s.day) ? '#34d399' : '#5c5044',
                            border: `1px solid ${e.completedSteps.includes(s.day) ? 'rgba(52,211,153,0.3)' : 'rgba(255,255,255,0.08)'}`,
                          }}>
                            {s.day}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td style={{ padding: '10px 14px', fontSize: 11, color: e.status === 'active' ? '#fb923c' : '#5c5044' }}>
                      {nextStepLabel(e, campaign)}
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      <span style={{
                        display: 'inline-block', padding: '2px 8px', borderRadius: 99,
                        fontSize: 10, fontWeight: 600, letterSpacing: '0.06em',
                        background: STATUS_COLOR[e.status] + '22',
                        color: STATUS_COLOR[e.status],
                        border: `1px solid ${STATUS_COLOR[e.status]}44`,
                      }}>
                        {e.status}
                      </span>
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {e.status === 'active' && (
                          <button onClick={() => updateEnrollmentStatus(e.id, 'paused')}
                            style={{ ...BTN, background: 'rgba(251,146,60,0.1)', color: '#fb923c', padding: '4px 8px', fontSize: 11 }}>
                            <Pause size={10} /> Pause
                          </button>
                        )}
                        {e.status === 'paused' && (
                          <button onClick={() => updateEnrollmentStatus(e.id, 'active')}
                            style={{ ...BTN, background: 'rgba(52,211,153,0.1)', color: '#34d399', padding: '4px 8px', fontSize: 11 }}>
                            <Play size={10} /> Resume
                          </button>
                        )}
                        {(e.status === 'active' || e.status === 'paused') && (
                          <button onClick={() => updateEnrollmentStatus(e.id, 'unsubscribed')}
                            style={{ ...BTN, background: 'rgba(192,64,32,0.1)', color: '#c04020', padding: '4px 8px', fontSize: 11 }}>
                            <XCircle size={10} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
