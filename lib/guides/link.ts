export function isExternalUrl(url: string): boolean {
  return /^https?:\/\//i.test(url)
}

export function getLinkTarget(url: string): '_blank' | undefined {
  return isExternalUrl(url) ? '_blank' : undefined
}

export function getLinkRel(url: string): string | undefined {
  return isExternalUrl(url) ? 'noopener noreferrer' : undefined
}
