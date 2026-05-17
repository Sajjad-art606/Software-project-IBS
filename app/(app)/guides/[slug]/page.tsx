import { db } from '@/db'
import { mapRow } from '@/db/utils'
import { guides, contacts } from '@/db/schema'
import { eq, inArray } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import type { GuideStep } from '@/db/schema'
import { Badge } from '@/components/ui/badge'
import { HugeiconsIcon } from '@hugeicons/react'
import { Clock01Icon, ArrowLeft01Icon } from '@hugeicons/core-free-icons'
import Link from 'next/link'
import { GuideStepTracker } from '@/components/guides/guide-step-tracker'
import { GuideRelatedSection } from '@/components/guides/guide-related-section'
import { GUIDE_CATEGORY_COLORS } from '@/lib/guides/constants'
import { resolveRelatedGuides } from '@/lib/guides/related'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const raw = db
    .select({ title: guides.title, description: guides.description })
    .from(guides)
    .where(eq(guides.slug, slug))
    .get()
  if (!raw) return {}
  return {
    title: `${raw.title} | IBS Student Hub`,
    description: raw.description,
  }
}

export default async function GuideDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const _raw = db.select().from(guides).where(eq(guides.slug, slug)).get()
  const guide = _raw ? mapRow(guides, _raw) : undefined

  if (!guide) {
    notFound()
  }

  const steps = guide.steps as GuideStep[]
  const tags = guide.tags as string[]
  const prerequisites = (guide.prerequisites as string[]) ?? []
  const relatedGuideSlugs = (guide.relatedGuideSlugs as string[]) ?? []
  const relatedContactIds = (guide.relatedContactIds as number[]) ?? []

  const allGuideSummaries = db
    .select()
    .from(guides)
    .all()
    .map((g) => mapRow(guides, g))
    .map((g) => ({
      slug: g.slug,
      title: g.title,
      description: g.description,
      category: g.category,
      tags: g.tags as string[],
      relatedGuideSlugs: (g.relatedGuideSlugs as string[]) ?? [],
    }))

  const relatedGuides = resolveRelatedGuides(
    { slug, category: guide.category, tags, relatedGuideSlugs },
    allGuideSummaries,
  )

  const relatedContacts =
    relatedContactIds.length > 0
      ? db
          .select({
            id: contacts.id,
            name: contacts.name,
            role: contacts.role,
            email: contacts.email,
          })
          .from(contacts)
          .where(inArray(contacts.id, relatedContactIds))
          .all()
          .map((c) => ({
            id: c.id,
            name: c.name,
            role: c.role,
            email: c.email ?? null,
          }))
      : []

  return (
    <div className="mx-auto max-w-2xl p-4 sm:p-6">
      <Link
        href="/guides"
        className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <HugeiconsIcon icon={ArrowLeft01Icon} size={14} />
        All guides
      </Link>

      <div className="mb-8 flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={GUIDE_CATEGORY_COLORS[guide.category] ?? 'muted'}>
            {guide.category}
          </Badge>
          {guide.estimatedTime && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <HugeiconsIcon icon={Clock01Icon} size={12} />
              {guide.estimatedTime}
            </div>
          )}
          {guide.lastReviewedAt && (
            <span className="text-xs text-muted-foreground">
              Last updated: {guide.lastReviewedAt}
            </span>
          )}
        </div>
        <h1 className="text-2xl font-semibold">{guide.title}</h1>
        <p className="text-muted-foreground">{guide.description}</p>
        {prerequisites.length > 0 && (
          <div className="rounded-lg border border-border bg-muted/30 p-3">
            <p className="mb-1 text-xs font-semibold text-muted-foreground">Before you start</p>
            <ul className="flex flex-col gap-1">
              {prerequisites.map((item) => (
                <li key={item} className="text-sm text-muted-foreground">
                  • {item}
                </li>
              ))}
            </ul>
          </div>
        )}
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

      <GuideStepTracker steps={steps} slug={slug} />

      <GuideRelatedSection relatedGuides={relatedGuides} relatedContacts={relatedContacts} />
    </div>
  )
}
