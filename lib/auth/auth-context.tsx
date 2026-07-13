"use client"

import { createContext, useContext, useState, useCallback } from "react"
import type { Session } from "./session"
import { COOKIE_NAME, encodeSession } from "./session"

interface AuthContextValue {
  session: Session | null
  isAdmin: boolean
  setServerSession: (session: Session) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({
  initialSession,
  isAdmin = false,
  children,
}: {
  initialSession: Session | null
  isAdmin?: boolean
  children: React.ReactNode
}) {
  const [session, setSession] = useState<Session | null>(initialSession)

  const setServerSession = useCallback((newSession: Session) => {
    // Update client cookie for consistency (server already set httpOnly one)
    document.cookie = `${COOKIE_NAME}=${encodeSession(newSession)}; path=/; SameSite=Lax`
    setSession(newSession)
  }, [])

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "same-origin",
      })
    } catch {
      // ignore network errors — still clear client state
    }
    document.cookie = `${COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
    setSession(null)
    window.location.href = "/login"
  }, [])

  return (
    <AuthContext.Provider
      value={{ session, isAdmin, setServerSession, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
