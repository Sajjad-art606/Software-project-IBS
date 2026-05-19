interface SendEmailParams {
  to: string
  subject: string
  textBody: string
  htmlBody?: string
}

export async function sendEmail(params: SendEmailParams): Promise<void> {
  const workerUrl = process.env.EMAIL_WORKER_URL
  const workerSecret = process.env.EMAIL_WORKER_SECRET
  const fromEmail = process.env.VERIFICATION_FROM_EMAIL ?? 'ibs-student-hub@infile.app'

  if (!workerUrl || !workerSecret) {
    throw new Error('Missing email worker credentials: EMAIL_WORKER_URL and EMAIL_WORKER_SECRET must be set')
  }

  const url = workerUrl.replace(/\/$/, '') + '/send'

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${workerSecret}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: fromEmail,
      to: params.to,
      subject: params.subject,
      text: params.textBody,
      html: params.htmlBody,
    }),
  })

  if (!res.ok) {
    const body = await res.text().catch(() => 'unknown error')
    throw new Error(`Email worker request failed (${res.status}): ${body}`)
  }
}
