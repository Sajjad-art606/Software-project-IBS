export interface GuideRelatedInput {
  slug: string
  category: string
  tags: string[]
  relatedGuideSlugs?: string[]
}

export interface GuideRelatedSummary {
  slug: string
  title: string
  description: string
  category: string
  tags: string[]
}

function tagOverlapScore(a: string[], b: string[]): number {
  const setB = new Set(b)
  return a.filter((t) => setB.has(t)).length
}

export function resolveRelatedGuides(
  current: GuideRelatedInput,
  allGuides: GuideRelatedSummary[],
  limit = 3,
): GuideRelatedSummary[] {
  const bySlug = new Map(allGuides.map((g) => [g.slug, g]))

  if (current.relatedGuideSlugs && current.relatedGuideSlugs.length > 0) {
    const explicit = current.relatedGuideSlugs
      .map((slug) => bySlug.get(slug))
      .filter((g): g is GuideRelatedSummary => g != null && g.slug !== current.slug)
      .slice(0, limit)
    if (explicit.length > 0) return explicit
  }

  return allGuides
    .filter((g) => g.slug !== current.slug)
    .map((g) => ({
      guide: g,
      score:
        tagOverlapScore(current.tags, g.tags) + (g.category === current.category ? 1 : 0),
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ guide }) => guide)
}
