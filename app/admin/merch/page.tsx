// Admin section — Merch redirect stub: forwards /admin/merch to the admin
// shell on its Merch tab (/admin?tab=merch).
import { redirect } from 'next/navigation'
export default function Page() { redirect('/admin?tab=merch') }
