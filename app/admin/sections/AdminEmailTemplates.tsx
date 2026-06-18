'use client'

// Admin section — Email Templates manager: create, edit, and delete reusable email
// templates via /api/email-templates. Edits name/subject/HTML body with a live iframe
// preview and detected {{variables}}; system templates are protected from deletion.

import { useEffect, useState, useRef } from 'react'
import { Plus, Trash2, Save, Lock, Eye } from 'lucide-react'
import type { EmailTemplate } from '@/lib/data'

const CARD: React.CSSProperties = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8 }
const INPUT: React.CSSProperties = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: '#e8ddd0', padding: '7px 11px', fontSize: 13, width: '100%', boxSizing: 'border-box', fontFamily: 'var(--font-body)' }
const LABEL: React.CSSProperties = { fontSize: 11, color: '#8a7f70', letterSpacing: '0.08em', display: 'block', marginBottom: 4 }
const BTN: React.CSSProperties = { border: 'none', cursor: 'pointer', padding: '7px 14px', borderRadius: 6, fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-body)' }

function extractVars(str: string): string[] {
  const matches = str.match(/\{\{(\w+)\}\}/g) ?? []
  return [...new Set(matches.map(m => m.slice(2, -2)))]
}

// ── New Template Form ──────────────────────────────────────────────────────────
function NewTemplateForm({ onCreate, onCancel }: {
  onCreate: (t: EmailTemplate) => void
  onCancel: () => void
}) {
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [subject, setSubject] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !slug || !subject) { setError('Name, slug, and subject are required.'); return }
    setSaving(true); setError('')
    try {
      const res = await fetch('/api/email-templates', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, slug, subject, bodyHtml: '' }),
      })
      if (!res.ok) { const e = await res.json(); throw new Error(e.error ?? 'Failed') }
      const created: EmailTemplate = await res.json()
      onCreate(created)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to create')
    } finally { setSaving(false) }
  }

  return (
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.14em', fontSize: 13, color: '#e8ddd0', marginBottom: 4 }}>NEW TEMPLATE</div>
      <div>
        <label style={LABEL}>NAME</label>
        <input value={name} onChange={e => setName(e.target.value)} style={INPUT} required placeholder="Template display name" />
      </div>
      <div>
        <label style={LABEL}>SLUG</label>
        <input value={slug} onChange={e => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
          style={INPUT} required placeholder="my-template-slug" />
      </div>
      <div>
        <label style={LABEL}>SUBJECT</label>
        <input value={subject} onChange={e => setSubject(e.target.value)} style={INPUT} required placeholder="Email subject" />
      </div>
      {error && <div style={{ fontSize: 12, color: '#c04020' }}>{error}</div>}
      <div style={{ display: 'flex', gap: 8 }}>
        <button type="submit" disabled={saving}
          style={{ ...BTN, background: '#c9a84c', color: '#070707', fontWeight: 700, flex: 1, justifyContent: 'center' }}>
          {saving ? 'Creating…' : 'Create Template'}
        </button>
        <button type="button" onClick={onCancel}
          style={{ ...BTN, background: 'rgba(255,255,255,0.06)', color: '#8a7f70' }}>
          Cancel
        </button>
      </div>
    </form>
  )
}

