import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { emailVerifications } from '@/db/schema'
import { sendEmail } from '@/lib/email'
import { eq, and, gt } from 'drizzle-orm'

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

function validateEmail(email: string): string | null {
  const v = email.trim().toLowerCase()
  if (!v) return 'Email is required.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Please enter a valid email address.'
  if (!v.endsWith('@stud.hs-furtwangen.de')) {
    return 'Only @stud.hs-furtwangen.de email addresses are allowed.'
  }
  return null
}

// Simple in-memory rate limiting: max 3 requests per email per 10 minutes
const rateLimit = new Map<string, number[]>()

function isRateLimited(email: string): boolean {
  const now = Date.now()
  const windowStart = now - 10 * 60 * 1000
  const attempts = rateLimit.get(email) ?? []
  const recent = attempts.filter((t) => t > windowStart)
  rateLimit.set(email, recent)
  return recent.length >= 3
}

function recordAttempt(email: string): void {
  const attempts = rateLimit.get(email) ?? []
  attempts.push(Date.now())
  rateLimit.set(email, attempts)
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>
    const emailRaw = String(body.email ?? '')
    const semester = Number(body.semester ?? 0)
    const name = String(body.name ?? '').trim() || null

    const emailErr = validateEmail(emailRaw)
    if (emailErr) {
      return NextResponse.json({ error: emailErr }, { status: 400 })
    }
    if (!semester || semester < 1 || semester > 7) {
      return NextResponse.json({ error: 'Please select a valid semester.' }, { status: 400 })
    }

    const email = emailRaw.trim().toLowerCase()

    if (isRateLimited(email)) {
      return NextResponse.json(
        { error: 'Too many attempts. Please wait 10 minutes before trying again.' },
        { status: 429 },
      )
    }

    recordAttempt(email)

    const code = generateCode()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Invalidate any existing unused codes for this email
    await db
      .update(emailVerifications)
      .set({ used: true })
      .where(and(eq(emailVerifications.email, email), eq(emailVerifications.used, false)))

    // Store new verification
    await db.insert(emailVerifications).values({
      email,
      code,
      semester,
      name,
      expiresAt,
    })

    // Send email via Cloudflare
    await sendEmail({
      to: email,
      subject: 'Your IBS Student Hub Login Code',
      textBody: `Hello,

Your login code for IBS Student Hub is: ${code}

This code will expire in 10 minutes.

If you did not request this code, you can safely ignore this email.

— IBS Student Hub`,
      htmlBody: `<p>Hello,</p>
<p>Your login code for <strong>IBS Student Hub</strong> is:</p>
<h2 style="font-size:24px;letter-spacing:4px;margin:16px 0;">${code}</h2>
<p>This code will expire in <strong>10 minutes</strong>.</p>
<p>If you did not request this code, you can safely ignore this email.</p>
<p>— IBS Student Hub</p>`,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('send-code error:', err)
    const message = err instanceof Error ? err.message : 'Something went wrong.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
