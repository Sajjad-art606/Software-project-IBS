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

function validateStudentId(value: string): string {
  const v = value.trim()
  if (!v) return 'Student ID is required.'
  if (v.length < 4) return 'Must be at least 4 characters.'
  if (v.length > 12) return 'Must be at most 12 characters.'
  if (!/^[a-zA-Z0-9]+$/.test(v)) return 'Letters and numbers only - no spaces or special characters.'
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

// ── Login form ────────────────────────────────────────────────────────────────

function LoginForm() {
  const { login } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [studentId, setStudentId] = useState('')
  const [name, setName] = useState('')
  const [semester, setSemester] = useState('')
  const [errors, setErrors] = useState({ studentId: '', name: '', semester: '' })
  const [touched, setTouched] = useState({ studentId: false, name: false, semester: false })

  function blurField(field: 'studentId' | 'name' | 'semester') {
    setTouched((t) => ({ ...t, [field]: true }))
    if (field === 'studentId') {
      setErrors((e) => ({ ...e, studentId: validateStudentId(studentId) }))
    } else if (field === 'name') {
      setErrors((e) => ({ ...e, name: validateName(name) }))
    } else {
      setErrors((e) => ({ ...e, semester: validateSemester(semester) }))
    }
  }

  function handleStudentIdChange(value: string) {
    setStudentId(value)
    if (touched.studentId) {
      setErrors((e) => ({ ...e, studentId: validateStudentId(value) }))
    }
  }

  function handleNameChange(value: string) {
    setName(value)
    if (touched.name) {
      setErrors((e) => ({ ...e, name: validateName(value) }))
    }
  }

  function handleSemesterChange(value: string) {
    setSemester(value)
    if (touched.semester) {
      setErrors((e) => ({ ...e, semester: validateSemester(value) }))
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const idErr = validateStudentId(studentId)
    const nameErr = validateName(name)
    const semErr = validateSemester(semester)
    setErrors({ studentId: idErr, name: nameErr, semester: semErr })
    setTouched({ studentId: true, name: true, semester: true })

    if (idErr || nameErr || semErr) return

    login(studentId.trim(), parseInt(semester, 10), name.trim() || undefined)
    const from = searchParams.get('from')
    router.push(from && from !== '/login' ? from : '/dashboard')
  }

  const inputBase =
    'flex h-9 w-full rounded-lg border bg-transparent px-3 py-1 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2'

  return (
    <form onSubmit={handleSubmit} noValidate className="flex w-full max-w-sm flex-col gap-4">
      {/* Student ID */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="student-id" className="text-sm font-medium">
          Student ID
        </label>
        <input
          id="student-id"
          type="text"
          placeholder="e.g. 260123456"
          value={studentId}
          onChange={(e) => handleStudentIdChange(e.target.value)}
          onBlur={() => blurField('studentId')}
          autoComplete="off"
          autoFocus
          aria-describedby={errors.studentId && touched.studentId ? 'student-id-error' : undefined}
          aria-invalid={!!(errors.studentId && touched.studentId)}
          className={cn(
            inputBase,
            errors.studentId && touched.studentId
              ? 'border-destructive focus-visible:ring-destructive/40 text-destructive'
              : 'border-input focus-visible:ring-ring',
          )}
        />
        {errors.studentId && touched.studentId && (
          <p id="student-id-error" className="text-xs text-destructive">
            {errors.studentId}
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
          placeholder="e.g. Alex Müller"
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
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
        <Select value={semester} onValueChange={(val) => handleSemesterChange(val ?? '')}>
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

      <Button type="submit" className="w-full">
        Sign in
      </Button>
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
            Enter your student ID and current semester to continue.
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
