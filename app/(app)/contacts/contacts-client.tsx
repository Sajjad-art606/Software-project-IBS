'use client'

import { useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { Search01Icon, Mail01Icon, Call02Icon, Clock01Icon, Building03Icon } from '@hugeicons/core-free-icons'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { useDebounce } from '@/hooks/use-debounce'

interface Contact {
  id: number
  name: string
  role: string
  department: string | null
  email: string | null
  phone: string | null
  officeLocation: string | null
  officeHours: string | null
  tags: string[]
  relevantSemesters: number[]
}

function ContactCard({ contact }: { contact: Contact }) {
  const initials = contact.name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

  return (
    <div className="flex gap-4 rounded-xl border border-border bg-card p-5">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
        {initials}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div>
          <p className="font-semibold">{contact.name}</p>
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge variant="secondary" className="text-xs">{contact.role}</Badge>
            {contact.department && (
              <span className="text-xs text-muted-foreground">{contact.department}</span>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          {contact.email && (
            <a
              href={`mailto:${contact.email}`}
              className="flex items-center gap-1.5 text-xs text-primary hover:underline"
            >
              <HugeiconsIcon icon={Mail01Icon} size={12} />
              {contact.email}
            </a>
          )}
          {contact.phone && (
            <a
              href={`tel:${contact.phone}`}
              className="flex items-center gap-1.5 text-xs text-muted-foreground"
            >
              <HugeiconsIcon icon={Call02Icon} size={12} />
              {contact.phone}
            </a>
          )}
          {contact.officeLocation && (
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <HugeiconsIcon icon={Building03Icon} size={12} />
              {contact.officeLocation}
            </p>
          )}
          {contact.officeHours && (
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <HugeiconsIcon icon={Clock01Icon} size={12} />
              {contact.officeHours}
            </p>
          )}
        </div>
        {contact.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {contact.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function ContactsClient({ allContacts }: { allContacts: Contact[] }) {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 200)

  const filtered = debouncedQuery.trim()
    ? allContacts.filter(
        (c) =>
          c.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
          c.role.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
          (c.department?.toLowerCase().includes(debouncedQuery.toLowerCase()) ?? false) ||
          c.tags.some((t) => t.toLowerCase().includes(debouncedQuery.toLowerCase())),
      )
    : allContacts

  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <HugeiconsIcon
          icon={Search01Icon}
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, role, topic..."
          className="pl-9"
        />
      </div>
      {filtered.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          No contacts found for &ldquo;{debouncedQuery}&rdquo;
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {filtered.map((contact) => (
            <ContactCard key={contact.id} contact={contact} />
          ))}
        </div>
      )}
    </div>
  )
}

export { ContactsClient }
export type { Contact }
