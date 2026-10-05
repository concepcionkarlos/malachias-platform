'use client';

// Honors the OS "reduce motion" setting for every framer-motion animation on the site.

import { MotionConfig } from 'framer-motion';

export default function MotionPrefs({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
