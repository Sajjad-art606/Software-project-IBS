import { db } from '@/db'
import { mapRow } from '@/db/utils'
import { guides } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import type { GuideStep } from '@/db/schema'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const raw = db.select({ title: guides.title, description: guides.description }).from(guides).where(eq(guides.slug, slug)).get()
  if (!raw) return {}
  return {
    title: `${raw.title} | IBS Student Hub`,
    description: raw.description,
  }
}
import { Badge } from '@/components/ui/badge'
import { HugeiconsIcon } from '@hugeicons/react'
import { Clock01Icon, ArrowLeft01Icon } from '@hugeicons/core-free-icons'
import Link from 'next/link'
import { GuideStepTracker } from '@/components/guides/guide-step-tracker'

const categoryColors: Record<string, 'default' | 'secondary' | 'outline' | 'muted' | 'success'> = {
  general: 'muted',
  enrollment: 'secondary',
  exams: 'outline',
  internship: 'default',
  international: 'success',
  thesis: 'secondary',
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

  return (
    <div className="mx-auto max-w-2xl p-4 sm:p-6">
      {/* Back link */}
      <Link
        href="/guides"
        className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <HugeiconsIcon icon={ArrowLeft01Icon} size={14} />
        All guides
      </Link>

      {/* Header */}
      <div className="mb-8 flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={categoryColors[guide.category] ?? 'muted'}>
            {guide.category}
          </Badge>
          {guide.estimatedTime && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <HugeiconsIcon icon={Clock01Icon} size={12} />
              {guide.estimatedTime}
            </div>
          )}
        </div>
        <h1 className="text-2xl font-semibold">{guide.title}</h1>
        <p className="text-muted-foreground">{guide.description}</p>
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

      {/* Interactive steps */}
      <GuideStepTracker steps={steps} slug={slug} />
    </div>
  )
}
