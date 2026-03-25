IBS Student Digital Hub – Detailed Project Concept
1. Project Goal
The goal of this project is to build a centralized digital platform that helps IBS students
quickly find important academic information, documents, contacts, and guides. The system
will act as a digital assistant for students, especially for new and international students.
2. Problems We Want to Solve
• Important information is scattered across multiple systems and websites.
• Students often do not know which professor or office to contact.
• Academic processes (e.g., internship registration) are not clearly explained.
• International students need guidance for administrative tasks such as city registration or
bank accounts.
3. Our Solution
We will build a web-based software system called 'IBS Student Digital Hub'. This platform
will centralize useful student resources and provide intelligent features such as search,
personalized dashboards, document access, and guided processes.
4. Core Functionalities
1. Student Login System – Students log in with their student ID and semester number.
2. Personalized Dashboard – Shows relevant information depending on the student's
semester.
3. Smart Search System – Students can search questions (e.g., 'internship registration') and
the system returns relevant results.
4. Contact Finder – Helps students find the correct professor or contact person for a topic.
5. Document Center – Allows students to search and download important study documents.
6. Process Guide System – Step‑by‑step guides for processes such as internship registration.
7. Student Help Center – Information for international students (bank account,
accommodation, etc.).
8. Academic Platform Hub – Central access to important university systems.
5. Example User Workflow
Example scenario:
1. A student logs into the platform using their student ID.
2. The dashboard loads and shows relevant information based on their semester.
3. The student searches for 'internship'.
4. The system displays:
• Internship registration guide
• Required documents
• Responsible professor contact
• Links to useful platforms.
9. Expected Outcome
At the end of the project, we expect to deliver a working prototype that:
• allows students to log in
• provides personalized dashboards
• enables intelligent search
• helps students find documents and contacts
• guides students through important academic processes


Here are some platform links that I will include on the web page.

https://felix.hs-furtwangen.de/dmz/

## 6. Getting Started & Installation

### Prerequisites
- Node.js (v18 or higher)
- pnpm (recommended package manager)
- SQLite3 (for database)

### Installation Steps

1. Clone the repository:
```bash
git clone git@github.com:Sajjad-art606/Software-project-IBS.git
cd ibs_student_hub
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up the database:
```bash
pnpm db:generate
pnpm db:migrate
pnpm db:seed
```

## 7. Available Commands

### Development Commands

#### Start Development Server
```bash
pnpm dev
```
- Starts the Next.js development server with Turbopack
- Access the app at `http://localhost:3000`
- Hot-reload enabled (changes refresh automatically)

#### Build for Production
```bash
pnpm build
```
- Creates an optimized production build
- Compiles TypeScript and Next.js pages

#### Start Production Server
```bash
pnpm start
```
- Runs the production-built application
- Only works after running `pnpm build`

### Code Quality Commands

#### Run Linter
```bash
pnpm lint
```
- Checks code for style and potential errors using ESLint
- Run before committing code

#### Format Code
```bash
pnpm format
```
- Formats all TypeScript and TSX files using Prettier
- Automatically fixes code style issues
- Includes Tailwind CSS class sorting

#### Type Check
```bash
pnpm typecheck
```
- Validates TypeScript types without emitting code
- Catches type errors early in development

### Database Management Commands

#### Generate Database Schema
```bash
pnpm db:generate
```
- Generates migration files based on schema changes
- Must be run after modifying `db/schema.ts`

#### Apply Database Migrations
```bash
pnpm db:migrate
```
- Applies pending migrations to the database
- Creates or updates database tables

#### Seed Database
```bash
pnpm db:seed
```
- Populates the database with initial test data
- Useful for development and testing

#### Open Database Studio
```bash
pnpm db:studio
```
- Opens Drizzle Studio (web UI for database management)
- View and edit data without SQL queries
- Access at `http://localhost:3001`

## 8. Development Workflow

### Quick Start for Development
```bash
pnpm install          # Install dependencies
pnpm db:generate      # Generate schema migrations
pnpm db:migrate       # Apply migrations
pnpm db:seed          # Populate with test data
pnpm dev              # Start development server
```

### Before Committing Code
```bash
pnpm typecheck        # Check for TypeScript errors
pnpm lint             # Check for code style issues
pnpm format           # Auto-format code
```

### To Prepare for Deployment
```bash
pnpm build            # Create production build
pnpm start            # Test production build locally
```

## 9. Project Structure

- **app/** – Next.js application structure with routes and layouts
- **components/** – Reusable React components (UI, guides, layout)
- **db/** – Database schema, migrations, and seeding scripts
- **hooks/** – Custom React hooks for authentication and utilities
- **lib/** – Utility functions and authentication context
- **public/** – Static assets like illustrations
- **api/** – API routes for backend endpoints

## 10. Technology Stack

- **Frontend:** React 19, Next.js 16, TypeScript
- **Styling:** Tailwind CSS 4, PostCSS
- **Database:** SQLite with Drizzle ORM
- **UI Components:** shadcn/ui, Base UI, Huge Icons
- **Code Quality:** ESLint, Prettier
- **Database Tools:** Drizzle Kit

## 11. Contributing

When making changes:
1. Create a feature branch
2. Make your changes
3. Run `pnpm typecheck && pnpm lint && pnpm format`
4. Commit and push to GitHub
5. Create a pull request


https://mio.hs-furtwangen.de/qisserver/pages/cs/sys/portal/hisinoneStartPage.faces
https://mailbox.hs-furtwangen.de/owa/#path=/mail
https://splan.hs-furtwangen.de/starplan/mobile?lan=de&acc=true&act=tt&sel=pg&pu=6&sd=false&loc=4&sa=false&cb=o
https://lconline.hs-furtwangen.de/login/index.php?loginredirect=1

Project should be GDPR compilant# Software-project-IBS

