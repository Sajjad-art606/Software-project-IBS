'use client'

import { useState, useEffect } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { CheckmarkCircle01Icon, Link01Icon } from '@hugeicons/core-free-icons'
import { Progress } from '@/components/ui/progress'
import { buttonVariants } from '@/components/ui/button'
import type { GuideStep } from '@/db/schema'

export function GuideStepTracker({ steps, slug }: { steps: GuideStep[]; slug: string }) {
  const storageKey = `guide-progress-${slug}`

  const [checked, setChecked] = useState<Set<number>>(() => new Set())

  // Hydrate from localStorage after mount (avoids SSR mismatch)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey)
      if (stored) setChecked(new Set(JSON.parse(stored) as number[]))
    } catch {
      // ignore
    }
  }, [storageKey])

  function toggle(id: number) {
    setChecked((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      try {
        localStorage.setItem(storageKey, JSON.stringify([...next]))
      } catch {
        // ignore
      }
      return next
    })
  }

  const progress = steps.length > 0 ? Math.round((checked.size / steps.length) * 100) : 0

  return (
    <div className="flex flex-col gap-6">
      {/* Progress */}
      <div className="flex flex-col gap-2 rounded-xl border border-border bg-card p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">Your progress</span>
          <span className="text-muted-foreground">
            {checked.size} / {steps.length} steps
          </span>
        </div>
        <Progress value={progress} className="h-2" />
        {progress === 100 && (
          <p className="text-sm font-medium text-green-600 dark:text-green-400">
            All steps complete!
          </p>
        )}
      </div>

      {/* Steps */}
      <ol className="flex flex-col gap-4">
        {steps.map((step) => {
          const isDone = checked.has(step.id)
          return (
            <li
              key={step.id}
              className="flex gap-4 rounded-xl border border-border bg-card p-5 transition-colors"
            >
              {/* Step number / check button */}
              <button
                onClick={() => toggle(step.id)}
                className="shrink-0 transition-colors"
                aria-label={isDone ? 'Mark as incomplete' : 'Mark as complete'}
              >
                {isDone ? (
                  <HugeiconsIcon
                    icon={CheckmarkCircle01Icon}
                    size={22}
                    className="text-primary"
                  />
                ) : (
                  <div className="flex h-[22px] w-[22px] items-center justify-center rounded-full border-2 border-muted-foreground/40 text-xs font-semibold text-muted-foreground">
                    {step.id}
                  </div>
                )}
              </button>

              <div className="flex flex-1 flex-col gap-3">
                <div>
                  <h3
                    className={`text-sm font-semibold leading-tight ${isDone ? 'line-through text-muted-foreground' : ''}`}
                  >
                    {step.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>
                </div>

                {step.tips && step.tips.length > 0 && (
                  <div className="rounded-lg bg-primary/5 p-3">
                    <p className="mb-1 text-xs font-semibold text-primary">Tips</p>
                    <ul className="flex flex-col gap-1">
                      {step.tips.map((tip, i) => (
                        <li key={i} className="text-xs text-muted-foreground">
                          • {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {step.links && step.links.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {step.links.map((link, i) => (
                      <a
                        key={i}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={buttonVariants({ variant: 'outline', size: 'xs' }) + ' gap-1.5'}
                      >
                        <HugeiconsIcon icon={Link01Icon} size={12} />
                        {link.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
