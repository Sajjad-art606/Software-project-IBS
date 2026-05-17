import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { contacts, guides, documents, platformLinks, internationalInfo } from './schema'
import type { HelpContent } from './schema'
import { guideData } from './seed/guides'
import { assertValidGuides } from './seed/validate-guides'
import path from 'path'

const DB_PATH = process.env.DB_PATH ?? path.join(process.cwd(), 'ibs-hub.db')
const sqlite = new Database(DB_PATH)
sqlite.pragma('journal_mode = WAL')
const db = drizzle(sqlite)

function ensureGuideColumns() {
  const existing = sqlite
    .prepare('PRAGMA table_info(guides)')
    .all()
    .map((c) => (c as { name: string }).name)
  const columns: [string, string][] = [
    ['prerequisites', "text DEFAULT '[]'"],
    ['related_guide_slugs', "text DEFAULT '[]'"],
    ['related_contact_ids', "text DEFAULT '[]'"],
    ['last_reviewed_at', 'text'],
  ]
  for (const [name, type] of columns) {
    if (!existing.includes(name)) {
      sqlite.exec(`ALTER TABLE guides ADD ${name} ${type}`)
    }
  }
}

async function seed() {
  console.log('🌱 Seeding database...')
  ensureGuideColumns()

  // Clear existing data
  db.delete(contacts).run()
  db.delete(guides).run()
  db.delete(documents).run()
  db.delete(platformLinks).run()
  db.delete(internationalInfo).run()

  // ─── Platform Links ───────────────────────────────────────────────
  db.insert(platformLinks).values([
    {
      name: 'HFU Portal (Felix)',
      shortName: 'Felix',
      description: 'Central student portal for course registration, grades, and university services.',
      url: 'https://felix.hs-furtwangen.de/dmz/',
      category: 'academic',
      iconName: 'DashboardSquare01Icon',
      tags: ['portal', 'registration', 'grades'],
      sortOrder: 1,
    },
    {
      name: 'Campus Management (MIO/QIS)',
      shortName: 'MIO/QIS',
      description: 'Manage your study account, view exam results, and academic records.',
      url: 'https://mio.hs-furtwangen.de/',
      category: 'academic',
      iconName: 'File01Icon',
      tags: ['grades', 'exams', 'account'],
      sortOrder: 2,
    },
    {
      name: 'HFU Mailbox (OWA)',
      shortName: 'OWA',
      description: 'Your official HFU email inbox - used for all university communications.',
      url: 'https://mailbox.hs-furtwangen.de/',
      category: 'communication',
      iconName: 'Mail01Icon',
      tags: ['email', 'communication', 'mailbox'],
      sortOrder: 3,
    },
    {
      name: 'Timetable (sPlan)',
      shortName: 'sPlan',
      description: 'View your weekly lecture schedule and room allocations.',
      url: 'https://splan.hs-furtwangen.de/',
      category: 'scheduling',
      iconName: 'Calendar01Icon',
      tags: ['timetable', 'schedule', 'lectures', 'rooms'],
      sortOrder: 4,
    },
    {
      name: 'Moodle (LCOnline)',
      shortName: 'LCOnline',
      description: 'Access course materials, assignments, and learning resources.',
      url: 'https://lconline.hs-furtwangen.de/',
      category: 'learning',
      iconName: 'Book02Icon',
      tags: ['moodle', 'courses', 'materials', 'assignments'],
      sortOrder: 5,
    },
  ]).run()

  // ─── Contacts ─────────────────────────────────────────────────────
  db.insert(contacts).values([
    {
      name: 'Study Office (Studierendensekretariat)',
      role: 'Administrative',
      department: 'Student Services',
      email: 'studienbuero@hs-furtwangen.de',
      phone: '+49 7723 920-0',
      officeLocation: 'Building A, Room 101',
      officeHours: 'Mon-Fri 9:00-12:00, Mon & Wed 14:00-16:00',
      tags: ['enrollment', 're-enrollment', 'certificates', 'general'],
      relevantSemesters: [],
    },
    {
      name: 'International Office',
      role: 'Administrative',
      department: 'International Affairs',
      email: 'international@hs-furtwangen.de',
      phone: '+49 7723 920-0',
      officeLocation: 'Building A, Room 115',
      officeHours: 'Mon-Thu 10:00-12:00',
      tags: ['visa', 'accommodation', 'international', 'abroad'],
      relevantSemesters: [],
    },
    {
      name: 'Study Program Coordinator',
      role: 'Professor',
      department: 'IBS Program',
      email: 'ibs-coordinator@hs-furtwangen.de',
      officeLocation: 'Building B, Room 210',
      officeHours: 'Wed 14:00-16:00 or by appointment',
      tags: ['curriculum', 'module-plan', 'internship', 'program'],
      relevantSemesters: [],
    },
    {
      name: 'IT Support Helpdesk',
      role: 'Support',
      department: 'IT Services',
      email: 'helpdesk@hs-furtwangen.de',
      phone: '+49 7723 920-1111',
      officeLocation: 'Building C, Room 005',
      officeHours: 'Mon-Fri 8:00-17:00',
      tags: ['email', 'account', 'felix', 'moodle', 'vpn', 'wifi', 'password'],
      relevantSemesters: [1],
    },
    {
      name: 'Library (Bibliothek HFU)',
      role: 'Service',
      department: 'Library Services',
      email: 'bibliothek@hs-furtwangen.de',
      phone: '+49 7723 920-0',
      officeLocation: 'Library Building, Ground Floor',
      officeHours: 'Mon-Fri 8:00-20:00, Sat 10:00-17:00',
      tags: ['books', 'loans', 'study-rooms', 'research', 'databases'],
      relevantSemesters: [],
    },
    {
      name: 'Internship Coordinator',
      role: 'Administrative',
      department: 'Career & Internship Office',
      email: 'praktikum@hs-furtwangen.de',
      officeLocation: 'Building A, Room 120',
      officeHours: 'Tue & Thu 10:00-12:00',
      tags: ['internship', 'placement', 'registration', 'contract', 'practical-semester'],
      relevantSemesters: [3, 4],
    },
    {
      name: 'Exam Office (Prüfungsamt)',
      role: 'Administrative',
      department: 'Exam Administration',
      email: 'pruefungsamt@hs-furtwangen.de',
      officeLocation: 'Building A, Room 108',
      officeHours: 'Mon, Wed, Fri 9:00-12:00',
      tags: ['exams', 'grades', 're-exam', 'deregistration', 'appeals'],
      relevantSemesters: [],
    },
    {
      name: 'Career Center',
      role: 'Service',
      department: 'Career Services',
      email: 'career@hs-furtwangen.de',
      officeLocation: 'Building A, Room 125',
      officeHours: 'Mon-Thu 10:00-12:00, Tue 14:00-16:00',
      tags: ['jobs', 'internship', 'career', 'cv', 'applications', 'companies'],
      relevantSemesters: [3, 4, 5, 6],
    },
    {
      name: 'Thesis Supervisor Office',
      role: 'Administrative',
      department: 'IBS Program',
      email: 'thesis@hs-furtwangen.de',
      officeLocation: 'Building B, Room 215',
      officeHours: 'By appointment',
      tags: ['thesis', 'research', 'supervision', 'bachelor-thesis', 'registration'],
      relevantSemesters: [5, 6, 7],
    },
    {
      name: 'Student Council (StuV)',
      role: 'Student Body',
      department: 'Student Representatives',
      email: 'stuv@hs-furtwangen.de',
      officeLocation: 'Student Union Building',
      officeHours: 'Mon, Wed, Fri 12:00-14:00',
      tags: ['events', 'social', 'support', 'student-life', 'community'],
      relevantSemesters: [],
    },
    {
      name: 'AStA (Student Union)',
      role: 'Student Body',
      department: 'Student Union',
      email: 'asta@hs-furtwangen.de',
      officeLocation: 'AStA Building',
      officeHours: 'Mon-Fri 11:00-14:00',
      tags: ['social', 'sports', 'discount', 'student-card', 'culture', 'legal-advice'],
      relevantSemesters: [],
    },
    {
      name: 'Accommodation Office (Studierendenwerk)',
      role: 'Service',
      department: 'Student Services (Studierendenwerk)',
      email: 'wohnen@swfr.de',
      phone: '+49 761 2101-0',
      officeLocation: 'Studierendenwerk Freiburg office',
      officeHours: 'Mon-Fri 9:00-12:00',
      tags: ['housing', 'dormitory', 'accommodation', 'student-residence', 'wohnheim'],
      relevantSemesters: [1],
    },
  ]).run()

  // ─── Guides ───────────────────────────────────────────────────────
  assertValidGuides(guideData)

  for (const guide of guideData) {
    db.insert(guides).values([{
      slug: guide.slug,
      title: guide.title,
      description: guide.description,
      category: guide.category,
      steps: guide.steps,
      tags: guide.tags,
      relevantSemesters: guide.relevantSemesters,
      estimatedTime: guide.estimatedTime,
      prerequisites: guide.prerequisites ?? [],
      relatedGuideSlugs: guide.relatedGuideSlugs ?? [],
      relatedContactIds: guide.relatedContactIds ?? [],
      lastReviewedAt: guide.lastReviewedAt ?? null,
    }]).run()
  }


  // ─── Documents ────────────────────────────────────────────────────
  db.insert(documents).values([
    {
      title: 'Internship Registration Form',
      description: 'Official form to register your practical semester internship with the university.',
      fileUrl: '#',
      category: 'forms',
      fileType: 'pdf',
      tags: ['internship', 'practical-semester', 'registration'],
      relevantSemesters: [3, 4],
    },
    {
      title: 'Internship Report Template',
      description: 'Template for writing your internship report (Praktikumsbericht) after completing your practical semester.',
      fileUrl: '#',
      category: 'templates',
      fileType: 'docx',
      tags: ['internship', 'report', 'template'],
      relevantSemesters: [4],
    },
    {
      title: 'Exam Registration & Deadlines Overview',
      description: 'Overview of exam registration and deregistration deadlines for the current semester.',
      fileUrl: '#',
      category: 'info-sheets',
      fileType: 'pdf',
      tags: ['exams', 'deadlines', 'registration'],
      relevantSemesters: [],
    },
    {
      title: 'Student Enrollment Certificate',
      description: 'Download your official enrollment certificate (Immatrikulationsbescheinigung) from MIO/QIS.',
      fileUrl: 'https://mio.hs-furtwangen.de/',
      category: 'forms',
      fileType: 'link',
      tags: ['enrollment', 'certificate', 'proof'],
      relevantSemesters: [],
    },
    {
      title: 'Bachelor Thesis Registration Form',
      description: 'Official form to register your bachelor thesis topic and examiners with the Exam Office.',
      fileUrl: '#',
      category: 'forms',
      fileType: 'pdf',
      tags: ['thesis', 'registration', 'graduation'],
      relevantSemesters: [5, 6, 7],
    },
    {
      title: 'Academic Regulations (SPO)',
      description: 'The official study and examination regulations (Studien- und Prüfungsordnung) for the IBS program.',
      fileUrl: '#',
      category: 'regulations',
      fileType: 'pdf',
      tags: ['regulations', 'spo', 'rules', 'exams', 'modules'],
      relevantSemesters: [],
    },
    {
      title: 'Housing Application (Studierendenwerk)',
      description: 'Apply for a student dormitory room via the Studierendenwerk Freiburg.',
      fileUrl: 'https://www.swfr.de/',
      category: 'forms',
      fileType: 'link',
      tags: ['housing', 'dormitory', 'accommodation', 'studierendenwerk'],
      relevantSemesters: [1],
    },
    {
      title: 'Health Insurance Certificate Template',
      description: 'Template for the health insurance certificate required for enrollment at HFU.',
      fileUrl: '#',
      category: 'templates',
      fileType: 'pdf',
      tags: ['health-insurance', 'insurance', 'international', 'enrollment'],
      relevantSemesters: [1],
    },
  ]).run()

  // ─── International Info ───────────────────────────────────────────
  const helpData: Array<{
    slug: string
    title: string
    category: string
    description: string
    tags: string[]
    sortOrder: number
    content: HelpContent
  }> = [
    {
      slug: 'anmeldung-city-registration',
      title: 'City Registration (Anmeldung) in Furtwangen',
      category: 'registration',
      description: 'Step-by-step guide to registering your address in Germany - required by law within 14 days of moving in.',
      tags: ['anmeldung', 'registration', 'address', 'germany'],
      sortOrder: 1,
      content: {
        steps: [
          { id: 1, title: 'Get a confirmed address', description: 'You must have a fixed address (dormitory or private) before registering. Your landlord must provide a Wohnungsgeberbestätigung.' },
          { id: 2, title: 'Download the registration form', description: 'Get the Anmeldeformular from the Furtwangen city website or pick it up at the Bürgerbüro.' },
          { id: 3, title: 'Book an appointment', description: 'Book online at the Furtwangen Bürgerbüro or call to get an appointment. Some days accept walk-ins.' },
          { id: 4, title: 'Attend the appointment', description: 'Bring: passport, completed form, Wohnungsgeberbestätigung, and for non-EU students: visa/residence permit.' },
          { id: 5, title: 'Receive your Anmeldebestätigung', description: 'You will receive the registration confirmation on the spot. Keep it - you need it for the bank, insurance, and university.' },
        ],
        tips: ['Register within 14 days of moving in to avoid fines.', 'If you move dormitories later, you must update your registration.'],
      },
    },
    {
      slug: 'opening-bank-account',
      title: 'Opening a German Bank Account as a Student',
      category: 'banking',
      description: 'Everything you need to know about getting a German bank account - from choosing a bank to making your first transfer.',
      tags: ['bank', 'banking', 'account', 'germany', 'finance'],
      sortOrder: 2,
      content: {
        steps: [
          { id: 1, title: 'Complete city registration first', description: 'Banks require your Anmeldebestätigung. Complete your Anmeldung before applying for a bank account.' },
          { id: 2, title: 'Choose a bank', description: 'Popular options: DKB (online, free), N26 (app-based, free), Sparkasse (local branches in Furtwangen).', links: [{ label: 'DKB Student Account', url: 'https://www.dkb.de/' }, { label: 'N26 Bank', url: 'https://n26.com/' }] },
          { id: 3, title: 'Prepare documents', description: 'Typically needed: passport, Anmeldebestätigung, HFU enrollment certificate, student ID.' },
          { id: 4, title: 'Apply and verify identity', description: 'Online banks use VideoIdent for identity verification. Sparkasse requires an in-person visit.' },
          { id: 5, title: 'Wait for your card', description: 'Card and PIN arrive separately by post within 5-10 business days.' },
        ],
        tips: ['DKB offers a free credit card alongside the account, useful for travel.', 'Set up online banking immediately - you will need it to pay your semester fee.'],
      },
    },
    {
      slug: 'finding-accommodation',
      title: 'Finding Student Accommodation',
      category: 'housing',
      description: 'Options for student housing in and around Furtwangen - from dormitories to private rentals.',
      tags: ['housing', 'dormitory', 'accommodation', 'wohnheim', 'rental'],
      sortOrder: 3,
      content: {
        steps: [
          { id: 1, title: 'Apply for a dormitory (Wohnheim)', description: 'The Studierendenwerk manages student dormitories. Apply as early as possible - demand is high.', links: [{ label: 'Studierendenwerk Wohnen', url: 'https://www.swfr.de/' }] },
          { id: 2, title: 'Search private rentals', description: 'Use WG-Gesucht.de (shared apartments), ImmobilienScout24, or the HFU notice boards for private rooms and flats.', links: [{ label: 'WG-Gesucht.de', url: 'https://www.wg-gesucht.de/' }] },
          { id: 3, title: 'Prepare your rental application', description: 'Landlords typically require: SCHUFA credit report (get a free copy once a year), proof of income or scholarship, and a copy of your student ID.' },
          { id: 4, title: 'Sign your rental contract', description: 'Read the Mietvertrag carefully. Check the notice period (Kündigungsfrist) - typically 3 months.' },
        ],
        tips: ['Start your housing search 3-4 months before moving to Germany.', 'Join the HFU international student Facebook groups to find roommates and housing tips.'],
      },
    },
    {
      slug: 'health-insurance-germany',
      title: 'Health Insurance as a Student in Germany',
      category: 'insurance',
      description: 'Health insurance is mandatory in Germany. Here is how to get covered as an international student.',
      tags: ['health-insurance', 'insurance', 'krankenversicherung', 'international'],
      sortOrder: 4,
      content: {
        steps: [
          { id: 1, title: 'Understand your options', description: 'EU students may use their European Health Insurance Card (EHIC). Non-EU students must get German statutory (gesetzliche) or private health insurance.' },
          { id: 2, title: 'Choose a health insurance provider', description: 'Major statutory insurers for students: TK (Techniker Krankenkasse), AOK, Barmer, DAK. Student premiums are subsidized (approx. €120/month in 2024).', links: [{ label: 'TK for International Students', url: 'https://www.tk.de/en' }] },
          { id: 3, title: 'Apply for insurance', description: 'Apply online or at a local office of your chosen insurer. You will need your passport, enrollment certificate, and German address.' },
          { id: 4, title: 'Get your insurance certificate', description: 'After enrolling, your insurer provides a certificate (Mitgliedsbescheinigung). Submit this to the HFU Study Office as proof of insurance.' },
          { id: 5, title: 'Get your insurance card', description: 'Your electronic health insurance card (eGK) arrives by post. Present this card to any doctor or pharmacy in Germany.' },
        ],
        tips: ['Choose TK - they have English-speaking customer service and an excellent app.', 'Health insurance must be proved before you can enroll at HFU.'],
      },
    },
    {
      slug: 'residence-permit-aufenthaltstitel',
      title: 'Residence Permit & Visa Extension',
      category: 'visa',
      description: 'For non-EU students: how to apply for or extend your residence permit (Aufenthaltstitel) in Germany.',
      tags: ['visa', 'residence-permit', 'aufenthaltstitel', 'immigration', 'non-eu'],
      sortOrder: 5,
      content: {
        steps: [
          { id: 1, title: 'Check your current visa', description: 'If you entered on a student visa (Visum zu Studienzwecken), you must convert it to a residence permit before it expires - typically within 90 days of arrival.' },
          { id: 2, title: 'Contact the Ausländerbehörde', description: 'The immigration office (Ausländerbehörde) for Furtwangen is located in Villingen-Schwenningen or Rottweil. Contact them or book an appointment online.' },
          { id: 3, title: 'Prepare your documents', description: 'Required: passport, biometric photo, proof of enrollment, proof of financial means (blocked account or scholarship), health insurance certificate, city registration (Anmeldebestätigung), and rental contract.' },
          { id: 4, title: 'Attend your appointment', description: 'Bring all original documents and copies. The residence permit is usually issued for 1-2 years and can be extended.' },
          { id: 5, title: 'Receive your Aufenthaltstitel', description: 'The residence permit card is issued 4-8 weeks after your appointment. You will receive a pickup notification.' },
        ],
        tips: ['Contact the International Office early - they can advise on your specific situation.', 'Start the process 2 months before your current visa expires.'],
        relatedContactIds: [2],
      },
    },
    {
      slug: 'campus-welcome-checklist',
      title: 'Your First Week on Campus - Checklist',
      category: 'general',
      description: 'A comprehensive checklist of everything you should do in your first week at HFU Furtwangen.',
      tags: ['first-week', 'checklist', 'getting-started', 'campus', 'new-student'],
      sortOrder: 6,
      content: {
        steps: [
          { id: 1, title: 'Attend the orientation week (Orientierungswoche)', description: 'HFU runs an orientation week (O-Woche) at the start of each winter semester. Attend all sessions - you will get your student ID, learn about systems, and meet fellow students.' },
          { id: 2, title: 'Set up all HFU digital accounts', description: 'Activate Felix, HFU email (OWA), LCOnline, and MIO/QIS accounts. See the "Getting Started with HFU Systems" guide.', links: [{ label: 'Getting Started Guide', url: '/guides/getting-started-hfu-systems' }] },
          { id: 3, title: 'Complete city registration (Anmeldung)', description: 'Visit the Furtwangen Bürgerbüro within 14 days of moving in to register your address.' },
          { id: 4, title: 'Open a German bank account', description: 'Start the process early - it takes 1-2 weeks. You need the Anmeldebestätigung first.' },
          { id: 5, title: 'Get your student ID card', description: 'Collect your physical student ID from the Study Office. Bring your passport and enrollment certificate.' },
          { id: 6, title: 'Explore the campus and city', description: "Furtwangen is a small, friendly town in the Black Forest. Find the library, canteen (Mensa), sports facilities, and local shops. Pick up a student discount card from AStA." },
        ],
        tips: ['Join the HFU international student WhatsApp group for news and events.', 'The Mensa (canteen) is the cheapest and most convenient lunch option on campus.'],
      },
    },
  ]

  for (const info of helpData) {
    db.insert(internationalInfo).values([{
      slug: info.slug,
      title: info.title,
      category: info.category,
      description: info.description,
      content: info.content,
      tags: info.tags,
      sortOrder: info.sortOrder,
    }]).run()
  }

  console.log('✅ Database seeded successfully!')
  console.log('   Platform links:', 5)
  console.log('   Contacts:', 12)
  console.log('   Guides:', guideData.length)
  console.log('   Documents:', 8)
  console.log('   International info topics:', helpData.length)
  sqlite.close()
}

seed().catch(console.error)
