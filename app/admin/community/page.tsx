'use client';

const STATS = [
  { label: 'Total Subscribers', value: '847' },
  { label: 'VIP / Supporters',  value: '34'  },
  { label: 'Active This Month', value: '218' },
  { label: 'Avg. Engagement',   value: '38%' },
];

const FANS = [
  { name: 'Sarah M.',      location: 'Sacramento, CA',   source: 'Instagram',  joined: 'Feb 2025',  segment: 'VIP'        },
  { name: 'James H.',      location: 'Fresno, CA',       source: 'Website',    joined: 'Jan 2025',  segment: 'Engaged'    },
  { name: 'Maria T.',      location: 'Los Angeles, CA',  source: 'Apple Music',joined: 'Mar 2025',  segment: 'Subscriber' },
  { name: 'Ray V.',        location: 'Tacoma, WA',       source: 'YouTube',    joined: 'Jan 2025',  segment: 'VIP'        },
  { name: 'Christine W.',  location: 'Phoenix, AZ',      source: 'Instagram',  joined: 'Feb 2025',  segment: 'Engaged'    },
  { name: 'Derek O.',      location: 'San Diego, CA',    source: 'Spotify',    joined: 'Mar 2025',  segment: 'Subscriber' },
  { name: 'Tanisha B.',    location: 'Atlanta, GA',      source: 'Facebook',   joined: 'Apr 2025',  segment: 'Subscriber' },
  { name: 'Aaron F.',      location: 'San Antonio, TX',  source: 'Website',    joined: 'Mar 2025',  segment: 'Engaged'    },
];

const SEGMENT_STYLES: Record<string, { color: string; bg: string }> = {
  VIP:        { color: '#c9a84c', bg: 'rgba(201,168,76,0.09)' },
  Engaged:    { color: '#60a5fa', bg: 'rgba(96,165,250,0.08)' },
  Subscriber: { color: '#5c5044', bg: 'rgba(255,255,255,0.04)' },
};

export default function CommunityPage() {
  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', letterSpacing: '0.10em', color: '#e8ddd0', marginBottom: '0.25rem' }}>
          COMMUNITY
        </h1>
        <p style={{ fontSize: '0.78rem', color: '#5c5044' }}>Fan CRM — contacts, segments, and engagement</p>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', background: 'rgba(255,255,255,0.055)', marginBottom: '2rem' }}>
        {STATS.map(s => (
          <div key={s.label} style={{ background: '#070707', padding: '1.25rem 1.5rem' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: '#e8ddd0', letterSpacing: '0.04em', lineHeight: 1, marginBottom: '0.35rem' }}>
              {s.value}
            </div>
            <div style={{ fontSize: '0.68rem', letterSpacing: '0.10em', color: '#5c5044', textTransform: 'uppercase' }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Segments legend */}
      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {Object.entries(SEGMENT_STYLES).map(([label, style]) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.72rem', color: '#5c5044' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: style.color }} />
            {label}
          </div>
        ))}
      </div>

      {/* Fan table */}
      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.72rem', letterSpacing: '0.14em', color: '#8a7f70', textTransform: 'uppercase' }}>Fan Contacts</span>
          <div style={{ fontSize: '0.68rem', color: '#342c24', border: '1px solid rgba(255,255,255,0.06)', padding: '0.3rem 0.75rem', cursor: 'default', opacity: 0.5 }}>
            Search / Filter
          </div>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              {['Name', 'Location', 'Source', 'Joined', 'Segment'].map(h => (
                <th key={h} style={{ padding: '0.65rem 1.25rem', textAlign: 'left', fontSize: '0.60rem', letterSpacing: '0.18em', color: '#342c24', textTransform: 'uppercase', fontWeight: 600 }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {FANS.map((f, i) => {
              const seg = SEGMENT_STYLES[f.segment];
              return (
                <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer', transition: 'background 0.15s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                >
                  <td style={{ padding: '0.85rem 1.25rem', fontSize: '0.82rem', color: '#8a7f70' }}>{f.name}</td>
                  <td style={{ padding: '0.85rem 1.25rem', fontSize: '0.78rem', color: '#5c5044' }}>{f.location}</td>
                  <td style={{ padding: '0.85rem 1.25rem', fontSize: '0.78rem', color: '#5c5044' }}>{f.source}</td>
                  <td style={{ padding: '0.85rem 1.25rem', fontSize: '0.76rem', color: '#342c24' }}>{f.joined}</td>
                  <td style={{ padding: '0.85rem 1.25rem' }}>
                    <span style={{ fontSize: '0.63rem', letterSpacing: '0.10em', color: seg.color, background: seg.bg, padding: '0.2rem 0.6rem', borderRadius: 2 }}>
                      {f.segment}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
