// Coerce an untrusted JSON body field to a trimmed, length-capped string.
// Numbers become their string form; anything else (objects, arrays, null) is ''.
// Keeps public form handlers from 500-ing on `.trim()` of a non-string.
export function str(v: unknown, max = 4000): string {
  if (typeof v === 'string') return v.trim().slice(0, max)
  if (typeof v === 'number' && Number.isFinite(v)) return String(v).slice(0, max)
  return ''
}
