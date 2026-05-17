'use client';

import { Calendar, Users, Mail, MessageSquare, TrendingUp, Clock } from 'lucide-react';

const STATS = [
  { label: 'Booking Requests', value: '12', sub: 'this month', icon: Calendar,    delta: '+4',  positive: true  },
  { label: 'Subscribers',      value: '847', sub: 'newsletter', icon: Mail,       delta: '+23', positive: true  },
  { label: 'Upcoming Shows',   value: '3',   sub: 'confirmed',  icon: TrendingUp, delta: null,  positive: null  },
  { label: 'Pending Messages', value: '5',   sub: 'unread',     icon: MessageSquare, delta: null, positive: null },
];

const RECENT_BOOKINGS = [
  { org: 'Victory Church',          type: 'Church Concert',   date: 'Apr 28',  status: 'pending'   },
  { org: 'Veterans Memorial Hall',  type: 'Military Event',   date: 'May 3',   status: 'confirmed' },
  { org: 'House of Prayer',         type: 'Church Service',   date: 'May 12',  status: 'confirmed' },
  { org: 'JBLM Chapel',             type: 'Military Event',   date: 'Jun 15',  status: 'pending'   },
  { org: 'Freedom Church',          type: 'Church Concert',   date: 'Jun 2',   status: 'review'    },
];

const ACTIVITY = [
  { text: 'New booking request from Victory Church',           time: '2h ago',  dot: '#c9a84c' },
  { text: 'Newsletter subscriber milestone — 847 total',       time: '1d ago',  dot: '#34d399' },
  { text: 'Booking confirmed: Veterans Memorial Hall',         time: '2d ago',  dot: '#34d399' },
  { text: 'New fan contact from Sacramento, CA',               time: '3d ago',  dot: '#8a7f70' },
  { text: 'Booking request submitted: Freedom Church',         time: '4d ago',  dot: '#c9a84c' },
];

const STATUS_STYLES: Record<string, { color: string; bg: string; label: string }> = {
  pending:   { color: '#c9a84c', bg: 'rgba(201,168,76,0.08)',  label: 'Pending'   },
  confirmed: { color: '#34d399', bg: 'rgba(52,211,153,0.08)',  label: 'Confirmed' },
  review:    { color: '#60a5fa', bg: 'rgba(96,165,250,0.08)',  label: 'In Review' },
  declined:  { color: '#f87171', bg: 'rgba(248,113,113,0.08)', label: 'Declined'  },
};

function StatCard({ label, value, sub, icon: Icon, delta, positive }: typeof STATS[0]) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.025)',
      border: '1px solid rgba(255,255,255,0.07)',
      padding: '1.25rem 1.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ fontSize: '0.68rem', letterSpacing: '0.10em', color: '#5c5044', textTransform: 'uppercase' }}>
          {label}
        </div>
        <Icon size={14} style={{ color: '#342c24' }} />
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', color: '#e8ddd0', letterSpacing: '0.04em', lineHeight: 1 }}>
          {value}
        </span>
        {delta && (
          <span style={{ fontSize: '0.72rem', color: positive ? '#34d399' : '#f87171' }}>
            {delta}
          </span>
        )}
      </div>
      <div style={{ fontSize: '0.68rem', color: '#5c5044' }}>{sub}</div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', letterSpacing: '0.10em', color: '#e8ddd0', marginBottom: '0.25rem' }}>
          DASHBOARD
        </h1>
        <p style={{ fontSize: '0.78rem', color: '#5c5044' }}>Platform overview — Malachias Operations</p>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1px', marginBottom: '2rem', background: 'rgba(255,255,255,0.055)' }}>
        {STATS.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1.5rem', alignItems: 'start' }}>

        {/* Recent bookings */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden' }}>
          <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.72rem', letterSpacing: '0.14em', color: '#8a7f70', textTransform: 'uppercase' }}>
              Recent Bookings
            </span>
            <a href="/admin/bookings" style={{ fontSize: '0.68rem', color: '#c9a84c', textDecoration: 'none', letterSpacing: '0.06em' }}>
              View all →
            </a>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                {['Organization', 'Type', 'Date', 'Status'].map(h => (
                  <th key={h} style={{ padding: '0.65rem 1.5rem', textAlign: 'left', fontSize: '0.62rem', letterSpacing: '0.16em', color: '#342c24', textTransform: 'uppercase', fontWeight: 600 }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {RECENT_BOOKINGS.map((b, i) => {
                const s = STATUS_STYLES[b.status];
                return (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                  >
                    <td style={{ padding: '0.75rem 1.5rem', fontSize: '0.80rem', color: '#8a7f70' }}>{b.org}</td>
                    <td style={{ padding: '0.75rem 1.5rem', fontSize: '0.78rem', color: '#5c5044' }}>{b.type}</td>
                    <td style={{ padding: '0.75rem 1.5rem', fontSize: '0.78rem', color: '#5c5044' }}>{b.date}</td>
                    <td style={{ padding: '0.75rem 1.5rem' }}>
                      <span style={{ fontSize: '0.65rem', letterSpacing: '0.10em', color: s.color, background: s.bg, padding: '0.25rem 0.65rem', borderRadius: 2 }}>
                        {s.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Activity feed */}
        <div style={{ minWidth: 260, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            <span style={{ fontSize: '0.72rem', letterSpacing: '0.14em', color: '#8a7f70', textTransform: 'uppercase' }}>
              Activity
            </span>
          </div>
          <div style={{ padding: '0.5rem 0' }}>
            {ACTIVITY.map((a, i) => (
              <div key={i} style={{ display: 'flex', gap: '0.85rem', padding: '0.75rem 1.25rem', alignItems: 'flex-start' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: a.dot, marginTop: '0.3rem', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '0.76rem', color: '#8a7f70', lineHeight: 1.4, marginBottom: '0.2rem' }}>{a.text}</div>
                  <div style={{ fontSize: '0.63rem', color: '#342c24', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Clock size={10} />
                    {a.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
