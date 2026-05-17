import { NextResponse } from 'next/server'
import { db } from '@/db'
import { guides } from '@/db/schema'
import { mapRow } from '@/db/utils'
import { filterBySemester } from '@/lib/guides/filter'

/**
 * Public read API for Process Guides (not used by the Next.js UI).
 * The app loads guides via server components and `db` directly.
 *
 * Query params:
 * - `semester` (number): filter by relevant semester
 * - `category` (string): filter by category (`all` ignored)
 * - `limit` (number, default 100): max rows returned
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const semester = searchParams.get('semester')
  const category = searchParams.get('category')
  const limit = parseInt(searchParams.get('limit') ?? '100', 10)

  const semesterNum = semester ? parseInt(semester, 10) : null

  let allGuides = db.select().from(guides).all().map((g) => mapRow(guides, g))

  if (semesterNum) {
    allGuides = filterBySemester(
      allGuides.map((g) => ({ ...g, relevantSemesters: g.relevantSemesters as number[] })),
      semesterNum,
    )
  }

  if (category && category !== 'all') {
    allGuides = allGuides.filter((g) => g.category === category)
  }

  return NextResponse.json(allGuides.slice(0, limit))
}

