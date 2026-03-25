import { NextResponse } from 'next/server'
import { db } from '@/db'
import { platformLinks } from '@/db/schema'
import { mapRow } from '@/db/utils'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category') ?? ''

  let all = db.select().from(platformLinks).orderBy(platformLinks.sortOrder).all().map((p) => mapRow(platformLinks, p))

  if (category && category !== 'all') {
    all = all.filter((p) => p.category === category)
  }

  return NextResponse.json(all)
}

