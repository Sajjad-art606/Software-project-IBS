import { cookies } from "next/headers"
import { COOKIE_NAME, decodeSession } from "@/lib/auth/session"
import { isAdmin } from "@/lib/auth/admin"
import { AuthProvider } from "@/lib/auth/auth-context"
import { ShellClient } from "@/components/layout/shell-client"

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const raw = cookieStore.get(COOKIE_NAME)?.value ?? null
  const initialSession = raw ? decodeSession(raw) : null
  const admin = isAdmin(initialSession)

  return (
    <AuthProvider initialSession={initialSession} isAdmin={admin}>
      <ShellClient>{children}</ShellClient>
    </AuthProvider>
  )
}
