'use client'

import { useState, useEffect } from 'react'
import { Plus, Check, Trash2, Calendar, AlertCircle, X } from 'lucide-react'
import type { BandTask, TaskStatus, TaskPriority, TaskCategory } from '@/lib/data'
import { TASK_CATEGORIES } from '@/lib/data'

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeId() {
  return Math.random().toString(36).slice(2, 10)
}

function formatDue(iso: string): { label: string; overdue: boolean } {
  const d = new Date(iso + 'T00:00:00')
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const diff = Math.round((d.getTime() - today.getTime()) / 86400000)
  const overdue = diff < 0
  if (diff === 0) return { label: 'Today', overdue: false }
  if (diff === 1) return { label: 'Tomorrow', overdue: false }
  if (diff === -1) return { label: 'Yesterday', overdue: true }
  if (overdue) return { label: `${Math.abs(diff)}d overdue`, overdue: true }
  if (diff <= 7) return { label: `In ${diff}d`, overdue: false }
  return { label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), overdue: false }
}

function catEmoji(category: TaskCategory): string {
  return TASK_CATEGORIES.find(c => c.id === category)?.emoji ?? '⚡'
}
function catLabel(category: TaskCategory): string {
  return TASK_CATEGORIES.find(c => c.id === category)?.label ?? category
}

// ── Styles ────────────────────────────────────────────────────────────────────

const GOLD = '#c9a84c'
const MUTED = '#5c5044'
const DIM = '#342c24'
const TEXT = '#e8ddd0'
const SUBTLE = 'rgba(255,255,255,0.04)'
const BORDER = 'rgba(255,255,255,0.07)'

const col: React.CSSProperties = {
  background: SUBTLE,
  border: `1px solid ${BORDER}`,
  borderRadius: 10,
  display: 'flex',
  flexDirection: 'column',
  minHeight: 200,
  flex: 1,
  minWidth: 260,
}

