'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'

interface GuideSection {
  title: string
  items: { heading: string; body: string; links?: { label: string; url: string }[] }[]
}

const GUIDES: GuideSection[] = [
  {
    title: 'Finding Gigs',
    items: [
      {
        heading: 'Churches & Christian Events',
        body: 'Contact worship pastors directly — not the main office. Ask about "special music Sundays," revival nights, youth events, and outdoor summer services. Offer a 20-min set as a free preview for small churches. Target churches with 200+ attendance that have a stage and sound system.',
        links: [
          { label: 'Worship Musician Network', url: 'https://www.worshipmusician.com' },
          { label: 'Christian Band Directory', url: 'https://www.christianbands.net' },
        ],
      },
      {
        heading: 'Veteran & Military Events',
        body: "VFW halls, American Legion posts, and military base events are natural fits for Malachias' mission. Contact your local VFW post's entertainment coordinator. Memorial Day, Veterans Day, and 4th of July events book 6–12 weeks in advance. USO shows may have paid opportunities.",
        links: [
          { label: 'VFW Post Locator', url: 'https://www.vfw.org/find-a-post' },
          { label: 'American Legion Locator', url: 'https://www.legion.org/findlegion' },
        ],
      },
      {
        heading: 'Local Bars & Music Venues',
        body: 'Call on Tuesday/Wednesday afternoons — that\'s when bookers are most available. Ask for the booking manager, not the general manager. Offer to play for a door deal (% of cover) to get in the door. Bring 3 minutes of video on your phone — they\'ll want to see the live show. Fort Wayne venues: The Clyde Theatre, Piere\'s, Summit City Music Hall.',
      },
      {
        heading: 'Festivals & Outdoor Events',
        body: 'Christian music festivals book January–March for summer slots. Apply via their official submission forms — most require EPK, social stats, and 3 links. Target regional festivals first: Ichthus, Alive Festival, Kingdom Bound. General county fairs and outdoor festivals are also great — contact parks & rec departments.',
        links: [
          { label: 'Sonicbids', url: 'https://www.sonicbids.com' },
          { label: 'Reverbnation', url: 'https://www.reverbnation.com' },
        ],
      },
      {
        heading: 'Schools & Recovery Programs',
        body: "Given Malachias' mission around PTSD, depression, and suicide prevention, target: high schools (assemblies/events), VA hospitals and veteran centers, drug & alcohol recovery programs, and crisis counseling organizations. These often have small budgets but deep alignment with the mission.",
      },
    ],
  },
  {
    title: 'Outreach Templates & Pitch',
    items: [
      {
        heading: 'The 3-Line Pitch',
        body: "Malachias is a Christian rock band founded by a U.S. Army veteran from Fort Wayne. We play original faith-driven rock for veterans, churches, and community events — music that's honest about struggle and real about hope. We're available for [date range] and would love to be part of [event name].",
      },
      {
        heading: 'Email Outreach Best Practices',
        body: '1. Send Tuesday–Thursday, 9am–11am local time.\n2. Subject line: "Live music for [specific event/date] — Malachias"\n3. Keep it under 200 words.\n4. Include 1 video link (YouTube), 1 song link (Spotify), and your booking page.\n5. Follow up at Day 5 and Day 10 — most bookings happen on the 2nd or 3rd touch.\n6. Use the CRM drip campaigns for automatic follow-up.',
      },
      {
        heading: 'What to Include in Your EPK',
        body: 'Your Press Kit section has everything bookers need. Make sure it has: bio (under 150 words), set length options, tech specs, 3 press/testimonial quotes, and links to video + audio. Keep the EPK URL handy: malachiasmusic.com/epk',
      },
    ],
  },
  {
    title: 'Social Media & Growth',
    items: [
      {
        heading: 'Content That Works for Christian Rock Bands',
        body: 'Short-form video (Reels/TikTok) of rehearsal clips, song breakdowns, and "the story behind the song" performs best. Post 4–5x per week minimum. Use relevant hashtags: #ChristianRock #VeteranMusic #FaithRock #PTSD #SuicidePrevention. The mission story (veteran-founded, PTSD/depression focus) differentiates you — lean into it.',
      },
      {
        heading: 'Instagram Strategy',
        body: '- Reels: live performance clips, behind-the-scenes, lyric clips (3–4x/week)\n- Stories: daily band life, polls, scripture + song connection\n- Grid: professional photos from shows, band portraits\n- Bio link: malachiasmusic.com/booking',
      },
      {
        heading: 'YouTube',
        body: 'Upload: full live sets (even phone recordings), "Story Behind the Song" mini-docs, rehearsal sessions. YouTube is long-tail — one good video can generate leads for years. Title format: "MALACHIAS — [Song Title] (Live at [Venue])"',
      },
    ],
  },
  {
    title: 'Booking & Business',
    items: [
      {
        heading: 'What to Charge',
        body: 'Starting rates for a new band in Fort Wayne market:\n- Small venue / bar: $200–$500 (door deal or guarantee)\n- Church event: $300–$800 + freewill offering\n- Private event: $500–$1,500 depending on hours\n- Festival slot: $500–$2,000+ depending on stage size\n- Military/VFW: negotiate — mission alignment matters more than rate here.',
      },
      {
        heading: 'Getting Paid',
        body: 'Always get a written agreement (even a text thread counts legally). Require 50% deposit to hold the date. Collect remainder night of show or day before. Accept: cash, Venmo, Zelle, check. Invoice template available in your email templates section.',
      },
      {
        heading: 'When You Confirm a Show',
        body: '1. Mark booking as Confirmed in the CRM.\n2. Send the Booking Confirmed email template.\n3. Schedule a rehearsal focused on that set.\n4. Post about the show on social 3 weeks, 1 week, and day-of.\n5. Add the show to your Shows section so it appears on the website.',
      },
    ],
  },
]

