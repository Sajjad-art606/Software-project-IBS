export interface Session {
  studentId: string
  semester: number
  displayName?: string
}

export const COOKIE_NAME = 'ibs-session'

export function encodeSession(session: Session): string {
  return Buffer.from(JSON.stringify(session)).toString('base64')
}

export function decodeSession(raw: string): Session | null {
  try {
    const parsed = JSON.parse(Buffer.from(raw, 'base64').toString('utf-8'))
    if (
      typeof parsed.studentId === 'string' &&
      typeof parsed.semester === 'number'
    ) {
      return parsed as Session
    }
    return null
  } catch {
    return null
  }
}
