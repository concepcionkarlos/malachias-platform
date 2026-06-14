'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import {
  LayoutDashboard, Calendar, Users, ShoppingBag, FileText, Image, Mail,
  MapPin, Settings, Newspaper, BarChart2, StickyNote, Inbox, CheckSquare,
  Music, BookOpen,
  Menu, X, ExternalLink, LogOut, ChevronRight,
} from 'lucide-react'
import AdminLogin from './AdminLogin'

const SECTIONS = {
  dashboard:       { label: 'Dashboard',       icon: LayoutDashboard, group: 'Overview'    },
  bookings:        { label: 'Bookings',         icon: Calendar,        group: 'Operations'  },
  shows:           { label: 'Shows',            icon: MapPin,          group: 'Operations'  },
  tasks:           { label: 'Task Board',       icon: CheckSquare,     group: 'Operations'  },
  'song-stories':  { label: 'Behind the Song',  icon: Music,           group: 'Content'     },
  'war-room':      { label: 'War Room',         icon: BookOpen,        group: 'Content'     },
  'band-members':  { label: 'Band Members',     icon: Users,           group: 'Platform'    },
  merch:           { label: 'Merch',            icon: ShoppingBag,     group: 'Platform'    },
  media:           { label: 'Media',            icon: Image,           group: 'Platform'    },
  epk:             { label: 'Press Kit',        icon: Newspaper,       group: 'Platform'    },
  content:         { label: 'Site Content',     icon: FileText,        group: 'Platform'    },
  'venue-finder':  { label: 'Venue Finder',     icon: MapPin,          group: 'Outreach'    },
  'email-templates': { label: 'Email Templates', icon: Mail,           group: 'Outreach'    },
  inbox:           { label: 'Inbox',            icon: Inbox,           group: 'Outreach'    },
  analytics:       { label: 'Analytics',        icon: BarChart2,       group: 'Reports'     },
  notes:           { label: 'Notes',            icon: StickyNote,      group: 'Reports'     },
  settings:        { label: 'Settings',         icon: Settings,        group: 'System'      },
} as const

type TabKey = keyof typeof SECTIONS

const GROUPS = ['Overview', 'Operations', 'Content', 'Platform', 'Outreach', 'Reports', 'System']

const SectionComponents: Record<TabKey, React.ComponentType> = {
  dashboard:         dynamic(() => import('./sections/AdminDashboard')),
  bookings:          dynamic(() => import('./sections/AdminBookings')),
  shows:             dynamic(() => import('./sections/AdminShows')),
  tasks:             dynamic(() => import('./sections/AdminTasks')),
  'song-stories':    dynamic(() => import('./sections/AdminSongStories')),
  'war-room':        dynamic(() => import('./sections/AdminWarRoom')),
  'band-members':    dynamic(() => import('./sections/AdminBandMembers')),
  merch:             dynamic(() => import('./sections/AdminMerch')),
  media:             dynamic(() => import('./sections/AdminMedia')),
  epk:               dynamic(() => import('./sections/AdminEPK')),
  content:           dynamic(() => import('./sections/AdminContent')),
  'venue-finder':    dynamic(() => import('./sections/AdminVenueFinder')),
  'email-templates': dynamic(() => import('./sections/AdminEmailTemplates')),
  inbox:             dynamic(() => import('./sections/AdminInbox')),
  analytics:         dynamic(() => import('./sections/AdminAnalytics')),
  notes:             dynamic(() => import('./sections/AdminNotes')),
  settings:          dynamic(() => import('./sections/AdminSettings')),
}

