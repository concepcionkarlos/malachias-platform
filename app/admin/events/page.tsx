'use client';

const UPCOMING = [
  {
    title: 'Victory Church — Spring Concert',
    date: 'April 28, 2025',
    time: '7:00 PM',
    location: 'Victory Church, Fresno CA',
    type: 'Church Concert',
    status: 'confirmed',
    notes: 'Full set. Soundcheck at 5:30 PM. 200 capacity.',
  },
  {
    title: 'Veterans Memorial Hall',
    date: 'May 3, 2025',
    time: '6:00 PM',
    location: 'Veterans Memorial Hall, Sacramento CA',
    type: 'Military Event',
    status: 'confirmed',
    notes: '45-minute set. Outdoor stage. Press expected.',
  },
  {
    title: 'Eastside Community Outreach',
    date: 'June 20, 2025',
    time: 'TBD',
    location: 'Eastside Community Center, Stockton CA',
    type: 'Community Event',
    status: 'pending',
    notes: 'Awaiting final confirmation from organizer.',
  },
];

const PAST = [
  { title: 'Fort Irwin Chapel',      date: 'Feb 14, 2025', location: 'Fort Irwin, CA',     type: 'Military Event'   },
  { title: 'Crossroads Church',      date: 'Jan 19, 2025', location: 'Clovis, CA',          type: 'Church Concert'   },
  { title: 'Veterans Day Rally',     date: 'Nov 11, 2024', location: 'Fresno, CA',          type: 'Military Event'   },
  { title: 'Harvest Festival',       date: 'Oct 5, 2024',  location: 'Visalia, CA',         type: 'Community Event'  },
];

const STATUS_STYLES: Record<string, { color: string; bg: string }> = {
  confirmed: { color: '#34d399', bg: 'rgba(52,211,153,0.08)' },
  pending:   { color: '#c9a84c', bg: 'rgba(201,168,76,0.08)' },
};

export default function EventsPage() {
  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', letterSpacing: '0.10em', color: '#e8ddd0', marginBottom: '0.25rem' }}>
          EVENTS
        </h1>
        <p style={{ fontSize: '0.78rem', color: '#5c5044' }}>Upcoming shows and past performances</p>
      </div>

      {/* Upcoming */}
      <div style={{ marginBottom: '0.75rem', fontSize: '0.68rem', letterSpacing: '0.20em', color: '#5c5044', textTransform: 'uppercase' }}>
        Upcoming
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
        {UPCOMING.map((e, i) => {
          const s = STATUS_STYLES[e.status];
          return (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.025)',
              border: '1px solid rgba(255,255,255,0.07)',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '0.65rem', letterSpacing: '0.14em', color: '#5c5044', textTransform: 'uppercase' }}>{e.type}</span>
                <span style={{ fontSize: '0.62rem', letterSpacing: '0.10em', color: s.color, background: s.bg, padding: '0.2rem 0.55rem', borderRadius: 2 }}>
                  {e.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                </span>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', letterSpacing: '0.08em', color: '#e8ddd0', lineHeight: 1.1, marginBottom: '0.4rem' }}>
                  {e.title}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#8a7f70' }}>{e.date} · {e.time}</div>
                <div style={{ fontSize: '0.75rem', color: '#5c5044', marginTop: '0.15rem' }}>{e.location}</div>
              </div>
              {e.notes && (
                <div style={{ fontSize: '0.72rem', color: '#5c5044', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.75rem', lineHeight: 1.5 }}>
                  {e.notes}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Past */}
      <div style={{ marginBottom: '0.75rem', fontSize: '0.68rem', letterSpacing: '0.20em', color: '#5c5044', textTransform: 'uppercase' }}>
        Past Performances
      </div>
      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              {['Event', 'Date', 'Location', 'Type'].map(h => (
                <th key={h} style={{ padding: '0.65rem 1.25rem', textAlign: 'left', fontSize: '0.60rem', letterSpacing: '0.18em', color: '#342c24', textTransform: 'uppercase', fontWeight: 600 }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PAST.map((p, i) => (
              <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.015)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
              >
                <td style={{ padding: '0.75rem 1.25rem', fontSize: '0.80rem', color: '#5c5044' }}>{p.title}</td>
                <td style={{ padding: '0.75rem 1.25rem', fontSize: '0.76rem', color: '#342c24' }}>{p.date}</td>
                <td style={{ padding: '0.75rem 1.25rem', fontSize: '0.76rem', color: '#342c24' }}>{p.location}</td>
                <td style={{ padding: '0.75rem 1.25rem', fontSize: '0.72rem', color: '#342c24' }}>{p.type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