// ── Template Editor ────────────────────────────────────────────────────────────
function TemplateEditor({ template, onChange, onDelete }: {
  template: EmailTemplate
  onChange: (updated: EmailTemplate) => void
  onDelete: (id: string) => void
}) {
  const [form, setForm] = useState<EmailTemplate>(template)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [deleting, setDeleting] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => { setForm(template); setSaved(false) }, [template.id]) // eslint-disable-line react-hooks/exhaustive-deps

  // Always render iframe preview
  useEffect(() => {
    if (iframeRef.current) {
      const doc = iframeRef.current.contentDocument
      if (doc) {
        doc.open()
        doc.write(`<html><head><style>body{background:#fff;margin:0;padding:0;}</style></head><body>${form.bodyHtml}</body></html>`)
        doc.close()
      }
    }
  }, [form.bodyHtml])

  function setField(k: keyof EmailTemplate, v: unknown) { setForm(f => ({ ...f, [k]: v })) }

  async function save() {
    setSaving(true); setError('')
    try {
      const res = await fetch(`/api/email-templates/${template.id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, subject: form.subject, bodyHtml: form.bodyHtml }),
      })
      if (!res.ok) { const e = await res.json(); throw new Error(e.error ?? 'Failed') }
      const updated: EmailTemplate = await res.json()
      onChange(updated); setSaved(true); setTimeout(() => setSaved(false), 2000)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Save failed')
    } finally { setSaving(false) }
  }

  async function handleDelete() {
    if (!confirm(`Delete template "${template.name}"?`)) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/email-templates/${template.id}`, { method: 'DELETE' })
      if (res.status === 403) { setError('System templates cannot be deleted.'); setDeleting(false); return }
      if (!res.ok) throw new Error()
      onDelete(template.id)
    } catch {
      setError('Delete failed')
    } finally { setDeleting(false) }
  }

  const allVars = extractVars(form.subject + ' ' + form.bodyHtml)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18, height: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.14em', fontSize: 14, color: '#e8ddd0' }}>
            {form.name}
            {template.isSystem && (
              <span style={{ marginLeft: 10, fontSize: 10, padding: '2px 8px', background: 'rgba(96,165,250,0.15)', color: '#60a5fa', borderRadius: 99, letterSpacing: '0.08em', verticalAlign: 'middle' }}>
                SYSTEM
              </span>
            )}
          </div>
          <div style={{ fontSize: 11, color: '#5c5044', marginTop: 3 }}>/{template.slug}</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={save} disabled={saving}
            style={{ ...BTN, background: saved ? '#34d399' : '#c9a84c', color: '#070707', fontWeight: 700 }}>
            <Save size={13} /> {saved ? 'Saved!' : saving ? 'Saving…' : 'Save'}
          </button>
          {template.isSystem ? (
            <button disabled
              style={{ ...BTN, background: 'rgba(255,255,255,0.04)', color: '#5c5044', cursor: 'not-allowed' }}>
              <Lock size={13} /> Protected
            </button>
          ) : (
            <button onClick={handleDelete} disabled={deleting}
              style={{ ...BTN, background: 'rgba(192,64,32,0.15)', color: '#c04020', border: '1px solid rgba(192,64,32,0.3)' }}>
              <Trash2 size={13} /> {deleting ? 'Deleting…' : 'Delete'}
            </button>
          )}
        </div>
      </div>

      {/* Fields */}
      <div>
        <label style={LABEL}>NAME</label>
        <input value={form.name} onChange={e => setField('name', e.target.value)} style={INPUT} />
      </div>
      <div>
        <label style={LABEL}>SUBJECT</label>
        <input value={form.subject} onChange={e => setField('subject', e.target.value)} style={INPUT} />
      </div>

      {/* Variables */}
      {allVars.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: '#5c5044' }}>Variables:</span>
          {allVars.map(v => (
            <span key={v} style={{ fontSize: 11, padding: '2px 8px', background: 'rgba(167,139,250,0.15)', color: '#a78bfa', borderRadius: 99, fontFamily: 'monospace' }}>
              {`{{${v}}}`}
            </span>
          ))}
        </div>
      )}

      {/* Email preview — HTML hidden */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0, flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 10px', borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.03)', borderRadius: '6px 6px 0 0' }}>
          <Eye size={12} style={{ color: '#8a7f70' }} />
          <span style={{ fontSize: 11, color: '#8a7f70', letterSpacing: '0.08em' }}>PREVIEW</span>
        </div>
        <div style={{ border: '1px solid rgba(255,255,255,0.1)', borderTop: 'none', borderRadius: '0 0 6px 6px', overflow: 'hidden', minHeight: 360 }}>
          <iframe
            ref={iframeRef}
            title="Email preview"
            style={{ width: '100%', height: 420, border: 'none', display: 'block' }}
            sandbox="allow-same-origin"
          />
        </div>
      </div>

      {error && <div style={{ fontSize: 12, color: '#c04020' }}>{error}</div>}
      {template.isSystem && (
        <div style={{ fontSize: 12, color: '#5c5044', fontStyle: 'italic' }}>
          System template — cannot be deleted. Can be edited.
        </div>
      )}
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function AdminEmailTemplates() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState<string|null>(null)
  const [creatingNew, setCreatingNew] = useState(false)

  useEffect(() => {
    fetch('/api/email-templates').then(r => r.json()).then((d: EmailTemplate[]) => {
      setTemplates(d)
      if (d.length) setSelectedId(d[0].id)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  function handleCreate(t: EmailTemplate) {
    setTemplates(prev => [...prev, t])
    setSelectedId(t.id)
    setCreatingNew(false)
  }

  function handleChange(updated: EmailTemplate) {
    setTemplates(prev => prev.map(t => t.id === updated.id ? updated : t))
  }

  function handleDelete(id: string) {
    const remaining = templates.filter(t => t.id !== id)
    setTemplates(remaining)
    setSelectedId(remaining.length ? remaining[0].id : null)
  }

  const selectedTemplate = templates.find(t => t.id === selectedId)

  if (loading) return <div style={{ color: '#8a7f70', padding: 40, textAlign: 'center' }}>Loading templates…</div>

  return (
    <div style={{ fontFamily: 'var(--font-body)', color: '#e8ddd0', display: 'grid', gridTemplateColumns: '260px 1fr', gap: 20, alignItems: 'start', height: '100%' }}>
      {/* Left sidebar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <span style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.15em', fontSize: 12, color: '#8a7f70' }}>TEMPLATES</span>
          <button onClick={() => { setCreatingNew(true); setSelectedId(null) }}
            style={{ ...BTN, background: 'rgba(201,168,76,0.15)', color: '#c9a84c', border: '1px solid rgba(201,168,76,0.3)', padding: '4px 10px', fontSize: 12 }}>
            <Plus size={12} /> New
          </button>
        </div>
        {templates.length === 0 && <div style={{ fontSize: 12, color: '#5c5044' }}>No templates yet.</div>}
        {templates.map(t => (
          <button key={t.id}
            onClick={() => { setSelectedId(t.id); setCreatingNew(false) }}
            style={{
              background: selectedId === t.id ? 'rgba(201,168,76,0.1)' : 'rgba(255,255,255,0.02)',
              border: `1px solid ${selectedId === t.id ? 'rgba(201,168,76,0.35)' : 'rgba(255,255,255,0.06)'}`,
              borderRadius: 7, padding: '10px 13px', textAlign: 'left', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', gap: 3,
            }}>
            <div style={{ fontSize: 13, color: selectedId === t.id ? '#c9a84c' : '#e8ddd0', fontFamily: 'var(--font-body)', display: 'flex', alignItems: 'center', gap: 6 }}>
              {t.isSystem && <Lock size={10} style={{ color: '#60a5fa', flexShrink: 0 }} />}
              {t.name}
            </div>
            <div style={{ fontSize: 10, color: '#5c5044', fontFamily: 'monospace' }}>/{t.slug}</div>
          </button>
        ))}
      </div>

      {/* Right editor */}
      <div style={{ ...CARD, padding: 24, minHeight: 500 }}>
        {creatingNew ? (
          <NewTemplateForm onCreate={handleCreate} onCancel={() => setCreatingNew(false)} />
        ) : selectedTemplate ? (
          <TemplateEditor template={selectedTemplate} onChange={handleChange} onDelete={handleDelete} />
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#5c5044' }}>
            Select a template or create a new one.
          </div>
        )}
      </div>
    </div>
  )
}
