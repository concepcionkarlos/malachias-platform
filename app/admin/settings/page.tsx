'use client';

export default function SettingsPage() {
  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', letterSpacing: '0.10em', color: '#e8ddd0', marginBottom: '0.25rem' }}>
          SETTINGS
        </h1>
        <p style={{ fontSize: '0.78rem', color: '#5c5044' }}>Band profile, social links, and system preferences</p>
      </div>

      <div style={{ display: 'grid', gap: '1.5rem', maxWidth: 640 }}>

        {/* Band Profile */}
        <Section title="Band Profile">
          <Field label="Band Name"    value="Malachias"                            />
          <Field label="Genre"        value="Christian Rock"                        />
          <Field label="Location"     value="Central Valley, California"            />
          <Field label="Founded"      value="2022"                                  />
          <Field label="Contact Email"value="booking@malachias.com"                 />
          <Field label="Website"      value="malachias-platform.vercel.app"         />
        </Section>

        {/* Social Links */}
        <Section title="Social Links">
          <Field label="Apple Music" value="music.apple.com/us/artist/malachias/937313536" />
          <Field label="Spotify"     value="open.spotify.com/artist/2YSqk7Skh7jsm5fR0uU3vl" />
          <Field label="YouTube"     value="youtube.com/channel/UCboGsplcNdd9Pha-n83mZYA"   />
          <Field label="Instagram"   value="instagram.com/malachiasmusic"                    />
          <Field label="Facebook"    value="facebook.com/share/17s554A9qA/"                  />
        </Section>

        {/* Notifications */}
        <Section title="Notifications">
          <Toggle label="New booking requests"  checked={true}  />
          <Toggle label="New newsletter signups" checked={true}  />
          <Toggle label="New fan contacts"       checked={false} />
        </Section>

        {/* Danger zone */}
        <Section title="System">
          <div style={{ fontSize: '0.76rem', color: '#5c5044', marginBottom: '1rem', lineHeight: 1.6 }}>
            Admin panel is frontend-only. Backend integration and authentication coming in a future phase.
          </div>
          <div style={{ fontSize: '0.72rem', color: '#342c24', border: '1px solid rgba(248,113,113,0.15)', padding: '0.75rem 1rem', background: 'rgba(248,113,113,0.03)' }}>
            Danger Zone — actions here are irreversible. Connect backend before enabling.
          </div>
        </Section>

      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden' }}>
      <div style={{ padding: '0.85rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <span style={{ fontSize: '0.68rem', letterSpacing: '0.18em', color: '#8a7f70', textTransform: 'uppercase' }}>
          {title}
        </span>
      </div>
      <div style={{ padding: '1rem 0' }}>{children}</div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '1rem', alignItems: 'center', padding: '0.6rem 1.25rem' }}>
      <span style={{ fontSize: '0.72rem', color: '#5c5044', letterSpacing: '0.06em' }}>{label}</span>
      <input
        defaultValue={value}
        disabled
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.07)',
          color: '#8a7f70',
          fontSize: '0.78rem',
          padding: '0.45rem 0.75rem',
          outline: 'none',
          width: '100%',
          cursor: 'not-allowed',
          opacity: 0.7,
        }}
      />
    </div>
  );
}

function Toggle({ label, checked }: { label: string; checked: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.6rem 1.25rem' }}>
      <span style={{ fontSize: '0.78rem', color: '#5c5044' }}>{label}</span>
      <div style={{
        width: 36,
        height: 20,
        background: checked ? 'rgba(201,168,76,0.25)' : 'rgba(255,255,255,0.06)',
        border: `1px solid ${checked ? 'rgba(201,168,76,0.40)' : 'rgba(255,255,255,0.09)'}`,
        borderRadius: 10,
        position: 'relative',
        cursor: 'not-allowed',
      }}>
        <div style={{
          width: 14,
          height: 14,
          borderRadius: '50%',
          background: checked ? '#c9a84c' : '#342c24',
          position: 'absolute',
          top: 2,
          left: checked ? 18 : 2,
          transition: 'left 0.2s',
        }} />
      </div>
    </div>
  );
}
