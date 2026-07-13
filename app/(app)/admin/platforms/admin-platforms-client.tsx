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
import { PLATFORM_CATEGORIES } from "@/lib/admin/constants"

export interface AdminPlatform {
  id: number
  name: string
  shortName: string | null
  description: string
  url: string
  category: string
  tags: string[]
  sortOrder: number | null
}

type FormState = {
  name: string
  shortName: string
  description: string
  url: string
  category: string
  sortOrder: string
  tags: string
}

const emptyForm: FormState = {
  name: "",
  shortName: "",
  description: "",
  url: "",
  category: "academic",
  sortOrder: "",
  tags: "",
}

const categoryLabels = Object.fromEntries(
  PLATFORM_CATEGORIES.map((c) => [c.value, c.label])
) as Record<string, string>

function formFromPlatform(p: AdminPlatform): FormState {
  return {
    name: p.name,
    shortName: p.shortName ?? "",
    description: p.description,
    url: p.url,
    category: p.category,
    sortOrder: String(p.sortOrder ?? 0),
    tags: p.tags.join(", "),
  }
}

function bodyFromForm(form: FormState) {
  const trimmedSortOrder = form.sortOrder.trim()
  return {
    name: form.name.trim(),
    shortName: form.shortName.trim(),
    description: form.description.trim(),
    url: form.url.trim(),
    category: form.category,
    sortOrder: trimmedSortOrder === "" ? null : Number(trimmedSortOrder),
    tags: form.tags,
  }
}

function sortPlatforms(items: AdminPlatform[]) {
  return [...items].sort((a, b) => {
    const orderDiff = (a.sortOrder ?? 0) - (b.sortOrder ?? 0)
    if (orderDiff !== 0) return orderDiff
    return a.name.localeCompare(b.name)
  })
}

export function AdminPlatformsClient({
  initialPlatforms,
}: {
  initialPlatforms: AdminPlatform[]
}) {
  const [items, setItems] = useState(initialPlatforms)
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
    setLoading(true)
    setError("")
    try {
      const url = editingId
        ? `/api/admin/platforms/${editingId}`
        : "/api/admin/platforms"
      const res = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyFromForm(form)),
      })
      if (!res.ok) {
        const data = (await res.json()) as { error?: string }
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
    const res = await fetch("/api/admin/platforms")
    if (!res.ok) return
    const data = (await res.json()) as AdminPlatform[]
    setItems(sortPlatforms(data))
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Delete this platform link?")) return
    setLoading(true)
    setError("")
    try {
      const res = await fetch(`/api/admin/platforms/${id}`, {
        method: "DELETE",
      })
      const data = (await res.json()) as { error?: string }
      if (!res.ok) {
        setError(data.error ?? "Could not delete platform link.")
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
          Add platform
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
            {editingId ? "Edit platform link" : "New platform link"}
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5 sm:col-span-2">
              <span className="text-sm font-medium">Name</span>
              <Input
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="HFU Portal (Felix)"
                required
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium">Short name</span>
              <Input
                value={form.shortName}
                onChange={(e) =>
                  setForm((f) => ({ ...f, shortName: e.target.value }))
                }
                placeholder="Felix"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium">Category</span>
              <Select
                value={form.category}
                onValueChange={(v) =>
                  setForm((f) => ({ ...f, category: v ?? "academic" }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PLATFORM_CATEGORIES.map((c) => (
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
                placeholder="Central student portal for course registration and grades."
                required
              />
            </label>
            <label className="flex flex-col gap-1.5 sm:col-span-2">
              <span className="text-sm font-medium">URL</span>
              <Input
                value={form.url}
                onChange={(e) =>
                  setForm((f) => ({ ...f, url: e.target.value }))
                }
                placeholder="https://felix.hs-furtwangen.de/dmz/"
                type="url"
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
                Enter a number (e.g. 2) to insert there — other links shift
                automatically.
              </span>
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium">Tags</span>
              <Input
                value={form.tags}
                onChange={(e) =>
                  setForm((f) => ({ ...f, tags: e.target.value }))
                }
                placeholder="portal, registration, grades"
              />
            </label>
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              {editingId ? "Save changes" : "Create platform"}
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
                <p className="font-semibold">{item.name}</p>
                {item.shortName && (
                  <Badge variant="muted">{item.shortName}</Badge>
                )}
                <Badge variant="secondary">
                  {categoryLabels[item.category] ?? item.category}
                </Badge>
                <Badge variant="outline">Order {item.sortOrder ?? 0}</Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {item.description}
              </p>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-block truncate text-xs text-primary hover:underline"
              >
                {item.url}
              </a>
            </div>
            <div className="flex shrink-0 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setForm(formFromPlatform(item))
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
