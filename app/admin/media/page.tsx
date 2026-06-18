// Admin section — Media redirect stub: forwards /admin/media to the admin
// shell on its Media tab (/admin?tab=media).
import { redirect } from 'next/navigation'
export default function Page() { redirect('/admin?tab=media') }
