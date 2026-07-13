"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { Add01Icon, Delete02Icon } from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { GuideStep, HelpContent } from "@/db/schema"
import { createEmptyGuideStep } from "@/lib/admin/content-defaults"

function StringListEditor({
  label,
  items,
  onChange,
  placeholder,
}: {
  label: string
  items: string[]
  onChange: (items: string[]) => void
  placeholder?: string
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">
          {label}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="xs"
          onClick={() => onChange([...items, ""])}
        >
          <HugeiconsIcon icon={Add01Icon} size={12} /> Add
        </Button>
      </div>
      {items.length === 0 ? (
        <p className="text-xs text-muted-foreground">None added.</p>
      ) : (
        items.map((item, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={item}
              onChange={(e) => {
                const next = [...items]
                next[index] = e.target.value
                onChange(next)
              }}
              placeholder={placeholder}
            />
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              onClick={() => onChange(items.filter((_, i) => i !== index))}
            >
              <HugeiconsIcon icon={Delete02Icon} size={14} />
            </Button>
          </div>
        ))
      )}
    </div>
  )
}

function LinkListEditor({
  label,
  items,
  onChange,
}: {
  label: string
  items: { label: string; url: string }[]
  onChange: (items: { label: string; url: string }[]) => void
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">
          {label}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="xs"
          onClick={() => onChange([...items, { label: "", url: "" }])}
        >
          <HugeiconsIcon icon={Add01Icon} size={12} /> Add link
        </Button>
      </div>
      {items.length === 0 ? (
        <p className="text-xs text-muted-foreground">None added.</p>
      ) : (
        items.map((item, index) => (
          <div
            key={index}
            className="flex flex-col gap-2 rounded-lg border border-border/60 p-3 sm:flex-row sm:items-center"
          >
            <Input
              value={item.label}
              onChange={(e) => {
                const next = [...items]
                next[index] = { ...next[index], label: e.target.value }
                onChange(next)
              }}
              placeholder="Link label"
              className="sm:flex-1"
            />
            <Input
              value={item.url}
              onChange={(e) => {
                const next = [...items]
                next[index] = { ...next[index], url: e.target.value }
                onChange(next)
              }}
              placeholder="https://..."
              className="sm:flex-[2]"
            />
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              onClick={() => onChange(items.filter((_, i) => i !== index))}
            >
              <HugeiconsIcon icon={Delete02Icon} size={14} />
            </Button>
          </div>
        ))
      )}
    </div>
  )
}

export function GuideStepsEditor({
  steps,
  onChange,
}: {
  steps: GuideStep[]
  onChange: (steps: GuideStep[]) => void
}) {
  function updateStep(index: number, patch: Partial<GuideStep>) {
    const next = steps.map((step, i) =>
      i === index ? { ...step, ...patch } : step
    )
    onChange(next)
  }

  function removeStep(index: number) {
    onChange(steps.filter((_, i) => i !== index))
  }

  return (
    <div className="flex flex-col gap-3 sm:col-span-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Steps</span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            onChange([...steps, createEmptyGuideStep(steps.length + 1)])
          }
        >
          <HugeiconsIcon icon={Add01Icon} size={14} /> Add step
        </Button>
      </div>

      {steps.map((step, index) => (
        <div
          key={index}
          className="flex flex-col gap-3 rounded-xl border border-border bg-muted/20 p-4"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">Step {index + 1}</p>
            {steps.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="xs"
                onClick={() => removeStep(index)}
              >
                <HugeiconsIcon icon={Delete02Icon} size={14} /> Remove
              </Button>
            )}
          </div>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium">Step title</span>
            <Input
              value={step.title}
              onChange={(e) => updateStep(index, { title: e.target.value })}
              placeholder="What should the student do?"
              required
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium">Description</span>
            <textarea
              value={step.description}
              onChange={(e) =>
                updateStep(index, { description: e.target.value })
              }
              rows={3}
              placeholder="Explain this step in plain language."
              className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm"
              required
            />
          </label>

          <StringListEditor
            label="Tips (optional)"
            items={step.tips ?? []}
            onChange={(tips) => updateStep(index, { tips })}
            placeholder="Helpful hint for this step"
          />

          <LinkListEditor
            label="Links (optional)"
            items={step.links ?? []}
            onChange={(links) => updateStep(index, { links })}
          />
        </div>
      ))}
    </div>
  )
}

export function HelpContentEditor({
  content,
  onChange,
}: {
  content: HelpContent
  onChange: (content: HelpContent) => void
}) {
  const steps = content.steps ?? []

  return (
    <div className="flex flex-col gap-4 sm:col-span-2">
      <GuideStepsEditor
        steps={steps.length > 0 ? steps : [createEmptyGuideStep(1)]}
        onChange={(nextSteps) => onChange({ ...content, steps: nextSteps })}
      />

      <div className="rounded-xl border border-border bg-muted/20 p-4">
        <StringListEditor
          label="General tips (optional)"
          items={content.tips ?? []}
          onChange={(tips) => onChange({ ...content, tips })}
          placeholder="Extra tip for the whole topic"
        />
      </div>

      <div className="rounded-xl border border-border bg-muted/20 p-4">
        <LinkListEditor
          label="Useful links (optional)"
          items={content.links ?? []}
          onChange={(links) => onChange({ ...content, links })}
        />
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium">
          Related contact IDs (optional)
        </span>
        <Input
          value={(content.relatedContactIds ?? []).join(", ")}
          onChange={(e) => {
            const relatedContactIds = e.target.value
              .split(",")
              .map((v) => Number(v.trim()))
              .filter((n) => n > 0)
            onChange({ ...content, relatedContactIds })
          }}
          placeholder="e.g. 1, 3, 5 — from Contacts page"
        />
      </label>
    </div>
  )
}

export function validateGuideSteps(steps: GuideStep[]): string | null {
  if (steps.length === 0) return "Add at least one step."
  for (let i = 0; i < steps.length; i++) {
    if (!steps[i].title.trim()) return `Step ${i + 1} needs a title.`
    if (!steps[i].description.trim())
      return `Step ${i + 1} needs a description.`
  }
  return null
}
