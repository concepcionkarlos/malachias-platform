'use client';

const CAMPAIGNS = [
  { subject: 'Spring shows — April & May',        sent: 'Mar 28, 2025', recipients: 812,  opens: '44%', status: 'sent'  },
  { subject: 'New music coming — stay close',     sent: 'Feb 14, 2025', recipients: 789,  opens: '51%', status: 'sent'  },
  { subject: 'We played for veterans last week',  sent: 'Jan 19, 2025', recipients: 761,  opens: '48%', status: 'sent'  },
  { subject: 'First Drop announcement',           sent: null,            recipients: null, opens: null,  status: 'draft' },
  { subject: 'Summer tour preview',               sent: null,            recipients: null, opens: null,  status: 'draft' },
];

const STATUS_STYLES: Record<string, { color: string; bg: string; label: string }> = {
  sent:  { color: '#34d399', bg: 'rgba(52,211,153,0.08)',  label: 'Sent'  },
  draft: { color: '#5c5044', bg: 'rgba(255,255,255,0.04)', label: 'Draft' },
};

export default function EmailPage() {
  return (
    <div>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', letterSpacing: '0.10em', color: '#e8ddd0', marginBottom: '0.25rem' }}>
            EMAIL
          </h1>
          <p style={{ fontSize: '0.78rem', color: '#5c5044' }}>Newsletter campaigns and subscriber management</p>
        </div>
        <div style={{ fontSize: '0.70rem', letterSpacing: '0.12em', color: '#5c5044', border: '1px solid rgba(255,255,255,0.07)', padding: '0.5rem 1rem', cursor: 'not-allowed', opacity: 0.5 }}>
          + New Campaign
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: 'rgba(255,255,255,0.055)', marginBottom: '2rem' }}>
        {[
          { label: 'Subscribers',   value: '847' },
          { label: 'Avg Open Rate', value: '48%' },
          { label: 'Campaigns Sent',value: '3'   },
        ].map(s => (
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

      {/* Campaigns */}
      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <span style={{ fontSize: '0.72rem', letterSpacing: '0.14em', color: '#8a7f70', textTransform: 'uppercase' }}>Campaigns</span>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              {['Subject', 'Sent', 'Recipients', 'Open Rate', 'Status'].map(h => (
                <th key={h} style={{ padding: '0.65rem 1.25rem', textAlign: 'left', fontSize: '0.60rem', letterSpacing: '0.18em', color: '#342c24', textTransform: 'uppercase', fontWeight: 600 }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CAMPAIGNS.map((c, i) => {
              const s = STATUS_STYLES[c.status];
              return (
                <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.15s', cursor: 'pointer' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                >
                  <td style={{ padding: '0.85rem 1.25rem', fontSize: '0.82rem', color: '#8a7f70' }}>{c.subject}</td>
                  <td style={{ padding: '0.85rem 1.25rem', fontSize: '0.76rem', color: '#5c5044' }}>{c.sent ?? '—'}</td>
                  <td style={{ padding: '0.85rem 1.25rem', fontSize: '0.76rem', color: '#5c5044' }}>{c.recipients ?? '—'}</td>
                  <td style={{ padding: '0.85rem 1.25rem', fontSize: '0.76rem', color: c.opens ? '#34d399' : '#342c24' }}>{c.opens ?? '—'}</td>
                  <td style={{ padding: '0.85rem 1.25rem' }}>
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
    </div>
  );
}
