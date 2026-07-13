import { asc, eq } from "drizzle-orm"
import { db } from "@/db"
import { internationalInfo, platformLinks } from "@/db/schema"

export type SortableAdminTable = typeof platformLinks | typeof internationalInfo

type SortableRow = { id: number; sortOrder: number | null }

/** Empty or invalid input means "append to end" on create, "keep current" on update. */
export function parseRequestedSortOrder(value: unknown): number | null {
  if (value === null || value === undefined) return null
  if (typeof value === "string" && value.trim() === "") return null
  const n = Number(value)
  if (!Number.isInteger(n) || n < 1) return null
  return n
}

function getSortedRows(table: SortableAdminTable): SortableRow[] {
  return db
    .select({ id: table.id, sortOrder: table.sortOrder })
    .from(table)
    .orderBy(asc(table.sortOrder), asc(table.id))
    .all()
}

function clampPosition(position: number, maxLength: number): number {
  return Math.max(1, Math.min(position, maxLength))
}

function persistSortOrders(table: SortableAdminTable, orderedIds: number[]) {
  for (let i = 0; i < orderedIds.length; i++) {
    db.update(table)
      .set({ sortOrder: i + 1 })
      .where(eq(table.id, orderedIds[i]))
      .run()
  }
}

function orderedIdsAfterInsert(
  existing: SortableRow[],
  newId: number,
  targetPosition: number | null
): number[] {
  const ids = existing.map((row) => row.id)
  const index =
    targetPosition === null
      ? ids.length
      : clampPosition(targetPosition, ids.length + 1) - 1
  ids.splice(index, 0, newId)
  return ids
}

function orderedIdsAfterMove(
  existing: SortableRow[],
  movedId: number,
  targetPosition: number
): number[] {
  const ids = existing.map((row) => row.id).filter((id) => id !== movedId)
  const index = clampPosition(targetPosition, ids.length + 1) - 1
  ids.splice(index, 0, movedId)
  return ids
}

function orderedIdsAfterDelete(
  existing: SortableRow[],
  deletedId: number
): number[] {
  return existing.map((row) => row.id).filter((id) => id !== deletedId)
}

/** Assign sort order when creating a row. Empty position appends to the end. */
export function applyCreateSortOrder(
  table: SortableAdminTable,
  newId: number,
  requestedPosition: number | null
) {
  const existing = getSortedRows(table).filter((row) => row.id !== newId)
  const orderedIds = orderedIdsAfterInsert(existing, newId, requestedPosition)
  persistSortOrders(table, orderedIds)
}

/** Reorder an existing row. Empty position keeps its current slot. */
export function applyUpdateSortOrder(
  table: SortableAdminTable,
  itemId: number,
  requestedPosition: number | null
) {
  if (requestedPosition === null) return

  const existing = getSortedRows(table)
  const currentIndex = existing.findIndex((row) => row.id === itemId)
  if (currentIndex === -1) return

  const currentPosition = currentIndex + 1
  if (requestedPosition === currentPosition) return

  const orderedIds = orderedIdsAfterMove(existing, itemId, requestedPosition)
  persistSortOrders(table, orderedIds)
}

/** Close the gap after deleting a row and renumber 1..n. */
export function applyDeleteSortOrder(
  table: SortableAdminTable,
  deletedId: number
) {
  const existing = getSortedRows(table)
  const orderedIds = orderedIdsAfterDelete(existing, deletedId)
  persistSortOrders(table, orderedIds)
}

export function getResolvedSortOrder(
  table: SortableAdminTable,
  itemId: number
): number {
  const rows = getSortedRows(table)
  const index = rows.findIndex((row) => row.id === itemId)
  return index === -1 ? rows.length : index + 1
}
