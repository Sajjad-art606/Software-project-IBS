'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Suspense } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

// ── Validation rules ──────────────────────────────────────────────────────────

function validateEmail(value: string): string {
  const v = value.trim().toLowerCase()
  if (!v) return 'Email is required.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Please enter a valid email address.'
  if (!v.endsWith('@stud.hs-furtwangen.de')) {
    return 'Only @stud.hs-furtwangen.de email addresses are allowed.'
  }
  return ''
}

function validateName(value: string): string {
  const v = value.trim()
  if (!v) return '' // optional
  if (v.length > 50) return 'Name must be at most 50 characters.'
  if (!/^[\p{L}\s'\-]+$/u.test(v)) return 'Only letters, spaces, hyphens, and apostrophes allowed.'
  return ''
}

function validateSemester(value: string): string {
  if (!value) return 'Please select your current semester.'
  return ''
}

function validateCode(value: string): string {
  const v = value.trim()
  if (!v) return 'Code is required.'
  if (!/^\d{6}$/.test(v)) return 'Enter the 6-digit code from your email.'
  return ''
}

// ── Login form ────────────────────────────────────────────────────────────────

function LoginForm() {
  const { setServerSession } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  // Step 1 fields
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [semester, setSemester] = useState('')

  // Step 2 fields
  const [code, setCode] = useState('')

  const [step, setStep] = useState<1 | 2>(1)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(false)
  const [globalError, setGlobalError] = useState('')
  const [ resent, setResent ] = useState(false)

  const inputBase =
    'flex h-9 w-full rounded-lg border bg-transparent px-3 py-1 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2'

  function blurField(field: string) {
    setTouched((t) => ({ ...t, [field]: true }))
    if (field === 'email') {
      setErrors((e) => ({ ...e, email: validateEmail(email) }))
    } else if (field === 'name') {
      setErrors((e) => ({ ...e, name: validateName(name) }))
    } else if (field === 'semester') {
      setErrors((e) => ({ ...e, semester: validateSemester(semester) }))
    } else if (field === 'code') {
      setErrors((e) => ({ ...e, code: validateCode(code) }))
    }
  }

  function sanitizeEmail(v: string) {
    return v.trim().toLowerCase().replace(/\s/g, '')
  }

  function sanitizeName(v: string) {
    // Strip control chars, allow letters, spaces, hyphens, apostrophes
    return v.replace(/[\x00-\x1F\x7F]/g, '').slice(0, 50)
  }

  function sanitizeCode(v: string) {
    return v.replace(/\D/g, '').slice(0, 6)
  }

  function handleChange(field: string, value: string) {
    let sanitized = value
    if (field === 'email') sanitized = sanitizeEmail(value)
    if (field === 'name') sanitized = sanitizeName(value)
    if (field === 'code') sanitized = sanitizeCode(value)

    if (field === 'email') setEmail(sanitized)
    if (field === 'name') setName(sanitized)
    if (field === 'semester') setSemester(value)
    if (field === 'code') setCode(sanitized)

    if (touched[field]) {
      if (field === 'email') setErrors((e) => ({ ...e, email: validateEmail(sanitized) }))
      if (field === 'name') setErrors((e) => ({ ...e, name: validateName(sanitized) }))
      if (field === 'semester') setErrors((e) => ({ ...e, semester: validateSemester(value) }))
      if (field === 'code') setErrors((e) => ({ ...e, code: validateCode(sanitized) }))
    }
    setGlobalError('')
  }

  async function handleSendCode(e: React.FormEvent) {
    e.preventDefault()

    const emailErr = validateEmail(email)
    const nameErr = validateName(name)
    const semErr = validateSemester(semester)
    setErrors({ email: emailErr, name: nameErr, semester: semErr, code: '' })
    setTouched({ email: true, name: true, semester: true, code: false })

    if (emailErr || nameErr || semErr) return

    setLoading(true)
    setGlobalError('')

    try {
      const res = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          semester: parseInt(semester, 10),
          name: name.trim() || null,
        }),
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setGlobalError(data.error || 'Failed to send code. Please try again.')
        setLoading(false)
        return
      }

      setStep(2)
      setCode('')
      setErrors((e) => ({ ...e, code: '' }))
      setTouched((t) => ({ ...t, code: false }))
    } catch {
      setGlobalError('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault()

    const codeErr = validateCode(code)
    setErrors((e) => ({ ...e, code: codeErr }))
    setTouched((t) => ({ ...t, code: true }))

    if (codeErr) return

    setLoading(true)
    setGlobalError('')

    try {
      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          code: code.trim(),
        }),
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setGlobalError(data.error || 'Invalid or expired code.')
        setLoading(false)
        return
      }

      // Update client auth state
      setServerSession({
        email: email.trim().toLowerCase(),
        semester: parseInt(semester, 10),
        displayName: name.trim() || undefined,
      })

      const from = searchParams.get('from')
      router.push(from && from !== '/login' ? from : '/dashboard')
    } catch {
      setGlobalError('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleResend() {
    if (resent) return
    setLoading(true)
    setGlobalError('')

    try {
      const res = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          semester: parseInt(semester, 10),
          name: name.trim() || null,
        }),
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setGlobalError(data.error || 'Failed to resend code.')
        setLoading(false)
        return
      }

      setResent(true)
      setTimeout(() => setResent(false), 30000) // allow resend after 30s
    } catch {
      setGlobalError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={step === 1 ? handleSendCode : handleVerify}
      noValidate
      className="flex w-full max-w-sm flex-col gap-4"
    >
      {globalError && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {globalError}
        </div>
      )}

      {step === 1 && (
        <>
          {/* Student Email */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-medium">
              Student Email
            </label>
            <input
              id="email"
              type="email"
              maxLength={120}
              placeholder="e.g. student@stud.hs-furtwangen.de"
              value={email}
              onChange={(e) => handleChange('email', e.target.value)}
              onBlur={() => blurField('email')}
              autoComplete="email"
              autoFocus
              aria-describedby={errors.email && touched.email ? 'email-error' : undefined}
              aria-invalid={!!(errors.email && touched.email)}
              className={cn(
                inputBase,
                errors.email && touched.email
                  ? 'border-destructive focus-visible:ring-destructive/40 text-destructive'
                  : 'border-input focus-visible:ring-ring',
              )}
            />
            {errors.email && touched.email && (
              <p id="email-error" className="text-xs text-destructive">
                {errors.email}
              </p>
            )}
          </div>

          {/* Name (optional) */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="text-sm font-medium">
              Your Name <span className="text-muted-foreground font-normal">(optional)</span>
            </label>
            <input
              id="name"
              type="text"
              maxLength={50}
              placeholder="e.g. Alex Müller"
              value={name}
              onChange={(e) => handleChange('name', e.target.value)}
              onBlur={() => blurField('name')}
              autoComplete="name"
              aria-describedby={errors.name && touched.name ? 'name-error' : undefined}
              aria-invalid={!!(errors.name && touched.name)}
              className={cn(
                inputBase,
                errors.name && touched.name
                  ? 'border-destructive focus-visible:ring-destructive/40 text-destructive'
                  : 'border-input focus-visible:ring-ring',
              )}
            />
            {errors.name && touched.name && (
              <p id="name-error" className="text-xs text-destructive">
                {errors.name}
              </p>
            )}
          </div>

          {/* Semester */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="semester-trigger" className="text-sm font-medium">
              Current Semester
            </label>
            <Select value={semester} onValueChange={(val) => handleChange('semester', val ?? '')}>
              <SelectTrigger
                id="semester-trigger"
                className={cn(
                  'w-full rounded-lg px-3 py-1 text-sm shadow-xs',
                  errors.semester && touched.semester
                    ? 'border-destructive focus-visible:ring-destructive/40 text-destructive'
                    : '',
                )}
                onBlur={() => blurField('semester')}
                aria-describedby={errors.semester && touched.semester ? 'semester-error' : undefined}
                aria-invalid={!!(errors.semester && touched.semester)}
              >
                <SelectValue placeholder="Select semester…" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7].map((s) => (
                  <SelectItem key={s} value={String(s)}>
                    Semester {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.semester && touched.semester && (
              <p id="semester-error" className="text-xs text-destructive">
                {errors.semester}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Sending code…' : 'Continue'}
          </Button>
        </>
      )}

      {step === 2 && (
        <>
          <div className="rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm text-muted-foreground">
            We sent a 6-digit code to{' '}
            <span className="font-medium text-foreground">{email.trim().toLowerCase()}</span>
          </div>

          {/* Verification Code */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="code" className="text-sm font-medium">
              Verification Code
            </label>
            <input
              id="code"
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="123456"
              value={code}
              onChange={(e) => handleChange('code', e.target.value)}
              onBlur={() => blurField('code')}
              autoComplete="one-time-code"
              autoFocus
              aria-describedby={errors.code && touched.code ? 'code-error' : undefined}
              aria-invalid={!!(errors.code && touched.code)}
              className={cn(
                inputBase,
                'text-center tracking-[0.3em] font-mono text-lg',
                errors.code && touched.code
                  ? 'border-destructive focus-visible:ring-destructive/40 text-destructive'
                  : 'border-input focus-visible:ring-ring',
              )}
            />
            {errors.code && touched.code && (
              <p id="code-error" className="text-xs text-destructive">
                {errors.code}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Verifying…' : 'Sign in'}
          </Button>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors"
            >
              Use a different email
            </button>
            <button
              type="button"
              onClick={handleResend}
              disabled={resent || loading}
              className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors disabled:opacity-50 disabled:pointer-events-none"
            >
              {resent ? 'Code resent' : 'Resend code'}
            </button>
          </div>
        </>
      )}
    </form>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function LoginPage() {
  return (
    <div className="flex min-h-svh">
      {/* Left panel - illustration, desktop only */}
      <div className="relative hidden lg:flex flex-1 flex-col items-center justify-center gap-6 border-r border-border bg-primary/5 p-12">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/illustrations/online-learning.svg"
          alt=""
          aria-hidden
          className="w-full max-w-sm select-none"
          draggable={false}
        />
        <div className="text-center">
          <p className="text-sm font-semibold">IBS Student Hub</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Hochschule Furtwangen University · International Business Studies
          </p>
        </div>
        <a
          href="https://storyset.com/education"
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-4 text-[10px] text-muted-foreground/40 transition-colors hover:text-muted-foreground"
        >
          Illustration by Storyset
        </a>
      </div>

      {/* Right panel - form */}
      <div className="flex flex-1 flex-col items-center justify-center gap-8 p-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground text-xl font-bold">
            IBS
          </div>
          <h1 className="text-2xl font-semibold">Welcome back</h1>
          <p className="text-sm text-muted-foreground">
            Enter your student email and current semester to continue.
          </p>
        </div>

        <Suspense>
          <LoginForm />
        </Suspense>

        <div className="flex flex-col items-center gap-1.5 text-center">
          <p className="text-xs text-muted-foreground lg:hidden">
            Hochschule Furtwangen University · International Business Studies
          </p>
          <p className="text-xs text-muted-foreground">
            By signing in you acknowledge our{' '}
            <Link href="/privacy" className="underline underline-offset-2 hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            {'. '}
            A strictly necessary session cookie is set upon sign-in.
          </p>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <span className="opacity-40">·</span>
            <Link href="/imprint" className="hover:text-foreground transition-colors">Imprint</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
