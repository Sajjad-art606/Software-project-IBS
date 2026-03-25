import { db } from '@/db'
import { mapRow } from '@/db/utils'
import { internationalInfo } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import type { HelpContent } from '@/db/schema'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const raw = db.select({ title: internationalInfo.title, description: internationalInfo.description }).from(internationalInfo).where(eq(internationalInfo.slug, slug)).get()
  if (!raw) return {}
  return {
    title: `${raw.title} | IBS Student Hub`,
    description: raw.description,
  }
}
import { Badge } from '@/components/ui/badge'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowLeft01Icon, Link01Icon } from '@hugeicons/core-free-icons'
import Link from 'next/link'

const categoryLabels: Record<string, string> = {
  registration: 'City Registration',
  banking: 'Banking',
  housing: 'Housing',
  insurance: 'Insurance',
  visa: 'Visa & Permits',
  general: 'General',
}

export default async function HelpDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const _rawInfo = db.select().from(internationalInfo).where(eq(internationalInfo.slug, slug)).get()
  const info = _rawInfo ? mapRow(internationalInfo, _rawInfo) : undefined

  if (!info) {
    notFound()
  }

  const content = info.content as HelpContent
  const tags = info.tags as string[]

  return (
    <div className="mx-auto max-w-2xl p-4 sm:p-6">
      {/* Back link */}
      <Link
        href="/help"
        className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <HugeiconsIcon icon={ArrowLeft01Icon} size={14} />
        International Help
      </Link>

      {/* Header */}
      <div className="mb-8 flex flex-col gap-3">
        <Badge variant="default" className="w-fit">
          {categoryLabels[info.category] ?? info.category}
        </Badge>
        <h1 className="text-2xl font-semibold">{info.title}</h1>
        <p className="text-muted-foreground">{info.description}</p>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Steps */}
      {content.steps && content.steps.length > 0 && (
        <div className="mb-8 flex flex-col gap-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Steps
          </h2>
          <ol className="flex flex-col gap-4">
            {content.steps.map((step) => (
              <li
                key={step.id}
                className="flex gap-4 rounded-xl border border-border bg-card p-5"
              >
                <div className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  {step.id}
                </div>
                <div className="flex flex-1 flex-col gap-2">
                  <h3 className="text-sm font-semibold">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                  {step.links && step.links.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {step.links.map((link, i) => (
                        <a
                          key={i}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-primary hover:underline"
                        >
                          <HugeiconsIcon icon={Link01Icon} size={11} />
                          {link.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Tips */}
      {content.tips && content.tips.length > 0 && (
        <div className="mb-8 rounded-xl border border-primary/20 bg-primary/5 p-5">
          <h2 className="mb-3 text-sm font-semibold text-primary">Tips</h2>
          <ul className="flex flex-col gap-2">
            {content.tips.map((tip, i) => (
              <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                <span className="mt-0.5 text-primary">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Additional links */}
      {content.links && content.links.length > 0 && (
        <div className="flex flex-col gap-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Useful Links
          </h2>
          <div className="flex flex-col gap-2">
            {content.links.map((link, i) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-3 text-sm text-primary transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <HugeiconsIcon icon={Link01Icon} size={14} />
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
