import { describe, expect, it } from 'vitest'
import { guideData } from './guides'
import { assertValidGuides } from './validate-guides'

describe('guide seed data', () => {
  it('passes validation', () => {
    expect(() => assertValidGuides(guideData)).not.toThrow()
  })

  it('has unique slugs', () => {
    const slugs = guideData.map((g) => g.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })
})
