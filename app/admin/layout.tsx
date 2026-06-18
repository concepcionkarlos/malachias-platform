// Admin section — Layout shell: wraps all /admin routes in the dark, branded
// full-height container that sets the panel's background and base font.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: '#070707', fontFamily: 'var(--font-body)' }}>
      {children}
    </div>
  )
}
