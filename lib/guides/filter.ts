export function filterBySemester<T extends { relevantSemesters: number[] }>(
  items: T[],
  semester: number,
): T[] {
  return items.filter(
    (item) =>
      item.relevantSemesters.length === 0 ||
      item.relevantSemesters.includes(semester),
  )
}
