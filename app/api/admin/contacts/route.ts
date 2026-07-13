import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { contacts } from "@/db/schema"
import { mapRow } from "@/db/utils"
import { parseSemesters, parseTags } from "@/lib/admin/form-utils"
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

export async function GET(request: NextRequest) {
  const session = getSessionFromRequest(request)
  const denied = requireAdminSession(session)
  if (denied) return denied

  const all = db
    .select()
    .from(contacts)
    .all()
    .map((c) => mapRow(contacts, c))
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
  const parsed = parseContactBody(body)
  if ("error" in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: 400 })
  }

  const result = db.insert(contacts).values(parsed.data).returning().all()
  return NextResponse.json(mapRow(contacts, result[0]), { status: 201 })
}
