// Admin-only campaign dashboard feed: last-7-day page views for the campaign
// routes, top referrers, and the campaign's custom events (donate_click,
// cashapp_click, sponsor_form_submit…) from Vercel Web Analytics, plus the
// admin-entered money (raised, in-kind, sponsors, inquiries) from the store.
// Needs VERCEL_API_TOKEN (a scoped token from vercel.com/account/tokens) plus
// VERCEL_PROJECT_ID and VERCEL_TEAM_ID in the environment; without them the
// analytics half is reported as "not configured" and the store half still works.
import { NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { readContent } from '@/lib/store'
import { CAMPAIGN, campaignMath, inKindTotal } from '@/lib/campaign'

export const dynamic = 'force-dynamic'

const API = 'https://api.vercel.com/v1/query/web-analytics'

async function query(kind: 'visits' | 'events', by: string, from: string, to: string) {
  const token = process.env.VERCEL_API_TOKEN
  const projectId = process.env.VERCEL_PROJECT_ID
  const teamId = process.env.VERCEL_TEAM_ID
  if (!token || !projectId) return null
  const url = `${API}/${kind}/aggregate?projectId=${projectId}${teamId ? `&teamId=${teamId}` : ''}&since=${from}&until=${to}&by=${by}&limit=25`
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' })
  if (!res.ok) return null
  return res.json()
}

export async function GET() {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const to = new Date()
  const from = new Date(to.getTime() - 7 * 86_400_000)
  const [paths, referrers, events] = await Promise.all([
    query('visits', 'requestPath', from.toISOString(), to.toISOString()),
    query('visits', 'referrerHostname', from.toISOString(), to.toISOString()),
    query('events', 'eventName', from.toISOString(), to.toISOString()),
  ])

  const store = await readContent()
  const o = store.campaign ?? {}
  const config = { ...CAMPAIGN, ...o, cashApp: { ...CAMPAIGN.cashApp, ...(o.cashApp ?? {}) } }
  const math = campaignMath(config)
  const inKind = store.campaignInKind ?? []

  return NextResponse.json({
    window: { from: from.toISOString(), to: to.toISOString() },
    analyticsConfigured: !!(process.env.VERCEL_API_TOKEN && process.env.VERCEL_PROJECT_ID),
    paths, referrers, events,
    money: {
      raised: math.raised, goal: math.goal, percent: math.percent, raisedAsOf: config.raisedAsOf,
      inKindConfirmed: inKindTotal(inKind), inKindPending: inKind.filter(i => !i.confirmed).reduce((s, i) => s + i.value, 0),
      sponsors: (store.campaignSponsors ?? []).filter(s => s.visible !== false).length,
      inquiries: { total: (store.sponsorInquiries ?? []).length, new: (store.sponsorInquiries ?? []).filter(q => q.status === 'new').length, confirmed: (store.sponsorInquiries ?? []).filter(q => q.status === 'confirmed').length },
      lessonInquiries: (store.lessonInquiries ?? []).length,
    },
  })
}
