import { db } from '@/db'
import { mapRow } from '@/db/utils'
import { platformLinks } from '@/db/schema'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  DashboardSquare01Icon,
  Mail01Icon,
  Calendar01Icon,
  Book02Icon,
  Link01Icon,
  ArrowRight01Icon,
} from '@hugeicons/core-free-icons'
import { Badge } from '@/components/ui/badge'

export const metadata = {
  title: 'Platform Links | IBS Student Hub',
  description: 'Quick access to Felix, MIO/QIS, OWA, sPlan, and all HFU web platforms.',
}

const categoryIcons: Record<string, typeof Link01Icon> = {
  academic: DashboardSquare01Icon,
  communication: Mail01Icon,
  scheduling: Calendar01Icon,
  learning: Book02Icon,
}

const categoryLabels: Record<string, string> = {
  academic: 'Academic',
  communication: 'Communication',
  scheduling: 'Scheduling',
  learning: 'Learning',
}

export default function PlatformsPage() {
  const allPlatforms = db
    .select()
    .from(platformLinks)
    .orderBy(platformLinks.sortOrder)
    .all()
    .map((p) => mapRow(platformLinks, p))

  const grouped = allPlatforms.reduce<Record<string, typeof allPlatforms>>(
    (acc, p) => {
      const cat = p.category as string
      if (!acc[cat]) acc[cat] = []
      acc[cat].push(p)
      return acc
    },
    {},
  )

  return (
    <div className="flex flex-col gap-8 p-4 sm:p-6">
      <div>
        <h1 className="text-xl font-semibold">Platform Links</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Quick access to all HFU web services and platforms.
        </p>
      </div>

      {Object.entries(grouped).map(([category, platforms]) => (
        <section key={category}>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            {categoryLabels[category] ?? category}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {platforms.map((platform) => (
              <a
                key={platform.id}
                href={platform.url as string}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <HugeiconsIcon
                      icon={categoryIcons[category] ?? Link01Icon}
                      size={20}
                    />
                  </div>
                  <Badge variant="muted" className="text-xs">
                    {platform.shortName ?? platform.name}
                  </Badge>
                </div>
                <div>
                  <p className="font-semibold">{platform.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {platform.description}
                  </p>
                </div>
                <div className="inline-flex w-full items-center justify-center gap-1.5 rounded-4xl border border-border bg-input/30 px-3 py-1 text-sm font-medium">
                  Open {platform.shortName ?? 'Platform'}
                  <HugeiconsIcon icon={ArrowRight01Icon} size={13} />
                </div>
              </a>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