const colHead: React.CSSProperties = {
  padding: '14px 16px 10px',
  borderBottom: `1px solid ${BORDER}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}

const badge = (color: string): React.CSSProperties => ({
  fontSize: 11,
  fontWeight: 700,
  padding: '2px 8px',
  borderRadius: 99,
  background: `${color}18`,
  color,
  border: `1px solid ${color}30`,
})

const cardStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.035)',
  border: `1px solid ${BORDER}`,
  borderRadius: 8,
  padding: '12px 14px',
  cursor: 'default',
  transition: 'border-color 0.15s',
}

const priorityColors: Record<TaskPriority, string> = {
  high: '#c04020',
  medium: '#c9a84c',
  low: '#5c5044',
}
const priorityLabels: Record<TaskPriority, string> = { high: '!!! High', medium: '!! Med', low: '! Low' }

const INPUT: React.CSSProperties = {
  background: 'rgba(255,255,255,0.06)',
  border: `1px solid ${BORDER}`,
  borderRadius: 6,
  color: TEXT,
  padding: '7px 10px',
  fontSize: 13,
  fontFamily: 'var(--font-body)',
  width: '100%',
  boxSizing: 'border-box',
  outline: 'none',
}

const SEL: React.CSSProperties = { ...INPUT, cursor: 'pointer' }

const BTN = (primary?: boolean): React.CSSProperties => ({
  border: 'none',
  cursor: 'pointer',
  padding: '7px 14px',
  borderRadius: 6,
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: '0.05em',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 5,
  fontFamily: 'var(--font-body)',
  background: primary ? GOLD : 'rgba(255,255,255,0.07)',
  color: primary ? '#070707' : MUTED,
  transition: 'opacity 0.15s',
})

// ── New Task Form ─────────────────────────────────────────────────────────────

interface NewTaskFormProps {
  onAdd: (task: BandTask) => void
  onClose: () => void
}

function NewTaskForm({ onAdd, onClose }: NewTaskFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<TaskPriority>('medium')
  const [category, setCategory] = useState<TaskCategory>('other')
  const [dueDate, setDueDate] = useState('')
  const [saving, setSaving] = useState(false)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    setSaving(true)
    const task: BandTask = {
      id: makeId(),
      title: title.trim(),
      description: description.trim() || undefined,
      status: 'todo',
      priority,
      category,
      dueDate: dueDate || undefined,
      createdAt: new Date().toISOString(),
    }
    onAdd(task)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
      <div style={{ background: '#0e0c0a', border: `1px solid ${BORDER}`, borderRadius: 12, padding: '28px 28px 24px', width: 460, maxWidth: '95vw' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 12, letterSpacing: '0.18em', color: GOLD }}>NEW TASK</div>
          <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: MUTED, padding: 2 }}><X size={15} /></button>
        </div>
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input
            autoFocus
            placeholder="Task title…"
            value={title}
            onChange={e => setTitle(e.target.value)}
            style={{ ...INPUT, fontSize: 15, fontWeight: 600 }}
            required
          />
          <textarea
            placeholder="Description (optional)"
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={2}
            style={{ ...INPUT, resize: 'vertical' }}
          />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label style={{ fontSize: 11, color: MUTED, display: 'block', marginBottom: 4 }}>Category</label>
              <select value={category} onChange={e => setCategory(e.target.value as TaskCategory)} style={SEL}>
                {TASK_CATEGORIES.map(c => (
                  <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 11, color: MUTED, display: 'block', marginBottom: 4 }}>Priority</label>
              <select value={priority} onChange={e => setPriority(e.target.value as TaskPriority)} style={SEL}>
                <option value="high">!!! High</option>
                <option value="medium">!! Medium</option>
                <option value="low">! Low</option>
              </select>
            </div>
          </div>
          <div>
            <label style={{ fontSize: 11, color: MUTED, display: 'block', marginBottom: 4 }}>Due date (optional)</label>
            <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} style={SEL} />
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 4 }}>
            <button type="button" onClick={onClose} style={BTN()}>Cancel</button>
            <button type="submit" disabled={saving || !title.trim()} style={{ ...BTN(true), opacity: !title.trim() ? 0.5 : 1 }}>
              <Plus size={13} /> Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Task Card ─────────────────────────────────────────────────────────────────

interface TaskCardProps {
  task: BandTask
  onMove: (id: string, status: TaskStatus) => void
  onDelete: (id: string) => void
}

function TaskCard({ task, onMove, onDelete }: TaskCardProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const due = task.dueDate ? formatDue(task.dueDate) : null
  const pColor = priorityColors[task.priority]

  return (
    <div
      style={{ ...cardStyle, position: 'relative' }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(201,168,76,0.25)')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = BORDER)}
    >
      {/* Category + priority pill row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
        <span style={{ fontSize: 12 }}>{catEmoji(task.category)}</span>
        <span style={{ fontSize: 10, color: DIM, letterSpacing: '0.08em' }}>{catLabel(task.category).toUpperCase()}</span>
        <span style={{ marginLeft: 'auto', fontSize: 10, color: pColor, fontWeight: 700 }}>
          {priorityLabels[task.priority]}
        </span>
      </div>

      {/* Title */}
      <p style={{ fontSize: 13, color: task.status === 'done' ? MUTED : TEXT, fontWeight: 600, lineHeight: 1.4, textDecoration: task.status === 'done' ? 'line-through' : 'none', marginBottom: task.description ? 6 : 0 }}>
        {task.title}
      </p>

      {/* Description */}
      {task.description && (
        <p style={{ fontSize: 12, color: MUTED, lineHeight: 1.5, marginBottom: 8 }}>{task.description}</p>
      )}

      {/* Due date */}
      {due && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 6 }}>
          <Calendar size={10} style={{ color: due.overdue ? '#c04020' : DIM }} />
          <span style={{ fontSize: 11, color: due.overdue ? '#c04020' : DIM, fontWeight: due.overdue ? 700 : 400 }}>
            {due.label}
          </span>
          {due.overdue && <AlertCircle size={10} style={{ color: '#c04020' }} />}
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10, paddingTop: 8, borderTop: `1px solid ${BORDER}` }}>
        {task.status !== 'done' && (
          <button
            type="button"
            onClick={() => onMove(task.id, task.status === 'todo' ? 'in_progress' : 'done')}
            style={{ ...BTN(true), padding: '4px 10px', fontSize: 11 }}
            title={task.status === 'todo' ? 'Start' : 'Mark done'}
          >
            {task.status === 'todo' ? '▶ Start' : <><Check size={11} /> Done</>}
          </button>
        )}
        {task.status !== 'todo' && (
          <button
            type="button"
            onClick={() => onMove(task.id, task.status === 'done' ? 'in_progress' : 'todo')}
            style={{ ...BTN(), padding: '4px 10px', fontSize: 11 }}
          >
            ↩ Back
          </button>
        )}
        <button
          type="button"
          onClick={() => onDelete(task.id)}
          style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: DIM, padding: 3, display: 'flex', alignItems: 'center' }}
          title="Delete task"
          onMouseEnter={e => (e.currentTarget.style.color = '#c04020')}
          onMouseLeave={e => (e.currentTarget.style.color = DIM)}
        >
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  )
}

// ── Column ────────────────────────────────────────────────────────────────────

const COLUMN_COLORS: Record<TaskStatus, string> = {
  todo: '#60a5fa',
  in_progress: GOLD,
  done: '#34d399',
}
const COLUMN_LABELS: Record<TaskStatus, string> = {
  todo: 'To Do',
  in_progress: 'In Progress',
  done: 'Done',
}

interface ColumnProps {
  status: TaskStatus
  tasks: BandTask[]
  onMove: (id: string, status: TaskStatus) => void
  onDelete: (id: string) => void
}

function Column({ status, tasks, onMove, onDelete }: ColumnProps) {
  const color = COLUMN_COLORS[status]
  return (
    <div style={col}>
      <div style={colHead}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, display: 'inline-block', flexShrink: 0 }} />
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: '0.16em', color: TEXT }}>{COLUMN_LABELS[status].toUpperCase()}</span>
        </div>
        <span style={badge(color)}>{tasks.length}</span>
      </div>

      <div style={{ padding: '10px 10px', display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
        {tasks.length === 0 && (
          <div style={{ textAlign: 'center', padding: '24px 0', color: DIM, fontSize: 12, border: `2px dashed ${BORDER}`, borderRadius: 8 }}>
            {status === 'done' ? 'Nothing done yet' : 'No tasks here'}
          </div>
        )}
        {tasks.map(t => (
          <TaskCard key={t.id} task={t} onMove={onMove} onDelete={onDelete} />
        ))}
      </div>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function AdminTasks() {
  const [tasks, setTasks] = useState<BandTask[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [catFilter, setCatFilter] = useState<TaskCategory | 'all'>('all')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/content')
      .then(r => r.json())
      .then(d => { setTasks(d.tasks ?? []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  async function persist(updated: BandTask[]) {
    setSaving(true)
    const res = await fetch('/api/content', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tasks: updated }),
    })
    if (res.ok) setTasks(updated)
    setSaving(false)
  }

  function handleAdd(task: BandTask) {
    const updated = [task, ...tasks]
    persist(updated)
    setShowForm(false)
  }

  function handleMove(id: string, status: TaskStatus) {
    const updated = tasks.map(t =>
      t.id === id
        ? { ...t, status, completedAt: status === 'done' ? new Date().toISOString() : undefined }
        : t
    )
    persist(updated)
  }

  function handleDelete(id: string) {
    if (!confirm('Delete this task?')) return
    persist(tasks.filter(t => t.id !== id))
  }

  const filtered = catFilter === 'all' ? tasks : tasks.filter(t => t.category === catFilter)

  const todo = filtered.filter(t => t.status === 'todo')
  const inProgress = filtered.filter(t => t.status === 'in_progress')
  const done = filtered.filter(t => t.status === 'done')

  const overdue = todo.filter(t => t.dueDate && new Date(t.dueDate + 'T00:00:00') < new Date())

  if (loading) return <p style={{ color: MUTED, fontFamily: 'var(--font-body)' }}>Loading…</p>

  return (
    <div style={{ fontFamily: 'var(--font-body)', color: TEXT }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.18em', fontSize: 13, color: '#8a7f70', textTransform: 'uppercase', margin: 0 }}>Task Board</h2>
          <p style={{ fontSize: 12, color: DIM, marginTop: 4 }}>
            {tasks.filter(t => t.status !== 'done').length} open
            {overdue.length > 0 && <span style={{ color: '#c04020', fontWeight: 700, marginLeft: 6 }}>· {overdue.length} overdue</span>}
            {saving && <span style={{ color: MUTED, marginLeft: 8 }}>Saving…</span>}
          </p>
        </div>
        <button type="button" onClick={() => setShowForm(true)} style={{ ...BTN(true), padding: '8px 16px' }}>
          <Plus size={14} /> New Task
        </button>
      </div>

      {/* Stat pills */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        {[
          { label: 'To Do',       count: tasks.filter(t => t.status === 'todo').length,        color: '#60a5fa' },
          { label: 'In Progress', count: tasks.filter(t => t.status === 'in_progress').length, color: GOLD     },
          { label: 'Done',        count: tasks.filter(t => t.status === 'done').length,        color: '#34d399' },
        ].map(s => (
          <div key={s.label} style={{ background: SUBTLE, border: `1px solid ${BORDER}`, borderRadius: 8, padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 11, color: MUTED, letterSpacing: '0.06em' }}>{s.label}</span>
            <span style={{ fontSize: 20, fontWeight: 700, color: s.color }}>{s.count}</span>
          </div>
        ))}
      </div>

      {/* Category filter chips */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={() => setCatFilter('all')}
          style={{ ...BTN(catFilter === 'all'), padding: '4px 12px', fontSize: 11 }}
        >
          All
        </button>
        {TASK_CATEGORIES.map(c => (
          <button
            key={c.id}
            type="button"
            onClick={() => setCatFilter(catFilter === c.id ? 'all' : c.id)}
            style={{ ...BTN(catFilter === c.id), padding: '4px 12px', fontSize: 11 }}
          >
            {c.emoji} {c.label}
          </button>
        ))}
      </div>

      {/* Board */}
      <div style={{ display: 'flex', gap: 14, overflowX: 'auto', paddingBottom: 12 }}>
        <Column status="todo"        tasks={todo}       onMove={handleMove} onDelete={handleDelete} />
        <Column status="in_progress" tasks={inProgress} onMove={handleMove} onDelete={handleDelete} />
        <Column status="done"        tasks={done}       onMove={handleMove} onDelete={handleDelete} />
      </div>

      {/* New task modal */}
      {showForm && <NewTaskForm onAdd={handleAdd} onClose={() => setShowForm(false)} />}
    </div>
  )
}
