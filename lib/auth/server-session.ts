import { cookies } from "next/headers"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { COOKIE_NAME, decodeSession, type Session } from "./session"
import { isAdmin } from "./admin"

export async function getServerSession(): Promise<Session | null> {
  const cookieStore = await cookies()
  const raw = cookieStore.get(COOKIE_NAME)?.value
  return raw ? decodeSession(raw) : null
}

export function getSessionFromRequest(request: NextRequest): Session | null {
  const raw = request.cookies.get(COOKIE_NAME)?.value
  return raw ? decodeSession(raw) : null
}

export function unauthorizedResponse(): NextResponse {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
}

export function forbiddenResponse(): NextResponse {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 })
}

export function requireAdminSession(
  session: Session | null
): NextResponse | null {
  if (!session) return unauthorizedResponse()
  if (!isAdmin(session)) return forbiddenResponse()
  return null
}
