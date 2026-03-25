import { Skeleton } from '@/components/ui/skeleton'

export default function GuidesLoading() {
  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6">
      <div>
        <Skeleton className="mb-1 h-7 w-40" />
        <Skeleton className="h-4 w-80" />
      </div>
      <Skeleton className="h-10 w-full max-w-md" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-48 rounded-xl" />
        ))}
      </div>
    </div>
  )
}
