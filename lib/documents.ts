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

const PUBLIC_DOCUMENT_URLS_BY_TITLE: Record<string, string | null> = {
  "internship registration form": "/documents/ExaminationRulesAboutTheDurationOfInternship_251028_115338.pdf",
  "internship report template": "/documents/IBS_Internship_Semester_Checklist_Procedure_Notes_101024.pdf",
  "exam registration & deadlines overview": null,
  "student enrollment certificate": "https://mio.hs-furtwangen.de/",
  "bachelor thesis registration form": "/documents/Antrag_auf_Verlaengerung_einer_Thesis__englisch_new_1.pdf",
  "academic regulations (spo)": "/documents/InternationalBusinessInformationSystems_IBS_SPO11_gueltig_ab_WiSe2024-2025.pdf",
  "housing application (studierendenwerk)": "https://www.swfr.de/",
  "health insurance certificate template": null,
  "student exmatriculation document": "/documents/Antrag_auf_Exmatrikulation_englisch.pdf",
  "german language course flyer": "/documents/SLC_Flyer_SoSe2026_de_en.pdf",
  "ibs internship checklist": "/documents/IBS_Internship_Semester_Checklist_Procedure_Notes_101024.pdf",
  "elective registration form": "/documents/IBS_Electives_Registration_Form%20(1).pdf",
  "credit transfer form": "/documents/IBS_CREDIT_Transfer_Form.pdf",
  "professors profile list": "/documents/ProfessorInnen_Profil.pdf",
  "thesis templates": "/documents/Thesis_Titelblatt_BCM.doc",
  "thesis extension requests form": "/documents/Antrag_auf_Verlaengerung_einer_Thesis__englisch_new_1.pdf",
  "ibs curriculum overview": "/documents/IBS%20CUrriculum.pdf",
}

export function resolveDocumentFileUrl({
  title,
  fileUrl,
  fileType,
}: {
  title?: string | null
  fileUrl?: string | null
  fileType?: string | null
}) {
  if (fileUrl && fileUrl !== "#") {
    return fileUrl
  }

  if (fileType === "link") {
    return null
  }

  const normalizedTitle = title?.toLowerCase().trim() ?? ""
  return PUBLIC_DOCUMENT_URLS_BY_TITLE[normalizedTitle] ?? null
}

export type DocumentCategory = (typeof DOCUMENT_CATEGORIES)[number]["value"]
export type DocumentFileType = (typeof DOCUMENT_FILE_TYPES)[number]["value"]
