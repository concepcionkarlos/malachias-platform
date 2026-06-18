'use client'

// Admin section — Fan Stories moderation: reviews fan-submitted stories, filtered by
// status (pending/approved/rejected), and lets the band approve or reject each one.

import { useState, useEffect, useCallback } from 'react'
import { Check, X, Clock, RefreshCw } from 'lucide-react'
import type { FanStory } from '@/lib/data'

type StatusFilter = 'all' | 'pending' | 'approved' | 'rejected'

const STATUS_COLOR: Record<FanStory['status'], string> = {
  pending:  '#c9a84c',
  approved: '#4caf6a',
  rejected: '#8a3a28',
}

const STATUS_LABEL: Record<FanStory['status'], string> = {
  pending:  'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
}

export default function AdminFanStories() {
  const [stories, setStories]     = useState<FanStory[]>([])
  const [filter, setFilter]       = useState<StatusFilter>('pending')
  const [loading, setLoading]     = useState(true)
  const [updating, setUpdating]   = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/fan-stories')
      if (res.ok) {
        const data = await res.json()
        setStories(data.stories ?? [])
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  async function updateStatus(id: string, status: 'approved' | 'rejected') {
    setUpdating(id)
    try {
      await fetch('/api/fan-stories', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      })
      setStories(prev => prev.map(s => s.id === id ? { ...s, status } : s))
    } finally {
      setUpdating(null)
    }
  }

  const filtered = filter === 'all' ? stories : stories.filter(s => s.status === filter)
  const counts = {
    all:      stories.length,
    pending:  stories.filter(s => s.status === 'pending').length,
    approved: stories.filter(s => s.status === 'approved').length,
    rejected: stories.filter(s => s.status === 'rejected').length,
  }

  return (
    <div style={{ maxWidth: 800 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.3rem', color: '#e8ddd0', fontFamily: 'var(--font-display)', letterSpacing: '0.08em' }}>FAN STORIES</h1>
          <p style={{ margin: '4px 0 0', fontSize: '0.78rem', color: '#5c5044' }}>Review and approve fan-submitted stories</p>
        </div>
        <button
          onClick={load}
          style={{ background: 'none', border: '1px solid rgba(255,255,255,0.08)', color: '#5c5044', cursor: 'pointer', borderRadius: 6, padding: '6px 10px', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem' }}
        >
          <RefreshCw size={12} /> Refresh
        </button>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: '1.5rem' }}>
        {(['all', 'pending', 'approved', 'rejected'] as StatusFilter[]).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '6px 14px', fontSize: '0.72rem', letterSpacing: '0.06em',
              textTransform: 'uppercase', cursor: 'pointer', borderRadius: 4,
              background: filter === f ? 'rgba(201,168,76,0.12)' : 'transparent',
              border: `1px solid ${filter === f ? 'rgba(201,168,76,0.40)' : 'rgba(255,255,255,0.07)'}`,
              color: filter === f ? '#c9a84c' : '#5c5044',
              fontFamily: 'var(--font-body)',
            }}
          >
            {f} ({counts[f]})
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ color: '#3a3228', fontSize: '0.82rem', padding: '2rem 0' }}>Loading…</div>
      ) : filtered.length === 0 ? (
        <div style={{ color: '#3a3228', fontSize: '0.82rem', padding: '2rem 0' }}>No {filter === 'all' ? '' : filter} stories yet.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(story => (
            <div
              key={story.id}
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 8,
                padding: '18px 20px',
              }}
            >
              {/* Header row */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.8rem', color: '#e8ddd0', fontWeight: 600 }}>
                      {story.name ?? 'Anonymous'}
                    </span>
                    {story.songTitle && (
                      <span style={{ fontSize: '0.65rem', color: '#c9a84c', padding: '2px 8px', border: '1px solid rgba(201,168,76,0.25)', borderRadius: 4 }}>
                        {story.songTitle}
                      </span>
                    )}
                    <span style={{
                      fontSize: '0.62rem', padding: '2px 8px', borderRadius: 4,
                      background: `${STATUS_COLOR[story.status]}18`,
                      color: STATUS_COLOR[story.status],
                      border: `1px solid ${STATUS_COLOR[story.status]}40`,
                      display: 'flex', alignItems: 'center', gap: 4,
                    }}>
                      {story.status === 'pending'  && <Clock size={10} />}
                      {story.status === 'approved' && <Check size={10} />}
                      {story.status === 'rejected' && <X size={10} />}
                      {STATUS_LABEL[story.status]}
                    </span>
                  </div>
                  {story.email && (
                    <div style={{ fontSize: '0.68rem', color: '#3a3228', marginTop: 4 }}>{story.email}</div>
                  )}
                </div>

                {/* Action buttons — only shown for pending */}
                {story.status === 'pending' && (
                  <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                    <button
                      onClick={() => updateStatus(story.id, 'approved')}
                      disabled={updating === story.id}
                      title="Approve"
                      style={{
                        background: 'rgba(76,175,106,0.12)', border: '1px solid rgba(76,175,106,0.35)',
                        color: '#4caf6a', cursor: 'pointer', borderRadius: 5,
                        padding: '5px 10px', display: 'flex', alignItems: 'center', gap: 5,
                        fontSize: '0.7rem', opacity: updating === story.id ? 0.5 : 1,
                      }}
                    >
                      <Check size={12} /> Approve
                    </button>
                    <button
                      onClick={() => updateStatus(story.id, 'rejected')}
                      disabled={updating === story.id}
                      title="Reject"
                      style={{
                        background: 'rgba(138,58,40,0.12)', border: '1px solid rgba(138,58,40,0.35)',
                        color: '#c04020', cursor: 'pointer', borderRadius: 5,
                        padding: '5px 10px', display: 'flex', alignItems: 'center', gap: 5,
                        fontSize: '0.7rem', opacity: updating === story.id ? 0.5 : 1,
                      }}
                    >
                      <X size={12} /> Reject
                    </button>
                  </div>
                )}

                {/* Re-open option for rejected */}
                {story.status === 'rejected' && (
                  <button
                    onClick={() => updateStatus(story.id, 'approved')}
                    disabled={updating === story.id}
                    style={{
                      background: 'transparent', border: '1px solid rgba(255,255,255,0.07)',
                      color: '#5c5044', cursor: 'pointer', borderRadius: 5,
                      padding: '5px 10px', fontSize: '0.7rem',
                      opacity: updating === story.id ? 0.5 : 1,
                    }}
                  >
                    Approve instead
                  </button>
                )}
              </div>

              {/* Story body */}
              <p style={{
                margin: 0, fontSize: '0.83rem', lineHeight: 1.75,
                color: '#8a7f70', fontFamily: 'var(--font-body)',
                whiteSpace: 'pre-wrap',
              }}>
                {story.story}
              </p>

              {/* Timestamp */}
              <div style={{ marginTop: 10, fontSize: '0.62rem', color: '#2a2215' }}>
                {new Date(story.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
