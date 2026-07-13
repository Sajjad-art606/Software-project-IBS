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
    ...professorContacts,
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
      slug: "semester-1-getting-started-hfu-systems",
      title: "Semester 1",
      description: "Getting Started with HFU Systems",
      category: "semester",
      estimatedTime: "Semester 1",
      relevantSemesters: [1],
      tags: ["semester-1"],
      steps: [
        {
          id: 1,
          title: "Activate your HFU student account",
          description:
            "After your enrollment is completed, you will receive your HFU student ID and an activation link via email. Activate your account through the HFU identity management portal (Felix). This account gives you access to all university systems, including MIO, LCOnline, HFU email, library services, and Wi-Fi.",
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
            "Your official university email address is your primary communication channel with HFU. All announcements regarding lectures, examinations, semester registration, tuition fees, and university services are sent to this mailbox. Check your email regularly or forward it to your personal email account if desired.",
          links: [
            { label: "Open HFU Mailbox", url: "https://mailbox.hs-furtwangen.de/owa/#path=/mail" },
          ],
        },
        {
          id: 3,
          title: "Collect your student ID card",
          description:
            "After enrollment, collect your student ID card from the responsible university office. The card is required for library services, cafeteria payments, printing, building access, and student identification.",
        },
        {
          id: 4,
          title: "City Registration (Anmeldung) in Furtwangen",
          description:
            "Register your address with the local registration office (Bürgerbüro) after moving to Germany. City registration is required by law and is necessary for opening a bank account, obtaining health insurance, and completing many administrative procedures.",
        },
        {
          id: 5,
          title: "Step 1 – Secure your accommodation",
          description:
            "Before registering your address, you must have a permanent place of residence in Germany. This may be a student dormitory, private apartment, or shared accommodation.",
        },
        {
          id: 6,
          title: "Step 2 – Obtain the Wohnungsgeberbestätigung",
          description:
            "Ask your landlord or accommodation provider for the Wohnungsgeberbestätigung (landlord confirmation form). This document is legally required for city registration.",
          tips: [
            "The registration office cannot complete your registration without this document.",
          ],
        },
        {
          id: 7,
          title: "Step 3 – Book an appointment",
          description:
            "Schedule an appointment with the Bürgerbüro (Residents' Registration Office). Some offices accept walk-ins, but appointments are usually faster and guarantee service.",
        },
        {
          id: 8,
          title: "Step 4 – Bring the required documents",
          description:
            "Take the following documents to your appointment:\n• Valid passport or national ID\n• Wohnungsgeberbestätigung\n• Completed registration form (Anmeldeformular)\n• Residence permit or visa (if applicable)",
          tips: [
            "Non-EU students should also bring their residence permit or visa documents.",
          ],
        },
        {
          id: 9,
          title: "Step 5 – Receive your registration certificate",
          description:
            "After completing the registration, you will receive your Anmeldebestätigung (registration certificate). Keep this document carefully because it is required for opening a bank account, obtaining health insurance, and completing many university and government procedures.",
        },
        {
          id: 10,
          title: "Log in to LCOnline",
          description:
            "Use your HFU credentials to access LCOnline. Each lecturer creates course rooms where lecture slides, assignments, announcements, quizzes, and additional learning materials are published.",
          links: [
            { label: "Open LCOnline", url: "https://lconline.hs-furtwangen.de/login/index.php?loginredirect=1" },
          ],
        },
        {
          id: 11,
          title: "Download lecture materials",
          description:
            "Lecture slides, assignments, reading materials, and additional resources are uploaded regularly. Download or review the newest files before every lecture.",
        },
        {
          id: 12,
          title: "Check announcements",
          description:
            "Lecturers regularly publish announcements about lecture cancellations, room changes, examination information, assignment updates, and other important notices. Check LC Online frequently and enable email notifications if available.",
        },
        {
          id: 13,
          title: "Check your timetable",
          description:
            "View your current timetable using sPlan or the timetable published for your study programme. Check lecture times, room numbers, online sessions, and possible timetable changes before the semester begins.",
          links: [
            { label: "Open sPlan", url: "https://splan.hs-furtwangen.de/starplan/mobile?lan=de&acc=true&act=tt&sel=pg&pu=6&sd=false&loc=4&sa=false&cb=o" },
          ],
        },
        {
          id: 14,
          title: "Enrollment",
          description:
            "Complete your semester re-enrollment by paying the semester contribution before the official deadline to remain enrolled at Hochschule Furtwangen University.",
        },
        {
          id: 15,
          title: "Check the re-enrollment deadline",
          description:
            "HFU announces the official re-enrollment period before each semester. Verify the deadline through your HFU email or MIO.",
          tips: ["Missing the deadline may result in late fees or exmatriculation."],
        },
        {
          id: 16,
          title: "Pay the semester contribution",
          description:
            "Transfer the required semester contribution using the correct payment reference (Verwendungszweck). Payment instructions are provided by the university.",
          tips: [
            "Use the correct reference number to ensure your payment is assigned to your student account.",
          ],
        },
        {
          id: 17,
          title: "Verify your enrollment status",
          description:
            "After your payment has been processed, log in to MIO/QIS and check that your enrollment has been renewed successfully. Download your updated enrollment certificate (Immatrikulationsbescheinigung).",
          links: [{ label: "Open MIO/QIS", url: "https://mio.hs-furtwangen.de/qisserver/pages/cs/sys/portal/hisinoneStartPage.faces" }],
        },
        {
          id: 18,
          title: "Validate your student ID card",
          description:
            "Update your student ID card at one of the validation terminals on campus so it remains valid for the new semester.",
        },
        {
          id: 19,
          title: "Registering for Exams",
          description:
            "How to register and deregister for examinations during the official examination registration period.",
        },
        {
          id: 20,
          title: "Check the examination registration period",
          description:
            "HFU publishes the official examination registration period before each examination phase. Check your HFU email, MIO, or the university website for the exact registration and deregistration deadlines.",
        },
        {
          id: 21,
          title: "Verify your registrations",
          description:
            "After registering, review the list of registered examinations in MIO. Check that the correct modules and examination types are displayed.",
        },
        {
          id: 22,
          title: "Deregister if necessary",
          description:
            "If you decide not to take an examination, deregister within the official deregistration period. After the deadline, withdrawal is only possible according to the university examination regulations (for example, due to illness with the required documentation).",
          tips: [
            "Missing an examination without an accepted reason is treated according to the applicable examination regulations.",
          ],
        },
      ],
    },
    {
      slug: "semester-2",
      title: "2nd semester",
      description: "2nd semester",
      category: "semester",
      estimatedTime: "2nd semester",
      relevantSemesters: [2],
      tags: ["semester-2"],
      steps: [
        {
          id: 1,
          title: "Log in to LCOnline",
          description:
            "Use your HFU credentials to access LCOnline. Each lecturer creates course rooms where lecture slides, assignments, announcements, quizzes, and additional learning materials are published.",
          links: [
            { label: "Open LCOnline", url: "https://lconline.hs-furtwangen.de/login/index.php?loginredirect=1" },
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
          title: "Check announcements",
          description:
            "Lecturers regularly publish announcements about lecture cancellations, room changes, examination information, assignment updates, and other important notices. Check LC Online frequently and enable email notifications if available.",
        },
        {
          id: 4,
          title: "Check your timetable",
          description:
            "View your current timetable using sPlan or the timetable published for your study programme. Check lecture times, room numbers, online sessions, and possible timetable changes before the semester begins.",
          links: [
            { label: "Open sPlan", url: "https://splan.hs-furtwangen.de/starplan/mobile?lan=de&acc=true&act=tt&sel=pg&pu=6&sd=false&loc=4&sa=false&cb=o" },
          ],
        },
        {
          id: 5,
          title: "Enrollment",
          description:
            "Complete your semester re-enrollment by paying the semester contribution before the official deadline to remain enrolled at Hochschule Furtwangen University.",
        },
        {
          id: 6,
          title: "Check the re-enrollment deadline",
          description:
            "HFU announces the official re-enrollment period before each semester. Verify the deadline through your HFU email or MIO.",
          tips: ["Missing the deadline may result in late fees or exmatriculation."],
        },
        {
          id: 7,
          title: "Pay the semester contribution",
          description:
            "Transfer the required semester contribution using the correct payment reference (Verwendungszweck). Payment instructions are provided by the university.",
          tips: [
            "Use the correct reference number to ensure your payment is assigned to your student account.",
          ],
        },
        {
          id: 8,
          title: "Verify your enrollment status",
          description:
            "After your payment has been processed, log in to MIO/QIS and check that your enrollment has been renewed successfully. Download your updated enrollment certificate (Immatrikulationsbescheinigung).",
          links: [{ label: "Open MIO/QIS", url: "https://mio.hs-furtwangen.de/qisserver/pages/cs/sys/portal/hisinoneStartPage.faces" }],
        },
        {
          id: 9,
          title: "Validate your student ID card",
          description:
            "Update your student ID card at one of the validation terminals on campus so it remains valid for the new semester.",
        },
        {
          id: 10,
          title: "Registering for Exams",
          description:
            "How to register and deregister for examinations during the official examination registration period.",
        },
        {
          id: 11,
          title: "Check the examination registration period",
          description:
            "HFU publishes the official examination registration period before each examination phase. Check your HFU email, MIO, or the university website for the exact registration and deregistration deadlines.",
        },
        {
          id: 12,
          title: "Verify your registrations",
          description:
            "After registering, review the list of registered examinations in MIO. Check that the correct modules and examination types are displayed.",
        },
        {
          id: 13,
          title: "Deregister if necessary",
          description:
            "If you decide not to take an examination, deregister within the official deregistration period. After the deadline, withdrawal is only possible according to the university examination regulations (for example, due to illness with the required documentation).",
          tips: [
            "Missing an examination without an accepted reason is treated according to the applicable examination regulations.",
          ],
        },
      ],
    },
    {
      slug: "semester-3",
      title: "3rd semester",
      description: "3rd semester",
      category: "semester",
      estimatedTime: "3rd semester",
      relevantSemesters: [3],
      tags: ["semester-3"],
      steps: [
        {
          id: 1,
          title: "Log in to LCOnline",
          description:
            "Use your HFU credentials to access LCOnline. Each lecturer creates course rooms where lecture slides, assignments, announcements, quizzes, and additional learning materials are published.",
          links: [
            { label: "Open LCOnline", url: "https://lconline.hs-furtwangen.de/login/index.php?loginredirect=1" },
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
          title: "Check announcements",
          description:
            "Lecturers regularly publish announcements about lecture cancellations, room changes, examination information, assignment updates, and other important notices. Check LC Online frequently and enable email notifications if available.",
        },
        {
          id: 4,
          title: "Check your timetable",
          description:
            "View your current timetable using sPlan or the timetable published for your study programme. Check lecture times, room numbers, online sessions, and possible timetable changes before the semester begins.",
          links: [
            { label: "Open sPlan", url: "https://splan.hs-furtwangen.de/starplan/mobile?lan=de&acc=true&act=tt&sel=pg&pu=6&sd=false&loc=4&sa=false&cb=o" },
          ],
        },
        {
          id: 5,
          title: "Enrollment",
          description:
            "Complete your semester re-enrollment by paying the semester contribution before the official deadline to remain enrolled at Hochschule Furtwangen University.",
        },
        {
          id: 6,
          title: "Check the re-enrollment deadline",
          description:
            "HFU announces the official re-enrollment period before each semester. Verify the deadline through your HFU email or MIO.",
          tips: ["Missing the deadline may result in late fees or exmatriculation."],
        },
        {
          id: 7,
          title: "Pay the semester contribution",
          description:
            "Transfer the required semester contribution using the correct payment reference (Verwendungszweck). Payment instructions are provided by the university.",
          tips: [
            "Use the correct reference number to ensure your payment is assigned to your student account.",
          ],
        },
        {
          id: 8,
          title: "Verify your enrollment status",
          description:
            "After your payment has been processed, log in to MIO/QIS and check that your enrollment has been renewed successfully. Download your updated enrollment certificate (Immatrikulationsbescheinigung).",
          links: [{ label: "Open MIO/QIS", url: "https://mio.hs-furtwangen.de/qisserver/pages/cs/sys/portal/hisinoneStartPage.faces" }],
        },
        {
          id: 9,
          title: "Validate your student ID card",
          description:
            "Update your student ID card at one of the validation terminals on campus so it remains valid for the new semester.",
        },
        {
          id: 10,
          title: "Registering for Exams",
          description:
            "How to register and deregister for examinations during the official examination registration period.",
        },
        {
          id: 11,
          title: "Check the examination registration period",
          description:
            "HFU publishes the official examination registration period before each examination phase. Check your HFU email, MIO, or the university website for the exact registration and deregistration deadlines.",
        },
        {
          id: 12,
          title: "Verify your registrations",
          description:
            "After registering, review the list of registered examinations in MIO. Check that the correct modules and examination types are displayed.",
        },
        {
          id: 13,
          title: "Deregister if necessary",
          description:
            "If you decide not to take an examination, deregister within the official deregistration period. After the deadline, withdrawal is only possible according to the university examination regulations (for example, due to illness with the required documentation).",
          tips: [
            "Missing an examination without an accepted reason is treated according to the applicable examination regulations.",
          ],
        },
        {
          id: 14,
          title: "Preparing for Your Practical Semester",
          description:
            "What to do before starting your mandatory practical semester (internship) to ensure you meet all university requirements.",
        },
        {
          id: 15,
          title: "Check the internship requirements",
          description:
            "Review the internship requirements defined by your study programme. Before beginning the practical semester, ensure you have completed the required prerequisites and meet the minimum ECTS requirements specified by the examination regulations.",
        },
        {
          id: 16,
          title: "Prepare your application documents",
          description:
            "Prepare a professional CV (Lebenslauf), cover letter, transcripts, and any additional documents requested by employers. Adapt your application to each company.",
        },
        {
          id: 17,
          title: "Internship Registration Process",
          description:
            "Step-by-step guide for officially registering your internship with Hochschule Furtwangen University.",
        },
        {
          id: 18,
          title: "Step 1 – Confirm your eligibility",
          description:
            "Verify that you meet the internship requirements defined by your study programme before registering your practical semester.",
        },
        {
          id: 19,
          title: "Step 2 – Complete the practical semester",
          description:
            "Carry out your internship according to the required duration and learning objectives defined by your study programme. Keep records of your activities if required by your department.",
        },
        {
          id: 20,
          title: "Step 3– Submit the internship report, Certificate and Paper",
          description:
            "After completing the internship, submit the required internship documents requested by your study programme, including any evaluation forms completed by your employer.",
          links: [
            {
              label: "Internship Report Template",
              url: "/documents/IBS_Internship_Semester_Checklist_Procedure_Notes_101024.pdf",
            },
          ],
        },
      ],
    },
    {
      slug: "semester-4",
      title: "4th semester",
      description: "Internship Semester (Semester 4 / Semester 5)",
      category: "semester",
      estimatedTime: "4th semester",
      relevantSemesters: [4],
      tags: ["semester-4"],
      steps: [
        {
          id: 1,
          title: "Internship Semester (Semester 4 / Semester 5)",
          description:
            "The mandatory internship is normally completed in Semester 4. However, IBS students may swap Semesters 4 and 5, allowing them to complete the taught courses first and undertake the internship in the following semester.",
        },
      ],
    },
    {
      slug: "semester-5",
      title: "5th semester",
      description: "Registering for Exams",
      category: "semester",
      estimatedTime: "5th semester",
      relevantSemesters: [5],
      tags: ["semester-5"],
      steps: [
        {
          id: 1,
          title: "Registering for Exams",
          description:
            "How to register and deregister for examinations during the official examination registration period.",
        },
        {
          id: 2,
          title: "Check the examination registration period",
          description:
            "HFU publishes the official examination registration period before each examination phase. Check your HFU email, MIO, or the university website for the exact registration and deregistration deadlines.",
        },
        {
          id: 3,
          title: "Verify your registrations",
          description:
            "After registering, review the list of registered examinations in MIO. Check that the correct modules and examination types are displayed.",
        },
        {
          id: 4,
          title: "Deregister if necessary",
          description:
            "If you decide not to take an examination, deregister within the official deregistration period. After the deadline, withdrawal is only possible according to the university examination regulations (for example, due to illness with the required documentation).",
          tips: [
            "Missing an examination without an accepted reason is treated according to the applicable examination regulations.",
          ],
        },
      ],
    },
    {
      slug: "semester-6",
      title: "6th semester",
      description: "Registering for Exams",
      category: "semester",
      estimatedTime: "6th semester",
      relevantSemesters: [6],
      tags: ["semester-6"],
      steps: [
        {
          id: 1,
          title: "Registering for Exams",
          description:
            "How to register and deregister for examinations during the official examination registration period.",
        },
        {
          id: 2,
          title: "Check the examination registration period",
          description:
            "HFU publishes the official examination registration period before each examination phase. Check your HFU email, MIO, or the university website for the exact registration and deregistration deadlines.",
        },
        {
          id: 3,
          title: "Verify your registrations",
          description:
            "After registering, review the list of registered examinations in MIO. Check that the correct modules and examination types are displayed.",
        },
        {
          id: 4,
          title: "Deregister if necessary",
          description:
            "If you decide not to take an examination, deregister within the official deregistration period. After the deadline, withdrawal is only possible according to the university examination regulations (for example, due to illness with the required documentation).",
          tips: [
            "Missing an examination without an accepted reason is treated according to the applicable examination regulations.",
          ],
        },
        {
          id: 5,
          title: "Bachelor Thesis Registration",
          description:
            "Officially register your bachelor thesis with Hochschule Furtwangen University before beginning your thesis work. Complete all required approvals and submit the registration form to the Examination Office.",
        },
        {
          id: 6,
          title: "Step 1 – Define your thesis topic",
          description:
            "Work together with your supervisor to develop a clear research topic, objectives, and scope. Your topic must be approved before registration.",
        },
        {
          id: 7,
          title: "Step 2– Submit the registration form",
          description:
            "Complete the official Bachelor Thesis Registration Form with:\n• Approved thesis title\n• First examiner\n• Second examiner\n• Planned starting date\nSubmit the completed form to the Examination Office.",
          links: [
            {
              label: "Thesis Registration Form",
              url: "/documents/Thesis_Titelblatt_BCM.doc",
            },
          ],
        },
        {
          id: 8,
          title: "Step 3 – Receive the official start date",
          description:
            "After your registration has been approved, the Examination Office will confirm your official thesis start date. Your submission deadline is calculated from this date.",
          tips: [
            "Thesis deadlines can normally only be extended in exceptional, officially approved circumstances.",
          ],
        },
      ],
    },
    {
      slug: "semester-7",
      title: "7th Semester",
      description: "Oral exam",
      category: "semester",
      estimatedTime: "7th Semester",
      relevantSemesters: [7],
      tags: ["semester-7"],
      steps: [
        {
          id: 1,
          title: "Oral exam",
          description:
            "• Oral examinations may be conducted individually or as a group.\n• They are normally conducted by at least two examiners, or by one examiner with an observer.\n• The final grade is the average of the examiners' grades.\n• An oral examination lasts at least 15 minutes and no more than 30 minutes per student.\n• The content and result of the examination must be documented in writing.\n• Students are informed of their result immediately after the examination.\n• In exceptional cases, oral examinations may also be conducted online.",
        },
        {
          id: 2,
          title: "Begin your thesis",
          description:
            "Start your research and writing according to your approved schedule.",
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

  console.log("✅ Database seeded successfully!")
  console.log("   Platform links:", 5)
  console.log("   Contacts:", 12 + professorContacts.length)
  console.log("   Guides:", guideData.length)
  console.log("   Documents:", 12)
  console.log("   International info topics:", helpData.length)
  sqlite.close()
}

seed().catch(console.error)
