import { NextResponse } from 'next/server'
import { db } from '@/db'
import { guides } from '@/db/schema'
import { mapRow } from '@/db/utils'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const semester = searchParams.get('semester')
  const category = searchParams.get('category')
  const limit = parseInt(searchParams.get('limit') ?? '100', 10)

  const semesterNum = semester ? parseInt(semester, 10) : null

  let allGuides = db.select().from(guides).all().map((g) => mapRow(guides, g))

  if (semesterNum) {
    allGuides = allGuides.filter(
      (g) => (g.relevantSemesters as number[]).length === 0 || (g.relevantSemesters as number[]).includes(semesterNum),
    )
  }

  if (category && category !== 'all') {
    allGuides = allGuides.filter((g) => g.category === category)
  }

  return NextResponse.json(allGuides.slice(0, limit))
}

