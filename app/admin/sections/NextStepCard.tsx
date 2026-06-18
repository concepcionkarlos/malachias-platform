'use client'

// Admin shared component — Next Step Card: shows status-specific, numbered "what to do next"
// guidance for a booking or venue based on its current pipeline status (e.g. New, Sent,
// Confirmed), with optional detail text and links. Used in the booking and venue drawers.

import { Lightbulb, ExternalLink } from 'lucide-react'
import type { BookingStatus, VenueStatus } from '@/lib/data'

const GOLD = '#c9a84c'

interface Tip {
  action: string
  detail?: string
  link?: { label: string; url: string }
}

const BOOKING_TIPS: Record<BookingStatus, Tip[]> = {
  'New': [
    { action: 'Send the auto-reply email', detail: 'Use the "Booking Auto-Reply" template so the client knows you got their request.' },
    { action: 'Review event details', detail: 'Check date, event type, and budget range before responding.' },
    { action: 'Move to Contacted once you reply' },
  ],
  'Contacted': [
    { action: 'Send the initial reply template', detail: 'Use "Booking Reply — Initial Contact" with event-specific details.' },
    { action: 'Ask the 3 key questions', detail: 'Venue type, guest count, and set length so you can quote accurately.' },
  ],
  'Quote Sent': [
    { action: 'Follow up in 48 hours if no reply', detail: 'Use the "Drip — Day 2 Follow-up" template.' },
    { action: 'Set a follow-up date reminder' },
  ],
  'Follow-up': [
    { action: 'Send the Day 5 Mission Touch email', detail: 'This one shares the band\'s story and mission — often converts hesitant clients.' },
    { action: 'If still no reply after Day 10, send the final follow-up and mark Lost if no response' },
  ],
  'Negotiating': [
    { action: 'Confirm budget range and what is included', detail: 'PA, set length, extras like merch table.' },
    { action: 'Be ready to offer value adds', detail: 'Longer set, earlier load-in, social mentions in exchange for better rate.' },
  ],
  'Confirmed': [
    { action: 'Send the booking confirmation email', detail: 'Use "Booking Reply — Confirmed" template with all logistics.' },
    { action: 'Collect deposit or contract if required' },
    { action: 'Add to the Shows section' },
  ],
  'Advance Sent': [
    { action: 'Confirm load-in time and parking', detail: '72–48h before the show.' },
    { action: 'Check equipment requirements with the venue' },
    { action: 'Prepare the set list and share with band' },
  ],
  'Paid': [
    { action: 'Confirm payment received and log in Finances', detail: 'Track all income for tax and reporting purposes.' },
    { action: 'Final show logistics check 24h before' },
  ],
  'Completed': [
    { action: 'Send a thank-you email', detail: 'Keep the relationship warm — repeat clients are gold.' },
    { action: 'Ask for a testimonial or review', detail: 'Google, Facebook, or a quote for the website.' },
    { action: 'Log the show in the Shows section with setlist and notes' },
  ],
  'Lost': [
    { action: 'Note why the deal was lost', detail: 'Budget? Date conflict? Use this to improve your quote strategy.' },
    { action: 'Keep the contact — reach out in 6 months' },
  ],
  'Archived': [],
  'Spam': [],
}

const VENUE_TIPS: Record<VenueStatus, Tip[]> = {
  'New': [
    { action: 'Research the venue', detail: 'Check their website, social media, and what kind of acts they book.' },
    { action: 'Add a contact name and email if you can find one', detail: 'A named contact gets much better response rates than "info@".' },
    { action: 'Move to Reviewed once you\'ve checked them out' },
  ],
  'Reviewed': [
    { action: 'Decide: is this a good fit?', detail: 'Do they book live bands? Is the room the right size? Is there budget for talent?' },
    { action: 'Move to "Contact Added" once you have a contact email' },
  ],
  'Contact Added': [
    { action: 'Personalize the outreach email', detail: 'Reference something specific about the venue before sending.' },
    { action: 'Send the "Venue First Outreach" email', detail: 'Use the Venue Finder → Send Email tab.' },
  ],
  'Draft Ready': [
    { action: 'Review the draft email for any placeholders or errors', detail: 'Especially check {{venueName}} and the contact name.' },
    { action: 'Send from the Email tab and move to Sent' },
  ],
  'Sent': [
    { action: 'Wait 5–7 business days before following up', detail: 'Give them time to see it. Don\'t rush.' },
    { action: 'Send the follow-up email if no reply', detail: 'Use "Venue Follow-Up" template.' },
    { action: 'Move to Follow-up status' },
  ],
  'Follow-up': [
    { action: 'One more follow-up after 7 days', detail: 'If still no reply, move to Not Interested and circle back in 3 months.' },
    { action: 'Try a different channel', detail: 'Instagram DM, Facebook message, or call if you have the number.' },
  ],
  'Interested': [
    { action: 'Respond fast — this is hot', detail: 'Strike while the iron is warm. Get details on dates and terms.' },
    { action: 'Share the press kit', detail: 'Link them to malachiasmusic.com/epk', link: { label: 'View EPK', url: '/epk' } },
    { action: 'Discuss availability and move to Booked once confirmed' },
  ],
  'Not Interested': [
    { action: 'Note why and re-evaluate in 3–6 months', detail: 'Venues change booking staff. A "no" now is not a "no" forever.' },
    { action: 'Keep the contact in your database' },
  ],
  'Booked': [
    { action: 'Send the "Thanks & Booked Confirmation" email' },
    { action: 'Add the show to the Shows section with all logistics' },
    { action: 'Coordinate load-in time and parking 1 week out' },
    { action: 'Post about the upcoming show on social media' },
  ],
  'Archived': [],
}

interface NextStepCardProps {
  type: 'booking' | 'venue'
  status: BookingStatus | VenueStatus
}

export default function NextStepCard({ type, status }: NextStepCardProps) {
  const tips = type === 'booking'
    ? BOOKING_TIPS[status as BookingStatus] ?? []
    : VENUE_TIPS[status as VenueStatus] ?? []

  if (tips.length === 0) return null

  return (
    <div style={{
      background: `${GOLD}0d`,
      border: `1px solid ${GOLD}30`,
      borderRadius: 8,
      padding: '14px 16px',
      marginBottom: 20,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
        <Lightbulb size={13} style={{ color: GOLD, flexShrink: 0 }} />
        <span style={{ fontSize: 11, fontWeight: 700, color: GOLD, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          Next Steps · {status}
        </span>
      </div>
      <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {tips.map((tip, i) => (
          <li key={i} style={{ display: 'flex', gap: 8 }}>
            <span style={{ color: GOLD, fontSize: 12, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>{i + 1}.</span>
            <div>
              <div style={{ fontSize: 12, color: '#e8ddd0', fontWeight: 600, lineHeight: 1.5 }}>{tip.action}</div>
              {tip.detail && <div style={{ fontSize: 11, color: '#5c5044', lineHeight: 1.6, marginTop: 2 }}>{tip.detail}</div>}
              {tip.link && (
                <a href={tip.link.url} target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: 11, color: GOLD, display: 'inline-flex', alignItems: 'center', gap: 3, marginTop: 3, textDecoration: 'none' }}>
                  {tip.link.label} <ExternalLink size={10} />
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
