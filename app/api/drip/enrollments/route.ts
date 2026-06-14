import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { getDripEnrollments, addDripEnrollment } from '@/lib/venueStore'

export async function GET() {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const enrollments = await getDripEnrollments()
  return NextResponse.json(enrollments)
}

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const enrollment = await addDripEnrollment({
    ...body,
    enrolledAt: new Date().toISOString(),
    completedSteps: [],
    status: 'active',
  })
  return NextResponse.json(enrollment, { status: 201 })
}
