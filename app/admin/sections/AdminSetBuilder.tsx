'use client'

import { useState, useEffect } from 'react'
import { GripVertical, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import type { Show, Song, ShowSetList, ShowSetListItem } from '@/lib/data'

export default function AdminSetBuilder() {
  const [shows, setShows]     = useState<Show[]>([])
  const [songs, setSongs]     = useState<Song[]>([])
  const [selectedShow, setSelectedShow] = useState<string>('')
  const [setList, setSetList] = useState<ShowSetListItem[]>([])
  const [saving, setSaving]   = useState(false)
  const [saved, setSaved]     = useState(false)
  const [loading, setLoading] = useState(true)
  const [addOpen, setAddOpen] = useState(false)
  const [dragIdx, setDragIdx] = useState<number | null>(null)

  useEffect(() => {
    Promise.all([
      fetch('/api/content').then(r => r.json()),
      fetch('/api/songs').then(r => r.json()),
    ]).then(([c, s]) => {
      setShows(c.shows ?? [])
      setSongs(s)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    if (!selectedShow) { setSetList([]); return }
    fetch(`/api/shows/setlist?showId=${selectedShow}`)
      .then(r => r.json())
      .then((d: ShowSetList | null) => setSetList(d?.items ?? []))
  }, [selectedShow])

  function addSong(songId: string) {
    if (setList.some(i => i.songId === songId)) return
    setSetList(prev => [...prev, { songId, order: prev.length + 1 }])
    setAddOpen(false)
  }

  function removeSong(idx: number) {
    setSetList(prev => prev.filter((_, i) => i !== idx).map((item, i) => ({ ...item, order: i + 1 })))
  }

  function moveUp(idx: number) {
    if (idx === 0) return
    const next = [...setList]
    ;[next[idx - 1], next[idx]] = [next[idx], next[idx - 1]]
    setSetList(next.map((item, i) => ({ ...item, order: i + 1 })))
  }

  function moveDown(idx: number) {
    if (idx === setList.length - 1) return
    const next = [...setList]
    ;[next[idx], next[idx + 1]] = [next[idx + 1], next[idx]]
    setSetList(next.map((item, i) => ({ ...item, order: i + 1 })))
  }

  async function save() {
    if (!selectedShow) return
    setSaving(true)
    await fetch('/api/shows/setlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ showId: selectedShow, items: setList }),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const INPUT: React.CSSProperties = {
    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)',
    borderRadius: 6, color: '#e8ddd0', fontSize: 13, padding: '8px 12px',
    fontFamily: 'var(--font-body)', outline: 'none',
  }

  const available = songs.filter(s => !setList.some(i => i.songId === s.id))

  return (
    <div style={{ maxWidth: 680 }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ margin: 0, fontSize: '1.3rem', color: '#e8ddd0', fontFamily: 'var(--font-display)', letterSpacing: '0.08em' }}>SET BUILDER</h1>
        <p style={{ margin: '4px 0 0', fontSize: '0.78rem', color: '#5c5044' }}>Build an ordered set list for a specific show</p>
      </div>

      {loading ? (
        <div style={{ color: '#3a2e26', fontSize: 13 }}>Loading…</div>
      ) : (
        <>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontSize: 11, color: '#5c5044', display: 'block', marginBottom: 6 }}>Select Show</label>
            <select
              value={selectedShow}
              onChange={e => setSelectedShow(e.target.value)}
              style={{ ...INPUT, width: '100%' }}
            >
              <option value="">— pick a show —</option>
              {shows.map(s => (
                <option key={s.id} value={s.id}>{s.date} · {s.venue}</option>
              ))}
            </select>
          </div>

          {selectedShow && (
            <>
              {setList.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: '1.25rem' }}>
                  {setList.map((item, idx) => {
                    const song = songs.find(s => s.id === item.songId)
                    return (
                      <div
                        key={item.songId}
                        style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 6 }}
                      >
                        <GripVertical size={13} style={{ color: '#2a2215', flexShrink: 0 }} />
                        <span style={{ fontSize: 11, color: '#3a2e26', width: 20, textAlign: 'center', flexShrink: 0 }}>{idx + 1}</span>
                        <span style={{ flex: 1, fontSize: 13, color: '#e8ddd0' }}>
                          {song?.title ?? item.songId}
                          {song?.type === 'cover' && song.originalArtist && (
                            <span style={{ fontSize: 11, color: '#3a2e26', marginLeft: 6 }}>{song.originalArtist}</span>
                          )}
                        </span>
                        <button onClick={() => moveUp(idx)} style={{ background: 'none', border: 'none', cursor: idx === 0 ? 'default' : 'pointer', color: idx === 0 ? '#1a1410' : '#5c5044', padding: 2 }}>
                          <ChevronUp size={13} />
                        </button>
                        <button onClick={() => moveDown(idx)} style={{ background: 'none', border: 'none', cursor: idx === setList.length - 1 ? 'default' : 'pointer', color: idx === setList.length - 1 ? '#1a1410' : '#5c5044', padding: 2 }}>
                          <ChevronDown size={13} />
                        </button>
                        <button onClick={() => removeSong(idx)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3a2e26', padding: 2 }}>
                          <Trash2 size={12} />
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}

              {addOpen ? (
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '1rem', marginBottom: '1rem' }}>
                  <div style={{ fontSize: 11, color: '#5c5044', marginBottom: 8 }}>Pick a song to add:</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {available.map(s => (
                      <button
                        key={s.id}
                        onClick={() => addSong(s.id)}
                        style={{ padding: '5px 12px', borderRadius: 99, fontSize: 12, cursor: 'pointer', fontFamily: 'var(--font-body)', background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.20)', color: '#c9a84c' }}
                      >
                        {s.title}
                      </button>
                    ))}
                    {available.length === 0 && <span style={{ fontSize: 12, color: '#3a2e26' }}>All songs added</span>}
                  </div>
                  <button onClick={() => setAddOpen(false)} style={{ marginTop: 10, fontSize: 11, color: '#3a2e26', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>Cancel</button>
                </div>
              ) : (
                <button
                  onClick={() => setAddOpen(true)}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#5c5044', background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.10)', borderRadius: 6, padding: '8px 14px', cursor: 'pointer', fontFamily: 'var(--font-body)', marginBottom: '1.25rem' }}
                >
                  <Plus size={12} /> Add Song
                </button>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button
                  onClick={save}
                  disabled={saving || setList.length === 0}
                  style={{ padding: '8px 20px', background: '#c9a84c', color: '#070707', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-body)' }}
                >
                  {saving ? 'Saving…' : 'Save Set List'}
                </button>
                {saved && <span style={{ fontSize: 12, color: '#34d399' }}>Saved ✓</span>}
                <span style={{ fontSize: 11, color: '#3a2e26', marginLeft: 'auto' }}>{setList.length} song{setList.length !== 1 ? 's' : ''}</span>
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}
