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
import { CONTACT_ROLES } from "@/lib/admin/constants"

export interface AdminContact {
  id: number
  name: string
  role: string
  department: string | null
  email: string | null
  phone: string | null
  officeLocation: string | null
  officeHours: string | null
  tags: string[]
  relevantSemesters: number[]
}

type FormState = {
  name: string
  role: string
  department: string
  email: string
  phone: string
  officeLocation: string
  officeHours: string
  tags: string
  relevantSemesters: string
}

const emptyForm: FormState = {
  name: "",
  role: "Administrative",
  department: "",
  email: "",
  phone: "",
  officeLocation: "",
  officeHours: "",
  tags: "",
  relevantSemesters: "",
}

function formFromContact(c: AdminContact): FormState {
  return {
    name: c.name,
    role: c.role,
    department: c.department ?? "",
    email: c.email ?? "",
    phone: c.phone ?? "",
    officeLocation: c.officeLocation ?? "",
    officeHours: c.officeHours ?? "",
    tags: c.tags.join(", "),
    relevantSemesters: c.relevantSemesters.join(", "),
  }
}

function bodyFromForm(form: FormState) {
  return {
    name: form.name.trim(),
    role: form.role,
    department: form.department.trim(),
    email: form.email.trim(),
    phone: form.phone.trim(),
    officeLocation: form.officeLocation.trim(),
    officeHours: form.officeHours.trim(),
    tags: form.tags,
    relevantSemesters: form.relevantSemesters,
  }
}

export function AdminContactsClient({
  initialContacts,
}: {
  initialContacts: AdminContact[]
}) {
  const [items, setItems] = useState(initialContacts)
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
        ? `/api/admin/contacts/${editingId}`
        : "/api/admin/contacts"
      const res = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyFromForm(form)),
      })
      const data = (await res.json()) as AdminContact & { error?: string }
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.")
        return
      }
      if (editingId) {
        setItems((prev) => prev.map((i) => (i.id === editingId ? data : i)))
      } else {
        setItems((prev) =>
          [...prev, data].sort((a, b) => a.name.localeCompare(b.name))
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
    if (!window.confirm("Delete this contact?")) return
    setLoading(true)
    setError("")
    try {
      const res = await fetch(`/api/admin/contacts/${id}`, { method: "DELETE" })
      const data = (await res.json()) as { error?: string }
      if (!res.ok) {
        setError(data.error ?? "Could not delete contact.")
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
          Add contact
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
            {editingId ? "Edit contact" : "New contact"}
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5 sm:col-span-2">
              <span className="text-sm font-medium">Name</span>
              <Input
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                required
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium">Role</span>
              <Select
                value={form.role}
                onValueChange={(v) =>
                  setForm((f) => ({ ...f, role: v ?? "Administrative" }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CONTACT_ROLES.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium">Department</span>
              <Input
                value={form.department}
                onChange={(e) =>
                  setForm((f) => ({ ...f, department: e.target.value }))
                }
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium">Email</span>
              <Input
                value={form.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium">Phone</span>
              <Input
                value={form.phone}
                onChange={(e) =>
                  setForm((f) => ({ ...f, phone: e.target.value }))
                }
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium">Office location</span>
              <Input
                value={form.officeLocation}
                onChange={(e) =>
                  setForm((f) => ({ ...f, officeLocation: e.target.value }))
                }
                placeholder="Building C, Room 112"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium">Office hours</span>
              <Input
                value={form.officeHours}
                onChange={(e) =>
                  setForm((f) => ({ ...f, officeHours: e.target.value }))
                }
                placeholder="Mon: 1.00 - 2.00pm"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium">Tags</span>
              <Input
                value={form.tags}
                onChange={(e) =>
                  setForm((f) => ({ ...f, tags: e.target.value }))
                }
                placeholder="ibs, internship"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium">Relevant semesters</span>
              <Input
                value={form.relevantSemesters}
                onChange={(e) =>
                  setForm((f) => ({ ...f, relevantSemesters: e.target.value }))
                }
                placeholder="1, 3 or empty for all"
              />
            </label>
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              {editingId ? "Save changes" : "Create contact"}
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
                <Badge variant="secondary">{item.role}</Badge>
              </div>
              {item.department && (
                <p className="mt-1 text-sm text-muted-foreground">
                  {item.department}
                </p>
              )}
              {item.email && (
                <p className="mt-1 text-xs text-primary">{item.email}</p>
              )}
            </div>
            <div className="flex shrink-0 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setForm(formFromContact(item))
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
