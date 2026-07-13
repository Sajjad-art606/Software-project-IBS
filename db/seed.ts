import Database from "better-sqlite3"
import { drizzle } from "drizzle-orm/better-sqlite3"
import {
  contacts,
  guides,
  documents,
  platformLinks,
  internationalInfo,
} from "./schema"
import type { GuideStep, HelpContent } from "./schema"
import { professorContacts } from "./professor-contacts"
import path from "path"

const DB_PATH = process.env.DB_PATH ?? path.join(process.cwd(), "ibs-hub.db")
const sqlite = new Database(DB_PATH)
sqlite.pragma("journal_mode = WAL")
const db = drizzle(sqlite)

async function seed() {
  console.log("🌱 Seeding database...")

  // Clear existing data
  db.delete(contacts).run()
  db.delete(guides).run()
  db.delete(documents).run()
  db.delete(platformLinks).run()
  db.delete(internationalInfo).run()

  // ─── Platform Links ───────────────────────────────────────────────
  db.insert(platformLinks)
    .values([
      {
        name: "HFU Portal (Felix)",
        shortName: "Felix",
        description:
          "Central student portal for course registration, grades, and university services.",
        url: "https://felix.hs-furtwangen.de/dmz/",
        category: "academic",
        iconName: "DashboardSquare01Icon",
        tags: ["portal", "registration", "grades"],
        sortOrder: 1,
      },
      {
        name: "Campus Management (MIO/QIS)",
        shortName: "MIO/QIS",
        description:
          "Manage your study account, view exam results, and academic records.",
        url: "https://mio.hs-furtwangen.de/",
        category: "academic",
        iconName: "File01Icon",
        tags: ["grades", "exams", "account"],
        sortOrder: 2,
      },
      {
        name: "HFU Mailbox (OWA)",
        shortName: "OWA",
        description:
          "Your official HFU email inbox - used for all university communications.",
        url: "https://mailbox.hs-furtwangen.de/",
        category: "communication",
        iconName: "Mail01Icon",
        tags: ["email", "communication", "mailbox"],
        sortOrder: 3,
      },
      {
        name: "Timetable (sPlan)",
        shortName: "sPlan",
        description: "View your weekly lecture schedule and room allocations.",
        url: "https://splan.hs-furtwangen.de/",
        category: "scheduling",
        iconName: "Calendar01Icon",
        tags: ["timetable", "schedule", "lectures", "rooms"],
        sortOrder: 4,
      },
      {
        name: "Moodle (LCOnline)",
        shortName: "LCOnline",
        description:
          "Access course materials, assignments, and learning resources.",
        url: "https://lconline.hs-furtwangen.de/",
        category: "learning",
        iconName: "Book02Icon",
        tags: ["moodle", "courses", "materials", "assignments"],
        sortOrder: 5,
      },
    ])
    .run()

  // ─── Contacts ─────────────────────────────────────────────────────
  db.insert(contacts)
    .values([
      {
        name: "Study Office (Studierendensekretariat)",
        role: "Administrative",
        department: "Student Services",
        email: "studienbuero@hs-furtwangen.de",
        phone: "+49 7723 920-0",
        officeLocation: "Building A, Room 101",
        officeHours: "Mon-Fri 9:00-12:00, Mon & Wed 14:00-16:00",
        tags: ["enrollment", "re-enrollment", "certificates", "general"],
        relevantSemesters: [],
      },
      {
        name: "International Office",
        role: "Administrative",
        department: "International Affairs",
        email: "international@hs-furtwangen.de",
        phone: "+49 7723 920-0",
        officeLocation: "Building A, Room 115",
        officeHours: "Mon-Thu 10:00-12:00",
        tags: ["visa", "accommodation", "international", "abroad"],
        relevantSemesters: [],
      },
      {
        name: "Study Program Coordinator",
        role: "Professor",
        department: "IBS Program",
        email: "ibs-coordinator@hs-furtwangen.de",
        officeLocation: "Building B, Room 210",
        officeHours: "Wed 14:00-16:00 or by appointment",
        tags: ["curriculum", "module-plan", "internship", "program"],
        relevantSemesters: [],
      },
      {
        name: "IT Support Helpdesk",
        role: "Support",
        department: "IT Services",
        email: "helpdesk@hs-furtwangen.de",
        phone: "+49 7723 920-1111",
        officeLocation: "Building C, Room 005",
        officeHours: "Mon-Fri 8:00-17:00",
        tags: [
          "email",
          "account",
          "felix",
          "moodle",
          "vpn",
          "wifi",
          "password",
        ],
        relevantSemesters: [1],
      },
      {
        name: "Library (Bibliothek HFU)",
        role: "Service",
        department: "Library Services",
        email: "bibliothek@hs-furtwangen.de",
        phone: "+49 7723 920-0",
        officeLocation: "Library Building, Ground Floor",
        officeHours: "Mon-Fri 8:00-20:00, Sat 10:00-17:00",
        tags: ["books", "loans", "study-rooms", "research", "databases"],
        relevantSemesters: [],
      },
      {
        name: "Internship Coordinator",
        role: "Administrative",
        department: "Career & Internship Office",
        email: "praktikum@hs-furtwangen.de",
        officeLocation: "Building A, Room 120",
        officeHours: "Tue & Thu 10:00-12:00",
        tags: [
          "internship",
          "placement",
          "registration",
          "contract",
          "practical-semester",
        ],
        relevantSemesters: [3, 4],
      },
      {
        name: "Exam Office (Prüfungsamt)",
        role: "Administrative",
        department: "Exam Administration",
        email: "pruefungsamt@hs-furtwangen.de",
        officeLocation: "Building A, Room 108",
        officeHours: "Mon, Wed, Fri 9:00-12:00",
        tags: ["exams", "grades", "re-exam", "deregistration", "appeals"],
        relevantSemesters: [],
      },
      {
        name: "Career Center",
        role: "Service",
        department: "Career Services",
        email: "career@hs-furtwangen.de",
        officeLocation: "Building A, Room 125",
        officeHours: "Mon-Thu 10:00-12:00, Tue 14:00-16:00",
        tags: [
          "jobs",
          "internship",
          "career",
          "cv",
          "applications",
          "companies",
        ],
        relevantSemesters: [3, 4, 5, 6],
      },
      {
        name: "Thesis Supervisor Office",
        role: "Administrative",
        department: "IBS Program",
        email: "thesis@hs-furtwangen.de",
        officeLocation: "Building B, Room 215",
        officeHours: "By appointment",
        tags: [
          "thesis",
          "research",
          "supervision",
          "bachelor-thesis",
          "registration",
        ],
        relevantSemesters: [5, 6, 7],
      },
      {
        name: "Student Council (StuV)",
        role: "Student Body",
        department: "Student Representatives",
        email: "stuv@hs-furtwangen.de",
        officeLocation: "Student Union Building",
        officeHours: "Mon, Wed, Fri 12:00-14:00",
        tags: ["events", "social", "support", "student-life", "community"],
        relevantSemesters: [],
      },
      {
        name: "AStA (Student Union)",
        role: "Student Body",
        department: "Student Union",
        email: "asta@hs-furtwangen.de",
        officeLocation: "AStA Building",
        officeHours: "Mon-Fri 11:00-14:00",
        tags: [
          "social",
          "sports",
          "discount",
          "student-card",
          "culture",
          "legal-advice",
        ],
        relevantSemesters: [],
      },
      {
        name: "Accommodation Office (Studierendenwerk)",
        role: "Service",
        department: "Student Services (Studierendenwerk)",
        email: "wohnen@swfr.de",
        phone: "+49 761 2101-0",
        officeLocation: "Studierendenwerk Freiburg office",
        officeHours: "Mon-Fri 9:00-12:00",
        tags: [
          "housing",
          "dormitory",
          "accommodation",
          "student-residence",
          "wohnheim",
        ],
        relevantSemesters: [1],
      },
      ...professorContacts,
    ])
    .run()

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
      slug: "getting-started-hfu-systems",
      title: "Getting Started with HFU Systems",
      description:
        "A semester 1 checklist covering account activation, email setup, student ID collection, city registration, and first-week university setup.",
      category: "general",
      estimatedTime: "2 hours",
      relevantSemesters: [1],
      tags: ["getting-started", "account", "setup", "first-semester"],
      steps: [
        {
          id: 1,
          title: "Activate your HFU student account",
          description:
            "After enrollment is completed, you will receive your HFU student ID and activation link by email. Use the HFU identity portal (Felix) to activate your account. This gives you access to MIO, LCOnline, your HFU email, library services, and Wi-Fi.",
          links: [
            {
              label: "Open HFU Portal (Felix)",
              url: "https://felix.hs-furtwangen.de/dmz/",
            },
          ],
        },
        {
          id: 2,
          title: "Set up your HFU email",
          description:
            "Your HFU email address is your main communication channel for lectures, exam information, semester registration, tuition, and university services. Check it regularly or forward it to a personal address if needed.",
          links: [
            {
              label: "Open HFU Mailbox",
              url: "https://mailbox.hs-furtwangen.de/",
            },
          ],
        },
        {
          id: 3,
          title: "Collect your student ID card",
          description:
            "Pick up your student ID card from the responsible university office after enrollment. It is needed for library services, cafeteria payments, printing, building access, and student identification.",
        },
        {
          id: 4,
          title: "Complete your city registration in Furtwangen",
          description:
            "After moving to Germany, register your address at the Bürgerbüro. You will need a permanent place of residence, the Wohnungsgeberbestätigung, your passport or ID, and the completed registration form. Keep the registration certificate safe because it is required for banking, insurance, and university procedures.",
        },
      ],
    },
    {
      slug: "enrollment-and-re-enrollment",
      title: "Enrollment & Re-enrollment (Rückmeldung)",
      description:
        "How to stay enrolled in the early semesters by checking deadlines, paying the contribution, and confirming your enrollment status.",
      category: "enrollment",
      estimatedTime: "30 minutes",
      relevantSemesters: [1, 2, 3],
      tags: ["enrollment", "re-enrollment", "semester-fee", "rückmeldung"],
      steps: [
        {
          id: 1,
          title: "Check the re-enrollment deadline",
          description:
            "HFU announces the official re-enrollment period before each semester. Verify the deadline through your HFU email or MIO. Missing the deadline may cause late fees or exmatriculation.",
        },
        {
          id: 2,
          title: "Pay the semester contribution",
          description:
            "Transfer the required semester contribution using the correct payment reference (Verwendungszweck). Payment instructions are provided by the university, and the correct reference ensures your payment reaches your student account.",
        },
        {
          id: 3,
          title: "Verify your enrollment status",
          description:
            "After the payment is processed, log in to MIO/QIS and check that your enrollment has been renewed successfully. Download your updated enrollment certificate (Immatrikulationsbescheinigung).",
          links: [
            { label: "Open MIO/QIS", url: "https://mio.hs-furtwangen.de/" },
          ],
        },
        {
          id: 4,
          title: "Validate your student ID card",
          description:
            "Update your student ID card at one of the validation terminals on campus so it remains valid for the new semester.",
        },
      ],
    },
    {
      slug: "exam-registration",
      title: "Registering for Exams",
      description:
        "How to register and deregister for examinations during the official examination registration period in the relevant exam semesters.",
      category: "exams",
      estimatedTime: "20 minutes",
      relevantSemesters: [1, 2, 3, 5, 6],
      tags: ["exams", "registration", "mio", "qis", "deregistration"],
      steps: [
        {
          id: 1,
          title: "Check the examination registration period",
          description:
            "HFU publishes the official examination registration period before each examination phase. Check your HFU email, MIO, or the university website for the exact registration and deregistration deadlines.",
        },
        {
          id: 2,
          title: "Verify your registrations",
          description:
            "After registering, review the list of registered examinations in MIO. Check that the correct modules and examination types are displayed.",
          links: [
            { label: "Open MIO/QIS", url: "https://mio.hs-furtwangen.de/" },
          ],
        },
        {
          id: 3,
          title: "Deregister if necessary",
          description:
            "If you decide not to take an examination, deregister within the official deregistration period. After the deadline, withdrawal is only possible according to the university examination regulations, for example due to illness with the required documentation.",
          tips: ["Missing an examination without an accepted reason is treated according to the relevant examination regulations."],
        },
      ],
    },
    {
      slug: "internship-preparation",
      title: "Preparing for Your Practical Semester",
      description:
        "What to do in Semester 3 to prepare for your practical semester (internship) in Semester 4.",
      category: "internship",
      estimatedTime: "1-2 weeks",
      relevantSemesters: [3],
      tags: [
        "internship",
        "practical-semester",
        "career",
        "preparation",
        "semester-3",
      ],
      steps: [
        {
          id: 1,
          title: "Understand the requirements",
          description:
            "The practical semester is a mandatory 18-22 week internship at a company. You must have completed at least 60 ECTS credits and passed specific modules before you can start.",
          tips: [
            "Check with the Study Program Coordinator for the exact prerequisites.",
          ],
        },
        {
          id: 2,
          title: "Start your company search early",
          description:
            "Start looking for internship positions at least 6 months before your intended start date. Use the HFU Career Center database, LinkedIn, and XING.",
          links: [{ label: "HFU Career Center", url: "#" }],
          tips: [
            "Many students start their search in Semester 2. Companies often have long hiring processes.",
          ],
        },
        {
          id: 3,
          title: "Prepare your application documents",
          description:
            "A German CV (Lebenslauf) is formatted differently from other countries. Visit the Career Center for CV and cover letter review sessions.",
          tips: [
            "Include a professional photo in German CVs.",
            "Keep your CV to one page if possible.",
          ],
        },
        {
          id: 4,
          title: "Attend Career Center workshops",
          description:
            "The Career Center runs CV workshops, interview preparation, and company networking events. Check the HFU events calendar.",
        },
        {
          id: 5,
          title: "Get your internship agreement pre-approved",
          description:
            "Once you have a company offer, the internship must be pre-approved by the Internship Coordinator before you sign the contract.",
        },
      ],
    },
    {
      slug: "internship-registration",
      title: "Internship Registration Process",
      description:
        "Step-by-step guide to officially register your internship with the university in Semester 4 or 5.",
      category: "internship",
      estimatedTime: "3-5 days",
      relevantSemesters: [4, 5],
      tags: [
        "internship",
        "registration",
        "contract",
        "practical-semester",
        "semester-4",
      ],
      steps: [
        {
          id: 1,
          title: "Confirm your eligibility",
          description:
            "Verify that you have completed the required 60 ECTS credits and the prerequisite modules. If unsure, ask the Study Office.",
        },
        {
          id: 2,
          title: "Get the internship contract template",
          description:
            "Download the official HFU internship agreement template from the Study Office or the documents section. Your company must sign this document.",
          links: [{ label: "Documents Center", url: "/documents" }],
        },
        {
          id: 3,
          title: "Have the contract signed by your company",
          description:
            "Send the contract to your internship company HR department. Both the company representative and you must sign it.",
        },
        {
          id: 4,
          title: "Submit for pre-approval",
          description:
            "Submit the signed contract to the Internship Coordinator (email or in-person). They will review and stamp it.",
          tips: [
            "Do this at least 4 weeks before your start date to avoid delays.",
          ],
        },
        {
          id: 5,
          title: "Register in MIO/QIS",
          description:
            "After receiving the stamped contract, register your practical semester in MIO/QIS. This officially enrolls you for the internship semester.",
          links: [
            { label: "Open MIO/QIS", url: "https://mio.hs-furtwangen.de/" },
          ],
        },
        {
          id: 6,
          title: "Complete your internship",
          description:
            "Complete the internship (minimum 18 weeks). Keep a weekly log or journal - this helps with the report later.",
        },
        {
          id: 7,
          title: "Submit the internship report",
          description:
            "After completing the internship, write and submit an internship report (Praktikumsbericht) and get your supervisor to fill in the evaluation form.",
          links: [{ label: "Internship Report Template", url: "/documents" }],
        },
      ],
    },
    {
      slug: "city-registration-anmeldung",
      title: "City Registration (Anmeldung) in Furtwangen",
      description:
        "How to register your address at the local registration office - required by German law within 14 days of moving in.",
      category: "international",
      estimatedTime: "2-3 days",
      relevantSemesters: [1],
      tags: [
        "anmeldung",
        "registration",
        "city",
        "address",
        "international",
        "germany",
      ],
      steps: [
        {
          id: 1,
          title: "Find a place to live first",
          description:
            "You must have a fixed address before you can register. If you are staying in a student dormitory, you can register there. Ensure you get a written confirmation from the landlord (Wohnungsgeberbestätigung).",
        },
        {
          id: 2,
          title: "Get the Wohnungsgeberbestätigung",
          description:
            'Your landlord (or dormitory management) must fill out a "Wohnungsgeberbestätigung" (landlord confirmation form). This is required for registration. Ask them for it.',
          tips: [
            "Without this form, the registration office cannot process your registration.",
          ],
        },
        {
          id: 3,
          title: "Book an appointment at the Bürgerbüro",
          description:
            "Go to the Furtwangen city administration (Bürgerbüro) website or call them to book an appointment. Some offices accept walk-ins but appointments are faster.",
        },
        {
          id: 4,
          title: "Bring your documents",
          description:
            "Bring: valid passport or ID card, Wohnungsgeberbestätigung, and the completed registration form (Anmeldebescheinigung). You can download the form from the city website.",
          tips: ["Non-EU students also need their visa/residence permit."],
        },
        {
          id: 5,
          title: "Receive your Anmeldebestätigung",
          description:
            "After registration, you will receive an official registration certificate (Anmeldebestätigung). Keep this document - you will need it for opening a bank account, applying for a health insurance card, and registering at the university.",
        },
      ],
    },
    {
      slug: "setting-up-bank-account",
      title: "Opening a German Bank Account",
      description:
        "How to open a bank account in Germany as a student - required for receiving stipends, paying rent, and getting your semester fee refunded.",
      category: "international",
      estimatedTime: "1-2 weeks",
      relevantSemesters: [1],
      tags: [
        "bank",
        "banking",
        "account",
        "germany",
        "international",
        "finance",
      ],
      steps: [
        {
          id: 1,
          title: "Complete your city registration first",
          description:
            "Most banks require your official German address registration (Anmeldebestätigung) before opening an account. Complete the Anmeldung first.",
          links: [
            {
              label: "City Registration Guide",
              url: "/guides/city-registration-anmeldung",
            },
          ],
        },
        {
          id: 2,
          title: "Choose a bank",
          description:
            "For students, the most popular options are: Sparkasse (local, good service), DKB (online bank, free for students), N26 (app-based, quick to set up), or Deutsche Bank.",
          tips: [
            "DKB and N26 can be opened fully online and are free of charge for students.",
            "Sparkasse has a physical branch in Furtwangen if you prefer in-person service.",
          ],
        },
        {
          id: 3,
          title: "Gather your documents",
          description:
            "Typically required: valid passport, Anmeldebestätigung (city registration), enrollment certificate from HFU, and student ID. Some banks also require a Schufa check waiver for international students.",
        },
        {
          id: 4,
          title: "Apply online or in branch",
          description:
            "For online banks like DKB or N26, complete the application online and do the identity verification via VideoIdent (a video call). For Sparkasse, visit the branch in person.",
        },
        {
          id: 5,
          title: "Wait for your card and PIN",
          description:
            "After approval, your debit card and PIN will be mailed separately to your registered address. This usually takes 5-10 business days.",
        },
        {
          id: 6,
          title: "Set up online banking",
          description:
            "Once your card arrives, activate it and set up online banking. You will need this for paying your semester fee, rent, and receiving any stipends.",
        },
      ],
    },
    {
      slug: "thesis-registration",
      title: "Bachelor Thesis Registration",
      description:
        "How to officially register your bachelor thesis topic and begin the writing period in Semester 6 or 7.",
      category: "thesis",
      estimatedTime: "1 week",
      relevantSemesters: [6, 7],
      tags: [
        "thesis",
        "bachelor-thesis",
        "registration",
        "abschlussarbeit",
        "graduation",
      ],
      steps: [
        {
          id: 1,
          title: "Find a first examiner (Erstbetreuer)",
          description:
            "Your thesis must have a professor from HFU as your first examiner. Approach professors whose research area matches your topic idea and ask if they are willing to supervise.",
          tips: [
            "Approach potential supervisors early - popular professors fill their thesis slots quickly.",
          ],
        },
        {
          id: 2,
          title: "Define your thesis topic",
          description:
            "Work with your first examiner to define a clear research topic and scope. The topic must be approved before you can officially register.",
        },
        {
          id: 3,
          title: "Find a second examiner (Zweitkorrektor)",
          description:
            "A second examiner is also required. This can be another professor at HFU or an external supervisor from a company (for company-based theses).",
        },
        {
          id: 4,
          title: "Submit the registration form",
          description:
            "Fill in the official thesis registration form with your topic, both examiners, and the proposed start date. Submit to the Exam Office.",
          links: [{ label: "Thesis Registration Form", url: "/documents" }],
        },
        {
          id: 5,
          title: "Receive your official start date",
          description:
            "The Exam Office will confirm your registration and give you the official thesis period (typically 3-4 months). Your deadline is calculated from this start date.",
          tips: [
            "The thesis period cannot be extended without documented exceptional circumstances.",
          ],
        },
        {
          id: 6,
          title: "Begin researching and writing",
          description:
            "Use the HFU library and its databases (accessible via VPN) for academic sources. Book writing rooms through the library if needed.",
          links: [{ label: "HFU Library", url: "#" }],
        },
      ],
    },
    {
      slug: "using-moodle-lconline",
      title: "Using LCOnline (Moodle)",
      description:
        "How to use LCOnline during the early semesters for course rooms, materials, announcements, and timetable updates.",
      category: "general",
      estimatedTime: "45 minutes",
      relevantSemesters: [1, 2, 3],
      tags: [
        "moodle",
        "lconline",
        "courses",
        "materials",
        "assignments",
        "e-learning",
      ],
      steps: [
        {
          id: 1,
          title: "Log in to LCOnline",
          description:
            "Use your HFU credentials to access LCOnline. Each lecturer creates course rooms where lecture slides, assignments, announcements, quizzes, and other learning materials are published.",
          links: [
            {
              label: "Open LCOnline",
              url: "https://lconline.hs-furtwangen.de/",
            },
          ],
        },
        {
          id: 2,
          title: "Download lecture materials",
          description:
            "Lecture slides, assignments, reading materials, and additional resources are uploaded regularly. Download or review the newest files before every lecture.",
        },
        {
          id: 3,
          title: "Check announcements and timetable",
          description:
            "Lecturers publish important updates about cancellations, room changes, exam information, and assignment changes. Check LCOnline frequently and review your timetable on sPlan before the semester begins.",
          links: [{ label: "Open sPlan", url: "https://splan.hs-furtwangen.de/" }],
        },
      ],
    },
  ]

  for (const guide of guideData) {
    db.insert(guides)
      .values([
        {
          slug: guide.slug,
          title: guide.title,
          description: guide.description,
          category: guide.category,
          steps: guide.steps,
          tags: guide.tags,
          relevantSemesters: guide.relevantSemesters,
          estimatedTime: guide.estimatedTime,
        },
      ])
      .run()
  }

  // ─── Documents ────────────────────────────────────────────────────
  db.insert(documents)
    .values([
      {
        title: "Student Enrollment Certificate",
        description:
          "Download your official enrollment certificate (Immatrikulationsbescheinigung) from MIO/QIS.",
        fileUrl: "https://mio.hs-furtwangen.de/",
        category: "forms",
        fileType: "link",
        tags: ["enrollment", "certificate", "proof"],
        relevantSemesters: [],
      },
      {
        title: "Academic Regulations (SPO)",
        description:
          "The official study and examination regulations (Studien- und Prüfungsordnung) for the IBS program.",
        fileUrl:
          "/documents/ExaminationRulesAboutTheDurationOfInternship_251028_115338.pdf",
        category: "regulations",
        fileType: "pdf",
        tags: ["regulations", "spo", "rules", "exams", "modules"],
        relevantSemesters: [],
      },
      {
        title: "Housing Application (Studierendenwerk)",
        description:
          "Apply for a student dormitory room via the Studierendenwerk Freiburg.",
        fileUrl: "https://www.swfr.de/",
        category: "forms",
        fileType: "link",
        tags: ["housing", "dormitory", "accommodation", "studierendenwerk"],
        relevantSemesters: [1],
      },
      {
        title: "Student Exmatriculation document",
        description: "Official document for deregistering from the university.",
        fileUrl: "/documents/Antrag_auf_Exmatrikulation_englisch.pdf",
        category: "forms",
        fileType: "pdf",
        tags: ["exmatriculation", "deregistration", "withdrawal"],
        relevantSemesters: [1, 2, 3, 4, 5, 6, 7],
      },
      {
        title: "German language course flyer",
        description:
          "Information about German language courses offered for international students.",
        fileUrl: "/documents/SLC_Flyer_SoSe2026_de_en.pdf",
        category: "info-sheets",
        fileType: "pdf",
        tags: [
          "german-language",
          "courses",
          "international",
          "language-learning",
        ],
        relevantSemesters: [1, 2, 3, 4, 5, 6, 7],
      },
      {
        title: "IBS Internship checklist",
        description:
          "A checklist to help you prepare for and complete your practical semester internship successfully.",
        fileUrl:
          "/documents/IBS_Internship_Semester_Checklist_Procedure_Notes_101024.pdf",
        category: "checklists",
        fileType: "pdf",
        tags: ["international", "checklist", "guides", "steps"],
        relevantSemesters: [3, 4],
      },
      {
        title: "Elective registration form",
        description:
          "Form to register for elective modules at the start of each semester.",
        fileUrl: "/documents/IBS_Electives_Registration_Form (1).pdf",
        category: "forms",
        fileType: "pdf",
        tags: ["electives", "modules", "registration", "course-selection"],
        relevantSemesters: [5, 6, 7],
      },
      {
        title: "Credit Transfer form",
        description:
          "Form to request recognition of prior learning or transfer of credits from other institutions.",
        fileUrl: "/documents/IBS_CREDIT_Transfer_Form.pdf",
        category: "forms",
        fileType: "pdf",
        tags: [
          "credit-transfer",
          "prior-learning",
          "recognition",
          "transfer",
          "credits",
        ],
        relevantSemesters: [1, 2, 3, 4, 5, 6, 7],
      },
      {
        title: "Professors profile list",
        description:
          "List of professors in the IBS program with their contact information and research areas.",
        fileUrl: "/documents/ProfessorInnen_Profil.pdf",
        category: "info-sheets",
        fileType: "pdf",
        tags: ["professors", "faculty", "research", "contacts"],
        relevantSemesters: [4, 5, 6, 7],
      },
      {
        title: "Thesis templates",
        description:
          "Templates for formatting your bachelor thesis according to HFU guidelines.",
        fileUrl: "/documents/Thesis_Titelblatt_BCM.doc",
        category: "templates",
        fileType: "docx",
        tags: ["thesis", "templates", "formating", "bachelors-thesis"],
        relevantSemesters: [5, 6, 7],
      },
      {
        title: "Thesis extension requests form",
        description:
          "Form to request an extension for your thesis submission deadline.",
        fileUrl:
          "/documents/Antrag_auf_Verlaengerung_einer_Thesis__englisch_new_1.pdf",
        category: "forms",
        fileType: "pdf",
        tags: ["thesis", "extension", "deadline", "request"],
        relevantSemesters: [5, 6, 7],
      },
      {
        title: "IBS curriculum overview",
        description:
          "Overview of the IBS program curriculum, including modules, ECTS credits, and semester structure.",
        fileUrl: "/documents/IBS CUrriculum.pdf",
        fileType: "pdf",
        category: "info-sheets",
        tags: [
          "curriculum",
          "overview",
          "modules",
          "ects",
          "semester-structure",
        ],
        relevantSemesters: [1, 2, 3, 4, 5, 6, 7],
      },
    ])
    .run()

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
      slug: "anmeldung-city-registration",
      title: "City Registration (Anmeldung) in Furtwangen",
      category: "registration",
      description:
        "Step-by-step guide to registering your address in Germany - required by law within 14 days of moving in.",
      tags: ["anmeldung", "registration", "address", "germany"],
      sortOrder: 1,
      content: {
        steps: [
          {
            id: 1,
            title: "Get a confirmed address",
            description:
              "You must have a fixed address (dormitory or private) before registering. Your landlord must provide a Wohnungsgeberbestätigung.",
          },
          {
            id: 2,
            title: "Download the registration form",
            description:
              "Get the Anmeldeformular from the Furtwangen city website or pick it up at the Bürgerbüro.",
          },
          {
            id: 3,
            title: "Book an appointment",
            description:
              "Book online at the Furtwangen Bürgerbüro or call to get an appointment. Some days accept walk-ins.",
          },
          {
            id: 4,
            title: "Attend the appointment",
            description:
              "Bring: passport, completed form, Wohnungsgeberbestätigung, and for non-EU students: visa/residence permit.",
          },
          {
            id: 5,
            title: "Receive your Anmeldebestätigung",
            description:
              "You will receive the registration confirmation on the spot. Keep it - you need it for the bank, insurance, and university.",
          },
        ],
        tips: [
          "Register within 14 days of moving in to avoid fines.",
          "If you move dormitories later, you must update your registration.",
        ],
      },
    },
    {
      slug: "opening-bank-account",
      title: "Opening a German Bank Account as a Student",
      category: "banking",
      description:
        "Everything you need to know about getting a German bank account - from choosing a bank to making your first transfer.",
      tags: ["bank", "banking", "account", "germany", "finance"],
      sortOrder: 2,
      content: {
        steps: [
          {
            id: 1,
            title: "Complete city registration first",
            description:
              "Banks require your Anmeldebestätigung. Complete your Anmeldung before applying for a bank account.",
          },
          {
            id: 2,
            title: "Choose a bank",
            description:
              "Popular options: DKB (online, free), N26 (app-based, free), Sparkasse (local branches in Furtwangen).",
            links: [
              { label: "DKB Student Account", url: "https://www.dkb.de/" },
              { label: "N26 Bank", url: "https://n26.com/" },
            ],
          },
          {
            id: 3,
            title: "Prepare documents",
            description:
              "Typically needed: passport, Anmeldebestätigung, HFU enrollment certificate, student ID.",
          },
          {
            id: 4,
            title: "Apply and verify identity",
            description:
              "Online banks use VideoIdent for identity verification. Sparkasse requires an in-person visit.",
          },
          {
            id: 5,
            title: "Wait for your card",
            description:
              "Card and PIN arrive separately by post within 5-10 business days.",
          },
        ],
        tips: [
          "DKB offers a free credit card alongside the account, useful for travel.",
          "Set up online banking immediately - you will need it to pay your semester fee.",
        ],
      },
    },
    {
      slug: "finding-accommodation",
      title: "Finding Student Accommodation",
      category: "housing",
      description:
        "Options for student housing in and around Furtwangen - from dormitories to private rentals.",
      tags: ["housing", "dormitory", "accommodation", "wohnheim", "rental"],
      sortOrder: 3,
      content: {
        steps: [
          {
            id: 1,
            title: "Apply for a dormitory (Wohnheim)",
            description:
              "The Studierendenwerk manages student dormitories. Apply as early as possible - demand is high.",
            links: [
              { label: "Studierendenwerk Wohnen", url: "https://www.swfr.de/" },
            ],
          },
          {
            id: 2,
            title: "Search private rentals",
            description:
              "Use WG-Gesucht.de (shared apartments), ImmobilienScout24, or the HFU notice boards for private rooms and flats.",
            links: [
              { label: "WG-Gesucht.de", url: "https://www.wg-gesucht.de/" },
            ],
          },
          {
            id: 3,
            title: "Prepare your rental application",
            description:
              "Landlords typically require: SCHUFA credit report (get a free copy once a year), proof of income or scholarship, and a copy of your student ID.",
          },
          {
            id: 4,
            title: "Sign your rental contract",
            description:
              "Read the Mietvertrag carefully. Check the notice period (Kündigungsfrist) - typically 3 months.",
          },
        ],
        tips: [
          "Start your housing search 3-4 months before moving to Germany.",
          "Join the HFU international student Facebook groups to find roommates and housing tips.",
        ],
      },
    },
    {
      slug: "health-insurance-germany",
      title: "Health Insurance as a Student in Germany",
      category: "insurance",
      description:
        "Health insurance is mandatory in Germany. Here is how to get covered as an international student.",
      tags: [
        "health-insurance",
        "insurance",
        "krankenversicherung",
        "international",
      ],
      sortOrder: 4,
      content: {
        steps: [
          {
            id: 1,
            title: "Understand your options",
            description:
              "EU students may use their European Health Insurance Card (EHIC). Non-EU students must get German statutory (gesetzliche) or private health insurance.",
          },
          {
            id: 2,
            title: "Choose a health insurance provider",
            description:
              "Major statutory insurers for students: TK (Techniker Krankenkasse), AOK, Barmer, DAK. Student premiums are subsidized (approx. €120/month in 2024).",
            links: [
              {
                label: "TK for International Students",
                url: "https://www.tk.de/en",
              },
            ],
          },
          {
            id: 3,
            title: "Apply for insurance",
            description:
              "Apply online or at a local office of your chosen insurer. You will need your passport, enrollment certificate, and German address.",
          },
          {
            id: 4,
            title: "Get your insurance certificate",
            description:
              "After enrolling, your insurer provides a certificate (Mitgliedsbescheinigung). Submit this to the HFU Study Office as proof of insurance.",
          },
          {
            id: 5,
            title: "Get your insurance card",
            description:
              "Your electronic health insurance card (eGK) arrives by post. Present this card to any doctor or pharmacy in Germany.",
          },
        ],
        tips: [
          "Choose TK - they have English-speaking customer service and an excellent app.",
          "Health insurance must be proved before you can enroll at HFU.",
        ],
      },
    },
    {
      slug: "residence-permit-aufenthaltstitel",
      title: "Residence Permit & Visa Extension",
      category: "visa",
      description:
        "For non-EU students: how to apply for or extend your residence permit (Aufenthaltstitel) in Germany.",
      tags: [
        "visa",
        "residence-permit",
        "aufenthaltstitel",
        "immigration",
        "non-eu",
      ],
      sortOrder: 5,
      content: {
        steps: [
          {
            id: 1,
            title: "Check your current visa",
            description:
              "If you entered on a student visa (Visum zu Studienzwecken), you must convert it to a residence permit before it expires - typically within 90 days of arrival.",
          },
          {
            id: 2,
            title: "Contact the Ausländerbehörde",
            description:
              "The immigration office (Ausländerbehörde) for Furtwangen is located in Villingen-Schwenningen or Rottweil. Contact them or book an appointment online.",
          },
          {
            id: 3,
            title: "Prepare your documents",
            description:
              "Required: passport, biometric photo, proof of enrollment, proof of financial means (blocked account or scholarship), health insurance certificate, city registration (Anmeldebestätigung), and rental contract.",
          },
          {
            id: 4,
            title: "Attend your appointment",
            description:
              "Bring all original documents and copies. The residence permit is usually issued for 1-2 years and can be extended.",
          },
          {
            id: 5,
            title: "Receive your Aufenthaltstitel",
            description:
              "The residence permit card is issued 4-8 weeks after your appointment. You will receive a pickup notification.",
          },
        ],
        tips: [
          "Contact the International Office early - they can advise on your specific situation.",
          "Start the process 2 months before your current visa expires.",
        ],
        relatedContactIds: [2],
      },
    },
    {
      slug: "campus-welcome-checklist",
      title: "Your First Week on Campus - Checklist",
      category: "general",
      description:
        "A comprehensive checklist of everything you should do in your first week at HFU Furtwangen.",
      tags: [
        "first-week",
        "checklist",
        "getting-started",
        "campus",
        "new-student",
      ],
      sortOrder: 6,
      content: {
        steps: [
          {
            id: 1,
            title: "Attend the orientation week (Orientierungswoche)",
            description:
              "HFU runs an orientation week (O-Woche) at the start of each winter semester. Attend all sessions - you will get your student ID, learn about systems, and meet fellow students.",
          },
          {
            id: 2,
            title: "Set up all HFU digital accounts",
            description:
              'Activate Felix, HFU email (OWA), LCOnline, and MIO/QIS accounts. See the "Getting Started with HFU Systems" guide.',
            links: [
              {
                label: "Getting Started Guide",
                url: "/guides/getting-started-hfu-systems",
              },
            ],
          },
          {
            id: 3,
            title: "Complete city registration (Anmeldung)",
            description:
              "Visit the Furtwangen Bürgerbüro within 14 days of moving in to register your address.",
          },
          {
            id: 4,
            title: "Open a German bank account",
            description:
              "Start the process early - it takes 1-2 weeks. You need the Anmeldebestätigung first.",
          },
          {
            id: 5,
            title: "Get your student ID card",
            description:
              "Collect your physical student ID from the Study Office. Bring your passport and enrollment certificate.",
          },
          {
            id: 6,
            title: "Explore the campus and city",
            description:
              "Furtwangen is a small, friendly town in the Black Forest. Find the library, canteen (Mensa), sports facilities, and local shops. Pick up a student discount card from AStA.",
          },
        ],
        tips: [
          "Join the HFU international student WhatsApp group for news and events.",
          "The Mensa (canteen) is the cheapest and most convenient lunch option on campus.",
        ],
      },
    },
  ]

  for (const info of helpData) {
    db.insert(internationalInfo)
      .values([
        {
          slug: info.slug,
          title: info.title,
          category: info.category,
          description: info.description,
          content: info.content,
          tags: info.tags,
          sortOrder: info.sortOrder,
        },
      ])
      .run()
  }

  console.log("✅ Database seeded successfully!")
  console.log("   Platform links:", 5)
  console.log("   Contacts:", 12 + professorContacts.length)
  console.log("   Guides:", guideData.length)
  console.log("   Documents:", 12)
  console.log("   International info topics:", helpData.length)
  sqlite.close()
}

seed().catch(console.error)
