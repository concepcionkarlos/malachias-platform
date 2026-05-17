import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MALACHIAS — Christian Rock. Veteran Spirit. Faith on Fire.',
  description:
    'Malachias is a Christian rock band founded by an Army veteran. Bringing faith, resilience, and brotherhood to every stage. Book us for churches, veteran events, festivals, and rock venues.',
  keywords: ['Christian rock band', 'veteran music', 'faith rock', 'military band', 'Malachias'],
  openGraph: {
    title: 'MALACHIAS — Christian Rock. Veteran Spirit. Faith on Fire.',
    description:
      'Faith-driven rock music from a band of brothers. Founded by a U.S. Army veteran. Every stage is a pulpit.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-black text-white antialiased">{children}</body>
    </html>
  );
}
