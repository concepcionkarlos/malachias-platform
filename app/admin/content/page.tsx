'use client';

const POSTS = [
  { title: 'Four new tracks in progress',      tag: 'Studio',   date: 'Mar 15, 2025', status: 'published', excerpt: "We've been in the room together two, three nights a week. These songs are different." },
  { title: 'Victory Church, Fresno',           tag: 'On Stage', date: 'Feb 28, 2025', status: 'published', excerpt: 'Played to about 200 people. One guy came up after and said it was the first time he felt something in years.' },
  { title: 'Why we play for veterans',         tag: 'Mission',  date: 'Jan 20, 2025', status: 'published', excerpt: 'Some of the men we play for have been carrying things most people don\'t talk about.' },
  { title: 'Recording session — track notes',  tag: 'Studio',   date: 'Apr 2, 2025',  status: 'draft',     excerpt: 'First attempt at the bridge section on Track 3. Still working through it.' },
  { title: 'Road thoughts — Bakersfield',      tag: 'On Stage', date: 'Apr 10, 2025', status: 'draft',     excerpt: 'Small venue but full room. Something happened in that room.' },
];

const STATUS_STYLES: Record<string, { color: string; bg: string }> = {
  published: { color: '#34d399', bg: 'rgba(52,211,153,0.08)'  },
  draft:     { color: '#5c5044', bg: 'rgba(255,255,255,0.04)' },
};

const TAG_COLORS: Record<string, string> = {
  Studio:    '#c9a84c',
  'On Stage':'#60a5fa',
  Mission:   '#a78bfa',
};

export default function ContentPage() {
  return (
    <div>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', letterSpacing: '0.10em', color: '#e8ddd0', marginBottom: '0.25rem' }}>
            CONTENT
          </h1>
          <p style={{ fontSize: '0.78rem', color: '#5c5044' }}>Journal posts — studio, field, and mission updates</p>
        </div>
        <div style={{ fontSize: '0.70rem', letterSpacing: '0.12em', color: '#5c5044', border: '1px solid rgba(255,255,255,0.07)', padding: '0.5rem 1rem', cursor: 'not-allowed', opacity: 0.5 }}>
          + New Post
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'rgba(255,255,255,0.055)' }}>
        {POSTS.map((post, i) => {
          const s = STATUS_STYLES[post.status];
          const tagColor = TAG_COLORS[post.tag] || '#5c5044';
          return (
            <div key={i} style={{
              background: '#070707',
              padding: '1.25rem 1.5rem',
              display: 'grid',
              gridTemplateColumns: '1fr auto',
              gap: '1rem',
              alignItems: 'start',
              cursor: 'pointer',
              transition: 'background 0.15s',
            }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#0a0a0a'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = '#070707'}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
                  <span style={{ fontSize: '0.60rem', letterSpacing: '0.18em', color: tagColor, textTransform: 'uppercase' }}>
                    {post.tag}
                  </span>
                  <span style={{ fontSize: '0.60rem', color: '#342c24' }}>{post.date}</span>
                </div>
                <div style={{ fontSize: '0.90rem', color: '#8a7f70', marginBottom: '0.35rem', letterSpacing: '0.02em' }}>
                  {post.title}
                </div>
                <div style={{ fontSize: '0.74rem', color: '#342c24', lineHeight: 1.5 }}>
                  {post.excerpt}
                </div>
              </div>
              <span style={{ fontSize: '0.65rem', letterSpacing: '0.10em', color: s.color, background: s.bg, padding: '0.25rem 0.65rem', borderRadius: 2, whiteSpace: 'nowrap', marginTop: '0.15rem' }}>
                {post.status === 'published' ? 'Published' : 'Draft'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
