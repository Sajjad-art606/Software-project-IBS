'use client'

import { createContext, useContext, useState, useCallback } from 'react'
import type { Session } from './session'
import { COOKIE_NAME, encodeSession } from './session'

interface AuthContextValue {
  session: Session | null
  login: (studentId: string, semester: number, displayName?: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({
  initialSession,
  children,
}: {
  initialSession: Session | null
  children: React.ReactNode
}) {
  const [session, setSession] = useState<Session | null>(initialSession)

  const login = useCallback(
    (studentId: string, semester: number, displayName?: string) => {
      const newSession: Session = { studentId, semester, displayName }
      document.cookie = `${COOKIE_NAME}=${encodeSession(newSession)}; path=/; SameSite=Lax`
      setSession(newSession)
    },
    [],
  )

  const logout = useCallback(() => {
    document.cookie = `${COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
    setSession(null)
    window.location.href = '/login'
  }, [])

  return (
    <AuthContext.Provider value={{ session, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
