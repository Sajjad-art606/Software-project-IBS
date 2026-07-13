"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type SemesterSwitcherProps = {
  currentSemester: number
}

export function SemesterSwitcher({ currentSemester }: SemesterSwitcherProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleValueChange = (value: string | null) => {
    if (!value) return

    const params = new URLSearchParams(searchParams.toString())
    params.set("semester", value)
    router.replace(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-3 py-2 shadow-sm backdrop-blur">
      <span className="text-xs font-medium text-muted-foreground">
        View semester
      </span>
      <Select value={String(currentSemester)} onValueChange={handleValueChange}>
        <SelectTrigger size="sm" className="w-[112px] rounded-full border-none bg-transparent px-0 py-0 shadow-none">
          <SelectValue placeholder="Semester" />
        </SelectTrigger>
        <SelectContent>
          {[1, 2, 3, 4, 5, 6, 7].map((semester) => (
            <SelectItem key={semester} value={String(semester)}>
              Semester {semester}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
