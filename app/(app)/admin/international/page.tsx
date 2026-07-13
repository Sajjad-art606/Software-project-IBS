import { db } from "@/db"
import { internationalInfo } from "@/db/schema"
import type { HelpContent } from "@/db/schema"
import { mapRow } from "@/db/utils"
import {
  AdminInternationalClient,
  type AdminInternationalEntry,
} from "./admin-international-client"

export const metadata = {
  title: "Admin — International Help | IBS Student Hub",
}

export default function AdminInternationalPage() {
  const allEntries = db
    .select()
    .from(internationalInfo)
    .all()
    .map((i) => mapRow(internationalInfo, i))
    .map(
      (i): AdminInternationalEntry => ({
        id: i.id,
        slug: i.slug,
        title: i.title,
        category: i.category,
        description: i.description,
        content: i.content as HelpContent,
        tags: i.tags as string[],
        sortOrder: i.sortOrder ?? null,
      })
    )
    .sort((a, b) => a.title.localeCompare(b.title))

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6">
      <div>
        <h1 className="text-xl font-semibold">Manage International Help</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Changes appear immediately on the public International Help pages.
        </p>
      </div>
      <AdminInternationalClient initialEntries={allEntries} />
    </div>
  )
}
