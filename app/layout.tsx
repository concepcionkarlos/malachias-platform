import type { Metadata } from 'next';
import { Bebas_Neue, Inter } from 'next/font/google';
import './globals.css';

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
  title: 'MALACHIAS — Christian Rock. Veteran Spirit. Faith on Fire.',
  description:
    'Malachias is a Christian rock band founded by an Army veteran. Bringing faith, resilience, and brotherhood to every stage.',
  keywords: ['Christian rock band', 'veteran music', 'faith rock', 'military band', 'Malachias'],
  openGraph: {
    title: 'MALACHIAS — Christian Rock. Veteran Spirit. Faith on Fire.',
    description: 'Faith-driven rock music from a band of brothers. Founded by a U.S. Army veteran.',
    type: 'website',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${bebas.variable} ${inter.variable}`}>
      <head>
        {/* Apple Music embed */}
        <link rel="preconnect" href="https://embed.music.apple.com" />
        <link rel="dns-prefetch" href="https://embed.music.apple.com" />
        {/* Social */}
        <link rel="dns-prefetch" href="https://www.instagram.com" />
        <link rel="dns-prefetch" href="https://www.facebook.com" />
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
            opacity: 0.028,
            willChange: 'auto',
          }}
        />
        {children}
      </body>
    </html>
  );
}
