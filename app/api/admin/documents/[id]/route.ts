import { NextRequest, NextResponse } from "next/server"
import { eq } from "drizzle-orm"
import { db } from "@/db"
import { documents } from "@/db/schema"
import { mapRow } from "@/db/utils"
import {
  deleteStoredDocument,
  isStoredDocumentUrl,
} from "@/lib/documents-storage"
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

function parseId(raw: string): number | null {
  const id = Number(raw)
  return Number.isInteger(id) && id > 0 ? id : null
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = getSessionFromRequest(request)
  const denied = requireAdminSession(session)
  if (denied) return denied

  const id = parseId((await params).id)
  if (!id) {
    return NextResponse.json({ error: "Invalid document ID." }, { status: 400 })
  }

  const existing = db.select().from(documents).where(eq(documents.id, id)).get()
  if (!existing) {
    return NextResponse.json({ error: "Document not found." }, { status: 404 })
  }

  const body = (await request.json().catch(() => ({}))) as Record<
    string,
    unknown
  >
  const parsed = parseDocumentBody(body)
  if ("error" in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: 400 })
  }

  const oldFileUrl = existing.fileUrl
  const newFileUrl = parsed.data.fileUrl

  const result = db
    .update(documents)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(documents.id, id))
    .returning()
    .all()

  if (
    oldFileUrl &&
    isStoredDocumentUrl(oldFileUrl) &&
    oldFileUrl !== newFileUrl
  ) {
    await deleteStoredDocument(oldFileUrl)
  }

  return NextResponse.json(mapRow(documents, result[0]))
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = getSessionFromRequest(request)
  const denied = requireAdminSession(session)
  if (denied) return denied

  const id = parseId((await params).id)
  if (!id) {
    return NextResponse.json({ error: "Invalid document ID." }, { status: 400 })
  }

  const existing = db.select().from(documents).where(eq(documents.id, id)).get()
  if (!existing) {
    return NextResponse.json({ error: "Document not found." }, { status: 404 })
  }

  if (existing.fileUrl && isStoredDocumentUrl(existing.fileUrl)) {
    await deleteStoredDocument(existing.fileUrl)
  }

  db.delete(documents).where(eq(documents.id, id)).run()
  return NextResponse.json({ success: true })
}
