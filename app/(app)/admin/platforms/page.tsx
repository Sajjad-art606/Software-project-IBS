import { db } from "@/db"
import { platformLinks } from "@/db/schema"
import { mapRow } from "@/db/utils"
import {
  AdminPlatformsClient,
  type AdminPlatform,
} from "./admin-platforms-client"

export const metadata = {
  title: "Admin — Platform Links | IBS Student Hub",
}

export default function AdminPlatformsPage() {
  const allPlatforms = db
    .select()
    .from(platformLinks)
    .orderBy(platformLinks.sortOrder)
    .all()
    .map((p) => mapRow(platformLinks, p))
    .map(
      (p): AdminPlatform => ({
        id: p.id,
        name: p.name,
        shortName: p.shortName ?? null,
        description: p.description,
        url: p.url,
        category: p.category,
        tags: p.tags as string[],
        sortOrder: p.sortOrder ?? null,
      })
    )

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6">
      <div>
        <h1 className="text-xl font-semibold">Manage Platform Links</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Changes appear immediately on the Platform Links page and dashboard.
        </p>
      </div>
      <AdminPlatformsClient initialPlatforms={allPlatforms} />
    </div>
  )
}
