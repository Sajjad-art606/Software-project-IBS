"use client"

import { useState } from "react"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { Delete02Icon, Edit02Icon, Add01Icon } from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DOCUMENT_CATEGORIES } from "@/lib/documents"

export interface AdminDocument {
  id: number
  title: string
  description: string | null
  fileUrl: string | null
  category: string
  fileType: string | null
  tags: string[]
  relevantSemesters: number[]
}

type FormState = {
  title: string
  description: string
  fileUrl: string
  category: string
  fileType: string
  tags: string
  relevantSemesters: string
}

const emptyForm: FormState = {
  title: "",
  description: "",
  fileUrl: "",
  category: "forms",
  fileType: "pdf",
  tags: "",
  relevantSemesters: "",
}

function formFromDocument(doc: AdminDocument): FormState {
  return {
    title: doc.title,
    description: doc.description ?? "",
    fileUrl: doc.fileUrl ?? "",
    category: doc.category,
    fileType: doc.fileType ?? "pdf",
    tags: doc.tags.join(", "),
    relevantSemesters: doc.relevantSemesters.join(", "),
  }
}

function parseSemesters(raw: string): number[] {
  return raw
    .split(",")
    .map((s) => Number(s.trim()))
    .filter((n) => n >= 1 && n <= 7)
}

function parseTags(raw: string): string[] {
  return raw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
}

function isUploadedFile(url: string): boolean {
  return url.startsWith("/uploads/documents/")
}

