import Link from 'next/link'

export const metadata = {
  title: 'Privacy Policy – IBS Student Hub',
}

export default function PrivacyPage() {
  return (
    <article className="prose prose-sm max-w-none dark:prose-invert">
      <h1 className="text-2xl font-bold mb-1">Privacy Policy</h1>
      <p className="text-sm text-muted-foreground mb-8">
        Last updated: March 2026 · English · (Datenschutzerklärung)
      </p>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">1. Data Controller</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          This tool is operated within the academic context of{' '}
          <strong className="text-foreground">Hochschule Furtwangen University (HFU)</strong>,
          International Business Studies (IBS) programme.
        </p>
        <div className="mt-3 rounded-lg border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">Hochschule Furtwangen University</p>
          <p>Robert-Gerwig-Platz 1</p>
          <p>78120 Furtwangen im Schwarzwald</p>
          <p>Germany</p>
          <p className="mt-1">
            Website:{' '}
            <span className="text-foreground font-medium">www.hs-furtwangen.de</span>
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">2. What Data We Process & Why</h2>

        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-muted/20 px-4 py-3">
            <p className="text-sm font-medium text-foreground mb-1">Session data (Student ID, Semester)</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              When you sign in, you provide your student ID and semester number. This data is
              stored exclusively in a session cookie in your browser. It is <strong className="text-foreground">never
              transmitted to or stored on the server</strong> beyond the duration of the request.
              No server-side user accounts or profiles are created.
            </p>
            <p className="text-xs text-muted-foreground mt-1.5">
              <strong className="text-foreground">Legal basis:</strong> Art. 6(1)(b) GDPR - processing
              necessary for the performance of the service you requested.
            </p>
          </div>

          <div className="rounded-lg border border-border bg-muted/20 px-4 py-3">
            <p className="text-sm font-medium text-foreground mb-1">Application content (Guides, Contacts, Documents)</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              All content displayed in the app (process guides, contact lists, documents, platform links)
              is institutional reference data maintained by the IBS programme. It does not constitute
              personal data and is not linked to individual student activity.
            </p>
          </div>

          <div className="rounded-lg border border-border bg-muted/20 px-4 py-3">
            <p className="text-sm font-medium text-foreground mb-1">No analytics or tracking</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              This tool does <strong className="text-foreground">not</strong> use any analytics,
              tracking pixels, advertising networks, or third-party data processors. No usage data,
              page views, or behavioural data are collected or transmitted to any third party.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">3. Cookies</h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
          This application uses exactly <strong className="text-foreground">one cookie</strong>:
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 pr-4 font-medium text-foreground">Name</th>
                <th className="text-left py-2 pr-4 font-medium text-foreground">Purpose</th>
                <th className="text-left py-2 pr-4 font-medium text-foreground">Type</th>
                <th className="text-left py-2 font-medium text-foreground">Expiry</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2 pr-4 font-mono text-foreground">ibs-session</td>
                <td className="py-2 pr-4 text-muted-foreground">Maintains your sign-in state (student ID + semester)</td>
                <td className="py-2 pr-4 text-muted-foreground">Strictly necessary / Functional</td>
                <td className="py-2 text-muted-foreground">Session (deleted when browser is closed)</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
          This cookie is <strong className="text-foreground">strictly necessary</strong> for
          the application to function. Under GDPR Recital 47 and ePrivacy Directive Art. 5(3),
          strictly necessary cookies do not require prior consent. No cookie consent banner is
          therefore shown. You may delete this cookie at any time via your browser settings,
          which will sign you out.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">4. Data Retention</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          The session cookie contains only your student ID and semester number and is stored
          exclusively in your browser. It is automatically deleted when you close your browser
          or sign out. No personal data is retained on any server after your session ends.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">5. Data Sharing</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Your data is <strong className="text-foreground">not shared</strong> with any third
          parties, advertisers, analytics providers, or external services. The application
          operates entirely within the HFU academic environment.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">6. Your Rights Under GDPR</h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
          Under the General Data Protection Regulation (GDPR / DSGVO), you have the following rights:
        </p>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li><strong className="text-foreground">Right of access (Art. 15):</strong> You may request information about what data we hold about you.</li>
          <li><strong className="text-foreground">Right to rectification (Art. 16):</strong> You may request correction of inaccurate data.</li>
          <li><strong className="text-foreground">Right to erasure (Art. 17):</strong> You may request deletion of your data. Signing out and closing your browser erases all session data immediately.</li>
          <li><strong className="text-foreground">Right to restriction (Art. 18):</strong> You may request that processing be restricted under certain circumstances.</li>
          <li><strong className="text-foreground">Right to data portability (Art. 20):</strong> You may receive your data in a portable format.</li>
          <li><strong className="text-foreground">Right to object (Art. 21):</strong> You may object to processing based on legitimate interests.</li>
        </ul>
        <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
          Since this tool stores only the data you actively enter in the login form (student ID,
          semester) and only in your own browser, exercising most of these rights is as simple as
          clearing your browser cookies or signing out.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">7. Right to Lodge a Complaint</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          You have the right to lodge a complaint with a supervisory authority. In Baden-Württemberg,
          the competent authority is:
        </p>
        <div className="mt-3 rounded-lg border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">Der Landesbeauftragte für den Datenschutz und die Informationsfreiheit Baden-Württemberg (LfDI)</p>
          <p>Königstraße 10a</p>
          <p>70173 Stuttgart</p>
          <p className="mt-1 text-foreground font-medium">www.baden-wuerttemberg.datenschutz.de</p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">8. Data Security</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          The session cookie is transmitted over HTTPS only (in production) and is set with
          <code className="mx-1 rounded bg-muted px-1 py-0.5 font-mono text-xs">SameSite=Lax</code>
          to protect against cross-site request forgery. No sensitive personal data (e.g.
          passwords, financial data, health data) is processed by this application.
        </p>
      </section>

      <div className="rounded-lg border border-border bg-muted/10 px-4 py-3 text-xs text-muted-foreground">
        Questions about this privacy policy? Contact the IBS Study Office at HFU Furtwangen.
        See the <Link href="/imprint" className="underline underline-offset-2 hover:text-foreground transition-colors">Imprint</Link> for contact details.
      </div>
    </article>
  )
}
