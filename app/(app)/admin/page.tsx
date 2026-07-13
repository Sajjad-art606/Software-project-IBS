import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  File01Icon,
  Book02Icon,
  UserGroupIcon,
  GlobeIcon,
  Link01Icon,
} from "@hugeicons/core-free-icons"
import { Card, CardContent } from "@/components/ui/card"

const adminSections = [
  {
    title: "Documents",
    description:
      "Add, edit, or remove PDFs and links shown on the Documents page.",
    href: "/admin/documents",
    icon: File01Icon,
  },
  {
    title: "Process Guides",
    description:
      "Manage step-by-step guides for enrollment, exams, internship, and more.",
    href: "/admin/guides",
    icon: Book02Icon,
  },
  {
    title: "Contacts",
    description: "Add, edit, or remove professors and office contacts.",
    href: "/admin/contacts",
    icon: UserGroupIcon,
  },
  {
    title: "International Help",
    description:
      "Manage help topics for international students (banking, visa, housing, etc.).",
    href: "/admin/international",
    icon: GlobeIcon,
  },
  {
    title: "Platform Links",
    description:
      "Manage Felix, MIO, OWA, sPlan, Moodle, and other HFU platform links.",
    href: "/admin/platforms",
    icon: Link01Icon,
  },
]

export default function AdminPage() {
  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6">
      <div>
        <h1 className="text-xl font-semibold">Admin Panel</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage hub content without changing code.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {adminSections.map((section) => (
          <Link key={section.href} href={section.href}>
            <Card className="h-full transition-colors hover:bg-muted/40">
              <CardContent className="flex flex-col gap-3 p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <HugeiconsIcon icon={section.icon} size={20} />
                </div>
                <div>
                  <p className="font-semibold">{section.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {section.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
