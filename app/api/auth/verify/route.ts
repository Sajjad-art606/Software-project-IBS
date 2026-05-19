import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { db } from '@/db'
import { emailVerifications } from '@/db/schema'
import { COOKIE_NAME, encodeSession } from '@/lib/auth/session'
import { eq, and, gt } from 'drizzle-orm'

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>
    const emailRaw = String(body.email ?? '')
    const code = String(body.code ?? '').trim()

    const email = emailRaw.trim().toLowerCase()
    if (!email || !code) {
      return NextResponse.json({ error: 'Email and code are required.' }, { status: 400 })
    }

    const [record] = await db
      .select()
      .from(emailVerifications)
      .where(
        and(
          eq(emailVerifications.email, email),
          eq(emailVerifications.code, code),
          eq(emailVerifications.used, false),
          gt(emailVerifications.expiresAt, new Date()),
        ),
      )
      .limit(1)

    if (!record) {
      return NextResponse.json({ error: 'Invalid or expired code.' }, { status: 400 })
    }

    // Mark as used
    await db
      .update(emailVerifications)
      .set({ used: true })
      .where(eq(emailVerifications.id, record.id))

    // Create session
    const session = {
      email: record.email,
      semester: record.semester,
      displayName: record.name ?? undefined,
    }

    const cookieStore = await cookies()
    cookieStore.set(COOKIE_NAME, encodeSession(session), {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('verify error:', err)
    const message = err instanceof Error ? err.message : 'Something went wrong.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
