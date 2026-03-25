import { getTableColumns } from 'drizzle-orm'
import type { Table } from 'drizzle-orm'

/**
 * Applies per-column mapFromDriverValue (including customType fromDriver) to
 * a row returned by better-sqlite3, which skips Drizzle's field-mapping fast
 * path and returns raw strings for JSON columns.
 */
export function mapRow<T extends Record<string, unknown>>(table: Table, row: T): T {
  const columns = getTableColumns(table)
  const result: Record<string, unknown> = { ...row }
  for (const [key, col] of Object.entries(columns)) {
    if (key in result && result[key] !== null && result[key] !== undefined) {
      result[key] = col.mapFromDriverValue(result[key])
    }
  }
  return result as T
}
