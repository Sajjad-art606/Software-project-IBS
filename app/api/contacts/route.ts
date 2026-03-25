import { NextResponse } from 'next/server'
import { db } from '@/db'
import { contacts } from '@/db/schema'
import { mapRow } from '@/db/utils'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')?.trim().toLowerCase() ?? ''
  const department = searchParams.get('department') ?? ''
  const semester = searchParams.get('semester')
  const semesterNum = semester ? parseInt(semester, 10) : null

  let all = db.select().from(contacts).all().map((c) => mapRow(contacts, c))

  if (semesterNum) {
    all = all.filter(
      (c) => (c.relevantSemesters as number[]).length === 0 || (c.relevantSemesters as number[]).includes(semesterNum),
    )
  }

  if (department) {
    all = all.filter((c) => c.department?.toLowerCase().includes(department.toLowerCase()))
  }

  if (q) {
    all = all.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.role?.toLowerCase().includes(q) ?? false) ||
        (c.department?.toLowerCase().includes(q) ?? false) ||
        (c.tags as string[]).some((t) => t.toLowerCase().includes(q)),
    )
  }

  return NextResponse.json(all)
}

