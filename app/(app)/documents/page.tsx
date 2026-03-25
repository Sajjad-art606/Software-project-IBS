import { db } from '@/db'
import { mapRow } from '@/db/utils'
import { documents } from '@/db/schema'
import type { Document } from './documents-client'
import { DocumentsClient } from './documents-client'

export const metadata = {
  title: 'Documents | IBS Student Hub',
  description: 'Access forms, templates, and official documents for IBS students at HFU.',
}

export default function DocumentsPage() {
  const allDocuments = db
    .select()
    .from(documents)
    .all()
    .map((d) => mapRow(documents, d))
    .map(
      (d): Document => ({
        id: d.id,
        title: d.title,
        description: d.description ?? null,
        fileUrl: d.fileUrl ?? null,
        category: d.category,
        fileType: d.fileType ?? null,
        tags: d.tags as string[],
        relevantSemesters: d.relevantSemesters as number[],
      }),
    )

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6">
      <div>
        <h1 className="text-xl font-semibold">Document Center</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Browse and download important forms, templates, and regulations.
        </p>
      </div>
      <DocumentsClient allDocuments={allDocuments} />
    </div>
  )
}
