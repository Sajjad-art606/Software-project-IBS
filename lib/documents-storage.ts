import fs from "fs/promises"
import path from "path"
import { randomBytes } from "crypto"

export const DOCUMENTS_UPLOAD_DIR = path.join(
  process.cwd(),
  "public",
  "uploads",
  "documents"
)
export const DOCUMENTS_UPLOAD_URL_PREFIX = "/uploads/documents/"

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024

const ALLOWED_EXTENSIONS = new Set([".pdf", ".doc", ".docx"])
const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
])

export function isStoredDocumentUrl(
  fileUrl: string | null | undefined
): boolean {
  return !!fileUrl?.startsWith(DOCUMENTS_UPLOAD_URL_PREFIX)
}

export function getStoredDocumentPath(fileUrl: string): string | null {
  if (!isStoredDocumentUrl(fileUrl)) return null
  const filename = path.basename(fileUrl)
  if (
    !filename ||
    filename.includes("..") ||
    filename.includes("/") ||
    filename.includes("\\")
  ) {
    return null
  }
  return path.join(DOCUMENTS_UPLOAD_DIR, filename)
}

export async function ensureUploadDirectory(): Promise<void> {
  await fs.mkdir(DOCUMENTS_UPLOAD_DIR, { recursive: true })
}

export async function deleteStoredDocument(
  fileUrl: string | null | undefined
): Promise<void> {
  if (!fileUrl) return
  const filePath = getStoredDocumentPath(fileUrl)
  if (!filePath) return
  await fs.unlink(filePath).catch(() => undefined)
}

function sanitizeFilename(name: string): string {
  const base = path.basename(name)
  return base
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 120)
}

export function inferFileType(filename: string): "pdf" | "docx" {
  const ext = path.extname(filename).toLowerCase()
  if (ext === ".doc" || ext === ".docx") return "docx"
  return "pdf"
}

export async function saveUploadedDocument(
  file: File
): Promise<{
  fileUrl: string
  fileType: "pdf" | "docx"
  originalName: string
}> {
  if (file.size === 0) {
    throw new Error("The selected file is empty.")
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error("File is too large. Maximum size is 10 MB.")
  }

  const ext = path.extname(file.name).toLowerCase()
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    throw new Error("Only PDF, DOC, and DOCX files are allowed.")
  }

  if (file.type && !ALLOWED_MIME_TYPES.has(file.type)) {
    throw new Error("Unsupported file type.")
  }

  await ensureUploadDirectory()

  const safeName = sanitizeFilename(file.name) || `document${ext}`
  const storedName = `${Date.now()}-${randomBytes(4).toString("hex")}-${safeName}`
  const filePath = path.join(DOCUMENTS_UPLOAD_DIR, storedName)
  const buffer = Buffer.from(await file.arrayBuffer())
  await fs.writeFile(filePath, buffer)

  return {
    fileUrl: `${DOCUMENTS_UPLOAD_URL_PREFIX}${storedName}`,
    fileType: inferFileType(file.name),
    originalName: file.name,
  }
}
