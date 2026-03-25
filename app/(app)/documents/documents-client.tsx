'use client'

import { useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { Search01Icon, File01Icon, Download01Icon, Link01Icon } from '@hugeicons/core-free-icons'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { useDebounce } from '@/hooks/use-debounce'

const CATEGORIES = [
  { value: 'all', label: 'All' },
  { value: 'forms', label: 'Forms' },
  { value: 'templates', label: 'Templates' },
  { value: 'regulations', label: 'Regulations' },
  { value: 'info-sheets', label: 'Info Sheets' },
]

const fileTypeConfig: Record<string, { icon: typeof File01Icon; label: string }> = {
  pdf: { icon: File01Icon, label: 'PDF' },
  docx: { icon: File01Icon, label: 'DOCX' },
  link: { icon: Link01Icon, label: 'Link' },
}

interface Document {
  id: number
  title: string
  description: string | null
  fileUrl: string | null
  category: string
  fileType: string | null
  tags: string[]
  relevantSemesters: number[]
}

function DocumentCard({ doc }: { doc: Document }) {
  const ftConfig = fileTypeConfig[doc.fileType ?? 'pdf'] ?? fileTypeConfig.pdf
  const isExternal = doc.fileType === 'link'

  return (
    <div className="flex items-start gap-4 rounded-xl border border-border bg-card p-5">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <HugeiconsIcon icon={ftConfig.icon} size={18} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div>
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-semibold leading-tight">{doc.title}</p>
            <Badge variant="outline" className="shrink-0 text-xs">
              {ftConfig.label}
            </Badge>
          </div>
          {doc.description && (
            <p className="mt-0.5 text-xs text-muted-foreground">{doc.description}</p>
          )}
        </div>
        {doc.fileUrl && doc.fileUrl !== '#' && (
          <a
            href={doc.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex"
          >
            <Button variant="outline" size="xs" className="gap-1.5">
              <HugeiconsIcon icon={isExternal ? Link01Icon : Download01Icon} size={12} />
              {isExternal ? 'Open' : 'Download'}
            </Button>
          </a>
        )}
        {(!doc.fileUrl || doc.fileUrl === '#') && (
          <p className="text-xs text-muted-foreground italic">
            Contact the Study Office to obtain this document.
          </p>
        )}
      </div>
    </div>
  )
}

export function DocumentsClient({ allDocuments }: { allDocuments: Document[] }) {
  const [query, setQuery] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const debouncedQuery = useDebounce(query, 200)

  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <HugeiconsIcon
          icon={Search01Icon}
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search documents..."
          className="pl-9"
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex flex-wrap gap-1 h-auto">
          {CATEGORIES.map((cat) => (
            <TabsTrigger key={cat.value} value={cat.value}>
              {cat.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {CATEGORIES.map((cat) => {
          let tabDocs = cat.value === 'all' ? allDocuments : allDocuments.filter((d) => d.category === cat.value)
          if (debouncedQuery.trim()) {
            const q = debouncedQuery.toLowerCase()
            tabDocs = tabDocs.filter(
              (d) =>
                d.title.toLowerCase().includes(q) ||
                (d.description?.toLowerCase().includes(q) ?? false) ||
                d.tags.some((t) => t.toLowerCase().includes(q)),
            )
          }
          return (
            <TabsContent key={cat.value} value={cat.value} className="mt-4">
              {tabDocs.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No documents found.
                </p>
              ) : (
                <div className="flex flex-col gap-3">
                  {tabDocs.map((doc) => (
                    <DocumentCard key={doc.id} doc={doc} />
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

export type { Document }
