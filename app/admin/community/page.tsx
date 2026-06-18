// Admin section — Community redirect stub: legacy /admin/community route that
// forwards into the admin shell on the Bookings tab (/admin?tab=bookings).
import { redirect } from 'next/navigation'
export default function Page() { redirect('/admin?tab=bookings') }
