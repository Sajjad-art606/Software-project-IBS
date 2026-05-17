export const GUIDE_CATEGORY_COLORS: Record<
  string,
  'default' | 'secondary' | 'outline' | 'muted' | 'success'
> = {
  general: 'muted',
  enrollment: 'secondary',
  exams: 'outline',
  internship: 'default',
  international: 'success',
  thesis: 'secondary',
}

export const GUIDE_CATEGORIES = [
  { value: 'all', label: 'All' },
  { value: 'general', label: 'General' },
  { value: 'enrollment', label: 'Enrollment' },
  { value: 'exams', label: 'Exams' },
  { value: 'internship', label: 'Internship' },
  { value: 'international', label: 'International' },
  { value: 'thesis', label: 'Thesis' },
] as const

export function formatSemesterBadge(semesters: number[]): string {
  if (semesters.length === 0) return 'All semesters'
  const sorted = [...semesters].sort((a, b) => a - b)
  if (sorted.length === 1) return `Sem ${sorted[0]}`
  return `Sem ${sorted.join(', ')}`
}
