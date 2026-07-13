import { NextResponse } from "next/server"
import { db } from "@/db"
import { documents } from "@/db/schema"
import { mapRow } from "@/db/utils"
import { resolveDocumentFileUrl } from "@/lib/documents"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get("q")?.trim().toLowerCase() ?? ""
  const category = searchParams.get("category") ?? ""
  const semester = searchParams.get("semester")
  const semesterNum = semester ? parseInt(semester, 10) : null

  let all = db
    .select()
    .from(documents)
    .all()
    .map((d) => mapRow(documents, d))
    .map((d) => ({
      ...d,
      fileUrl: resolveDocumentFileUrl({
        title: d.title,
        fileUrl: d.fileUrl ?? null,
        fileType: d.fileType ?? null,
      }),
    }))

  if (semesterNum) {
    all = all.filter(
      (d) =>
        (d.relevantSemesters as number[]).length === 0 ||
        (d.relevantSemesters as number[]).includes(semesterNum)
    )
  }

  if (category && category !== "all") {
    all = all.filter((d) => d.category === category)
  }

  if (q) {
    all = all.filter(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        (d.description?.toLowerCase().includes(q) ?? false) ||
        (d.tags as string[]).some((t) => t.toLowerCase().includes(q))
    )
  }

  return NextResponse.json(all)
}
