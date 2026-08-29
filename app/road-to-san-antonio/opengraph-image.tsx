// Social preview for /road-to-san-antonio — generated at request time from the real
// emblem in /public so Facebook/WhatsApp/Twitter cards read: MALACHIAS · VETERANS DAY
// 2026 · ROAD TO SAN ANTONIO · NOVEMBER 12. No band photos are invented.
import { ImageResponse } from 'next/og'
import fs from 'fs'
import path from 'path'
import { CAMPAIGN, formatEventDate } from '@/lib/campaign'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'Malachias — Veterans Day 2026 — Road to San Antonio — November 12'

export default async function Image() {
  let emblem: string | null = null
  try {
    const buf = fs.readFileSync(path.join(process.cwd(), 'public', 'Malachias.PNG'))
    emblem = `data:image/png;base64,${buf.toString('base64')}`
  } catch {
    emblem = null
  }

  const date = formatEventDate(CAMPAIGN.eventDate).toUpperCase()

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: 'linear-gradient(160deg, #020202 0%, #0a0602 60%, #030202 100%)',
          color: '#ede5d8',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* warm glow */}
        <div style={{ position: 'absolute', right: -80, top: -60, width: 620, height: 620, borderRadius: 999, background: 'radial-gradient(circle, rgba(120,60,10,0.45) 0%, rgba(120,60,10,0) 70%)', display: 'flex' }} />

        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 0 0 72px', width: 720 }}>
          <div style={{ fontSize: 22, letterSpacing: 10, color: '#c9a84c', display: 'flex' }}>MALACHIAS · VETERANS DAY 2026</div>
          <div style={{ fontSize: 96, fontWeight: 800, lineHeight: 0.95, marginTop: 22, display: 'flex', flexDirection: 'column', letterSpacing: 2 }}>
            <span>ROAD TO</span>
            <span style={{ color: '#c9a84c' }}>SAN ANTONIO</span>
          </div>
          <div style={{ width: 160, height: 2, background: '#c9a84c', marginTop: 28, display: 'flex' }} />
          <div style={{ fontSize: 30, marginTop: 24, color: '#e8ddd0', display: 'flex' }}>{date} · SAN ANTONIO, TEXAS</div>
          <div style={{ fontSize: 22, marginTop: 14, color: '#a89880', display: 'flex' }}>Help us bring the full band to San Antonio.</div>
        </div>

        {emblem && (
          <div style={{ position: 'absolute', right: 40, top: 65, width: 500, height: 500, display: 'flex', opacity: 0.92 }}>
            <img src={emblem} width={500} height={500} style={{ objectFit: 'contain' }} alt="" />
          </div>
        )}
      </div>
    ),
    { ...size }
  )
}
