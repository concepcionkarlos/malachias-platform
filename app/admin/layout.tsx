export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: '#070707', fontFamily: 'var(--font-body)' }}>
      {children}
    </div>
  )
}
