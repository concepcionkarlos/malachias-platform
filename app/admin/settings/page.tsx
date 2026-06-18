// Admin section — Settings redirect stub: forwards /admin/settings to the
// admin shell on its Settings tab (/admin?tab=settings).
import { redirect } from 'next/navigation'
export default function Page() { redirect('/admin?tab=settings') }
