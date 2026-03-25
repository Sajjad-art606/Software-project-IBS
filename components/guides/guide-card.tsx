import Link from 'next/link'
import { HugeiconsIcon } from '@hugeicons/react'
import { Book02Icon, Clock01Icon } from '@hugeicons/core-free-icons'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import type { GuideStep } from '@/db/schema'
import { cn } from '@/lib/utils'

const categoryColors: Record<string, 'default' | 'secondary' | 'outline' | 'muted' | 'success'> = {
  general: 'muted',
  enrollment: 'secondary',
  exams: 'outline',
  internship: 'default',
  international: 'success',
  thesis: 'secondary',
}

export interface GuideCardData {
  id: number
  slug: string
  title: string
  description: string
  category: string
  estimatedTime: string | null
  tags: string[]
  steps: GuideStep[]
}

export function GuideCard({ guide, className }: { guide: GuideCardData; className?: string }) {
  return (
    <Link href={`/guides/${guide.slug}`} className={cn('block', className)}>
      <Card className="h-full transition-colors hover:bg-accent hover:text-accent-foreground">
        <CardContent className="flex h-full flex-col gap-3 pt-5">
          <div className="flex items-start justify-between gap-2">
            <HugeiconsIcon icon={Book02Icon} size={16} className="mt-0.5 shrink-0 text-primary" />
            <Badge variant={categoryColors[guide.category] ?? 'muted'} className="shrink-0 text-xs">
              {guide.category}
            </Badge>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold leading-tight">{guide.title}</h3>
            <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{guide.description}</p>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-1">
              {guide.tags.slice(0, 2).map((tag) => (
                <span key={tag} className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                  {tag}
                </span>
              ))}
            </div>
            {guide.estimatedTime && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <HugeiconsIcon icon={Clock01Icon} size={11} />
                {guide.estimatedTime}
              </div>
            )}
          </div>
          <p className="text-xs text-primary">{guide.steps.length} steps →</p>
        </CardContent>
      </Card>
    </Link>
  )
}
