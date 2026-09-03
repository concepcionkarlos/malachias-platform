// Voice Lessons with Malachias — the one place the offer lives (copy, price,
// formats, service area, discounts). Safe for client components. Inquiries are
// stored in the content store (`lessonInquiries`) and reviewed in the admin.

export const LESSONS = {
  path: '/voice-lessons',
  title: 'Voice Lessons with Malachias',
  eyebrow: 'Vocal · Style · Stage presence',
  headline: 'Learn to sing like you mean it.',
  intro:
    'Malachias is an international touring artist — Iraq, Kuwait, Dubai, China, Ireland, and over half of the United States — and a former Nashville recording artist who learned from the best in the industry. He offers vocal and style lessons and stage presence coaching, with over 30 years of practical application experience.',
  price: 80,               // USD per lesson
  lengthMinutes: 50,
  formats: ['In person', 'Via Zoom'] as const,
  inPersonCounties: ['Broward', 'Palm Beach', 'Miami-Dade'],
  discounts: ['Veterans', 'Bulk packages'],
  // Lessons are Malachias's own offering, so these are his direct contacts
  // rather than the band's booking address.
  contactEmail: 'malachiasmusic@gmail.com',
  contactPhone: '+1 317 560 2356',
  contactPhoneHref: '+13175602356',   // tel: form — digits and a leading +
  focus: [
    { title: 'Vocal technique', body: 'Breath, range, tone, control — the fundamentals that keep a voice healthy through a full set.' },
    { title: 'Style', body: 'Rock, country, worship: phrasing and delivery that sound like you, not like an exercise.' },
    { title: 'Stage presence', body: 'What to do with your hands, your eyes and the room. Coaching from thirty years of stages, from VFW halls to overseas bases.' },
  ],
  goals: ['Vocal technique', 'Style / delivery', 'Stage presence', 'Audition or show prep', 'Worship leading', 'Not sure yet'] as const,
}

export type LessonFormat = (typeof LESSONS.formats)[number]
export type LessonInquiryStatus = 'new' | 'contacted' | 'booked' | 'declined'

export interface LessonInquiry {
  id: string
  name: string
  email: string
  phone: string
  format: LessonFormat
  county: string          // for in-person; '' for Zoom
  goal: string
  veteran: boolean
  message: string
  status: LessonInquiryStatus
  createdAt: string
}

export const usdLessons = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
