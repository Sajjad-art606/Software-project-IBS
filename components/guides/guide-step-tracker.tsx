'use client'

import { GuideStepsList } from '@/components/guides/guide-steps-list'
import type { GuideStep } from '@/db/schema'

export function GuideStepTracker({ steps, slug }: { steps: GuideStep[]; slug: string }) {
  return <GuideStepsList steps={steps} slug={slug} interactive />
}
