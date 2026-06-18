// Admin section — Events redirect stub: forwards /admin/events to the admin
// shell on its Shows tab (/admin?tab=shows).
import { redirect } from 'next/navigation'
export default function Page() { redirect('/admin?tab=shows') }
