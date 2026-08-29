'use client'

// "Print / Save as PDF" for the sponsorship overview — the browser's print dialog
// is the PDF generator until a designed PDF exists.

export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="btn btn-ghost"
      style={{ fontSize: '0.64rem', letterSpacing: '0.18em', padding: '0.55rem 1rem' }}
    >
      Print / Save as PDF
    </button>
  )
}
