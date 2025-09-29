export type Locale = 'ja' | 'en'

export const defaultLocale: Locale = 'ja'
export const locales: Locale[] = ['ja', 'en']

export interface Project {
  id: string
  title: string
  slug: string
  status: 'Draft' | 'Published'
  date: string
  tags: string[]
  summary: string
  body: NotionBlock[]
  repoUrl?: string
  demoUrl?: string
  slidesUrl?: string
  relatedPapers: string[]
  heroImage?: string
  language: Locale
  isPinned?: boolean
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  date: string
  tags: string[]
  summary: string
  heroImage?: string
  readTime?: string
  body: { heading: string; content: string }[]
  language: Locale
}

export interface Paper {
  id: string
  title: string
  venue: string
  year: number
  authors: string
  doi?: string
  arxiv?: string
  slidesUrl?: string
  posterUrl?: string
  award?: string
  relatedProjects: string[]
  language: Locale | 'both'
  categories: {
    scope: '国内' | '国際' | '学位論文'
    type: 'ジャーナル' | '会議' | 'ワークショップ'
    peerReview: '査読付き' | '査読なし'
  }
}

export interface NewsItem {
  id: string
  title: string
  date: string
  link?: string
  language: Locale
}

// Edit Mode (Proto) — News schema baseline
export type NewsStatus = 'draft' | 'reviewing' | 'published'

export interface NewsLocaleContent {
  title: string
  summary?: string
  body?: string
  alt?: string
}

export interface NewsDraft {
  id: string
  slug: string
  date: string // YYYY-MM-DD
  tags?: string[]
  imageUrl?: string
  status: NewsStatus
  publish: { ja: boolean; en: boolean }
  content: { ja: NewsLocaleContent; en: NewsLocaleContent }
}

// Helper to project a draft into locale-specific display item
export function toNewsItem(draft: NewsDraft, locale: Locale): NewsItem | null {
  const enabled = draft.publish[locale]
  const title = draft.content[locale]?.title?.trim()
  if (!enabled || !title) return null
  return {
    id: draft.id,
    title,
    date: draft.date,
    link: `#/news/${draft.slug}?lang=${locale}`,
    language: locale,
  }
}

export interface NotionBlock {
  type: string
  content: string
  children?: NotionBlock[]
}

export interface ContactFormData {
  name: string
  affiliation: string
  email: string
  purpose: string
  message: string
}

export interface FilterParams {
  tag?: string
  year?: number
  page?: number
  q?: string
  venue?: string
}

export interface SEOData {
  title: string
  description: string
  keywords?: string[]
  ogImage?: string
  alternates?: {
    canonical?: string
    hreflang?: Record<string, string>
  }
}
