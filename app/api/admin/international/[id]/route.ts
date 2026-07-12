import { NextRequest, NextResponse } from "next/server"
import { eq, and, ne } from "drizzle-orm"
import { db } from "@/db"
import { internationalInfo } from "@/db/schema"
import type { HelpContent } from "@/db/schema"
import { mapRow } from "@/db/utils"
import {
  parseId,
  parseJsonField,
  parseTags,
  slugify,
} from "@/lib/admin/form-utils"
import { INTERNATIONAL_CATEGORIES } from "@/lib/admin/constants"
import {
  applyDeleteSortOrder,
  applyUpdateSortOrder,
  parseRequestedSortOrder,
} from "@/lib/admin/sort-order"
import {
  getSessionFromRequest,
  requireAdminSession,
} from "@/lib/auth/server-session"

const VALID_CATEGORIES = INTERNATIONAL_CATEGORIES.map((c) => c.value)

function parseInternationalBody(body: Record<string, unknown>) {
  const title = String(body.title ?? "").trim()
  const slugRaw = String(body.slug ?? "").trim()
  const slug = slugRaw || slugify(title)
  const description = String(body.description ?? "").trim()
  const category = String(body.category ?? "").trim()
  const requestedSortOrder = parseRequestedSortOrder(body.sortOrder)
  const tags = parseTags(body.tags)
  const contentParsed = parseJsonField<HelpContent>(body.content, "content")

  if (!title) return { error: "Title is required." }
  if (!slug) return { error: "Slug is required." }
  if (!description) return { error: "Description is required." }
  if (
    !VALID_CATEGORIES.includes(category as (typeof VALID_CATEGORIES)[number])
  ) {
    return { error: "Invalid category." }
  }
  if ("error" in contentParsed) return contentParsed

  return {
    data: {
      slug,
      title,
      description,
      category,
      content: contentParsed.data,
      tags,
    },
    requestedSortOrder,
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = getSessionFromRequest(request)
  const denied = requireAdminSession(session)
  if (denied) return denied

  const id = parseId((await params).id)
  if (!id)
    return NextResponse.json({ error: "Invalid entry ID." }, { status: 400 })

  const existing = db
    .select()
    .from(internationalInfo)
    .where(eq(internationalInfo.id, id))
    .get()
  if (!existing)
    return NextResponse.json({ error: "Entry not found." }, { status: 404 })

  const body = (await request.json().catch(() => ({}))) as Record<
    string,
    unknown
  >
  const parsed = parseInternationalBody(body)
  if ("error" in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: 400 })
  }

  const slugConflict = db
    .select()
    .from(internationalInfo)
    .where(
      and(
        eq(internationalInfo.slug, parsed.data.slug),
        ne(internationalInfo.id, id)
      )
    )
    .get()
  if (slugConflict) {
    return NextResponse.json(
      { error: "An entry with this slug already exists." },
      { status: 409 }
    )
  }

  applyUpdateSortOrder(internationalInfo, id, parsed.requestedSortOrder)

  const result = db
    .update(internationalInfo)
    .set(parsed.data)
    .where(eq(internationalInfo.id, id))
    .returning()
    .all()
  return NextResponse.json(mapRow(internationalInfo, result[0]))
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = getSessionFromRequest(request)
  const denied = requireAdminSession(session)
  if (denied) return denied

  const id = parseId((await params).id)
  if (!id)
    return NextResponse.json({ error: "Invalid entry ID." }, { status: 400 })

  const existing = db
    .select()
    .from(internationalInfo)
    .where(eq(internationalInfo.id, id))
    .get()
  if (!existing)
    return NextResponse.json({ error: "Entry not found." }, { status: 404 })

  db.delete(internationalInfo).where(eq(internationalInfo.id, id)).run()
  applyDeleteSortOrder(internationalInfo, id)
  return NextResponse.json({ success: true })
}
