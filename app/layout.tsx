import type { Metadata } from 'next';
import { Bebas_Neue, Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://malachiasmusic.com'

const bebas = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'MALACHIAS — Christian Rock. Veteran Spirit. Faith on Fire.',
    template: '%s — MALACHIAS',
  },
  description:
    'Malachias is a veteran-founded Christian rock band from South Florida. Faith-driven music that heals PTSD, depression, and suicidal ideation. Available for bars, festivals, churches, and military events.',
  keywords: [
    'Christian rock band', 'veteran music', 'faith rock', 'military band', 'Malachias',
    'South Florida band', 'Miami rock band', 'South Florida rock festival', 'Christian metal',
    'veteran musician', 'book a band South Florida', 'rock band for hire Miami',
  ],
  authors: [{ name: 'Malachias', url: SITE_URL }],
  creator: 'Malachias',
  publisher: 'Malachias',
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: 'MALACHIAS — Christian Rock. Veteran Spirit. Faith on Fire.',
    description: 'Faith-driven rock from a veteran-founded band in South Florida. Music that heals PTSD and depression. Available for bars, festivals, churches, military events, and community gatherings.',
    type: 'website',
    url: SITE_URL,
    siteName: 'Malachias',
    locale: 'en_US',
    images: [{ url: `${SITE_URL}/Malachias.PNG`, width: 1200, height: 630, alt: 'Malachias — Christian Rock Band' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MALACHIAS — Christian Rock. Veteran Spirit.',
    description: 'Faith-driven rock from a veteran-founded band. Available for bars, festivals, churches & community events.',
    images: [`${SITE_URL}/Malachias.PNG`],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'MusicGroup',
  name: 'Malachias',
  description: 'Christian rock band based in South Florida, founded by a U.S. Army veteran. Music that heals PTSD, depression, and suicidal ideation through faith. Available for bars, festivals, churches, and military events.',
  genre: ['Christian Rock', 'Rock', 'Hard Rock', 'Faith Rock'],
  foundingDate: '2014',
  foundingLocation: {
    '@type': 'Place',
    name: 'South Florida',
    address: { '@type': 'PostalAddress', addressLocality: 'Miami', addressRegion: 'FL', addressCountry: 'US' },
  },
  areaServed: {
    '@type': 'Place',
    name: 'South Florida',
    address: { '@type': 'PostalAddress', addressLocality: 'Miami', addressRegion: 'FL', addressCountry: 'US' },
  },
  member: [
    { '@type': 'Person', name: 'Malachias', roleName: 'Vocals, Guitar, Founder' },
    { '@type': 'Person', name: 'JC Concepcion', roleName: 'Lead Guitar' },
    { '@type': 'Person', name: 'Efrain Sierra', roleName: 'Rhythm Guitar' },
    { '@type': 'Person', name: 'Gabe Grantham', roleName: 'Bass' },
    { '@type': 'Person', name: 'Henry', roleName: 'Drums' },
  ],
  url: SITE_URL,
  email: 'booking@malachiasmusic.com',
  sameAs: [
    'https://music.apple.com/us/artist/malachias/937313536',
    'https://open.spotify.com/artist/2YSqk7Skh7jsm5fR0uU3vl',
    'https://www.youtube.com/channel/UCboGsplcNdd9Pha-n83mZYA',
    'https://www.instagram.com/malachiasmusic',
    'https://www.facebook.com/share/17s554A9qA/?mibextid=wwXIfr',
  ],
  image: `${SITE_URL}/Malachias.PNG`,
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'Booking',
    email: 'booking@malachiasmusic.com',
    availableLanguage: 'English',
  },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${bebas.variable} ${inter.variable}`}>
      <head>
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://embed.music.apple.com" />
        <link rel="dns-prefetch" href="https://embed.music.apple.com" />
        <link rel="dns-prefetch" href="https://www.instagram.com" />
        <link rel="dns-prefetch" href="https://www.facebook.com" />
        {/* JSON-LD structured data */}
        <Script
          id="json-ld-musicgroup"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-black text-[#e8ddd0] antialiased font-body">
        {/* Global film grain — fixed, pointer-events-none, paint once */}
        <div
          aria-hidden="true"
          className="grain scanlines"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            pointerEvents: 'none',
            opacity: 0.044,
            willChange: 'auto',
          }}
        />
        {children}
      </body>
    </html>
  );
}
