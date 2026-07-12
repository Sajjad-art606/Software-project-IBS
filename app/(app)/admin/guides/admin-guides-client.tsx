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
import { GUIDE_CATEGORIES } from "@/lib/admin/constants"
import {
  DEFAULT_GUIDE_STEPS,
  normalizeGuideSteps,
} from "@/lib/admin/content-defaults"
import {
  GuideStepsEditor,
  validateGuideSteps,
} from "@/components/admin/content-editors"
import type { GuideStep } from "@/db/schema"

export interface AdminGuide {
  id: number
  slug: string
  title: string
  description: string
  category: string
  steps: GuideStep[]
  tags: string[]
  relevantSemesters: number[]
  estimatedTime: string | null
}

type FormState = {
  title: string
  slug: string
  description: string
  category: string
  estimatedTime: string
  tags: string
  relevantSemesters: string
  steps: GuideStep[]
}

const emptyForm: FormState = {
  title: "",
  slug: "",
  description: "",
  category: "general",
  estimatedTime: "",
  tags: "",
  relevantSemesters: "",
  steps: DEFAULT_GUIDE_STEPS,
}

function formFromGuide(g: AdminGuide): FormState {
  return {
    title: g.title,
    slug: g.slug,
    description: g.description,
    category: g.category,
    estimatedTime: g.estimatedTime ?? "",
    tags: g.tags.join(", "),
    relevantSemesters: g.relevantSemesters.join(", "),
    steps: g.steps,
  }
}

function bodyFromForm(form: FormState) {
  return {
    title: form.title.trim(),
    slug: form.slug.trim(),
    description: form.description.trim(),
    category: form.category,
    estimatedTime: form.estimatedTime.trim(),
    tags: form.tags,
    relevantSemesters: form.relevantSemesters,
    steps: normalizeGuideSteps(form.steps),
  }
}

export function AdminGuidesClient({
  initialGuides,
}: {
  initialGuides: AdminGuide[]
}) {
  const [items, setItems] = useState(initialGuides)
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
    const stepError = validateGuideSteps(form.steps)
    if (stepError) {
      setError(stepError)
      return
    }

    setLoading(true)
    setError("")
    try {
      const url = editingId
        ? `/api/admin/guides/${editingId}`
        : "/api/admin/guides"
      const res = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyFromForm(form)),
      })
      const data = (await res.json()) as AdminGuide & { error?: string }
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.")
        return
      }
      if (editingId) {
        setItems((prev) => prev.map((i) => (i.id === editingId ? data : i)))
      } else {
        setItems((prev) =>
          [...prev, data].sort((a, b) => a.title.localeCompare(b.title))
        )
      }
      resetForm()
    } catch {
      setError("Network error.")
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Delete this guide?")) return
    setLoading(true)
    setError("")
    try {
      const res = await fetch(`/api/admin/guides/${id}`, { method: "DELETE" })
      const data = (await res.json()) as { error?: string }
      if (!res.ok) {
        setError(data.error ?? "Could not delete guide.")
        return
      }
      setItems((prev) => prev.filter((i) => i.id !== id))
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
          Add guide
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
            {editingId ? "Edit guide" : "New guide"}
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
                  {GUIDE_CATEGORIES.map((c) => (
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
              <span className="text-sm font-medium">Estimated time</span>
              <Input
                value={form.estimatedTime}
                onChange={(e) =>
                  setForm((f) => ({ ...f, estimatedTime: e.target.value }))
                }
                placeholder="30 minutes"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium">Tags</span>
              <Input
                value={form.tags}
                onChange={(e) =>
                  setForm((f) => ({ ...f, tags: e.target.value }))
                }
                placeholder="internship, exams"
              />
            </label>
            <label className="flex flex-col gap-1.5 sm:col-span-2">
              <span className="text-sm font-medium">Relevant semesters</span>
              <Input
                value={form.relevantSemesters}
                onChange={(e) =>
                  setForm((f) => ({ ...f, relevantSemesters: e.target.value }))
                }
                placeholder="1, 3 or empty for all"
              />
            </label>

            <GuideStepsEditor
              steps={form.steps}
              onChange={(steps) => setForm((f) => ({ ...f, steps }))}
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              {editingId ? "Save changes" : "Create guide"}
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
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {item.description}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                /{item.slug} · {item.steps.length} steps
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setForm(formFromGuide(item))
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
