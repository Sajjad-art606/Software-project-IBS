import { db } from '@/db'
import { guides, contacts, platformLinks } from '@/db/schema'
import type { GuideStep } from '@/db/schema'
import { cookies } from 'next/headers'
import { COOKIE_NAME, decodeSession } from '@/lib/auth/session'

export const metadata = {
  title: 'Dashboard | IBS Student Hub',
  description: 'Your personalized overview of guides, contacts, and platforms at HFU.',
}
import Link from 'next/link'
import { mapRow } from '@/db/utils'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Book02Icon,
  UserGroupIcon,
  Link01Icon,
  Clock01Icon,
  DashboardSquare01Icon,
  GlobeIcon,
  File01Icon,
  Search01Icon,
} from '@hugeicons/core-free-icons'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

function semesterMessage(semester: number): string {
  if (semester === 1) return 'Welcome to HFU! Get your accounts set up and find your way around campus.'
  if (semester === 2) return 'Focus on your studies. Exam registration opens soon - stay on top of deadlines.'
  if (semester === 3) return 'Time to start your internship search! The practical semester is coming up.'
  if (semester === 4) return 'Practical semester! Complete your internship and submit your report on time.'
  if (semester === 5) return 'Think about your thesis topic and find a supervisor early.'
  if (semester === 6) return 'Working on your bachelor thesis? The Career Center can help with your next steps.'
  return 'Final stretch! Finish strong and prepare for your career ahead.'
}

function filterBySemester<T extends { relevantSemesters: number[] }>(
  items: T[],
  semester: number,
): T[] {
  return items.filter(
    (item) =>
      item.relevantSemesters.length === 0 ||
      item.relevantSemesters.includes(semester),
  )
}

const categoryColors: Record<string, 'default' | 'secondary' | 'outline' | 'muted' | 'success'> = {
  general: 'muted',
  enrollment: 'secondary',
  exams: 'outline',
  internship: 'default',
  international: 'success',
  thesis: 'secondary',
}

const platformIcons: Record<string, typeof Book02Icon> = {
  academic: DashboardSquare01Icon,
  communication: File01Icon,
  scheduling: Clock01Icon,
  learning: Book02Icon,
}

const quickLinks = [
  { label: 'Search', href: '/search', icon: Search01Icon, description: 'Find anything instantly' },
  { label: 'Guides', href: '/guides', icon: Book02Icon, description: 'Step-by-step processes' },
  { label: 'Contacts', href: '/contacts', icon: UserGroupIcon, description: 'Find the right person' },
  { label: 'Documents', href: '/documents', icon: File01Icon, description: 'Forms & templates' },
  { label: 'Platforms', href: '/platforms', icon: Link01Icon, description: 'HFU web services' },
  { label: 'Int\'l Help', href: '/help', icon: GlobeIcon, description: 'For international students' },
]

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const raw = cookieStore.get(COOKIE_NAME)?.value ?? null
  const session = raw ? decodeSession(raw) : null
  const semester = session?.semester ?? 1

  const allGuides = db.select().from(guides).all().map((g) => mapRow(guides, g))
  const allContacts = db.select().from(contacts).all().map((c) => mapRow(contacts, c))
  const allPlatforms = db.select().from(platformLinks).orderBy(platformLinks.sortOrder).all().map((p) => mapRow(platformLinks, p))

  const relevantGuides = filterBySemester(
    allGuides.map((g) => ({
      ...g,
      relevantSemesters: g.relevantSemesters as number[],
      steps: g.steps as GuideStep[],
      tags: g.tags as string[],
    })),
    semester,
  ).slice(0, 4)

  const relevantContacts = filterBySemester(
    allContacts.map((c) => ({
      ...c,
      relevantSemesters: c.relevantSemesters as number[],
      tags: c.tags as string[],
    })),
    semester,
  ).slice(0, 3)

  return (
    <div className="flex flex-col gap-8 p-4 sm:p-6">
      {/* Welcome banner */}
      <div className="relative overflow-hidden rounded-xl border border-border bg-gradient-to-br from-primary/5 to-primary/10 p-4 sm:p-6">
        <div className="relative z-10 max-w-[calc(100%-120px)] sm:max-w-[calc(100%-160px)]">
          <h1 className="text-xl font-semibold">
            Welcome back{session ? `, ${session.displayName ?? session.studentId}` : ''}!
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Semester {semester}</span> - {semesterMessage(semester)}
          </p>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/illustrations/graduation.svg"
          alt=""
          aria-hidden
          className="absolute -bottom-10 -right-2 w-28 select-none sm:w-40"
          draggable={false}
        />
      </div>

      {/* Quick links */}
      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Quick Access
        </h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {quickLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-4 text-center transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <HugeiconsIcon icon={item.icon} size={20} className="text-primary" />
              <div>
                <p className="text-xs font-medium">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Relevant guides */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Guides for You
            </h2>
            <Link href="/guides" className="text-xs text-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            {relevantGuides.length === 0 ? (
              <p className="text-sm text-muted-foreground">No guides found for your semester.</p>
            ) : (
              relevantGuides.map((guide) => (
                <Link
                  key={guide.id}
                  href={`/guides/${guide.slug}`}
                  className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <HugeiconsIcon icon={Book02Icon} size={16} className="mt-0.5 shrink-0 text-primary" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium leading-tight">{guide.title}</p>
                      <Badge variant={categoryColors[guide.category] ?? 'muted'} className="shrink-0 text-xs">
                        {guide.category}
                      </Badge>
                    </div>
                    <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                      {guide.description}
                    </p>
                    {guide.estimatedTime && (
                      <div className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground">
                        <HugeiconsIcon icon={Clock01Icon} size={11} />
                        {guide.estimatedTime}
                      </div>
                    )}
                  </div>
                </Link>
              ))
            )}
          </div>
        </section>

        {/* Relevant contacts */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Key Contacts
            </h2>
            <Link href="/contacts" className="text-xs text-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            {relevantContacts.length === 0 ? (
              <p className="text-sm text-muted-foreground">No specific contacts for Semester {semester}.</p>
            ) : null}
            {relevantContacts.map((contact) => (
              <div
                key={contact.id}
                className="flex items-start gap-3 rounded-xl border border-border bg-card p-4"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {contact.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium leading-tight">{contact.name}</p>
                  <p className="text-xs text-muted-foreground">{contact.role}</p>
                  {contact.email && (
                    <a
                      href={`mailto:${contact.email}`}
                      className="mt-0.5 text-xs text-primary hover:underline"
                    >
                      {contact.email}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Platform links */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            HFU Platforms
          </h2>
          <Link href="/platforms" className="text-xs text-primary hover:underline">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {allPlatforms.map((platform) => (
            <a
              key={platform.id}
              href={(platform.url as string)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-4 text-center transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <HugeiconsIcon
                icon={platformIcons[platform.category as string] ?? Link01Icon}
                size={18}
                className="text-primary"
              />
              <div>
                <p className="text-xs font-semibold">{platform.shortName ?? platform.name}</p>
                <p className="line-clamp-1 text-xs text-muted-foreground">{platform.description}</p>
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  )
}
