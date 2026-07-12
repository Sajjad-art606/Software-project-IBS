export function parseTags(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((t) => String(t).trim()).filter(Boolean)
  }
  if (typeof value === "string") {
    return value
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
  }
  return []
}

export function parseSemesters(value: unknown): number[] {
  if (Array.isArray(value)) {
    return value.map((s) => Number(s)).filter((n) => n >= 1 && n <= 7)
  }
  if (typeof value === "string") {
    return value
      .split(",")
      .map((s) => Number(s.trim()))
      .filter((n) => n >= 1 && n <= 7)
  }
  return []
}

export function parseId(raw: string): number | null {
  const id = Number(raw)
  return Number.isInteger(id) && id > 0 ? id : null
}

export function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function parseJsonField<T>(
  value: unknown,
  fieldName: string
): { data: T } | { error: string } {
  if (typeof value === "string") {
    try {
      return { data: JSON.parse(value) as T }
    } catch {
      return { error: `Invalid JSON in ${fieldName}.` }
    }
  }
  if (value && typeof value === "object") {
    return { data: value as T }
  }
  return { error: `${fieldName} is required.` }
}