export default function AdminGuides() {
  const [openSection, setOpenSection] = useState<string | null>('Finding Gigs')
  const [openItem, setOpenItem] = useState<string | null>(null)

  return (
    <div style={{ maxWidth: 760 }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ margin: 0, fontSize: '1.3rem', color: '#e8ddd0', fontFamily: 'var(--font-display)', letterSpacing: '0.08em' }}>PLAYBOOK</h1>
        <p style={{ margin: '4px 0 0', fontSize: '0.78rem', color: '#5c5044' }}>Guides for finding gigs, outreach, social media, and running the band</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {GUIDES.map(section => {
          const isOpen = openSection === section.title
          return (
            <div key={section.title} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8, overflow: 'hidden' }}>
              <button
                onClick={() => setOpenSection(isOpen ? null : section.title)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)' }}
              >
                <span style={{ fontSize: '0.85rem', color: '#c9a84c', fontWeight: 600, letterSpacing: '0.06em' }}>{section.title}</span>
                {isOpen ? <ChevronUp size={14} style={{ color: '#5c5044' }} /> : <ChevronDown size={14} style={{ color: '#5c5044' }} />}
              </button>

              {isOpen && (
                <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {section.items.map(item => {
                    const key = `${section.title}::${item.heading}`
                    const itemOpen = openItem === key
                    return (
                      <div key={key} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 6, overflow: 'hidden' }}>
                        <button
                          onClick={() => setOpenItem(itemOpen ? null : key)}
                          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)' }}
                        >
                          <span style={{ fontSize: '0.8rem', color: '#e8ddd0', textAlign: 'left' }}>{item.heading}</span>
                          {itemOpen ? <ChevronUp size={12} style={{ color: '#5c5044', flexShrink: 0 }} /> : <ChevronDown size={12} style={{ color: '#5c5044', flexShrink: 0 }} />}
                        </button>
                        {itemOpen && (
                          <div style={{ padding: '0 14px 14px' }}>
                            <p style={{ margin: '0 0 12px', fontSize: '0.8rem', color: '#8a7f70', lineHeight: 1.75, whiteSpace: 'pre-line' }}>{item.body}</p>
                            {item.links && (
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                {item.links.map(link => (
                                  <a
                                    key={link.label}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ fontSize: 11, color: '#c9a84c', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', border: '1px solid rgba(201,168,76,0.25)', borderRadius: 4 }}
                                  >
                                    {link.label} <ExternalLink size={9} />
                                  </a>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
