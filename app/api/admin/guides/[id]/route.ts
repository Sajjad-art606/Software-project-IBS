import { NextRequest, NextResponse } from "next/server"
import { eq, and, ne } from "drizzle-orm"
import { db } from "@/db"
import { guides } from "@/db/schema"
import type { GuideStep } from "@/db/schema"
import { mapRow } from "@/db/utils"
import {
  parseId,
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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = getSessionFromRequest(request)
  const denied = requireAdminSession(session)
  if (denied) return denied

  const id = parseId((await params).id)
  if (!id)
    return NextResponse.json({ error: "Invalid guide ID." }, { status: 400 })

  const existing = db.select().from(guides).where(eq(guides.id, id)).get()
  if (!existing)
    return NextResponse.json({ error: "Guide not found." }, { status: 404 })

  const body = (await request.json().catch(() => ({}))) as Record<
    string,
    unknown
  >
  const parsed = parseGuideBody(body)
  if ("error" in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: 400 })
  }

  const slugConflict = db
    .select()
    .from(guides)
    .where(and(eq(guides.slug, parsed.data.slug), ne(guides.id, id)))
    .get()
  if (slugConflict) {
    return NextResponse.json(
      { error: "A guide with this slug already exists." },
      { status: 409 }
    )
  }

  const result = db
    .update(guides)
    .set(parsed.data)
    .where(eq(guides.id, id))
    .returning()
    .all()
  return NextResponse.json(mapRow(guides, result[0]))
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
    return NextResponse.json({ error: "Invalid guide ID." }, { status: 400 })

  const existing = db.select().from(guides).where(eq(guides.id, id)).get()
  if (!existing)
    return NextResponse.json({ error: "Guide not found." }, { status: 404 })

  db.delete(guides).where(eq(guides.id, id)).run()
  return NextResponse.json({ success: true })
}
