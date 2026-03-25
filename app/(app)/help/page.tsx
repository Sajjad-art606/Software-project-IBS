import { db } from '@/db'
import { mapRow } from '@/db/utils'
import { internationalInfo } from '@/db/schema'
import type { HelpContent } from '@/db/schema'
import Link from 'next/link'

export const metadata = {
  title: 'International Help | IBS Student Hub',
  description: 'Practical guides for city registration, banking, housing, insurance, and visa as an international student.',
}
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Building01Icon,
  BankIcon,
  Home01Icon,
  HealthIcon,
  Passport01Icon,
  CheckmarkSquare04Icon,
  GlobeIcon,
  ArrowRight01Icon,
} from '@hugeicons/core-free-icons'
import { Badge } from '@/components/ui/badge'

const categoryIcons: Record<string, typeof GlobeIcon> = {
  registration: Building01Icon,
  banking: BankIcon,
  housing: Home01Icon,
  insurance: HealthIcon,
  visa: Passport01Icon,
  general: CheckmarkSquare04Icon,
}

const categoryColors: Record<string, 'default' | 'secondary' | 'outline' | 'muted' | 'success'> = {
  registration: 'default',
  banking: 'secondary',
  housing: 'success',
  insurance: 'muted',
  visa: 'outline',
  general: 'muted',
}

const categoryLabels: Record<string, string> = {
  registration: 'City Registration',
  banking: 'Banking',
  housing: 'Housing',
  insurance: 'Insurance',
  visa: 'Visa & Permits',
  general: 'General',
}

export default function HelpPage() {
  const allInfo = db
    .select()
    .from(internationalInfo)
    .orderBy(internationalInfo.sortOrder)
    .all()
    .map((h) => mapRow(internationalInfo, h))

  return (
    <div className="flex flex-col gap-8 p-4 sm:p-6">
      <div>
        <h1 className="text-xl font-semibold">International Student Help</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Practical guides for getting settled in Germany as an international student.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {allInfo.map((info) => {
          const icon = categoryIcons[info.category] ?? GlobeIcon
          const steps = info.content.steps?.length ?? 0
          const tips = info.content.tips?.length ?? 0
          const count = steps > 0 ? steps : tips
          const countLabel = steps > 0 ? 'steps' : 'tips'

          return (
            <Link
              key={info.id}
              href={`/help/${info.slug}`}
              className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <HugeiconsIcon icon={icon} size={20} />
                </div>
                <Badge variant={categoryColors[info.category] ?? 'muted'} className="text-xs">
                  {categoryLabels[info.category] ?? info.category}
                </Badge>
              </div>
              <div className="flex-1">
                <p className="font-semibold">{info.title}</p>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                  {info.description}
                </p>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{count > 0 ? `${count} ${countLabel}` : 'overview'}</span>
                <div className="flex items-center gap-1 text-primary">
                  Read guide <HugeiconsIcon icon={ArrowRight01Icon} size={12} />
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
