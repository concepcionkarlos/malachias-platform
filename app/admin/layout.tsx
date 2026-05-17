'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Calendar, Users, ShoppingBag,
  FileText, Image, Mail, MapPin, Settings, Menu, X,
  Bell, ExternalLink, ChevronRight,
} from 'lucide-react';

const SECTIONS = [
  {
    label: 'Overview',
    items: [
      { label: 'Dashboard',  href: '/admin/dashboard',  icon: LayoutDashboard },
    ],
  },
  {
    label: 'Operations',
    items: [
      { label: 'Bookings',   href: '/admin/bookings',   icon: Calendar },
      { label: 'Events',     href: '/admin/events',     icon: MapPin },
      { label: 'Community',  href: '/admin/community',  icon: Users },
    ],
  },
  {
    label: 'Platform',
    items: [
      { label: 'Merch',      href: '/admin/merch',      icon: ShoppingBag },
      { label: 'Content',    href: '/admin/content',    icon: FileText },
      { label: 'Media',      href: '/admin/media',      icon: Image },
      { label: 'Email',      href: '/admin/email',      icon: Mail },
    ],
  },
  {
    label: 'System',
    items: [
      { label: 'Settings',   href: '/admin/settings',   icon: Settings },
    ],
  },
];

function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();

  return (
    <aside style={{
      width: 220,
      minHeight: '100vh',
      background: '#030202',
      borderRight: '1px solid rgba(255,255,255,0.055)',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
    }}>
      {/* Wordmark */}
      <div style={{
        padding: '1.5rem 1.25rem 1.25rem',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.1rem',
            letterSpacing: '0.22em',
            color: '#e8ddd0',
            lineHeight: 1,
          }}>
            MALACHIAS
          </div>
          <div style={{
            fontSize: '0.55rem',
            letterSpacing: '0.26em',
            color: '#c9a84c',
            textTransform: 'uppercase',
            marginTop: '0.3rem',
            opacity: 0.7,
          }}>
            Admin Panel
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} style={{ color: '#5c5044', background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={16} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '1rem 0', overflowY: 'auto' }}>
        {SECTIONS.map(section => (
          <div key={section.label} style={{ marginBottom: '1.5rem' }}>
            <div style={{
              fontSize: '0.55rem',
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: '#342c24',
              padding: '0 1.25rem',
              marginBottom: '0.35rem',
            }}>
              {section.label}
            </div>
            {section.items.map(item => {
              const Icon = item.icon;
              const active = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    padding: '0.55rem 1.25rem',
                    fontSize: '0.78rem',
                    letterSpacing: '0.04em',
                    color: active ? '#c9a84c' : '#5c5044',
                    borderLeft: active ? '2px solid rgba(201,168,76,0.60)' : '2px solid transparent',
                    background: active ? 'rgba(201,168,76,0.05)' : 'transparent',
                    transition: 'all 0.2s ease',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={e => {
                    if (!active) (e.currentTarget as HTMLElement).style.color = '#8a7f70';
                  }}
                  onMouseLeave={e => {
                    if (!active) (e.currentTarget as HTMLElement).style.color = '#5c5044';
                  }}
                >
                  <Icon size={14} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div style={{
        padding: '1rem 1.25rem',
        borderTop: '1px solid rgba(255,255,255,0.05)',
      }}>
        <Link
          href="/"
          target="_blank"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.72rem',
            color: '#342c24',
            textDecoration: 'none',
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = '#5c5044')}
          onMouseLeave={e => (e.currentTarget.style.color = '#342c24')}
        >
          <ExternalLink size={11} />
          View live site
        </Link>
      </div>
    </aside>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const currentPage = SECTIONS.flatMap(s => s.items).find(
    i => pathname === i.href || pathname.startsWith(i.href + '/')
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#070707', fontFamily: 'var(--font-body)' }}>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex' }}
          onClick={() => setMobileOpen(false)}
        >
          <div onClick={e => e.stopPropagation()} style={{ zIndex: 101 }}>
            <Sidebar onClose={() => setMobileOpen(false)} />
          </div>
          <div style={{ flex: 1, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} />
        </div>
      )}

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* Header */}
        <header style={{
          height: 54,
          borderBottom: '1px solid rgba(255,255,255,0.055)',
          background: 'rgba(7,7,7,0.95)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1.5rem',
          position: 'sticky',
          top: 0,
          zIndex: 40,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              className="lg:hidden"
              onClick={() => setMobileOpen(true)}
              style={{ color: '#5c5044', background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem' }}
            >
              <Menu size={18} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.65rem', color: '#342c24', letterSpacing: '0.06em' }}>Admin</span>
              {currentPage && (
                <>
                  <ChevronRight size={11} style={{ color: '#342c24' }} />
                  <span style={{ fontSize: '0.78rem', color: '#8a7f70', letterSpacing: '0.04em' }}>
                    {currentPage.label}
                  </span>
                </>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button style={{
              color: '#342c24',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              position: 'relative',
            }}>
              <Bell size={16} />
              <span style={{
                position: 'absolute',
                top: -3,
                right: -3,
                width: 7,
                height: 7,
                background: '#c9a84c',
                borderRadius: '50%',
              }} />
            </button>
            <div style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: 'rgba(201,168,76,0.10)',
              border: '1px solid rgba(201,168,76,0.20)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.65rem',
              color: '#c9a84c',
              letterSpacing: '0.05em',
              fontFamily: 'var(--font-display)',
            }}>
              M
            </div>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, padding: '2rem 1.5rem', maxWidth: 1200, width: '100%', margin: '0 auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
