import { describe, expect, it } from 'vitest'
import { resolveRelatedGuides } from './related'

const all = [
  {
    slug: 'a',
    title: 'A',
    description: 'Desc A',
    category: 'general',
    tags: ['internship', 'prep'],
    relatedGuideSlugs: [],
  },
  {
    slug: 'b',
    title: 'B',
    description: 'Desc B',
    category: 'internship',
    tags: ['internship', 'registration'],
    relatedGuideSlugs: [],
  },
  {
    slug: 'c',
    title: 'C',
    description: 'Desc C',
    category: 'internship',
    tags: ['other'],
    relatedGuideSlugs: [],
  },
]

describe('resolveRelatedGuides', () => {
  it('uses explicit relatedGuideSlugs first', () => {
    const result = resolveRelatedGuides(
      { slug: 'main', category: 'general', tags: [], relatedGuideSlugs: ['c', 'b'] },
      all,
    )
    expect(result.map((g) => g.slug)).toEqual(['c', 'b'])
  })

  it('falls back to tag overlap scoring', () => {
    const result = resolveRelatedGuides(
      { slug: 'main', category: 'internship', tags: ['internship', 'prep'], relatedGuideSlugs: [] },
      all,
    )
    expect(result.map((g) => g.slug).slice(0, 2)).toEqual(['a', 'b'])
  })

  it('excludes current slug and respects limit', () => {
    const result = resolveRelatedGuides(
      { slug: 'a', category: 'general', tags: ['internship'], relatedGuideSlugs: [] },
      all,
      1,
    )
    expect(result).toHaveLength(1)
    expect(result[0].slug).not.toBe('a')
  })
})
