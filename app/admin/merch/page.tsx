'use client';

const ITEMS = [
  { name: '"Messenger" Pullover Hoodie', category: 'Apparel',    sku: 'APRL-001', status: 'in-production', units: 100,  notes: 'First run. Black / aged gold print.' },
  { name: 'Field Cross Tee',             category: 'Apparel',    sku: 'APRL-002', status: 'coming-soon',   units: null, notes: 'Black tee. Chest graphic.' },
  { name: 'Field Patch Set (3 patches)', category: 'Accessories',sku: 'ACCS-001', status: 'in-production', units: 200,  notes: 'Iron-on embroidered. Malachias crest, cross, Malachi 3:1.' },
  { name: 'Debut LP — First Pressing',   category: 'Music',      sku: 'MUSC-001', status: 'coming-soon',   units: 300,  notes: 'Vinyl. When recording is complete. Pre-order list forming.' },
  { name: 'Guitar Pick Set (6 picks)',   category: 'Accessories',sku: 'ACCS-002', status: 'coming-soon',   units: null, notes: 'Heavy gauge. Malachi 3:1 printed.' },
  { name: 'Photo Print — Live Shot',     category: 'Print',      sku: 'PRNT-001', status: 'coming-soon',   units: 50,   notes: 'Limited print run. Signed by band.' },
];

const STATUS_STYLES: Record<string, { color: string; bg: string; label: string }> = {
  'in-production': { color: '#c9a84c', bg: 'rgba(201,168,76,0.08)',  label: 'In Production' },
  'coming-soon':   { color: '#60a5fa', bg: 'rgba(96,165,250,0.08)',  label: 'Coming Soon'   },
  'live':          { color: '#34d399', bg: 'rgba(52,211,153,0.08)',  label: 'Live'          },
  'sold-out':      { color: '#f87171', bg: 'rgba(248,113,113,0.08)', label: 'Sold Out'      },
};

export default function AdminMerchPage() {
  return (
    <div>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', letterSpacing: '0.10em', color: '#e8ddd0', marginBottom: '0.25rem' }}>
            MERCH
          </h1>
          <p style={{ fontSize: '0.78rem', color: '#5c5044' }}>First Drop — inventory and production status</p>
        </div>
        <div style={{ fontSize: '0.68rem', letterSpacing: '0.14em', color: '#c9a84c', border: '1px solid rgba(201,168,76,0.20)', padding: '0.5rem 1rem' }}>
          First Drop — In Production
        </div>
      </div>

      {/* Summary row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: 'rgba(255,255,255,0.055)', marginBottom: '2rem' }}>
        {[
          { label: 'Total Items',     value: String(ITEMS.length) },
          { label: 'In Production',   value: String(ITEMS.filter(i => i.status === 'in-production').length) },
          { label: 'Units Planned',   value: '650+' },
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

      {/* Inventory table */}
      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              {['SKU', 'Item', 'Category', 'Units', 'Status', 'Notes'].map(h => (
                <th key={h} style={{ padding: '0.65rem 1.25rem', textAlign: 'left', fontSize: '0.60rem', letterSpacing: '0.18em', color: '#342c24', textTransform: 'uppercase', fontWeight: 600 }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ITEMS.map((item, i) => {
              const s = STATUS_STYLES[item.status];
              return (
                <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.15s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                >
                  <td style={{ padding: '0.85rem 1.25rem', fontSize: '0.68rem', color: '#342c24', fontFamily: 'monospace' }}>{item.sku}</td>
                  <td style={{ padding: '0.85rem 1.25rem', fontSize: '0.82rem', color: '#8a7f70' }}>{item.name}</td>
                  <td style={{ padding: '0.85rem 1.25rem', fontSize: '0.76rem', color: '#5c5044' }}>{item.category}</td>
                  <td style={{ padding: '0.85rem 1.25rem', fontSize: '0.78rem', color: '#5c5044' }}>
                    {item.units ? item.units : '—'}
                  </td>
                  <td style={{ padding: '0.85rem 1.25rem' }}>
                    <span style={{ fontSize: '0.65rem', letterSpacing: '0.10em', color: s.color, background: s.bg, padding: '0.25rem 0.65rem', borderRadius: 2, whiteSpace: 'nowrap' }}>
                      {s.label}
                    </span>
                  </td>
                  <td style={{ padding: '0.85rem 1.25rem', fontSize: '0.72rem', color: '#342c24', maxWidth: 240 }}>{item.notes}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
