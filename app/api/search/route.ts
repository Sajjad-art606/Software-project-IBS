import { NextResponse } from 'next/server'
import { db } from '@/db'
import { guides, contacts, documents, platformLinks, internationalInfo } from '@/db/schema'
import type { GuideStep } from '@/db/schema'
import { mapRow } from '@/db/utils'
import { filterBySemester } from '@/lib/guides/filter'

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
  score: number
}

function scoreItem(
  item: { title: string; description: string; tags: string[] },
  tokens: string[],
): number {
  let score = 0
  for (const token of tokens) {
    if (item.title.toLowerCase().includes(token)) score += 10
    if (item.description.toLowerCase().includes(token)) score += 5
    if (item.tags.some((t) => t.toLowerCase().includes(token))) score += 3
  }
  return score
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')?.trim() ?? ''
  const semester = searchParams.get('semester')
  const semesterNum = semester ? parseInt(semester, 10) : null

  if (!q) {
    return NextResponse.json([])
  }

  const tokens = q.toLowerCase().split(/\s+/).filter(Boolean)
  const results: SearchResult[] = []

  // Search guides
  const allGuides = db.select().from(guides).all().map((g) => mapRow(guides, g))
  const guidesWithSemester = allGuides.map((g) => ({
    ...g,
    relevantSemesters: g.relevantSemesters as number[],
  }))
  const filteredGuides = semesterNum
    ? filterBySemester(guidesWithSemester, semesterNum)
    : guidesWithSemester
  for (const guide of filteredGuides) {
    const score = scoreItem(
      { title: guide.title, description: guide.description, tags: guide.tags as string[] },
      tokens,
    )
    if (score > 0) {
      results.push({
        type: 'guide',
        id: guide.id,
        title: guide.title,
        description: guide.description,
        slug: guide.slug,
        category: guide.category,
        tags: guide.tags as string[],
        score,
      })
    }
  }

  // Search contacts
  const allContacts = db.select().from(contacts).all().map((c) => mapRow(contacts, c))
  const contactsWithSemester = allContacts.map((c) => ({
    ...c,
    relevantSemesters: c.relevantSemesters as number[],
  }))
  const filteredContacts = semesterNum
    ? filterBySemester(contactsWithSemester, semesterNum)
    : contactsWithSemester
  for (const contact of filteredContacts) {
    const score = scoreItem(
      {
        title: contact.name,
        description: `${contact.role ?? ''} ${contact.department ?? ''}`,
        tags: contact.tags as string[],
      },
      tokens,
    )
    if (score > 0) {
      results.push({
        type: 'contact',
        id: contact.id,
        title: contact.name,
        description: `${contact.role}${contact.department ? ` · ${contact.department}` : ''}`,
        category: contact.role,
        tags: contact.tags as string[],
        score,
      })
    }
  }

  // Search documents
  const allDocuments = db.select().from(documents).all().map((d) => mapRow(documents, d))
  const docsWithSemester = allDocuments.map((d) => ({
    ...d,
    relevantSemesters: d.relevantSemesters as number[],
  }))
  const filteredDocs = semesterNum
    ? filterBySemester(docsWithSemester, semesterNum)
    : docsWithSemester
  for (const doc of filteredDocs) {
    const score = scoreItem(
      {
        title: doc.title,
        description: doc.description ?? '',
        tags: doc.tags as string[],
      },
      tokens,
    )
    if (score > 0) {
      results.push({
        type: 'document',
        id: doc.id,
        title: doc.title,
        description: doc.description ?? '',
        url: doc.fileUrl ?? '#',
        category: doc.category,
        tags: doc.tags as string[],
        score,
      })
    }
  }

  // Search platform links
  const allPlatforms = db.select().from(platformLinks).all().map((p) => mapRow(platformLinks, p))
  for (const platform of allPlatforms) {
    const score = scoreItem(
      {
        title: platform.name,
        description: platform.description,
        tags: platform.tags as string[],
      },
      tokens,
    )
    if (score > 0) {
      results.push({
        type: 'platform',
        id: platform.id,
        title: platform.name,
        description: platform.description,
        url: platform.url as string,
        category: platform.category,
        tags: platform.tags as string[],
        score,
      })
    }
  }

  // Search international info
  const allHelp = db.select().from(internationalInfo).all().map((h) => mapRow(internationalInfo, h))
  for (const help of allHelp) {
    const score = scoreItem(
      {
        title: help.title,
        description: help.description,
        tags: help.tags as string[],
      },
      tokens,
    )
    if (score > 0) {
      results.push({
        type: 'help',
        id: help.id,
        title: help.title,
        description: help.description,
        slug: help.slug,
        category: help.category,
        tags: help.tags as string[],
        score,
      })
    }
  }

  // Sort by score desc, cap at 30
  results.sort((a, b) => b.score - a.score)

  return NextResponse.json(
    results.slice(0, 30).map(({ score: _, ...item }) => item),
  )
}
