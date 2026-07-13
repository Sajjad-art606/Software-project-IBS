import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { documents } from "@/db/schema"
import { mapRow } from "@/db/utils"
import {
  getSessionFromRequest,
  requireAdminSession,
} from "@/lib/auth/server-session"

const VALID_CATEGORIES = [
  "forms",
  "templates",
  "regulations",
  "info-sheets",
  "exam-dates",
] as const
const VALID_FILE_TYPES = ["pdf", "docx", "link"] as const

function parseDocumentBody(body: Record<string, unknown>) {
  const title = String(body.title ?? "").trim()
  const category = String(body.category ?? "").trim()
  const description = String(body.description ?? "").trim() || null
  const fileUrl = String(body.fileUrl ?? "").trim() || null
  const fileType = String(
    body.fileType ?? "pdf"
  ).trim() as (typeof VALID_FILE_TYPES)[number]
  const tags = Array.isArray(body.tags)
    ? body.tags.map((t) => String(t).trim()).filter(Boolean)
    : []
  const relevantSemesters = Array.isArray(body.relevantSemesters)
    ? body.relevantSemesters
        .map((s) => Number(s))
        .filter((n) => n >= 1 && n <= 7)
    : []

  if (!title) return { error: "Title is required." }
  if (
    !VALID_CATEGORIES.includes(category as (typeof VALID_CATEGORIES)[number])
  ) {
    return { error: "Invalid category." }
  }
  if (!VALID_FILE_TYPES.includes(fileType)) {
    return { error: "Invalid file type." }
  }

  return {
    data: {
      title,
      category,
      description,
      fileUrl,
      fileType,
      tags,
      relevantSemesters,
    },
  }
}

export async function GET(request: NextRequest) {
  const session = getSessionFromRequest(request)
  const denied = requireAdminSession(session)
  if (denied) return denied

  const all = db
    .select()
    .from(documents)
    .all()
    .map((d) => mapRow(documents, d))
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
  const parsed = parseDocumentBody(body)
  if ("error" in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: 400 })
  }

  const result = db
    .insert(documents)
    .values({
      ...parsed.data,
      updatedAt: new Date(),
    })
    .returning()
    .all()

  const created = mapRow(documents, result[0])
  return NextResponse.json(created, { status: 201 })
}