const S = {
  sidebar: {
    width: 220,
    minHeight: '100vh',
    background: '#030202',
    borderRight: '1px solid rgba(255,255,255,0.055)',
    display: 'flex' as const,
    flexDirection: 'column' as const,
    flexShrink: 0,
  },
  wordmark: {
    padding: '1.5rem 1.25rem 1.25rem',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    display: 'flex' as const, alignItems: 'center' as const, justifyContent: 'space-between' as const,
  },
  nav: { flex: 1, padding: '1rem 0', overflowY: 'auto' as const },
  groupLabel: {
    fontSize: '0.52rem', letterSpacing: '0.30em', textTransform: 'uppercase' as const,
    color: '#2a2215', padding: '0 1.25rem', marginBottom: '0.3rem', display: 'block' as const,
  },
  navItem: (active: boolean) => ({
    display: 'flex' as const, alignItems: 'center' as const, gap: '0.65rem',
    padding: '0.5rem 1.25rem', fontSize: '0.78rem', letterSpacing: '0.03em',
    color: active ? '#c9a84c' : '#5c5044',
    borderLeft: active ? '2px solid rgba(201,168,76,0.60)' : '2px solid transparent',
    borderTop: 'none', borderRight: 'none', borderBottom: 'none',
    background: active ? 'rgba(201,168,76,0.05)' : 'transparent',
    cursor: 'pointer', width: '100%',
    fontFamily: 'var(--font-body)', textAlign: 'left' as const,
    transition: 'color 0.15s',
  }),
  header: {
    height: 54, borderBottom: '1px solid rgba(255,255,255,0.055)',
    background: 'rgba(7,7,7,0.97)', backdropFilter: 'blur(12px)',
    display: 'flex' as const, alignItems: 'center' as const, justifyContent: 'space-between' as const,
    padding: '0 1.5rem', position: 'sticky' as const, top: 0, zIndex: 40,
  },
}

function SidebarContent({ tab, setTab, onClose }: { tab: TabKey; setTab: (t: TabKey) => void; onClose?: () => void }) {
  async function logout() {
    await fetch('/api/admin/login', { method: 'DELETE' })
    window.location.href = '/admin'
  }

  return (
    <aside style={S.sidebar}>
      <div style={S.wordmark}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', letterSpacing: '0.22em', color: '#e8ddd0', lineHeight: 1 }}>
            MALACHIAS
          </div>
          <div style={{ fontSize: '0.52rem', letterSpacing: '0.26em', color: '#c9a84c', textTransform: 'uppercase', marginTop: '0.3rem', opacity: 0.6 }}>
            Admin Panel
          </div>
        </div>
        {onClose && (
          <button type="button" aria-label="Close menu" onClick={onClose} style={{ color: '#5c5044', background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
            <X size={15} />
          </button>
        )}
      </div>

      <nav style={S.nav}>
        {GROUPS.map(group => {
          const items = (Object.entries(SECTIONS) as [TabKey, typeof SECTIONS[TabKey]][]).filter(([, v]) => v.group === group)
          if (!items.length) return null
          return (
            <div key={group} style={{ marginBottom: '1.25rem' }}>
              <span style={S.groupLabel}>{group}</span>
              {items.map(([key, { label, icon: Icon }]) => (
                <button
                  key={key}
                  style={S.navItem(tab === key)}
                  onClick={() => { setTab(key); onClose?.() }}
                  onMouseEnter={e => { if (tab !== key) (e.currentTarget as HTMLButtonElement).style.color = '#8a7f70' }}
                  onMouseLeave={e => { if (tab !== key) (e.currentTarget as HTMLButtonElement).style.color = '#5c5044' }}
                >
                  <Icon size={13} />
                  {label}
                </button>
              ))}
            </div>
          )
        })}
      </nav>

      <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <a
          href="/"
          style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            fontSize: '0.72rem', letterSpacing: '0.06em',
            color: '#c9a84c', textDecoration: 'none',
            padding: '0.45rem 0.75rem', borderRadius: 5,
            background: 'rgba(201,168,76,0.08)',
            border: '1px solid rgba(201,168,76,0.18)',
            transition: 'background 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(201,168,76,0.14)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(201,168,76,0.08)')}
        >
          <ExternalLink size={11} />
          ← Back to site
        </a>
        <button
          onClick={logout}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.72rem', color: '#3a2e26', background: 'none', border: 'none', cursor: 'pointer', padding: '0.2rem 0', fontFamily: 'var(--font-body)' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#c04020')}
          onMouseLeave={e => (e.currentTarget.style.color = '#3a2e26')}
        >
          <LogOut size={11} />
          Log out
        </button>
      </div>
    </aside>
  )
}

