import { NextRequest, NextResponse } from "next/server"
import { eq } from "drizzle-orm"
import { db } from "@/db"
import { internationalInfo } from "@/db/schema"
import type { HelpContent } from "@/db/schema"
import { mapRow } from "@/db/utils"
import { parseJsonField, parseTags, slugify } from "@/lib/admin/form-utils"
import { INTERNATIONAL_CATEGORIES } from "@/lib/admin/constants"
import {
  applyCreateSortOrder,
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
      sortOrder: 0,
    },
    requestedSortOrder,
  }
}

export async function GET(request: NextRequest) {
  const session = getSessionFromRequest(request)
  const denied = requireAdminSession(session)
  if (denied) return denied

  const all = db
    .select()
    .from(internationalInfo)
    .all()
    .map((i) => mapRow(internationalInfo, i))
  return NextResponse.json(all)
}

export async function POST(request: NextRequest) {
  const session = getSessionFromRequest(request)
  const denied = requireAdminSession(session)
  if (denied) return denied

  const body = (await request.json().catch(() => ({}))) as Record<
    string,
    unknown
  >
  const parsed = parseInternationalBody(body)
  if ("error" in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: 400 })
  }

  const existing = db
    .select()
    .from(internationalInfo)
    .where(eq(internationalInfo.slug, parsed.data.slug))
    .get()
  if (existing) {
    return NextResponse.json(
      { error: "An entry with this slug already exists." },
      { status: 409 }
    )
  }

  const result = db
    .insert(internationalInfo)
    .values(parsed.data)
    .returning()
    .all()
  const created = result[0]
  applyCreateSortOrder(internationalInfo, created.id, parsed.requestedSortOrder)

  const row = db
    .select()
    .from(internationalInfo)
    .where(eq(internationalInfo.id, created.id))
    .get()
  return NextResponse.json(mapRow(internationalInfo, row ?? created), {
    status: 201,
  })
}
