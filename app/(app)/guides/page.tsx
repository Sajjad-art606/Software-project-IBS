import { db } from '@/db'
import { guides } from '@/db/schema'
import { mapRow } from '@/db/utils'
import type { GuideCardData } from '@/components/guides/guide-card'
import type { GuideStep } from '@/db/schema'
import { cookies } from 'next/headers'
import { COOKIE_NAME, decodeSession } from '@/lib/auth/session'
import { GuidesClient } from './guides-client'

export const metadata = {
  title: 'Process Guides | IBS Student Hub',
  description: 'Step-by-step guides for enrollment, exams, internship, thesis, and more.',
}

export default async function GuidesPage() {
  const cookieStore = await cookies()
  const raw = cookieStore.get(COOKIE_NAME)?.value ?? null
  const session = raw ? decodeSession(raw) : null
  const userSemester = session?.semester ?? 1
  const hasSession = session != null

  const allGuides = db
    .select()
    .from(guides)
    .all()
    .map((g) => mapRow(guides, g))
    .map(
      (g): GuideCardData => ({
        id: g.id,
        slug: g.slug,
        title: g.title,
        description: g.description,
        category: g.category,
        estimatedTime: g.estimatedTime ?? null,
        tags: g.tags as string[],
        steps: g.steps as GuideStep[],
        relevantSemesters: g.relevantSemesters as number[],
      }),
    )

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6">
      <div>
        <h1 className="text-xl font-semibold">Process Guides</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Step-by-step guides for common academic processes and administrative tasks.
        </p>
      </div>
      <GuidesClient guides={allGuides} userSemester={userSemester} hasSession={hasSession} />
    </div>
  )
}
