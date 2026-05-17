'use client';

import { useState } from 'react';

const ALL_BOOKINGS = [
  { id: 'BK-001', org: 'Victory Church',          contact: 'Pastor James Rivera',  email: 'jrivera@victorychurch.org',       type: 'Church Concert',      date: 'Apr 28, 2025', location: 'Fresno, CA',       status: 'pending'   },
  { id: 'BK-002', org: 'Veterans Memorial Hall',  contact: 'Cpt. Diana Howell',    email: 'd.howell@vmh.gov',                type: 'Military Event',      date: 'May 3, 2025',  location: 'Sacramento, CA',   status: 'confirmed' },
  { id: 'BK-003', org: 'House of Prayer',         contact: 'Elder Thomas Grant',   email: 'thomas@houseofprayer.net',        type: 'Church Service',      date: 'May 12, 2025', location: 'Modesto, CA',      status: 'confirmed' },
  { id: 'BK-004', org: 'JBLM Chapel',             contact: 'Chaplain Sgt. Moore',  email: 'moore.r@army.mil',               type: 'Military Event',      date: 'Jun 15, 2025', location: 'Tacoma, WA',       status: 'pending'   },
  { id: 'BK-005', org: 'Freedom Church',          contact: 'Rev. Angela Watts',    email: 'angela@freedomchurch.com',        type: 'Church Concert',      date: 'Jun 2, 2025',  location: 'Bakersfield, CA',  status: 'review'    },
  { id: 'BK-006', org: 'Eastside Community Ctr',  contact: 'Marcus Bell',          email: 'm.bell@eastside.org',             type: 'Community Event',     date: 'Jun 20, 2025', location: 'Stockton, CA',     status: 'pending'   },
  { id: 'BK-007', org: 'Anchor Point Church',     contact: 'Pastor Steve Nunez',   email: 'steve@anchorpointchurch.com',     type: 'Church Concert',      date: 'Jul 4, 2025',  location: 'Visalia, CA',      status: 'pending'   },
  { id: 'BK-008', org: 'Fort Irwin MWR',          contact: 'SSG Patricia Leon',    email: 'p.leon@ftirwin.army.mil',         type: 'Military Event',      date: 'Mar 15, 2025', location: 'Fort Irwin, CA',   status: 'declined'  },
];

const STATUS_STYLES: Record<string, { color: string; bg: string; label: string }> = {
  pending:   { color: '#c9a84c', bg: 'rgba(201,168,76,0.08)',  label: 'Pending'   },
  confirmed: { color: '#34d399', bg: 'rgba(52,211,153,0.08)',  label: 'Confirmed' },
  review:    { color: '#60a5fa', bg: 'rgba(96,165,250,0.08)',  label: 'In Review' },
  declined:  { color: '#f87171', bg: 'rgba(248,113,113,0.08)', label: 'Declined'  },
};

const TABS = ['All', 'Pending', 'Confirmed', 'In Review', 'Declined'];

export default function BookingsPage() {
  const [activeTab, setActiveTab] = useState('All');

  const filtered = ALL_BOOKINGS.filter(b => {
    if (activeTab === 'All') return true;
    return STATUS_STYLES[b.status].label === activeTab;
  });

  return (
    <div>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', letterSpacing: '0.10em', color: '#e8ddd0', marginBottom: '0.25rem' }}>
            BOOKINGS
          </h1>
          <p style={{ fontSize: '0.78rem', color: '#5c5044' }}>Manage event inquiries and booking requests</p>
        </div>
        <div style={{
          fontSize: '0.70rem',
          letterSpacing: '0.12em',
          color: '#5c5044',
          border: '1px solid rgba(255,255,255,0.07)',
          padding: '0.5rem 1rem',
          cursor: 'not-allowed',
          opacity: 0.5,
        }}>
          + New Request
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 0, marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '0.6rem 1.1rem',
              fontSize: '0.72rem',
              letterSpacing: '0.08em',
              color: activeTab === tab ? '#c9a84c' : '#5c5044',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === tab ? '2px solid #c9a84c' : '2px solid transparent',
              cursor: 'pointer',
              transition: 'color 0.2s',
              marginBottom: -1,
            }}
          >
            {tab}
            <span style={{ marginLeft: '0.4rem', fontSize: '0.60rem', opacity: 0.6 }}>
              {tab === 'All' ? ALL_BOOKINGS.length : ALL_BOOKINGS.filter(b => STATUS_STYLES[b.status].label === tab).length}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              {['ID', 'Organization', 'Contact', 'Event Type', 'Date', 'Location', 'Status'].map(h => (
                <th key={h} style={{
                  padding: '0.75rem 1.25rem',
                  textAlign: 'left',
                  fontSize: '0.60rem',
                  letterSpacing: '0.18em',
                  color: '#342c24',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((b, i) => {
              const s = STATUS_STYLES[b.status];
              return (
                <tr
                  key={b.id}
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer', transition: 'background 0.15s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.025)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                >
                  <td style={{ padding: '0.85rem 1.25rem', fontSize: '0.68rem', color: '#342c24', fontFamily: 'monospace' }}>{b.id}</td>
                  <td style={{ padding: '0.85rem 1.25rem', fontSize: '0.82rem', color: '#8a7f70' }}>{b.org}</td>
                  <td style={{ padding: '0.85rem 1.25rem' }}>
                    <div style={{ fontSize: '0.78rem', color: '#5c5044' }}>{b.contact}</div>
                    <div style={{ fontSize: '0.68rem', color: '#342c24' }}>{b.email}</div>
                  </td>
                  <td style={{ padding: '0.85rem 1.25rem', fontSize: '0.78rem', color: '#5c5044', whiteSpace: 'nowrap' }}>{b.type}</td>
                  <td style={{ padding: '0.85rem 1.25rem', fontSize: '0.78rem', color: '#5c5044', whiteSpace: 'nowrap' }}>{b.date}</td>
                  <td style={{ padding: '0.85rem 1.25rem', fontSize: '0.78rem', color: '#5c5044' }}>{b.location}</td>
                  <td style={{ padding: '0.85rem 1.25rem' }}>
                    <span style={{ fontSize: '0.65rem', letterSpacing: '0.10em', color: s.color, background: s.bg, padding: '0.25rem 0.65rem', borderRadius: 2, whiteSpace: 'nowrap' }}>
                      {s.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: '1rem', fontSize: '0.68rem', color: '#342c24' }}>
        Showing {filtered.length} of {ALL_BOOKINGS.length} requests
      </div>
    </div>
  );
}
