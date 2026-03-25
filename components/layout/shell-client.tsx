'use client'

import { useState, useCallback } from 'react'
import { Sidebar } from './sidebar'
import { Header } from './header'
import { Footer } from './footer'

export function ShellClient({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const handleClose = useCallback(() => setSidebarOpen(false), [])

  return (
    <div className="flex h-svh overflow-hidden bg-background">
      <Sidebar open={sidebarOpen} onClose={handleClose} />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto">{children}</main>
        <Footer />
      </div>
    </div>
  )
}
