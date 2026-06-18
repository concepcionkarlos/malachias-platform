'use client'

// Admin section — Finances tracker: records categorized income and expense entries,
// shows running income/expense/net totals, and supports adding and deleting entries.

import { useState, useEffect } from 'react'
import { Plus, Trash2, TrendingUp, TrendingDown, DollarSign } from 'lucide-react'
import type { FinanceEntry, FinanceCategory } from '@/lib/data'

const INCOME_CATS: FinanceCategory[] = ['guarantee', 'door', 'merch', 'streaming']
const EXPENSE_CATS: FinanceCategory[] = ['gas', 'equipment', 'rehearsal', 'food', 'lodging', 'promotion', 'other']

const CAT_LABELS: Record<FinanceCategory, string> = {
  guarantee: 'Guarantee', door: 'Door %', merch: 'Merch', streaming: 'Streaming',
  gas: 'Gas', equipment: 'Equipment', rehearsal: 'Rehearsal space', food: 'Food',
  lodging: 'Lodging', promotion: 'Promotion', other: 'Other',
}

const BLANK = { type: 'income' as 'income' | 'expense', amount: '', category: 'guarantee' as FinanceCategory, date: '', description: '', showId: '' }

export default function AdminFinances() {
  const [entries, setEntries] = useState<FinanceEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding]   = useState(false)
  const [form, setForm]       = useState(BLANK)
  const [saving, setSaving]   = useState(false)

  useEffect(() => {
    fetch('/api/finances').then(r => r.json()).then(d => { setEntries(d); setLoading(false) })
  }, [])

  async function save() {
    if (!form.amount || !form.date) return
    setSaving(true)
    const entry = await fetch('/api/finances', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, amount: parseFloat(form.amount) }),
    }).then(r => r.json())
    setEntries(prev => [entry, ...prev])
    setForm(BLANK)
    setAdding(false)
    setSaving(false)
  }

  async function remove(id: string) {
    await fetch('/api/finances', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    setEntries(prev => prev.filter(e => e.id !== id))
  }

  const totalIncome  = entries.filter(e => e.type === 'income').reduce((s, e) => s + e.amount, 0)
  const totalExpense = entries.filter(e => e.type === 'expense').reduce((s, e) => s + e.amount, 0)
  const net = totalIncome - totalExpense

  const INPUT: React.CSSProperties = {
    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)',
    borderRadius: 6, color: '#e8ddd0', fontSize: 13, padding: '8px 12px',
    fontFamily: 'var(--font-body)', outline: 'none', width: '100%', boxSizing: 'border-box',
  }

  const fmt = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

  return (
    <div style={{ maxWidth: 760 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.3rem', color: '#e8ddd0', fontFamily: 'var(--font-display)', letterSpacing: '0.08em' }}>FINANCES</h1>
          <p style={{ margin: '4px 0 0', fontSize: '0.78rem', color: '#5c5044' }}>Income & expense tracker</p>
        </div>
        <button onClick={() => setAdding(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: '#c9a84c', color: '#070707', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-body)' }}>
          <Plus size={14} /> Add Entry
        </button>
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: '1.5rem' }}>
        {[
          { label: 'Income', value: totalIncome, icon: TrendingUp, color: '#34d399' },
          { label: 'Expenses', value: totalExpense, icon: TrendingDown, color: '#ef4444' },
          { label: 'Net', value: net, icon: DollarSign, color: net >= 0 ? '#c9a84c' : '#ef4444' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8, padding: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <Icon size={13} style={{ color }} />
              <span style={{ fontSize: 11, color: '#5c5044', letterSpacing: '0.10em', textTransform: 'uppercase' }}>{label}</span>
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color, fontFamily: 'var(--font-display)' }}>{fmt(value)}</div>
          </div>
        ))}
      </div>

      {/* Add Form */}
      {adding && (
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr 1fr', gap: 10, marginBottom: 10 }}>
            <select value={form.type} onChange={e => { const t = e.target.value as 'income' | 'expense'; setForm(f => ({ ...f, type: t, category: t === 'income' ? 'guarantee' : 'gas' })) }} style={{ ...INPUT, width: 'auto' }}>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value as FinanceCategory }))} style={{ ...INPUT }}>
              {(form.type === 'income' ? INCOME_CATS : EXPENSE_CATS).map(c => (
                <option key={c} value={c}>{CAT_LABELS[c]}</option>
              ))}
            </select>
            <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} style={INPUT} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
            <input type="number" min="0" step="0.01" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} placeholder="Amount $" style={INPUT} />
            <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Description (optional)" style={INPUT} />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={save} disabled={saving} style={{ padding: '7px 16px', background: '#c9a84c', color: '#070707', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-body)' }}>
              {saving ? 'Saving…' : 'Save'}
            </button>
            <button onClick={() => setAdding(false)} style={{ padding: '7px 16px', background: 'transparent', color: '#5c5044', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontFamily: 'var(--font-body)' }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ color: '#3a2e26', fontSize: 13 }}>Loading…</div>
      ) : entries.length === 0 ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#3a2e26', fontSize: 13 }}>No entries yet</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {entries.map(e => (
            <div key={e.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 6 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: e.type === 'income' ? '#34d399' : '#ef4444', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: 13, color: '#e8ddd0' }}>{CAT_LABELS[e.category]}</span>
                {e.description && <span style={{ fontSize: 11, color: '#3a2e26', marginLeft: 8 }}>{e.description}</span>}
              </div>
              <span style={{ fontSize: 11, color: '#5c5044' }}>{e.date}</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: e.type === 'income' ? '#34d399' : '#ef4444', minWidth: 80, textAlign: 'right' }}>
                {e.type === 'expense' ? '−' : '+'}{fmt(e.amount)}
              </span>
              <button onClick={() => remove(e.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2a2215', padding: 2 }}>
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
