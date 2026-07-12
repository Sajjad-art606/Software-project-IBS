import { NextRequest, NextResponse } from "next/server"
import { eq } from "drizzle-orm"
import { db } from "@/db"
import { guides } from "@/db/schema"
import type { GuideStep } from "@/db/schema"
import { mapRow } from "@/db/utils"
import {
  parseJsonField,
  parseSemesters,
  parseTags,
  slugify,
} from "@/lib/admin/form-utils"
import { GUIDE_CATEGORIES } from "@/lib/admin/constants"
import {
  getSessionFromRequest,
  requireAdminSession,
} from "@/lib/auth/server-session"

const VALID_CATEGORIES = GUIDE_CATEGORIES.map((c) => c.value)

function parseGuideBody(body: Record<string, unknown>) {
  const title = String(body.title ?? "").trim()
  const slugRaw = String(body.slug ?? "").trim()
  const slug = slugRaw || slugify(title)
  const description = String(body.description ?? "").trim()
  const category = String(body.category ?? "").trim()
  const estimatedTime = String(body.estimatedTime ?? "").trim() || null
  const tags = parseTags(body.tags)
  const relevantSemesters = parseSemesters(body.relevantSemesters)
  const stepsParsed = parseJsonField<GuideStep[]>(body.steps, "steps")

  if (!title) return { error: "Title is required." }
  if (!slug) return { error: "Slug is required." }
  if (!description) return { error: "Description is required." }
  if (
    !VALID_CATEGORIES.includes(category as (typeof VALID_CATEGORIES)[number])
  ) {
    return { error: "Invalid category." }
  }
  if ("error" in stepsParsed) return stepsParsed
  if (!Array.isArray(stepsParsed.data) || stepsParsed.data.length === 0) {
    return { error: "At least one step is required." }
  }

  return {
    data: {
      slug,
      title,
      description,
      category,
      steps: stepsParsed.data,
      tags,
      relevantSemesters,
      estimatedTime,
    },
  }
}

export async function GET(request: NextRequest) {
  const session = getSessionFromRequest(request)
  const denied = requireAdminSession(session)
  if (denied) return denied

  const all = db
    .select()
    .from(guides)
    .all()
    .map((g) => mapRow(guides, g))
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
  const parsed = parseGuideBody(body)
  if ("error" in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: 400 })
  }

  const existing = db
    .select()
    .from(guides)
    .where(eq(guides.slug, parsed.data.slug))
    .get()
  if (existing) {
    return NextResponse.json(
      { error: "A guide with this slug already exists." },
      { status: 409 }
    )
  }

  const result = db.insert(guides).values(parsed.data).returning().all()
  return NextResponse.json(mapRow(guides, result[0]), { status: 201 })
}
