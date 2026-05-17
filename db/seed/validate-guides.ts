import { z } from 'zod'
import type { GuideSeedData } from './guides'

const guideStepSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(1),
  description: z.string().min(1),
  tips: z.array(z.string()).optional(),
  links: z
    .array(
      z.object({
        label: z.string().min(1),
        url: z.string().min(1).refine((url) => url !== '#', {
          message: 'Placeholder url "#" is not allowed',
        }),
      }),
    )
    .optional(),
})

const guideSeedSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  category: z.string().min(1),
  estimatedTime: z.string().min(1),
  relevantSemesters: z.array(z.number().int().positive()),
  tags: z.array(z.string()),
  steps: z.array(guideStepSchema).min(1),
  prerequisites: z.array(z.string()).optional(),
  relatedGuideSlugs: z.array(z.string()).optional(),
  relatedContactIds: z.array(z.number().int().positive()).optional(),
  lastReviewedAt: z.string().nullable().optional(),
})

export function assertValidGuides(guideData: GuideSeedData[]): void {
  const parsed = z.array(guideSeedSchema).parse(guideData)

  const slugs = new Set<string>()
  for (const guide of parsed) {
    if (slugs.has(guide.slug)) {
      throw new Error(`Duplicate guide slug: ${guide.slug}`)
    }
    slugs.add(guide.slug)

    const stepIds = new Set<number>()
    for (const step of guide.steps) {
      if (stepIds.has(step.id)) {
        throw new Error(`Duplicate step id ${step.id} in guide "${guide.slug}"`)
      }
      stepIds.add(step.id)
    }

  }

  for (const guide of parsed) {
    for (const relatedSlug of guide.relatedGuideSlugs ?? []) {
      if (!slugs.has(relatedSlug)) {
        throw new Error(
          `Guide "${guide.slug}" references unknown relatedGuideSlug: ${relatedSlug}`,
        )
      }
    }
  }
}
