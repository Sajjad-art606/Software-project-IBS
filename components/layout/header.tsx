'use client'

import { useRef, useState, useEffect, type KeyboardEvent } from 'react'
import { useRouter } from 'next/navigation'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Search01Icon,
  Sun01Icon,
  Moon01Icon,
  Menu01Icon,
  ArrowDown01Icon,
  Logout01Icon,
} from '@hugeicons/core-free-icons'
import { useTheme } from 'next-themes'
import { useAuth } from '@/hooks/use-auth'
import { cn } from '@/lib/utils'

export function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const { session, logout } = useAuth()
  const inputRef = useRef<HTMLInputElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (!menuOpen) return
    function handleClick(e: MouseEvent) {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [menuOpen])

  function handleSearch(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      const q = inputRef.current?.value.trim()
      if (q) router.push(`/search?q=${encodeURIComponent(q)}`)
    }
  }

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border px-4">
      {/* Hamburger - mobile only */}
      <button
        onClick={onMenuClick}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground md:hidden"
        aria-label="Open menu"
      >
        <HugeiconsIcon icon={Menu01Icon} size={18} />
      </button>

      {/* Search */}
      <div className="relative min-w-0 flex-1 md:max-w-sm">
        <HugeiconsIcon
          icon={Search01Icon}
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <input
          ref={inputRef}
          type="search"
          placeholder="Search guides, contacts…"
          onKeyDown={handleSearch}
          className="flex h-8 w-full rounded-lg border border-input bg-muted/40 pl-9 pr-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      {/* Spacer - pushes right-side controls to the far right on desktop */}
      <div className="hidden flex-1 md:block" />

      {/* Theme toggle */}
      <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        aria-label="Toggle theme"
      >
        {mounted && (
          <HugeiconsIcon icon={theme === 'dark' ? Sun01Icon : Moon01Icon} size={16} />
        )}
      </button>

      {/* User section */}
      {session && (
        <>
          {/* Desktop - inline user info + sign out */}
          <div className="hidden md:flex items-center gap-3">
            <div className="w-px h-5 bg-border shrink-0" />

            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
                {session.studentId.slice(0, 2).toUpperCase()}
              </div>
              <div className="leading-tight">
                <p className="text-xs font-semibold">ID: {session.studentId}</p>
                <p className="text-[11px] text-muted-foreground">
                  Semester {session.semester}
                  {session.displayName ? ` · ${session.displayName}` : ''}
                </p>
              </div>
            </div>
            <div className="w-px h-5 bg-border shrink-0" />

            <button
              onClick={logout}
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs transition-colors hover:bg-destructive/10 hover:text-destructive"
              aria-label="Sign out"
            >
              <HugeiconsIcon icon={Logout01Icon} size={13} className="shrink-0" />
              Sign out
            </button>
          </div>

          {/* Mobile - compact dropdown */}
          <div className="relative md:hidden" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className={cn(
                'flex h-8 items-center gap-1.5 rounded-lg border border-border px-2 text-xs font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                menuOpen && 'bg-accent text-accent-foreground',
              )}
              aria-label="User menu"
              aria-expanded={menuOpen}
            >
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {session.studentId.slice(0, 2).toUpperCase()}
              </div>
              <HugeiconsIcon
                icon={ArrowDown01Icon}
                size={12}
                className={cn(
                  'shrink-0 text-muted-foreground transition-transform duration-150',
                  menuOpen && 'rotate-180',
                )}
              />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-full z-50 mt-1.5 w-52 rounded-xl border border-border bg-popover shadow-lg">
                <div className="px-3 py-3">
                  <p className="text-[11px] text-muted-foreground">Signed in as</p>
                  <p className="mt-0.5 text-sm font-semibold">{session.studentId}</p>
                  <p className="text-xs text-muted-foreground">
                    Semester {session.semester}
                    {session.displayName ? ` · ${session.displayName}` : ''}
                  </p>
                </div>
                <div className="h-px bg-border" />
                <div className="p-1">
                  <button
                    onClick={() => { logout(); setMenuOpen(false) }}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10"
                  >
                    <HugeiconsIcon icon={Logout01Icon} size={14} className="shrink-0" />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </header>
  )
}
