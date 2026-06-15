import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { getVenues, updateVenue, addOutreachLog } from '@/lib/venueStore'
import { sendOutreachEmail } from '@/lib/emailService'
import { renderTemplate } from '@/lib/templateUtils'
import type { EmailTemplate } from '@/lib/data'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params

  const venues = await getVenues()
  const venue = venues.find((v) => v.id === id)
  if (!venue) return NextResponse.json({ error: 'Venue not found' }, { status: 404 })

  const body: { template: EmailTemplate; vars: Record<string, string>; replyTo?: string } = await req.json()
  const { template, vars, replyTo } = body

  const { subject, bodyHtml } = renderTemplate(template, {
    venueName: venue.name,
    replyEmail: 'booking@malachiasmusic.com',
    bandName: 'Malachias',
    ...vars,
  })

  const toEmail = venue.contactEmail
  if (!toEmail) return NextResponse.json({ error: 'Venue has no contact email' }, { status: 400 })

  let resendEmailId: string | undefined
  let status: 'sent' | 'failed' = 'sent'
  let errorMessage: string | undefined

  try {
    const result = await sendOutreachEmail({ toEmail, subject, bodyHtml, replyTo })
    resendEmailId = result.resendEmailId
  } catch (err) {
    status = 'failed'
    errorMessage = err instanceof Error ? err.message : String(err)
  }

  await addOutreachLog({
    venueId: id, venueName: venue.name, toEmail, subject, bodyHtml,
    templateId: template.id, templateSlug: template.slug,
    sentAt: new Date().toISOString(), resendEmailId, status, errorMessage,
  })

  if (status === 'sent') {
    await updateVenue(id, {
      lastContactedAt: new Date().toISOString(),
      status: venue.status === 'New' ? 'Sent' : venue.status,
      activityLog: [
        ...(venue.activityLog ?? []),
        { ts: new Date().toISOString(), text: `Email sent: "${subject}"` },
      ],
    })
  }

  if (status === 'failed') return NextResponse.json({ error: errorMessage }, { status: 500 })
  return NextResponse.json({ ok: true, resendEmailId })
}
