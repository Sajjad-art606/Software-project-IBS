import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { COOKIE_NAME, decodeSession } from "@/lib/auth/session"
import { isAdmin } from "@/lib/auth/admin"

const PUBLIC_PATHS = ["/login", "/privacy", "/imprint"]

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const sessionCookie = request.cookies.get(COOKIE_NAME)
  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p))
  const session = sessionCookie?.value
    ? decodeSession(sessionCookie.value)
    : null

  if (!sessionCookie?.value && !isPublic) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("from", pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (pathname.startsWith("/admin")) {
    if (!session || !isAdmin(session)) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  }

  if (sessionCookie?.value && pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
}
