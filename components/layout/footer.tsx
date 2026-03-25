import Link from 'next/link'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="shrink-0 border-t border-border bg-background px-4 py-2.5">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground text-center sm:text-left">
          © {year} IBS Student Hub · Hochschule Furtwangen University
        </p>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <Link
            href="/privacy"
            className="transition-colors hover:text-foreground"
          >
            Privacy Policy
          </Link>
          <span className="opacity-40">·</span>
          <Link
            href="/imprint"
            className="transition-colors hover:text-foreground"
          >
            Imprint
          </Link>
          <span className="opacity-40">·</span>
          <span>Essential cookies only · No tracking</span>
        </div>
      </div>
    </footer>
  )
}
