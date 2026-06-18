// Admin section — Site Content redirect stub: forwards /admin/content to the
// admin shell on its Site Content tab (/admin?tab=content).
import { redirect } from 'next/navigation'
export default function Page() { redirect('/admin?tab=content') }