export function AdminDocumentsClient({
  initialDocuments,
}: {
  initialDocuments: AdminDocument[]
}) {
  const [documents, setDocuments] = useState(initialDocuments)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  function resetForm() {
    setForm(emptyForm)
    setSelectedFile(null)
    setEditingId(null)
    setShowForm(false)
    setError("")
  }

  function startCreate() {
    setForm(emptyForm)
    setSelectedFile(null)
    setEditingId(null)
    setShowForm(true)
    setError("")
  }

  function startEdit(doc: AdminDocument) {
    setForm(formFromDocument(doc))
    setSelectedFile(null)
    setEditingId(doc.id)
    setShowForm(true)
    setError("")
  }

  async function uploadFile(file: File) {
    const body = new FormData()
    body.append("file", file)
    const res = await fetch("/api/admin/documents/upload", {
      method: "POST",
      body,
    })
    const data = (await res.json()) as {
      fileUrl?: string
      fileType?: string
      error?: string
    }
    if (!res.ok) {
      throw new Error(data.error ?? "Upload failed.")
    }
    if (!data.fileUrl || !data.fileType) {
      throw new Error("Upload failed.")
    }
    return { fileUrl: data.fileUrl, fileType: data.fileType }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      let fileUrl = form.fileUrl.trim()
      let fileType = form.fileType

      if (fileType === "link") {
        if (!fileUrl) {
          setError("Please enter an external link URL.")
          setLoading(false)
          return
        }
      } else if (selectedFile) {
        const uploaded = await uploadFile(selectedFile)
        fileUrl = uploaded.fileUrl
        fileType = uploaded.fileType
      } else if (!fileUrl || fileUrl === "#") {
        setError("Please upload a PDF or DOCX file.")
        setLoading(false)
        return
      }

      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        fileUrl,
        category: form.category,
        fileType,
        tags: parseTags(form.tags),
        relevantSemesters: parseSemesters(form.relevantSemesters),
      }

      const url = editingId
        ? `/api/admin/documents/${editingId}`
        : "/api/admin/documents"
      const method = editingId ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = (await res.json()) as AdminDocument & { error?: string }

      if (!res.ok) {
        setError(data.error ?? "Something went wrong.")
        return
      }

      if (editingId) {
        setDocuments((prev) => prev.map((d) => (d.id === editingId ? data : d)))
      } else {
        setDocuments((prev) =>
          [...prev, data].sort((a, b) => a.title.localeCompare(b.title))
        )
      }
      resetForm()
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Network error. Please try again."
      )
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: number) {
    if (
      !window.confirm(
        "Delete this document? The uploaded file will also be removed."
      )
    )
      return
    setLoading(true)
    setError("")

    try {
      const res = await fetch(`/api/admin/documents/${id}`, {
        method: "DELETE",
      })
      const data = (await res.json()) as { error?: string }
      if (!res.ok) {
        setError(data.error ?? "Could not delete document.")
        return
      }
      setDocuments((prev) => prev.filter((d) => d.id !== id))
      if (editingId === id) resetForm()
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const isLinkType = form.fileType === "link"
  const currentUploadedName =
    form.fileUrl && isUploadedFile(form.fileUrl)
      ? form.fileUrl.split("/").pop()
      : null

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/admin"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to Admin
        </Link>
        <Button onClick={startCreate} disabled={loading}>
          <HugeiconsIcon icon={Add01Icon} size={16} data-icon="inline-start" />
          Add document
        </Button>
      </div>

      {error && (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5"
        >
          <p className="font-semibold">
            {editingId ? "Edit document" : "New document"}
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5 sm:col-span-2">
              <span className="text-sm font-medium">Title</span>
              <Input
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
                required
              />
            </label>

            <label className="flex flex-col gap-1.5 sm:col-span-2">
              <span className="text-sm font-medium">Description</span>
              <Input
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium">Category</span>
              <Select
                value={form.category}
                onValueChange={(v) =>
                  setForm((f) => ({ ...f, category: v ?? "forms" }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DOCUMENT_CATEGORIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium">Document type</span>
              <Select
                value={form.fileType}
                onValueChange={(v) => {
                  const nextType = v ?? "pdf"
                  setForm((f) => ({
                    ...f,
                    fileType: nextType,
                    fileUrl:
                      nextType === "link"
                        ? f.fileUrl
                        : isUploadedFile(f.fileUrl)
                          ? f.fileUrl
                          : "",
                  }))
                  if (nextType === "link") setSelectedFile(null)
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF upload</SelectItem>
                  <SelectItem value="docx">DOCX upload</SelectItem>
                  <SelectItem value="link">External link</SelectItem>
                </SelectContent>
              </Select>
            </label>

            {isLinkType ? (
              <label className="flex flex-col gap-1.5 sm:col-span-2">
                <span className="text-sm font-medium">External URL</span>
                <Input
                  value={form.fileUrl}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, fileUrl: e.target.value }))
                  }
                  placeholder="https://..."
                  required
                />
              </label>
            ) : (
              <label className="flex flex-col gap-1.5 sm:col-span-2">
                <span className="text-sm font-medium">File from computer</span>
                <Input
                  type="file"
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
                />
                <span className="text-xs text-muted-foreground">
                  PDF, DOC, or DOCX · max 10 MB
                  {currentUploadedName && !selectedFile
                    ? ` · Current file: ${currentUploadedName}`
                    : ""}
                </span>
              </label>
            )}

            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium">Tags</span>
              <Input
                value={form.tags}
                onChange={(e) =>
                  setForm((f) => ({ ...f, tags: e.target.value }))
                }
                placeholder="exams, internship"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium">Relevant semesters</span>
              <Input
                value={form.relevantSemesters}
                onChange={(e) =>
                  setForm((f) => ({ ...f, relevantSemesters: e.target.value }))
                }
                placeholder="1, 3, 5 or leave empty for all"
              />
            </label>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button type="submit" disabled={loading}>
              {loading
                ? "Saving…"
                : editingId
                  ? "Save changes"
                  : "Create document"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={resetForm}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}

      <div className="flex flex-col gap-3">
        {documents.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No documents yet.
          </p>
        ) : (
          documents.map((doc) => (
            <div
              key={doc.id}
              className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-start sm:justify-between"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold">{doc.title}</p>
                  <Badge variant="secondary">{doc.category}</Badge>
                  <Badge variant="outline">{doc.fileType ?? "pdf"}</Badge>
                </div>
                {doc.description && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {doc.description}
                  </p>
                )}
                {doc.fileUrl && doc.fileUrl !== "#" && (
                  <p className="mt-1 truncate text-xs text-primary">
                    {doc.fileUrl}
                  </p>
                )}
              </div>
              <div className="flex shrink-0 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => startEdit(doc)}
                  disabled={loading}
                >
                  <HugeiconsIcon icon={Edit02Icon} size={14} />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(doc.id)}
                  disabled={loading}
                >
                  <HugeiconsIcon icon={Delete02Icon} size={14} />
                  Delete
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
