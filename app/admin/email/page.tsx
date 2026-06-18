// Admin section — Email redirect stub: forwards /admin/email to the admin
// shell on its Email Templates tab (/admin?tab=email-templates).
import { redirect } from 'next/navigation'
export default function Page() { redirect('/admin?tab=email-templates') }
