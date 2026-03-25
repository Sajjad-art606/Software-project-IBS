'use client'

import { useState } from 'react'
import { GuideCard, type GuideCardData } from '@/components/guides/guide-card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { HugeiconsIcon } from '@hugeicons/react'
import { Search01Icon } from '@hugeicons/core-free-icons'
import { useDebounce } from '@/hooks/use-debounce'

const CATEGORIES = [
  { value: 'all', label: 'All' },
  { value: 'general', label: 'General' },
  { value: 'enrollment', label: 'Enrollment' },
  { value: 'exams', label: 'Exams' },
  { value: 'internship', label: 'Internship' },
  { value: 'international', label: 'International' },
  { value: 'thesis', label: 'Thesis' },
]

export function GuidesClient({ guides }: { guides: GuideCardData[] }) {
  const [activeTab, setActiveTab] = useState('all')
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 200)

  return (
    <div className="flex flex-col gap-6">
      {/* Search */}
      <div className="relative">
        <HugeiconsIcon
          icon={Search01Icon}
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search guides..."
          className="pl-9"
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex flex-wrap gap-1 h-auto">
          {CATEGORIES.map((cat) => (
            <TabsTrigger key={cat.value} value={cat.value}>
              {cat.label}
              {cat.value !== 'all' && (
                <span className="ml-1.5 rounded-full bg-muted-foreground/20 px-1.5 text-xs">
                  {guides.filter((g) => g.category === cat.value).length}
                </span>
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        {CATEGORIES.map((cat) => {
          let tabGuides = cat.value === 'all' ? guides : guides.filter((g) => g.category === cat.value)
          if (debouncedQuery.trim()) {
            const q = debouncedQuery.toLowerCase()
            tabGuides = tabGuides.filter(
              (g) =>
                g.title.toLowerCase().includes(q) ||
                g.description.toLowerCase().includes(q) ||
                g.tags.some((t) => t.toLowerCase().includes(q)),
            )
          }
          return (
            <TabsContent key={cat.value} value={cat.value} className="mt-4">
              {tabGuides.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-10 text-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/illustrations/no-data.svg" alt="" aria-hidden className="w-40 select-none opacity-90" draggable={false} />
                  <p className="text-sm text-muted-foreground">
                    {debouncedQuery.trim()
                      ? `No guides match "${debouncedQuery}".`
                      : 'No guides in this category.'}
                  </p>
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {tabGuides.map((guide) => (
                    <GuideCard key={guide.id} guide={guide} />
                  ))}
                </div>
              )}
            </TabsContent>
          )
        })}
      </Tabs>
    </div>
  )
}
