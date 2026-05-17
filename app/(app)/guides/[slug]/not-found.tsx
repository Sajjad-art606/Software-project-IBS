import Link from 'next/link'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowLeft01Icon } from '@hugeicons/core-free-icons'

export default function GuideNotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-12 text-center">
      <h1 className="text-2xl font-semibold">Guide Not Found</h1>
      <p className="text-sm text-muted-foreground">
        This guide does not exist. It may have been moved or renamed.
      </p>
      <Link
        href="/guides"
        className="flex items-center gap-1.5 text-sm text-primary hover:underline"
      >
        <HugeiconsIcon icon={ArrowLeft01Icon} size={14} />
        Back to all guides
      </Link>
    </div>
  )
}
