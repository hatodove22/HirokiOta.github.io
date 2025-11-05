import { Locale, SEOData } from './types'
import { getTranslations } from './i18n'

export function generateSEOData(
  locale: Locale,
  page: string,
  options: Partial<SEOData> = {}
): SEOData {
  const t = getTranslations(locale)
  const baseUrl = (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SITE_URL) || 'https://portfolio.example.com'

  const defaultData: Record<string, SEOData> = {
    home: {
      title: `${t.about.profile.name} - ${t.home.title}`,
      description: t.home.description,
      keywords: ['PhD', 'Machine Learning', 'Deep Learning', 'Computer Vision', 'Research'],
      ogImage: `${baseUrl}/og-image.png`,
    },
    about: {
      title: `${t.about.title} - ${t.about.profile.name}`,
      description: locale === 'ja' 
        ? '機械学習とコンピュータビジョンを専門とする博士課程学生のプロフィール'
        : 'Profile of a PhD student specializing in machine learning and computer vision',
      keywords: ['Biography', 'Education', 'Research Experience', 'Academic CV'],
    },
    projects: {
      title: `${t.projects.title} - ${t.about.profile.name}`,
      description: locale === 'ja'
        ? '機械学習、深層学習、コンピュータビジョンの研究プロジェクト'
        : 'Research projects in machine learning, deep learning, and computer vision',
      keywords: ['Research Projects', 'Open Source', 'Machine Learning', 'AI'],
    },
    papers: {
      title: `${t.papers.title} - ${t.about.profile.name}`,
      description: locale === 'ja'
        ? '国際会議・ジャーナルで発表した研究論文'
        : 'Research papers published in international conferences and journals',
      keywords: ['Academic Papers', 'Publications', 'Research', 'Citations'],
    },
    contact: {
      title: `${t.contact.title} - ${t.about.profile.name}`,
      description: t.contact.description,
      keywords: ['Contact', 'Collaboration', 'Research Inquiry', 'Hiring'],
    },
  }

  const pageData = defaultData[page] || defaultData.home
  const seoData: SEOData = {
    ...pageData,
    ...options,
  }

  // Add hreflang alternates
  seoData.alternates = {
    canonical: `${baseUrl}/${locale}${page === 'home' ? '' : `/${page}`}`,
    hreflang: {
      'ja': `${baseUrl}/ja${page === 'home' ? '' : `/${page}`}`,
      'en': `${baseUrl}/en${page === 'home' ? '' : `/${page}`}`,
      'x-default': `${baseUrl}/ja${page === 'home' ? '' : `/${page}`}`,
    },
  }

  return seoData
}

export function generateStructuredData(
  locale: Locale,
  type: 'Person' | 'Project' | 'ScholarlyArticle',
  data: any
) {
  const t = getTranslations(locale)
  const baseUrl = (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SITE_URL) || 'https://portfolio.example.com'

  switch (type) {
    case 'Person':
      return {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: t.about.profile.name,
        jobTitle: t.about.profile.title,
        affiliation: {
          '@type': 'Organization',
          name: t.about.profile.affiliation,
        },
        url: baseUrl,
        sameAs: [
          'https://scholar.google.com/citations?user=example',
          'https://github.com/example',
          'https://orcid.org/0009-0003-5546-921X',
          'https://linkedin.com/in/example',
        ],
        knowsAbout: [
          'Machine Learning',
          'Deep Learning',
          'Computer Vision',
          'Natural Language Processing',
          'Medical Image Analysis',
        ],
      }

    case 'Project':
      return {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: data.title,
        description: data.summary,
        author: {
          '@type': 'Person',
          name: t.about.profile.name,
        },
        dateCreated: data.date,
        programmingLanguage: 'Python',
        codeRepository: data.repoUrl,
        applicationCategory: 'Research',
      }

    case 'ScholarlyArticle':
      return {
        '@context': 'https://schema.org',
        '@type': 'ScholarlyArticle',
        headline: data.title,
        author: data.authors.split(',').map((author: string) => ({
          '@type': 'Person',
          name: author.trim().replace(/\*\*/g, ''),
        })),
        datePublished: `${data.year}-01-01`,
        publisher: {
          '@type': 'Organization',
          name: data.venue,
        },
        url: data.doi || data.url,
      }

    default:
      return null
  }
}