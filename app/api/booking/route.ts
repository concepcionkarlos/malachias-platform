import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { readContent, writeContent } from '@/lib/store'
import { triggerAutoReply, sendAdminNotification } from '@/lib/emailService'
import { enrollInBookingDrip } from '@/lib/venueStore'
import type { BookingRequest } from '@/lib/data'

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { fullName, venueOrOrg, email, phone, eventDate, city, eventType, budgetRange, guestCount, message } = body

  if (!fullName || !email) {
    return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
  }

  const now = new Date().toISOString()
  const booking: BookingRequest = {
    id: crypto.randomBytes(8).toString('hex'),
    fullName, venueOrOrg: venueOrOrg ?? '', email, phone: phone ?? '',
    eventDate: eventDate ?? '', city: city ?? '', eventType: eventType ?? '',
    budgetRange: budgetRange ?? '', guestCount: guestCount ?? '', message: message ?? '',
    source: 'website', status: 'New',
    createdAt: now, updatedAt: now,
  }

  const store = await readContent()
  await writeContent({ bookingRequests: [...store.bookingRequests, booking] })

  await triggerAutoReply(booking).catch(() => {})
  await enrollInBookingDrip(booking).catch(() => {})

  const adminEmail = process.env.ADMIN_NOTIFY_EMAIL ?? store.siteContent.contactEmail
  await sendAdminNotification({
    toEmail: adminEmail,
    subject: `New booking request from ${fullName}`,
    bodyHtml: `<p>New booking request received from <strong>${esc(fullName)}</strong> (${esc(email)}).</p>
               <p>Event: ${esc(eventType ?? '')} on ${esc(eventDate ?? '')} in ${esc(city ?? '')}</p>
               <p>Budget: ${esc(budgetRange ?? '')} | Guests: ${esc(guestCount ?? '')}</p>
               <p>Message: ${esc(message ?? '')}</p>`,
  }).catch(() => {})

  return NextResponse.json({ ok: true, id: booking.id }, { status: 201 })
}
