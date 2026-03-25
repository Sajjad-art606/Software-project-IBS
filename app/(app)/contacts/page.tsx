import { db } from '@/db'
import { mapRow } from '@/db/utils'
import { contacts } from '@/db/schema'
import type { Contact } from './contacts-client'
import { ContactsClient } from './contacts-client'

export const metadata = {
  title: 'Contacts | IBS Student Hub',
  description: 'Find the right contact person for your academic needs at HFU.',
}

export default function ContactsPage() {
  const allContacts = db
    .select()
    .from(contacts)
    .all()
    .map((c) => mapRow(contacts, c))
    .map(
      (c): Contact => ({
        id: c.id,
        name: c.name,
        role: c.role,
        department: c.department ?? null,
        email: c.email ?? null,
        phone: c.phone ?? null,
        officeLocation: c.officeLocation ?? null,
        officeHours: c.officeHours ?? null,
        tags: c.tags as string[],
        relevantSemesters: c.relevantSemesters as number[],
      }),
    )

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6">
      <div>
        <h1 className="text-xl font-semibold">Contacts</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Find the right person or office for your question.
        </p>
      </div>
      <ContactsClient allContacts={allContacts} />
    </div>
  )
}
