import { NextResponse } from 'next/server'
import { db } from '@/db'
import { internationalInfo } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { mapRow } from '@/db/utils'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params
  const _raw = db.select().from(internationalInfo).where(eq(internationalInfo.slug, slug)).get()

  if (!_raw) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json(mapRow(internationalInfo, _raw))
}

