'use client'

import { useState, useEffect, useCallback } from 'react'
import { Plus, Check, Trash2 } from 'lucide-react'
import type { Goal, GoalCategory } from '@/lib/data'

const CATS: { id: GoalCategory; label: string; color: string }[] = [
  { id: 'booking', label: 'Booking',  color: '#c9a84c' },
  { id: 'music',   label: 'Music',    color: '#60a5fa' },
  { id: 'social',  label: 'Social',   color: '#a78bfa' },
  { id: 'admin',   label: 'Admin',    color: '#34d399' },
  { id: 'other',   label: 'Other',    color: '#8a7f70' },
]

function todayStr() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

export default function AdminGoals() {
  const today = todayStr()
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)
  const [text, setText] = useState('')
  const [cat, setCat] = useState<GoalCategory>('booking')
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    const data = await fetch(`/api/goals?date=${today}`).then(r => r.json())
    setGoals(data)
    setLoading(false)
  }, [today])

  useEffect(() => { load() }, [load])

  async function add() {
    if (!text.trim()) return
    setSaving(true)
    const g = await fetch('/api/goals', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: text.trim(), category: cat, done: false, date: today }),
    }).then(r => r.json())
    setGoals(prev => [...prev, g])
    setText('')
    setSaving(false)
  }

  async function toggle(goal: Goal) {
    const updated = await fetch('/api/goals', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: goal.id, done: !goal.done }),
    }).then(r => r.json())
    setGoals(prev => prev.map(g => g.id === goal.id ? updated : g))
  }

  async function remove(id: string) {
    await fetch('/api/goals', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    setGoals(prev => prev.filter(g => g.id !== id))
  }

  const done  = goals.filter(g => g.done).length
  const total = goals.length

  return (
    <div style={{ maxWidth: 620 }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ margin: 0, fontSize: '1.3rem', color: '#e8ddd0', fontFamily: 'var(--font-display)', letterSpacing: '0.08em' }}>DAILY GOALS</h1>
        <p style={{ margin: '4px 0 0', fontSize: '0.78rem', color: '#5c5044' }}>
          {new Date(today + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} · {done}/{total} done
        </p>
      </div>

      {/* Progress bar */}
      {total > 0 && (
        <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2, marginBottom: '1.5rem', overflow: 'hidden' }}>
          <div style={{ height: '100%', background: '#c9a84c', width: `${Math.round((done/total)*100)}%`, transition: 'width 0.3s ease', borderRadius: 2 }} />
        </div>
      )}

      {/* Add goal */}
      <div style={{ display: 'flex', gap: 8, marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && add()}
          placeholder="New goal for today…"
          style={{
            flex: 1, minWidth: 200, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)',
            borderRadius: 6, color: '#e8ddd0', fontSize: 13, padding: '8px 12px',
            fontFamily: 'var(--font-body)', outline: 'none',
          }}
        />
        <select
          value={cat}
          onChange={e => setCat(e.target.value as GoalCategory)}
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 6, color: '#8a7f70', fontSize: 13, padding: '8px 10px', fontFamily: 'var(--font-body)', outline: 'none' }}
        >
          {CATS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
        <button
          onClick={add}
          disabled={saving || !text.trim()}
          style={{ padding: '8px 14px', background: '#c9a84c', color: '#070707', border: 'none', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-body)', opacity: (!text.trim() || saving) ? 0.5 : 1 }}
        >
          <Plus size={14} /> Add
        </button>
      </div>

      {/* Category filter pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: '1.25rem' }}>
        {CATS.filter(c => goals.some(g => g.category === c.id)).map(c => {
          const count = goals.filter(g => g.category === c.id).length
          const doneC = goals.filter(g => g.category === c.id && g.done).length
          return (
            <div key={c.id} style={{ fontSize: 10, padding: '3px 10px', borderRadius: 99, border: `1px solid ${c.color}33`, color: c.color, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              {c.label} {doneC}/{count}
            </div>
          )
        })}
      </div>

      {loading ? (
        <div style={{ color: '#3a2e26', fontSize: 13 }}>Loading…</div>
      ) : goals.length === 0 ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#3a2e26', fontSize: 13 }}>No goals yet today — add one above</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {/* Pending first, done after */}
          {[...goals.filter(g => !g.done), ...goals.filter(g => g.done)].map(goal => {
            const catInfo = CATS.find(c => c.id === goal.category)!
            return (
              <div
                key={goal.id}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
                  background: goal.done ? 'rgba(255,255,255,0.01)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${goal.done ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.07)'}`,
                  borderRadius: 8, opacity: goal.done ? 0.5 : 1, transition: 'opacity 0.2s',
                }}
              >
                <button
                  onClick={() => toggle(goal)}
                  style={{
                    width: 20, height: 20, borderRadius: '50%', flexShrink: 0, cursor: 'pointer',
                    background: goal.done ? '#34d399' : 'transparent',
                    border: `2px solid ${goal.done ? '#34d399' : 'rgba(255,255,255,0.15)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  {goal.done && <Check size={11} style={{ color: '#070707' }} />}
                </button>
                <span style={{ flex: 1, fontSize: 13, color: '#e8ddd0', textDecoration: goal.done ? 'line-through' : 'none' }}>
                  {goal.text}
                </span>
                <span style={{ fontSize: 9, padding: '2px 7px', borderRadius: 99, border: `1px solid ${catInfo.color}33`, color: catInfo.color, textTransform: 'uppercase', letterSpacing: '0.12em', flexShrink: 0 }}>
                  {catInfo.label}
                </span>
                <button onClick={() => remove(goal.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2a2215', padding: 2 }}>
                  <Trash2 size={11} />
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
