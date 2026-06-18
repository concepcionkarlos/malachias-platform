// Admin section — Dashboard redirect stub: forwards /admin/dashboard to the
// admin shell root (/admin), which defaults to the Dashboard tab.
import { redirect } from 'next/navigation'
export default function Page() { redirect('/admin') }
