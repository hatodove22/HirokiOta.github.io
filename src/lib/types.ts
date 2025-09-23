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
    scope: '国際' | '国内' | '学位論文'
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