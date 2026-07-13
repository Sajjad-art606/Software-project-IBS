import { NextRequest, NextResponse } from "next/server"
import { saveUploadedDocument } from "@/lib/documents-storage"
import {
  getSessionFromRequest,
  requireAdminSession,
} from "@/lib/auth/server-session"

export async function POST(request: NextRequest) {
  const session = getSessionFromRequest(request)
  const denied = requireAdminSession(session)
  if (denied) return denied

  try {
    const formData = await request.formData()
    const file = formData.get("file")

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 })
    }

    const saved = await saveUploadedDocument(file)
    return NextResponse.json(saved, { status: 201 })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed."
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
