'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useCallback } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  DashboardSquare01Icon,
  Search01Icon,
  Book02Icon,
  UserGroupIcon,
  File01Icon,
  Link01Icon,
  GlobeIcon,
  Logout01Icon,
} from '@hugeicons/core-free-icons'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/use-auth'

interface SidebarProps {
  open: boolean
  onClose: () => void
}

const navItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: DashboardSquare01Icon,
  },
  {
    label: 'Search',
    href: '/search',
    icon: Search01Icon,
  },
  {
    label: 'Process Guides',
    href: '/guides',
    icon: Book02Icon,
  },
  {
    label: 'Contacts',
    href: '/contacts',
    icon: UserGroupIcon,
  },
  {
    label: 'Documents',
    href: '/documents',
    icon: File01Icon,
  },
  {
    label: 'Platform Links',
    href: '/platforms',
    icon: Link01Icon,
  },
  {
    label: 'International Help',
    href: '/help',
    icon: GlobeIcon,
  },
]

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname()
  const { session, logout } = useAuth()

  // Close sidebar on navigation (mobile)
  useEffect(() => {
    onClose()
  }, [pathname, onClose])

  // Close sidebar on Escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) onClose()
    },
    [open, onClose],
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col border-r border-border bg-sidebar transition-transform duration-200 ease-in-out',
          'md:static md:z-auto md:translate-x-0 md:w-60',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
      {/* Logo */}
      <div className="flex items-center gap-3 ml-4 py-2.5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground text-xs font-bold">
          IBS
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">Student Hub</p>
          <p className="truncate text-xs text-muted-foreground">HFU Furtwangen</p>
        </div>
      </div>

      <div className="h-px bg-border " />

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-2 py-3">
        {navItems.map((item) => {
          const isActive =
            item.href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground border-b'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground',
              )}
            >
              <HugeiconsIcon
                icon={item.icon}
                size={16}
                className="shrink-0"
              />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="h-px bg-border mx-4" />

      {/* Illustration */}
      <div className="flex flex-col items-center gap-1 px-4 py-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/happy-student.svg"
          alt="Happy student illustration"
          className="w-full max-w-[148px] select-none"
          draggable={false}
        />
        <a
          href="https://storyset.com/education"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] text-muted-foreground/50 transition-colors hover:text-muted-foreground"
        >
          Illustration by Storyset
        </a>
      </div>

      <div className="h-px bg-border mx-4" />

      {/* Footer — user identity + sign out */}
      <div className="flex flex-col gap-2 px-4 py-3">
        {/* {session && (
          <div className="flex items-center gap-2.5 rounded-lg px-3 py-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">
              {session.studentId.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0 leading-tight">
              <p className="truncate text-xs font-semibold">{session.studentId}</p>
              <p className="truncate text-[11px] text-muted-foreground">Semester {session.semester}</p>
            </div>
          </div>
        )} */}
        <button
          onClick={logout}
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <HugeiconsIcon icon={Logout01Icon} size={16} className="shrink-0" />
          Sign out
        </button>
      </div>
    </aside>
    </>
  )
}
