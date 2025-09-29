import { Locale, NewsDraft } from './types'

const SLUG_RE = /^([a-z0-9-]{1,80})$/

export interface ValidationOptions {
  locales?: Locale[]
}

export function validateNewsDraft(draft: NewsDraft, _opts: ValidationOptions = {}): string[] {
  const errs: string[] = []
  if (!SLUG_RE.test(draft.slug)) errs.push('slug: a-z0-9- / 1-80 chars')
  if (!draft.date) errs.push('date: required (YYYY-MM-DD)')

  // JA
  if (draft.publish.ja) {
    if (!draft.content.ja?.title?.trim()) errs.push('JA: title required')
    if (!draft.content.ja?.alt?.trim()) errs.push('JA: image alt required')
  }

  // EN
  if (draft.publish.en) {
    if (!draft.content.en?.title?.trim()) errs.push('EN: title required')
    if (!draft.content.en?.alt?.trim()) errs.push('EN: image alt required')
  }

  return errs
}

export const slugify = (input: string): string =>
  input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)

