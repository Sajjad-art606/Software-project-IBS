import { db } from "@/db"
import { documents } from "@/db/schema"
import { mapRow } from "@/db/utils"
import {
  AdminDocumentsClient,
  type AdminDocument,
} from "./admin-documents-client"

export const metadata = {
  title: "Admin — Documents | IBS Student Hub",
}

export default function AdminDocumentsPage() {
  const allDocuments = db
    .select()
    .from(documents)
    .all()
    .map((d) => mapRow(documents, d))
    .map(
      (d): AdminDocument => ({
        id: d.id,
        title: d.title,
        description: d.description ?? null,
        fileUrl: d.fileUrl ?? null,
        category: d.category,
        fileType: d.fileType ?? null,
        tags: d.tags as string[],
        relevantSemesters: d.relevantSemesters as number[],
      })
    )
    .sort((a, b) => a.title.localeCompare(b.title))

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6">
      <div>
        <h1 className="text-xl font-semibold">Manage Documents</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Changes appear immediately on the public Documents page.
        </p>
      </div>
      <AdminDocumentsClient initialDocuments={allDocuments} />
    </div>
  )
}
