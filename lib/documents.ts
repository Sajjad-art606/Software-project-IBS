export const DOCUMENT_CATEGORIES = [
  { value: "forms", label: "Forms" },
  { value: "templates", label: "Templates" },
  { value: "regulations", label: "Regulations" },
  { value: "info-sheets", label: "Info Sheets" },
  { value: "checklists", label: "Checklists" },
  { value: "exam-dates", label: "Exam Dates" },
] as const

export const DOCUMENT_FILE_TYPES = [
  { value: "pdf", label: "PDF" },
  { value: "docx", label: "DOCX" },
  { value: "link", label: "Link" },
] as const

export type DocumentCategory = (typeof DOCUMENT_CATEGORIES)[number]["value"]
export type DocumentFileType = (typeof DOCUMENT_FILE_TYPES)[number]["value"]
