import { NextResponse } from 'next/server'
import { db } from '@/db'
import { internationalInfo } from '@/db/schema'
import { mapRow } from '@/db/utils'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category') ?? ''

  let all = db.select().from(internationalInfo).orderBy(internationalInfo.sortOrder).all().map((h) => mapRow(internationalInfo, h))

  if (category && category !== 'all') {
    all = all.filter((h) => h.category === category)
  }

  return NextResponse.json(all)
}

