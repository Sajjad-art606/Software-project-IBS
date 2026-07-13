import { db } from "@/db"
import { contacts } from "@/db/schema"
import { mapRow } from "@/db/utils"
import { AdminContactsClient, type AdminContact } from "./admin-contacts-client"

export const metadata = {
  title: "Admin — Contacts | IBS Student Hub",
}

export default function AdminContactsPage() {
  const allContacts = db
    .select()
    .from(contacts)
    .all()
    .map((c) => mapRow(contacts, c))
    .map(
      (c): AdminContact => ({
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
      })
    )
    .sort((a, b) => a.name.localeCompare(b.name))

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6">
      <div>
        <h1 className="text-xl font-semibold">Manage Contacts</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Changes appear immediately on the public Contacts page.
        </p>
      </div>
      <AdminContactsClient initialContacts={allContacts} />
    </div>
  )
}
