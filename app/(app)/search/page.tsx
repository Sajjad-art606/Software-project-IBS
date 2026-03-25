'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Search01Icon,
  Book02Icon,
  UserGroupIcon,
  File01Icon,
  Link01Icon,
  GlobeIcon,
} from '@hugeicons/core-free-icons'
import { Badge } from '@/components/ui/badge'
import { useDebounce } from '@/hooks/use-debounce'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'
import { Suspense } from 'react'

type SearchResultType = 'guide' | 'contact' | 'document' | 'platform' | 'help'

interface SearchResult {
  type: SearchResultType
  id: number
  title: string
  description: string
  slug?: string
  url?: string
  category: string
  tags: string[]
}

const typeConfig: Record<
  SearchResultType,
  { label: string; icon: typeof Book02Icon; variant: 'default' | 'secondary' | 'outline' | 'muted' | 'success' }
> = {
  guide: { label: 'Guide', icon: Book02Icon, variant: 'default' },
  contact: { label: 'Contact', icon: UserGroupIcon, variant: 'secondary' },
  document: { label: 'Document', icon: File01Icon, variant: 'outline' },
  platform: { label: 'Platform', icon: Link01Icon, variant: 'muted' },
  help: { label: 'Help', icon: GlobeIcon, variant: 'success' },
}

function resultHref(result: SearchResult): string {
  if (result.type === 'guide') return `/guides/${result.slug}`
  if (result.type === 'help') return `/help/${result.slug}`
  if (result.type === 'platform') return result.url ?? '/platforms'
  if (result.type === 'document') return result.url ?? '/documents'
  return '/contacts'
}

function resultIsExternal(result: SearchResult): boolean {
  return result.type === 'platform' || result.type === 'document'
}

function SearchResultItem({ result }: { result: SearchResult }) {
  const config = typeConfig[result.type]
  const href = resultHref(result)
  const isExternal = resultIsExternal(result)

  const inner = (
    <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-accent hover:text-accent-foreground">
      <HugeiconsIcon icon={config.icon} size={16} className="mt-0.5 shrink-0 text-primary" />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium leading-tight">{result.title}</p>
          <Badge variant={config.variant} className="shrink-0 text-xs">
            {config.label}
          </Badge>
        </div>
        <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{result.description}</p>
      </div>
    </div>
  )

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {inner}
      </a>
    )
  }

  return <Link href={href}>{inner}</Link>
}

function SearchContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialQ = searchParams.get('q') ?? ''
  const [query, setQuery] = useState(initialQ)
  const debouncedQuery = useDebounce(query, 300)
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([])
      setHasSearched(false)
      setHasError(false)
      return
    }

    const controller = new AbortController()
    setIsLoading(true)
    setHasSearched(true)
    setHasError(false)

    fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`, { signal: controller.signal })
      .then((r) => r.json())
      .then((data: SearchResult[]) => {
        setResults(data)
        setIsLoading(false)
        router.replace(`/search?q=${encodeURIComponent(debouncedQuery)}`, { scroll: false })
      })
      .catch((err) => {
        if (err.name === 'AbortError') return
        setIsLoading(false)
        setHasError(true)
      })

    return () => controller.abort()
  }, [debouncedQuery, router])

  const grouped = results.reduce<Partial<Record<SearchResultType, SearchResult[]>>>(
    (acc, r) => {
      if (!acc[r.type]) acc[r.type] = []
      acc[r.type]!.push(r)
      return acc
    },
    {},
  )

  return (
    <div className="flex flex-col gap-6">
      {/* Search input */}
      <div className="relative">
        <HugeiconsIcon
          icon={Search01Icon}
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for guides, contacts, documents, platforms..."
          autoFocus
          className="flex h-11 w-full rounded-xl border border-input bg-card pl-10 pr-4 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      {/* Results */}
      {isLoading && (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      )}

      {!isLoading && hasError && (
        <div className="flex flex-col items-center gap-4 py-10 text-center">
          <p className="text-sm font-medium text-destructive">Something went wrong. Please try again.</p>
        </div>
      )}

      {!isLoading && !hasError && hasSearched && results.length === 0 && (
        <div className="flex flex-col items-center gap-4 py-10 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/illustrations/no-data.svg" alt="" aria-hidden className="w-44 select-none opacity-90" draggable={false} />
          <div>
            <p className="text-sm font-medium">No results for &ldquo;{debouncedQuery}&rdquo;</p>
            <p className="mt-1 text-xs text-muted-foreground">Try different keywords or browse the sections directly.</p>
          </div>
        </div>
      )}

      {!isLoading && results.length > 0 && (
        <div className="flex flex-col gap-6">
          <p className="text-sm text-muted-foreground">
            {results.length} result{results.length !== 1 ? 's' : ''} for &ldquo;{debouncedQuery}&rdquo;
          </p>
          {(Object.entries(grouped) as [SearchResultType, SearchResult[]][]).map(([type, items]) => (
            <section key={type}>
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {typeConfig[type].label}s ({items.length})
              </h2>
              <div className="flex flex-col gap-2">
                {items.map((result) => (
                  <SearchResultItem key={`${result.type}-${result.id}`} result={result} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {!hasSearched && (
        <div className="flex flex-col items-center gap-4 py-10 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/illustrations/search.svg" alt="" aria-hidden className="w-44 select-none opacity-90" draggable={false} />
          <p className="text-sm text-muted-foreground">Start typing to search across all guides, contacts, documents, and platforms.</p>
        </div>
      )}
    </div>
  )
}

export default function SearchPage() {
  return (
    <div className="mx-auto max-w-2xl p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold">Smart Search</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Find anything across the student hub instantly.
        </p>
      </div>
      <Suspense>
        <SearchContent />
      </Suspense>
    </div>
  )
}
