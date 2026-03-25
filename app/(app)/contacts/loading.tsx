import { Skeleton } from '@/components/ui/skeleton'

export default function ContactsLoading() {
  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6">
      <div>
        <Skeleton className="mb-1 h-7 w-32" />
        <Skeleton className="h-4 w-64" />
      </div>
      <Skeleton className="h-9 w-full" />
      <div className="grid gap-3 sm:grid-cols-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-36 rounded-xl" />
        ))}
      </div>
    </div>
  )
}
