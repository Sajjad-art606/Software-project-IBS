import Link from 'next/link'

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  const year = new Date().getFullYear()

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <header className="border-b border-border px-6 py-4">
        <Link href="/dashboard" className="inline-flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground text-xs font-bold">
            IBS
          </div>
          <span className="text-sm font-semibold">Student Hub</span>
        </Link>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
        {children}
      </main>

      <footer className="border-t border-border px-6 py-4 text-center text-xs text-muted-foreground">
        © {year} IBS Student Hub · Hochschule Furtwangen University ·{' '}
        <Link href="/privacy" className="hover:text-foreground transition-colors">
          Privacy Policy
        </Link>{' '}
        ·{' '}
        <Link href="/imprint" className="hover:text-foreground transition-colors">
          Imprint
        </Link>
      </footer>
    </div>
  )
}
