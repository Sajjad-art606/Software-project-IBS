import { NextRequest, NextResponse } from "next/server"
import { eq } from "drizzle-orm"
import { db } from "@/db"
import { platformLinks } from "@/db/schema"
import { mapRow } from "@/db/utils"
import { parseTags } from "@/lib/admin/form-utils"
import { PLATFORM_CATEGORIES } from "@/lib/admin/constants"
import {
  applyCreateSortOrder,
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
      iconName: null,
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
    .from(platformLinks)
    .orderBy(platformLinks.sortOrder)
    .all()
    .map((p) => mapRow(platformLinks, p))
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
  const parsed = parsePlatformBody(body)
  if ("error" in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: 400 })
  }

  const result = db.insert(platformLinks).values(parsed.data).returning().all()
  const created = result[0]
  applyCreateSortOrder(platformLinks, created.id, parsed.requestedSortOrder)

  const row = db
    .select()
    .from(platformLinks)
    .where(eq(platformLinks.id, created.id))
    .get()
  if (!row) {
    return NextResponse.json(mapRow(platformLinks, created), { status: 201 })
  }
  return NextResponse.json(mapRow(platformLinks, row), { status: 201 })
}
