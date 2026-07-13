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
import { INTERNATIONAL_CATEGORIES } from "@/lib/admin/constants"
import {
  DEFAULT_HELP_CONTENT,
  normalizeHelpContent,
} from "@/lib/admin/content-defaults"
import {
  HelpContentEditor,
  validateGuideSteps,
} from "@/components/admin/content-editors"
import type { HelpContent } from "@/db/schema"

export interface AdminInternationalEntry {
  id: number
  slug: string
  title: string
  category: string
  description: string
  content: HelpContent
  tags: string[]
  sortOrder: number | null
}

type FormState = {
  title: string
  slug: string
  description: string
  category: string
  sortOrder: string
  tags: string
  content: HelpContent
}

const emptyForm: FormState = {
  title: "",
  slug: "",
  description: "",
  category: "general",
  sortOrder: "",
  tags: "",
  content: DEFAULT_HELP_CONTENT,
}

function formFromEntry(e: AdminInternationalEntry): FormState {
  return {
    title: e.title,
    slug: e.slug,
    description: e.description,
    category: e.category,
    sortOrder: String(e.sortOrder ?? 0),
    tags: e.tags.join(", "),
    content: {
      steps: e.content.steps ?? [],
      tips: e.content.tips ?? [],
      links: e.content.links ?? [],
      relatedContactIds: e.content.relatedContactIds ?? [],
    },
  }
}

function bodyFromForm(form: FormState) {
  const trimmedSortOrder = form.sortOrder.trim()
  return {
    title: form.title.trim(),
    slug: form.slug.trim(),
    description: form.description.trim(),
    category: form.category,
    sortOrder: trimmedSortOrder === "" ? null : Number(trimmedSortOrder),
    tags: form.tags,
    content: normalizeHelpContent(form.content),
  }
}

export function AdminInternationalClient({
  initialEntries,
}: {
  initialEntries: AdminInternationalEntry[]
}) {
  const [items, setItems] = useState(initialEntries)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  function resetForm() {
    setForm(emptyForm)
    setEditingId(null)
    setShowForm(false)
    setError("")
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const steps = form.content.steps ?? []
    const stepError = steps.length > 0 ? validateGuideSteps(steps) : null
    if (stepError) {
      setError(stepError)
      return
    }

    setLoading(true)
    setError("")
    try {
      const url = editingId
        ? `/api/admin/international/${editingId}`
        : "/api/admin/international"
      const res = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyFromForm(form)),
      })
      const data = (await res.json()) as AdminInternationalEntry & {
        error?: string
      }
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.")
        return
      }
      await refreshList()
      resetForm()
    } catch {
      setError("Network error.")
    } finally {
      setLoading(false)
    }
  }

  async function refreshList() {
    const res = await fetch("/api/admin/international")
    if (!res.ok) return
    const data = (await res.json()) as AdminInternationalEntry[]
    setItems(
      [...data].sort((a, b) => {
        const orderDiff = (a.sortOrder ?? 0) - (b.sortOrder ?? 0)
        if (orderDiff !== 0) return orderDiff
        return a.title.localeCompare(b.title)
      })
    )
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Delete this international help entry?")) return
    setLoading(true)
    setError("")
    try {
      const res = await fetch(`/api/admin/international/${id}`, {
        method: "DELETE",
      })
      const data = (await res.json()) as { error?: string }
      if (!res.ok) {
        setError(data.error ?? "Could not delete entry.")
        return
      }
      await refreshList()
      if (editingId === id) resetForm()
    } catch {
      setError("Network error.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/admin"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to Admin
        </Link>
        <Button
          onClick={() => {
            setForm(emptyForm)
            setEditingId(null)
            setShowForm(true)
            setError("")
          }}
          disabled={loading}
        >
          <HugeiconsIcon icon={Add01Icon} size={16} data-icon="inline-start" />
          Add entry
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
            {editingId ? "Edit entry" : "New entry"}
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
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium">Slug</span>
              <Input
                value={form.slug}
                onChange={(e) =>
                  setForm((f) => ({ ...f, slug: e.target.value }))
                }
                placeholder="auto-from-title if empty"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium">Category</span>
              <Select
                value={form.category}
                onValueChange={(v) =>
                  setForm((f) => ({ ...f, category: v ?? "general" }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {INTERNATIONAL_CATEGORIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>
            <label className="flex flex-col gap-1.5 sm:col-span-2">
              <span className="text-sm font-medium">Description</span>
              <Input
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                required
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium">Display order</span>
              <Input
                value={form.sortOrder}
                onChange={(e) =>
                  setForm((f) => ({ ...f, sortOrder: e.target.value }))
                }
                placeholder={editingId ? "Keep current" : "Add to end"}
                inputMode="numeric"
              />
              <span className="text-xs text-muted-foreground">
                Leave empty to{" "}
                {editingId ? "keep the current position" : "add at the end"}.
                Enter a number to move the entry — others shift automatically.
              </span>
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium">Tags</span>
              <Input
                value={form.tags}
                onChange={(e) =>
                  setForm((f) => ({ ...f, tags: e.target.value }))
                }
                placeholder="bank, visa"
              />
            </label>

            <HelpContentEditor
              content={form.content}
              onChange={(content) => setForm((f) => ({ ...f, content }))}
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              {editingId ? "Save changes" : "Create entry"}
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
        {items.map((item) => (
          <div
            key={item.id}
            className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-start sm:justify-between"
          >
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-semibold">{item.title}</p>
                <Badge variant="secondary">{item.category}</Badge>
                <Badge variant="outline">Order {item.sortOrder ?? 0}</Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {item.description}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                /help/{item.slug} · {(item.content.steps ?? []).length} steps
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setForm(formFromEntry(item))
                  setEditingId(item.id)
                  setShowForm(true)
                  setError("")
                }}
                disabled={loading}
              >
                <HugeiconsIcon icon={Edit02Icon} size={14} /> Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(item.id)}
                disabled={loading}
              >
                <HugeiconsIcon icon={Delete02Icon} size={14} /> Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
