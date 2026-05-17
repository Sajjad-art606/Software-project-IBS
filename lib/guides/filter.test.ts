import { describe, expect, it } from 'vitest'
import { filterBySemester } from './filter'

describe('filterBySemester', () => {
  const items = [
    { id: 1, relevantSemesters: [] },
    { id: 2, relevantSemesters: [1] },
    { id: 3, relevantSemesters: [3, 4] },
  ]

  it('includes items with empty relevantSemesters for any semester', () => {
    expect(filterBySemester(items, 5).map((i) => i.id)).toContain(1)
  })

  it('filters by semester match', () => {
    const result = filterBySemester(items, 1).map((i) => i.id)
    expect(result).toEqual(expect.arrayContaining([1, 2]))
    expect(result).not.toContain(3)
  })

  it('includes multi-semester guides when one matches', () => {
    expect(filterBySemester(items, 4).map((i) => i.id)).toContain(3)
  })
})
