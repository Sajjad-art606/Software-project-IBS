import { NextRequest, NextResponse } from "next/server"
import { eq } from "drizzle-orm"
import { db } from "@/db"
import { platformLinks } from "@/db/schema"
import { mapRow } from "@/db/utils"
import { parseId, parseTags } from "@/lib/admin/form-utils"
import { PLATFORM_CATEGORIES } from "@/lib/admin/constants"
import {
  applyDeleteSortOrder,
  applyUpdateSortOrder,
  parseRequestedSortOrder,
} from "@/lib/admin/sort-order"
import {
  getSessionFromRequest,
  requireAdminSession,
} from "@/lib/auth/server-session"

const VALID_CATEGORIES = PLATFORM_CATEGORIES.map((c) => c.value)

function parsePlatformBody(body: Record<string, unknown>) {
  const name = String(body.name ?? "").trim()
  const shortName = String(body.shortName ?? "").trim() || null
  const description = String(body.description ?? "").trim()
  const url = String(body.url ?? "").trim()
  const category = String(body.category ?? "").trim()
  const requestedSortOrder = parseRequestedSortOrder(body.sortOrder)
  const tags = parseTags(body.tags)

  if (!name) return { error: "Name is required." }
  if (!description) return { error: "Description is required." }
  if (!url) return { error: "URL is required." }
  if (!/^https?:\/\//i.test(url)) {
    return { error: "URL must start with http:// or https://." }
  }
  if (!(VALID_CATEGORIES as readonly string[]).includes(category)) {
    return { error: "Invalid category." }
  }

  return {
    data: {
      name,
      shortName,
      description,
      url,
      category,
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
    return NextResponse.json({ error: "Invalid platform ID." }, { status: 400 })

  const existing = db
    .select()
    .from(platformLinks)
    .where(eq(platformLinks.id, id))
    .get()
  if (!existing)
    return NextResponse.json(
      { error: "Platform link not found." },
      { status: 404 }
    )

  const body = (await request.json().catch(() => ({}))) as Record<
    string,
    unknown
  >
  const parsed = parsePlatformBody(body)
  if ("error" in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: 400 })
  }

  applyUpdateSortOrder(platformLinks, id, parsed.requestedSortOrder)

  const result = db
    .update(platformLinks)
    .set(parsed.data)
    .where(eq(platformLinks.id, id))
    .returning()
    .all()
  return NextResponse.json(mapRow(platformLinks, result[0]))
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
    return NextResponse.json({ error: "Invalid platform ID." }, { status: 400 })

  const existing = db
    .select()
    .from(platformLinks)
    .where(eq(platformLinks.id, id))
    .get()
  if (!existing)
    return NextResponse.json(
      { error: "Platform link not found." },
      { status: 404 }
    )

  db.delete(platformLinks).where(eq(platformLinks.id, id)).run()
  applyDeleteSortOrder(platformLinks, id)
  return NextResponse.json({ success: true })
}
