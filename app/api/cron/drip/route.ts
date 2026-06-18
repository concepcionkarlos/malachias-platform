// Cron endpoint: GET-only, authorized via Bearer CRON_SECRET (500 if unset, 401 if mismatch).
// Processes active drip enrollments against their campaign steps, rendering each due step's
// template and sending it via the outreach email service, logging each send as a booking email.
// Marks completed steps and flips enrollments to 'completed' when all steps are done; returns a run summary.
import { NextRequest, NextResponse } from 'next/server'
import { getActiveDripEnrollments, getDripCampaigns, getTemplateBySlug, updateDripEnrollment, addBookingEmailLog } from '@/lib/venueStore'
import { sendOutreachEmail } from '@/lib/emailService'
import { renderTemplate } from '@/lib/templateUtils'
import { readContent } from '@/lib/store'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET
  const auth = req.headers.get('authorization')
  if (!cronSecret) return NextResponse.json({ error: 'CRON_SECRET not configured' }, { status: 500 })
  if (auth !== `Bearer ${cronSecret}`) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const [enrollments, campaigns, store] = await Promise.all([
    getActiveDripEnrollments(),
    getDripCampaigns(),
    readContent(),
  ])

  const now = Date.now()
  let sent = 0, skipped = 0, errors = 0

  for (const enrollment of enrollments) {
    const campaign = campaigns.find((c) => c.id === enrollment.campaignId)
    if (!campaign || !campaign.active) continue

    const enrolledMs = new Date(enrollment.enrolledAt).getTime()

    for (const step of campaign.steps) {
      if (enrollment.completedSteps.includes(step.day)) continue

      const sendTime = enrolledMs + step.day * 24 * 60 * 60 * 1000
      if (sendTime > now) continue

      const template = await getTemplateBySlug(step.templateSlug)
      if (!template) { skipped++; continue }

      const firstName = enrollment.entityName.split(' ')[0] || enrollment.entityName
      const { subject, bodyHtml } = renderTemplate(template, {
        clientName: firstName,
        fullName: enrollment.entityName,
        bandName: 'Malachias',
        replyEmail: store.siteContent.contactEmail,
        eventDate: '(see your original inquiry)',
      })

      try {
        const { resendEmailId } = await sendOutreachEmail({ toEmail: enrollment.toEmail, subject, bodyHtml })
        await addBookingEmailLog({
          entityType: 'booking', entityId: enrollment.entityId,
          toEmail: enrollment.toEmail, subject, bodyHtml,
          templateId: template.id, templateSlug: template.slug,
          sentAt: new Date().toISOString(), resendEmailId, status: 'sent',
        })
        const completedSteps = [...enrollment.completedSteps, step.day]
        const allDone = campaign.steps.every((s) => completedSteps.includes(s.day))
        await updateDripEnrollment(enrollment.id, {
          completedSteps,
          status: allDone ? 'completed' : 'active',
        })
        sent++
      } catch {
        errors++
      }
    }
  }

  return NextResponse.json({
    ok: true,
    processed: enrollments.length,
    sent,
    skipped,
    errors,
    runAt: new Date().toISOString(),
  })
}
