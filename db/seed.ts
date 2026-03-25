import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { contacts, guides, documents, platformLinks, internationalInfo } from './schema'
import type { GuideStep, HelpContent } from './schema'
import path from 'path'

const DB_PATH = process.env.DB_PATH ?? path.join(process.cwd(), 'ibs-hub.db')
const sqlite = new Database(DB_PATH)
sqlite.pragma('journal_mode = WAL')
const db = drizzle(sqlite)

async function seed() {
  console.log('🌱 Seeding database...')

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
  const guideData: Array<{
    slug: string
    title: string
    description: string
    category: string
    estimatedTime: string
    relevantSemesters: number[]
    tags: string[]
    steps: GuideStep[]
  }> = [
    {
      slug: 'getting-started-hfu-systems',
      title: 'Getting Started with HFU Systems',
      description: 'A complete checklist to get all your university accounts and services set up in your first week.',
      category: 'general',
      estimatedTime: '2 hours',
      relevantSemesters: [1],
      tags: ['getting-started', 'account', 'setup', 'first-semester'],
      steps: [
        {
          id: 1,
          title: 'Activate your HFU student account',
          description: 'Your student ID and initial password will be sent to your personal email after enrollment. Use these to first log in to the HFU portal (Felix).',
          links: [{ label: 'Open HFU Portal (Felix)', url: 'https://felix.hs-furtwangen.de/dmz/' }],
        },
        {
          id: 2,
          title: 'Set up your HFU email (OWA)',
          description: 'Your official HFU email address is firstname.lastname@hs-furtwangen.de. Log in to OWA and check that it works. All university communications will come here.',
          links: [{ label: 'Open HFU Mailbox (OWA)', url: 'https://mailbox.hs-furtwangen.de/' }],
        },
        {
          id: 3,
          title: 'Log in to LCOnline (Moodle)',
          description: 'Use your HFU student credentials to access LCOnline. Your professors will post lecture slides, assignments, and announcements here.',
          links: [{ label: 'Open LCOnline', url: 'https://lconline.hs-furtwangen.de/' }],
        },
        {
          id: 4,
          title: 'Check your timetable on sPlan',
          description: 'Your lecture schedule is published on sPlan. Look up your study program and semester to see when and where your lectures are.',
          links: [{ label: 'Open sPlan', url: 'https://splan.hs-furtwangen.de/' }],
        },
        {
          id: 5,
          title: 'Set up the HFU VPN',
          description: 'To access library databases and some internal services from off-campus, you will need the HFU VPN. Contact IT Support Helpdesk for setup instructions.',
          tips: ['The VPN is required to access many resources when not on campus Wi-Fi.'],
        },
        {
          id: 6,
          title: 'Get your student ID card',
          description: 'Your physical student ID card can be collected from the Study Office. Bring your enrollment certificate. The card is used for the canteen, library, and printing.',
        },
      ],
    },
    {
      slug: 'enrollment-and-re-enrollment',
      title: 'Enrollment & Re-enrollment (Rückmeldung)',
      description: 'How to stay enrolled each semester - pay the semester fee and confirm your re-enrollment on time.',
      category: 'enrollment',
      estimatedTime: '30 minutes',
      relevantSemesters: [],
      tags: ['enrollment', 're-enrollment', 'semester-fee', 'rückmeldung'],
      steps: [
        {
          id: 1,
          title: 'Check the re-enrollment deadline',
          description: 'The re-enrollment deadline is typically in January (for summer semester) and July (for winter semester). Check the Study Office website for exact dates.',
          tips: ['Missing the deadline results in a late fee or even exmatriculation.'],
        },
        {
          id: 2,
          title: 'Pay the semester fee (Semesterbeitrag)',
          description: 'Transfer the semester fee to the university bank account. The amount includes the student union contribution (AStA) and public transport ticket. Details are sent to your HFU email.',
          tips: ['Use the exact reference number (Verwendungszweck) provided - this links the payment to your account.'],
        },
        {
          id: 3,
          title: 'Confirm re-enrollment in MIO/QIS',
          description: 'After the payment is processed (can take 2-3 business days), log in to MIO/QIS and confirm your re-enrollment. Download your new enrollment certificate.',
          links: [{ label: 'Open MIO/QIS', url: 'https://mio.hs-furtwangen.de/' }],
        },
        {
          id: 4,
          title: 'Update your student ID card',
          description: 'Once re-enrolled, update your physical student ID card at the validation terminals located in the university buildings.',
        },
      ],
    },
    {
      slug: 'exam-registration',
      title: 'Registering for Exams',
      description: 'How to register and deregister for exams in MIO/QIS within the registration period.',
      category: 'exams',
      estimatedTime: '20 minutes',
      relevantSemesters: [],
      tags: ['exams', 'registration', 'mio', 'qis', 'deregistration'],
      steps: [
        {
          id: 1,
          title: 'Check the exam registration period',
          description: 'Exam registration opens several weeks before the exam period. The exact dates are published on the HFU website and sent via your HFU email. You can also check MIO/QIS.',
        },
        {
          id: 2,
          title: 'Log in to MIO/QIS and register',
          description: 'Go to MIO/QIS → Prüfungsverwaltung → Prüfungsanmeldung. Select the exams you want to take and confirm registration. You will receive a confirmation.',
          links: [{ label: 'Open MIO/QIS', url: 'https://mio.hs-furtwangen.de/' }],
        },
        {
          id: 3,
          title: 'Verify your registrations',
          description: 'After registering, go to "Angemeldete Prüfungen" to see all your registered exams. Double-check the dates, times, and rooms.',
        },
        {
          id: 4,
          title: 'Deregister if needed',
          description: 'You can deregister from exams within the deregistration period (usually ends a few days before the exam). After that, you must show a medical certificate to be excused.',
          tips: ['An unexcused absence counts as a failed attempt.'],
        },
      ],
    },
    {
      slug: 'internship-preparation',
      title: 'Preparing for Your Practical Semester',
      description: 'What to do in Semester 3 to find and prepare for your practical semester (internship) in Semester 4.',
      category: 'internship',
      estimatedTime: '1-2 weeks',
      relevantSemesters: [3],
      tags: ['internship', 'practical-semester', 'career', 'preparation', 'semester-3'],
      steps: [
        {
          id: 1,
          title: 'Understand the requirements',
          description: 'The practical semester is a mandatory 18-22 week internship at a company. You must have completed at least 60 ECTS credits and passed specific modules before you can start.',
          tips: ['Check with the Study Program Coordinator for the exact prerequisites.'],
        },
        {
          id: 2,
          title: 'Start your company search early',
          description: 'Start looking for internship positions at least 6 months before your intended start date. Use the HFU Career Center database, LinkedIn, and XING.',
          links: [{ label: 'HFU Career Center', url: '#' }],
          tips: ['Many students start their search in Semester 2. Companies often have long hiring processes.'],
        },
        {
          id: 3,
          title: 'Prepare your application documents',
          description: 'A German CV (Lebenslauf) is formatted differently from other countries. Visit the Career Center for CV and cover letter review sessions.',
          tips: ['Include a professional photo in German CVs.', 'Keep your CV to one page if possible.'],
        },
        {
          id: 4,
          title: 'Attend Career Center workshops',
          description: 'The Career Center runs CV workshops, interview preparation, and company networking events. Check the HFU events calendar.',
        },
        {
          id: 5,
          title: 'Get your internship agreement pre-approved',
          description: 'Once you have a company offer, the internship must be pre-approved by the Internship Coordinator before you sign the contract.',
        },
      ],
    },
    {
      slug: 'internship-registration',
      title: 'Internship Registration Process',
      description: 'Step-by-step guide to officially register your internship with the university.',
      category: 'internship',
      estimatedTime: '3-5 days',
      relevantSemesters: [4],
      tags: ['internship', 'registration', 'contract', 'practical-semester', 'semester-4'],
      steps: [
        {
          id: 1,
          title: 'Confirm your eligibility',
          description: 'Verify that you have completed the required 60 ECTS credits and the prerequisite modules. If unsure, ask the Study Office.',
        },
        {
          id: 2,
          title: 'Get the internship contract template',
          description: 'Download the official HFU internship agreement template from the Study Office or the documents section. Your company must sign this document.',
          links: [{ label: 'Documents Center', url: '/documents' }],
        },
        {
          id: 3,
          title: 'Have the contract signed by your company',
          description: 'Send the contract to your internship company HR department. Both the company representative and you must sign it.',
        },
        {
          id: 4,
          title: 'Submit for pre-approval',
          description: 'Submit the signed contract to the Internship Coordinator (email or in-person). They will review and stamp it.',
          tips: ['Do this at least 4 weeks before your start date to avoid delays.'],
        },
        {
          id: 5,
          title: 'Register in MIO/QIS',
          description: 'After receiving the stamped contract, register your practical semester in MIO/QIS. This officially enrolls you for the internship semester.',
          links: [{ label: 'Open MIO/QIS', url: 'https://mio.hs-furtwangen.de/' }],
        },
        {
          id: 6,
          title: 'Complete your internship',
          description: 'Complete the internship (minimum 18 weeks). Keep a weekly log or journal - this helps with the report later.',
        },
        {
          id: 7,
          title: 'Submit the internship report',
          description: 'After completing the internship, write and submit an internship report (Praktikumsbericht) and get your supervisor to fill in the evaluation form.',
          links: [{ label: 'Internship Report Template', url: '/documents' }],
        },
      ],
    },
    {
      slug: 'city-registration-anmeldung',
      title: 'City Registration (Anmeldung) in Furtwangen',
      description: 'How to register your address at the local registration office - required by German law within 14 days of moving in.',
      category: 'international',
      estimatedTime: '2-3 days',
      relevantSemesters: [1],
      tags: ['anmeldung', 'registration', 'city', 'address', 'international', 'germany'],
      steps: [
        {
          id: 1,
          title: 'Find a place to live first',
          description: 'You must have a fixed address before you can register. If you are staying in a student dormitory, you can register there. Ensure you get a written confirmation from the landlord (Wohnungsgeberbestätigung).',
        },
        {
          id: 2,
          title: 'Get the Wohnungsgeberbestätigung',
          description: 'Your landlord (or dormitory management) must fill out a "Wohnungsgeberbestätigung" (landlord confirmation form). This is required for registration. Ask them for it.',
          tips: ['Without this form, the registration office cannot process your registration.'],
        },
        {
          id: 3,
          title: 'Book an appointment at the Bürgerbüro',
          description: "Go to the Furtwangen city administration (Bürgerbüro) website or call them to book an appointment. Some offices accept walk-ins but appointments are faster.",
        },
        {
          id: 4,
          title: 'Bring your documents',
          description: 'Bring: valid passport or ID card, Wohnungsgeberbestätigung, and the completed registration form (Anmeldebescheinigung). You can download the form from the city website.',
          tips: ['Non-EU students also need their visa/residence permit.'],
        },
        {
          id: 5,
          title: 'Receive your Anmeldebestätigung',
          description: 'After registration, you will receive an official registration certificate (Anmeldebestätigung). Keep this document - you will need it for opening a bank account, applying for a health insurance card, and registering at the university.',
        },
      ],
    },
    {
      slug: 'setting-up-bank-account',
      title: 'Opening a German Bank Account',
      description: 'How to open a bank account in Germany as a student - required for receiving stipends, paying rent, and getting your semester fee refunded.',
      category: 'international',
      estimatedTime: '1-2 weeks',
      relevantSemesters: [1],
      tags: ['bank', 'banking', 'account', 'germany', 'international', 'finance'],
      steps: [
        {
          id: 1,
          title: 'Complete your city registration first',
          description: 'Most banks require your official German address registration (Anmeldebestätigung) before opening an account. Complete the Anmeldung first.',
          links: [{ label: 'City Registration Guide', url: '/guides/city-registration-anmeldung' }],
        },
        {
          id: 2,
          title: 'Choose a bank',
          description: 'For students, the most popular options are: Sparkasse (local, good service), DKB (online bank, free for students), N26 (app-based, quick to set up), or Deutsche Bank.',
          tips: ['DKB and N26 can be opened fully online and are free of charge for students.', 'Sparkasse has a physical branch in Furtwangen if you prefer in-person service.'],
        },
        {
          id: 3,
          title: 'Gather your documents',
          description: 'Typically required: valid passport, Anmeldebestätigung (city registration), enrollment certificate from HFU, and student ID. Some banks also require a Schufa check waiver for international students.',
        },
        {
          id: 4,
          title: 'Apply online or in branch',
          description: 'For online banks like DKB or N26, complete the application online and do the identity verification via VideoIdent (a video call). For Sparkasse, visit the branch in person.',
        },
        {
          id: 5,
          title: 'Wait for your card and PIN',
          description: 'After approval, your debit card and PIN will be mailed separately to your registered address. This usually takes 5-10 business days.',
        },
        {
          id: 6,
          title: 'Set up online banking',
          description: 'Once your card arrives, activate it and set up online banking. You will need this for paying your semester fee, rent, and receiving any stipends.',
        },
      ],
    },
    {
      slug: 'thesis-registration',
      title: 'Bachelor Thesis Registration',
      description: 'How to officially register your bachelor thesis topic and begin the writing period.',
      category: 'thesis',
      estimatedTime: '1 week',
      relevantSemesters: [5, 6, 7],
      tags: ['thesis', 'bachelor-thesis', 'registration', 'abschlussarbeit', 'graduation'],
      steps: [
        {
          id: 1,
          title: 'Find a first examiner (Erstbetreuer)',
          description: 'Your thesis must have a professor from HFU as your first examiner. Approach professors whose research area matches your topic idea and ask if they are willing to supervise.',
          tips: ['Approach potential supervisors early - popular professors fill their thesis slots quickly.'],
        },
        {
          id: 2,
          title: 'Define your thesis topic',
          description: 'Work with your first examiner to define a clear research topic and scope. The topic must be approved before you can officially register.',
        },
        {
          id: 3,
          title: 'Find a second examiner (Zweitkorrektor)',
          description: 'A second examiner is also required. This can be another professor at HFU or an external supervisor from a company (for company-based theses).',
        },
        {
          id: 4,
          title: 'Submit the registration form',
          description: 'Fill in the official thesis registration form with your topic, both examiners, and the proposed start date. Submit to the Exam Office.',
          links: [{ label: 'Thesis Registration Form', url: '/documents' }],
        },
        {
          id: 5,
          title: 'Receive your official start date',
          description: 'The Exam Office will confirm your registration and give you the official thesis period (typically 3-4 months). Your deadline is calculated from this start date.',
          tips: ['The thesis period cannot be extended without documented exceptional circumstances.'],
        },
        {
          id: 6,
          title: 'Begin researching and writing',
          description: 'Use the HFU library and its databases (accessible via VPN) for academic sources. Book writing rooms through the library if needed.',
          links: [{ label: 'HFU Library', url: '#' }],
        },
      ],
    },
    {
      slug: 'using-moodle-lconline',
      title: 'Using LCOnline (Moodle)',
      description: 'How to navigate Moodle, find your courses, and access lecture materials and assignments.',
      category: 'general',
      estimatedTime: '45 minutes',
      relevantSemesters: [1],
      tags: ['moodle', 'lconline', 'courses', 'materials', 'assignments', 'e-learning'],
      steps: [
        {
          id: 1,
          title: 'Log in to LCOnline',
          description: 'Go to LCOnline and log in with your HFU student credentials (same username and password as Felix).',
          links: [{ label: 'Open LCOnline', url: 'https://lconline.hs-furtwangen.de/' }],
        },
        {
          id: 2,
          title: 'Find your course rooms',
          description: 'Your professors will have created course rooms for each module. Some rooms require a self-enrollment key - your professor will provide this in the first lecture.',
          tips: ['If you cannot find a course room, check if you need to search by the exact module name or ask your professor.'],
        },
        {
          id: 3,
          title: 'Download lecture materials',
          description: 'Lecture slides, handouts, and reading materials are uploaded by professors to the course rooms. Check regularly as new materials are added throughout the semester.',
        },
        {
          id: 4,
          title: 'Submit assignments',
          description: 'Many professors use Moodle for assignment submissions. Look for "Abgabe" or "Assignment" sections in your course room. Pay attention to submission deadlines.',
          tips: ['Submit well before the deadline - late submissions may not be accepted.'],
        },
        {
          id: 5,
          title: 'Check for announcements',
          description: 'Professors post important announcements (lecture cancellations, room changes, exam info) in Moodle. Make sure email notifications from LCOnline go to your HFU email.',
        },
      ],
    },
    {
      slug: 'changing-modules',
      title: 'Changing or Selecting Modules',
      description: 'How to change your module selection at the start of a semester in Felix.',
      category: 'enrollment',
      estimatedTime: '1 hour',
      relevantSemesters: [],
      tags: ['modules', 'course-selection', 'felix', 'enrollment', 'electives'],
      steps: [
        {
          id: 1,
          title: 'Check the module selection period',
          description: 'Module selection is available for a limited window at the start of each semester. The dates are announced in Felix and via your HFU email.',
        },
        {
          id: 2,
          title: 'Review the module catalog',
          description: 'Consult the current module catalog (Modulhandbuch) to understand which modules are available, their prerequisites, and how many ECTS they award.',
        },
        {
          id: 3,
          title: 'Log in to Felix and select modules',
          description: 'Go to Felix → Meine Lehrveranstaltungen → Belegung. Select or deselect modules within the allowed window.',
          links: [{ label: 'Open Felix', url: 'https://felix.hs-furtwangen.de/dmz/' }],
        },
        {
          id: 4,
          title: 'Confirm your selections',
          description: 'After making changes, confirm your selections. You will receive an email confirmation. Check that all your intended modules appear correctly.',
        },
      ],
    },
  ]

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
