import { NextResponse } from 'next/server'
import { db } from '@/db'
import { guides } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { mapRow } from '@/db/utils'

/**
 * Public read API for a single Process Guide by slug (not used by the Next.js UI).
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params
  const _raw = db.select().from(guides).where(eq(guides.slug, slug)).get()

  if (!_raw) {
    return NextResponse.json({ error: 'Guide not found' }, { status: 404 })
  }

  return NextResponse.json(mapRow(guides, _raw))
}

