import type { GuideStep, HelpContent } from "@/db/schema"

export function createEmptyGuideStep(id = 1): GuideStep {
  return { id, title: "", description: "", tips: [], links: [] }
}

export const DEFAULT_GUIDE_STEPS: GuideStep[] = [createEmptyGuideStep(1)]

export const DEFAULT_HELP_CONTENT: HelpContent = {
  steps: [createEmptyGuideStep(1)],
  tips: [],
  links: [],
  relatedContactIds: [],
}

export function normalizeGuideSteps(steps: GuideStep[]): GuideStep[] {
  return steps.map((step, index) => ({
    id: index + 1,
    title: step.title.trim(),
    description: step.description.trim(),
    tips: step.tips?.map((t) => t.trim()).filter(Boolean),
    links: step.links
      ?.map((l) => ({ label: l.label.trim(), url: l.url.trim() }))
      .filter((l) => l.label && l.url),
  }))
}

export function normalizeHelpContent(content: HelpContent): HelpContent {
  const steps = content.steps?.length
    ? normalizeGuideSteps(content.steps)
    : undefined
  const tips = content.tips?.map((t) => t.trim()).filter(Boolean)
  const links = content.links
    ?.map((l) => ({ label: l.label.trim(), url: l.url.trim() }))
    .filter((l) => l.label && l.url)
  const relatedContactIds = content.relatedContactIds?.filter(
    (id) => Number.isInteger(id) && id > 0
  )

  return {
    ...(steps?.length ? { steps } : {}),
    ...(tips?.length ? { tips } : {}),
    ...(links?.length ? { links } : {}),
    ...(relatedContactIds?.length ? { relatedContactIds } : {}),
  }
}
