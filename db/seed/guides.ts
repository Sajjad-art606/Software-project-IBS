import type { GuideStep } from '../schema'

export type GuideSeedData = {
  slug: string
  title: string
  description: string
  category: string
  estimatedTime: string
  relevantSemesters: number[]
  tags: string[]
  steps: GuideStep[]
  prerequisites?: string[]
  relatedGuideSlugs?: string[]
  relatedContactIds?: number[]
  lastReviewedAt?: string | null
}

export const guideData: GuideSeedData[] = [
    {
      slug: 'getting-started-hfu-systems',
      title: 'Getting Started with HFU Systems',
      description: 'A complete checklist to get all your university accounts and services set up in your first week.',
      category: 'general',
      estimatedTime: '2 hours',
      relevantSemesters: [1],
      tags: ['getting-started', 'account', 'setup', 'first-semester'],
      relatedContactIds: [4],
      lastReviewedAt: '2026-05-17',
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
      relatedContactIds: [7],
      lastReviewedAt: '2026-05-17',
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
          links: [{ label: 'Career Center (Contacts)', url: '/contacts' }],
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
      relatedGuideSlugs: ['internship-preparation'],
      relatedContactIds: [6],
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
      prerequisites: ['City registration (Anmeldung) completed'],
      relatedGuideSlugs: ['city-registration-anmeldung'],
      relatedContactIds: [2],
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
          links: [{ label: 'HFU Library', url: 'mailto:bibliothek@hs-furtwangen.de' }],
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