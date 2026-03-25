import { Skeleton } from '@/components/ui/skeleton'

export default function DocumentsLoading() {
  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6">
      <div>
        <Skeleton className="mb-1 h-7 w-44" />
        <Skeleton className="h-4 w-80" />
      </div>
      <Skeleton className="h-9 w-full" />
      <Skeleton className="h-10 w-72" />
      <div className="flex flex-col gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
    </div>
  )
}
