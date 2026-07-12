import { db } from "@/db"
import { guides } from "@/db/schema"
import type { GuideStep } from "@/db/schema"
import { mapRow } from "@/db/utils"
import { AdminGuidesClient, type AdminGuide } from "./admin-guides-client"

export const metadata = {
  title: "Admin — Guides | IBS Student Hub",
}

export default function AdminGuidesPage() {
  const allGuides = db
    .select()
    .from(guides)
    .all()
    .map((g) => mapRow(guides, g))
    .map(
      (g): AdminGuide => ({
        id: g.id,
        slug: g.slug,
        title: g.title,
        description: g.description,
        category: g.category,
        steps: g.steps as GuideStep[],
        tags: g.tags as string[],
        relevantSemesters: g.relevantSemesters as number[],
        estimatedTime: g.estimatedTime ?? null,
      })
    )
    .sort((a, b) => a.title.localeCompare(b.title))

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6">
      <div>
        <h1 className="text-xl font-semibold">Manage Process Guides</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Changes appear immediately on the public Guides pages.
        </p>
      </div>
      <AdminGuidesClient initialGuides={allGuides} />
    </div>
  )
}
