import { NextRequest, NextResponse } from "next/server"
import { eq } from "drizzle-orm"
import { db } from "@/db"
import { contacts } from "@/db/schema"
import { mapRow } from "@/db/utils"
import { parseId, parseSemesters, parseTags } from "@/lib/admin/form-utils"
import { CONTACT_ROLES } from "@/lib/admin/constants"
import {
  getSessionFromRequest,
  requireAdminSession,
} from "@/lib/auth/server-session"

const VALID_ROLES = CONTACT_ROLES.map((r) => r.value)

function parseContactBody(body: Record<string, unknown>) {
  const name = String(body.name ?? "").trim()
  const role = String(body.role ?? "").trim()
  const department = String(body.department ?? "").trim() || null
  const email = String(body.email ?? "").trim() || null
  const phone = String(body.phone ?? "").trim() || null
  const officeLocation = String(body.officeLocation ?? "").trim() || null
  const officeHours = String(body.officeHours ?? "").trim() || null
  const tags = parseTags(body.tags)
  const relevantSemesters = parseSemesters(body.relevantSemesters)

  if (!name) return { error: "Name is required." }
  if (!(VALID_ROLES as readonly string[]).includes(role))
    return { error: "Invalid role." }

  return {
    data: {
      name,
      role,
      department,
      email,
      phone,
      officeLocation,
      officeHours,
      tags,
      relevantSemesters,
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
    return NextResponse.json({ error: "Invalid contact ID." }, { status: 400 })

  const existing = db.select().from(contacts).where(eq(contacts.id, id)).get()
  if (!existing)
    return NextResponse.json({ error: "Contact not found." }, { status: 404 })

  const body = (await request.json().catch(() => ({}))) as Record<
    string,
    unknown
  >
  const parsed = parseContactBody(body)
  if ("error" in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: 400 })
  }

  const result = db
    .update(contacts)
    .set(parsed.data)
    .where(eq(contacts.id, id))
    .returning()
    .all()
  return NextResponse.json(mapRow(contacts, result[0]))
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
    return NextResponse.json({ error: "Invalid contact ID." }, { status: 400 })

  const existing = db.select().from(contacts).where(eq(contacts.id, id)).get()
  if (!existing)
    return NextResponse.json({ error: "Contact not found." }, { status: 404 })

  db.delete(contacts).where(eq(contacts.id, id)).run()
  return NextResponse.json({ success: true })
}
