import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { customType } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'

export type GuideStep = {
  id: number
  title: string
  description: string
  tips?: string[]
  links?: { label: string; url: string }[]
}

export type HelpContent = {
  steps?: GuideStep[]
  tips?: string[]
  links?: { label: string; url: string }[]
  relatedContactIds?: number[]
}

// Custom JSON column type that correctly parses on reads and stringifies on writes
function jsonCol<T>() {
  return customType<{ data: T; driverData: string }>({
    dataType() {
      return 'text'
    },
    fromDriver(value) {
      if (typeof value === 'string') {
        try {
          return JSON.parse(value) as T
        } catch {
          return value as T
        }
      }
      return value as T
    },
    toDriver(value) {
      return JSON.stringify(value)
    },
  })
}

export const contacts = sqliteTable('contacts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  role: text('role').notNull(),
  department: text('department'),
  email: text('email'),
  phone: text('phone'),
  officeLocation: text('office_location'),
  officeHours: text('office_hours'),
  tags: jsonCol<string[]>()('tags').default([]),
  relevantSemesters: jsonCol<number[]>()('relevant_semesters').default([]),
})

export const guides = sqliteTable('guides', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  category: text('category').notNull(),
  steps: jsonCol<GuideStep[]>()('steps').notNull(),
  tags: jsonCol<string[]>()('tags').default([]),
  relevantSemesters: jsonCol<number[]>()('relevant_semesters').default([]),
  estimatedTime: text('estimated_time'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(
    sql`(strftime('%s', 'now'))`,
  ),
})

export const documents = sqliteTable('documents', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  description: text('description'),
  fileUrl: text('file_url'),
  category: text('category').notNull(),
  fileType: text('file_type').default('pdf'),
  tags: jsonCol<string[]>()('tags').default([]),
  relevantSemesters: jsonCol<number[]>()('relevant_semesters').default([]),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(
    sql`(strftime('%s', 'now'))`,
  ),
})

export const platformLinks = sqliteTable('platform_links', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  shortName: text('short_name'),
  description: text('description').notNull(),
  url: text('url').notNull(),
  category: text('category').notNull(),
  iconName: text('icon_name'),
  tags: jsonCol<string[]>()('tags').default([]),
  sortOrder: integer('sort_order').default(0),
})

export const internationalInfo = sqliteTable('international_info', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  category: text('category').notNull(),
  description: text('description').notNull(),
  content: jsonCol<HelpContent>()('content').notNull(),
  tags: jsonCol<string[]>()('tags').default([]),
  sortOrder: integer('sort_order').default(0),
})
