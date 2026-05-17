import Link from 'next/link'
import { HugeiconsIcon } from '@hugeicons/react'
import { Book02Icon, UserGroupIcon } from '@hugeicons/core-free-icons'
import { Card, CardContent } from '@/components/ui/card'
import type { GuideRelatedSummary } from '@/lib/guides/related'

export interface RelatedContact {
  id: number
  name: string
  role: string
  email: string | null
}

export function GuideRelatedSection({
  relatedGuides,
  relatedContacts,
}: {
  relatedGuides: GuideRelatedSummary[]
  relatedContacts: RelatedContact[]
}) {
  if (relatedGuides.length === 0 && relatedContacts.length === 0) return null

  return (
    <div className="mt-10 flex flex-col gap-8 border-t border-border pt-8">
      {relatedGuides.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Related guides
          </h2>
          <div className="flex flex-col gap-2">
            {relatedGuides.map((g) => (
              <Link
                key={g.slug}
                href={`/guides/${g.slug}`}
                className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <HugeiconsIcon icon={Book02Icon} size={16} className="mt-0.5 shrink-0 text-primary" />
                <div className="min-w-0">
                  <p className="text-sm font-medium leading-tight">{g.title}</p>
                  <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{g.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {relatedContacts.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Who to contact
          </h2>
          <div className="flex flex-col gap-2">
            {relatedContacts.map((contact) => (
              <Card key={contact.id}>
                <CardContent className="flex items-start gap-3 pt-4">
                  <HugeiconsIcon
                    icon={UserGroupIcon}
                    size={16}
                    className="mt-0.5 shrink-0 text-primary"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{contact.name}</p>
                    <p className="text-xs text-muted-foreground">{contact.role}</p>
                    {contact.email && (
                      <a
                        href={`mailto:${contact.email}`}
                        className="mt-1 block text-xs text-primary hover:underline"
                      >
                        {contact.email}
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <Link href="/contacts" className="mt-2 inline-block text-xs text-primary hover:underline">
            View all contacts
          </Link>
        </section>
      )}
    </div>
  )
}

