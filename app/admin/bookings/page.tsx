// Admin section — Bookings redirect stub: forwards /admin/bookings to the
// single-page admin shell on its Bookings tab (/admin?tab=bookings).
import { redirect } from 'next/navigation'
export default function Page() { redirect('/admin?tab=bookings') }
