import { NextRequest, NextResponse } from "next/server"
import { getSessionFromRequest } from "@/lib/auth/server-session"
import { isAdmin } from "@/lib/auth/admin"

export async function GET(request: NextRequest) {
  const session = getSessionFromRequest(request)
  if (!session) {
    return NextResponse.json({ session: null, isAdmin: false })
  }
  return NextResponse.json({ session, isAdmin: isAdmin(session) })
}
