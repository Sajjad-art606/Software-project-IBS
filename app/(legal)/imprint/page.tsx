import Link from "next/link"

export const metadata = {
  title: "Imprint – IBS Student Hub",
}

export default function ImprintPage() {
  return (
    <article className="prose prose-sm dark:prose-invert max-w-none">
      <h1 className="mb-1 text-2xl font-bold">Imprint</h1>
      <p className="mb-8 text-sm text-muted-foreground">
        Impressum gemäß § 5 TMG
      </p>

      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold">Responsible Institution</h2>
        <div className="space-y-0.5 rounded-lg border border-border bg-muted/30 px-4 py-4 text-sm text-muted-foreground">
          <p className="text-base font-semibold text-foreground">
            Hochschule Furtwangen University (HFU)
          </p>
          <p className="font-medium text-foreground">
            International Business Studies (IBS)
          </p>
          <p className="mt-2">Robert-Gerwig-Platz 1</p>
          <p>78120 Furtwangen im Schwarzwald</p>
          <p>Germany</p>
          <p className="mt-2">
            <span className="font-medium text-foreground">Phone:</span> +49 7723
            920-0
          </p>
          <p>
            <span className="font-medium text-foreground">Website:</span>{" "}
            <span className="text-foreground">www.hs-furtwangen.de</span>
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold">
          Legal Form & Supervisory Authority
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Hochschule Furtwangen University is a public institution of higher
          education under the law of the State of Baden-Württemberg
          (Körperschaft des öffentlichen Rechts).
        </p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          <strong className="text-foreground">Supervisory authority:</strong>{" "}
          Ministerium für Wissenschaft, Forschung und Kunst Baden-Württemberg
          (MWK), Königstraße 46, 70173 Stuttgart.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold">About This Tool</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          IBS Student Hub is an internal student-facing web application
          developed to help International Business Studies students at HFU
          navigate administrative processes, find contacts, access documents,
          and use university platforms.
        </p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          This tool is for internal academic use only and is not a commercial
          offering. All content is provided for informational purposes. While we
          aim to keep information accurate and up to date, no liability is
          accepted for the accuracy of third-party content or external links.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold">Disclaimer of Liability</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          <strong className="text-foreground">Content:</strong> The content of
          this tool has been compiled with great care. However, we cannot
          guarantee the accuracy, completeness, or timeliness of the content. As
          a service provider, we are responsible for our own content on this
          platform in accordance with general law (§ 7 Abs.1 TMG).
        </p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          <strong className="text-foreground">External links:</strong> Links to
          external websites are beyond our control. At the time of linking, no
          legal violations were evident. We accept no liability for content on
          linked external sites.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold">Data Protection Officer</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          The Data Protection Officer of Hochschule Furtwangen University can be
          reached via the official HFU contact channels at{" "}
          <span className="font-medium text-foreground">
            www.hs-furtwangen.de
          </span>
          .
        </p>
      </section>

      <div className="rounded-lg border border-border bg-muted/10 px-4 py-3 text-xs text-muted-foreground">
        For data protection information see our{" "}
        <Link
          href="/privacy"
          className="underline underline-offset-2 transition-colors hover:text-foreground"
        >
          Privacy Policy
        </Link>
        .
      </div>
    </article>
  )
}
