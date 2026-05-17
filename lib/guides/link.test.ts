import { describe, expect, it } from 'vitest'
import { getLinkRel, getLinkTarget, isExternalUrl } from './link'

describe('isExternalUrl', () => {
  it('detects http(s) URLs', () => {
    expect(isExternalUrl('https://felix.hs-furtwangen.de/')).toBe(true)
    expect(isExternalUrl('http://example.com')).toBe(true)
  })

  it('treats app paths as internal', () => {
    expect(isExternalUrl('/guides/foo')).toBe(false)
    expect(isExternalUrl('/documents')).toBe(false)
    expect(isExternalUrl('mailto:a@b.de')).toBe(false)
  })
})

describe('getLinkTarget', () => {
  it('opens external links in new tab', () => {
    expect(getLinkTarget('https://example.com')).toBe('_blank')
  })

  it('uses same tab for internal paths', () => {
    expect(getLinkTarget('/guides/city-registration-anmeldung')).toBeUndefined()
    expect(getLinkTarget('/documents')).toBeUndefined()
  })
})

describe('getLinkRel', () => {
  it('adds rel only for external URLs', () => {
    expect(getLinkRel('https://example.com')).toBe('noopener noreferrer')
    expect(getLinkRel('/contacts')).toBeUndefined()
  })
})