function AdminShell({ initialTab }: { initialTab: TabKey }) {
  const router = useRouter()
  const [tab, setTabState] = useState<TabKey>(initialTab)
  const [mobileOpen, setMobileOpen] = useState(false)

  function setTab(t: TabKey) {
    setTabState(t)
    router.replace(`/admin?tab=${t}`, { scroll: false })
    window.scrollTo(0, 0)
  }

  const Section = SectionComponents[tab]
  const sectionMeta = SECTIONS[tab]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#070707' }}>
      {/* Desktop sidebar */}
      <div style={{ display: 'none' }} className="lg-sidebar">
        <style>{`@media (min-width: 1024px) { .lg-sidebar { display: flex !important; } }`}</style>
        <SidebarContent tab={tab} setTab={setTab} />
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex' }}
          onClick={() => setMobileOpen(false)}
        >
          <div onClick={e => e.stopPropagation()}>
            <SidebarContent tab={tab} setTab={setTab} onClose={() => setMobileOpen(false)} />
          </div>
          <div style={{ flex: 1, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)' }} />
        </div>
      )}

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <header style={S.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              type="button"
              aria-label="Open navigation menu"
              onClick={() => setMobileOpen(true)}
              className="mobile-menu-btn"
              style={{ color: '#5c5044', background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem' }}
            >
              <Menu size={18} />
            </button>
            <style>{`@media (min-width: 1024px) { .mobile-menu-btn { display: none !important; } }`}</style>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.63rem', color: '#342c24', letterSpacing: '0.06em' }}>Admin</span>
              <ChevronRight size={11} style={{ color: '#342c24' }} />
              <span style={{ fontSize: '0.78rem', color: '#8a7f70', letterSpacing: '0.04em' }}>
                {sectionMeta.label}
              </span>
            </div>
          </div>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(201,168,76,0.10)', border: '1px solid rgba(201,168,76,0.20)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', color: '#c9a84c', fontFamily: 'var(--font-display)' }}>
            M
          </div>
        </header>

        <main style={{ flex: 1, padding: '2rem 1.5rem', maxWidth: 1280, width: '100%', margin: '0 auto' }}>
          <Suspense fallback={<div style={{ color: '#5c5044', fontSize: '0.85rem' }}>Loading…</div>}>
            <Section />
          </Suspense>
        </main>
      </div>
    </div>
  )
}

function AdminPageInner() {
  const searchParams = useSearchParams()
  const rawTab = searchParams.get('tab') as TabKey | null
  const initialTab: TabKey = rawTab && rawTab in SECTIONS ? rawTab : 'dashboard'

  const [authed, setAuthed] = useState<boolean | null>(null)

  useEffect(() => {
    fetch('/api/admin/login')
      .then(r => r.json())
      .then(d => setAuthed(d.authenticated))
      .catch(() => setAuthed(false))
  }, [])

  if (authed === null) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#070707' }}>
        <div style={{ color: '#342c24', fontSize: '0.78rem', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
          Loading…
        </div>
      </div>
    )
  }

  if (!authed) {
    return <AdminLogin onLogin={() => setAuthed(true)} />
  }

  return <AdminShell initialTab={initialTab} />
}

export default function AdminPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: '#070707', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#342c24', fontSize: '0.78rem', letterSpacing: '0.14em' }}>Loading…</div>
      </div>
    }>
      <AdminPageInner />
    </Suspense>
  )
}
