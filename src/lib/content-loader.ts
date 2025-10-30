import { Project, Paper, NewsItem, NewsPost, Locale } from './types'

// コンテンツディレクトリのベースパス
const CONTENT_BASE_PATH = '/content'

// ファイルシステムからメタデータを読み込む関数
async function loadMetadata<T>(path: string): Promise<T | null> {
  try {
    console.log(`Loading metadata from: ${CONTENT_BASE_PATH}${path}`)
    const response = await fetch(`${CONTENT_BASE_PATH}${path}`)
    console.log(`Response status: ${response.status}`)
    if (!response.ok) {
      console.warn(`Failed to load metadata from ${path}: ${response.status}`)
      return null
    }
    const data = await response.json()
    console.log(`Loaded data:`, data)
    return data
  } catch (error) {
    console.error(`Error loading metadata from ${path}:`, error)
    return null
  }
}

// プロジェクトデータを読み込む関数
export async function loadProjects(): Promise<Project[]> {
  console.log('Loading projects from content files...')
  const projects: Project[] = []
  
  // プロジェクトフォルダのリストを取得（実際の実装では、APIエンドポイントから取得）
  const projectFolders = [
    'project-1-deep-learning-medical-image',
    'project-2-nlp-document-classification',
    'project-3-computer-vision-robotics',
    'project-4-data-visualization-platform',
    'project-5-blockchain-identity-management'
  ]

  for (const folder of projectFolders) {
    console.log(`Loading project: ${folder}`)
    const metadata = await loadMetadata<any>(`/projects/${folder}/info/metadata.json`)
    if (metadata) {
      console.log(`Successfully loaded metadata for ${folder}`)
      // 言語をメタデータから推定
      const hasJa = !!(metadata.title && metadata.title.ja)
      const hasEn = !!(metadata.title && metadata.title.en)
      const inferredLanguage: Locale | 'both' = metadata.language
        ? metadata.language
        : (hasJa && hasEn) ? 'both' : hasJa ? 'ja' : 'en'

      // メタデータをProject型に変換
      const project: Project = {
        id: metadata.id,
        title: metadata.title.en || metadata.title.ja || metadata.title,
        slug: metadata.slug,
        status: metadata.status,
        date: metadata.date,
        tags: metadata.tags || [],
        summary: metadata.summary.en || metadata.summary.ja || metadata.summary,
        body: metadata.body || [],
        repoUrl: metadata.repoUrl || '',
        demoUrl: metadata.demoUrl || '',
        slidesUrl: metadata.slidesUrl || '',
        relatedPapers: metadata.relatedPapers || [],
        heroImage: metadata.heroImage || '',
        language: inferredLanguage,
        isPinned: metadata.isPinned || false
      }
      projects.push(project)
    } else {
      console.warn(`Failed to load metadata for ${folder}`)
    }
  }

  console.log(`Loaded ${projects.length} projects`)
  return projects
}

// 論文データを読み込む関数
export async function loadPapers(): Promise<Paper[]> {
  const papers: Paper[] = []
  
  // 論文フォルダのリストを取得
  const paperFolders = [
    'paper-1-umotion',
    'paper-2-vibrotactile-feedback',
    'paper-3-medical-image-segmentation',
    'paper-4-transformer-document-classification'
  ]

  for (const folder of paperFolders) {
    const metadata = await loadMetadata<any>(`/papers/${folder}/metadata.json`)
    if (metadata) {
      // メタデータをPaper型に変換
      const paper: Paper = {
        id: metadata.id,
        title: metadata.title,
        venue: metadata.venue,
        year: metadata.year,
        authors: metadata.authors,
        relatedProjects: metadata.relatedProjects || [],
        language: metadata.language,
        categories: metadata.categories || {
          scope: '国際',
          type: '会議',
          peerReview: '査読付き'
        },
        doi: metadata.doi || '',
        arxiv: metadata.arxiv || '',
        slidesUrl: metadata.slidesUrl || '',
        award: metadata.award || ''
      }
      papers.push(paper)
    }
  }

  return papers
}

// ニュースデータを読み込む関数
export async function loadNews(): Promise<NewsItem[]> {
  const news: NewsItem[] = []
  
  // ニュースフォルダのリストを取得
  const newsFolders = [
    'news-1-medical-ai-lab-notes',
    'news-2-conference-retrospective',
    'news-3-tactile-display-behind-scenes',
    'news-4-collaborating-with-clinicians'
  ]

  for (const folder of newsFolders) {
    const metadata = await loadMetadata<any>(`/news/${folder}/info/metadata.json`)
    if (metadata) {
      // メタデータをNewsItem型に変換
      const newsItem: NewsItem = {
        id: metadata.id,
        title: metadata.title,
        date: metadata.date,
        link: metadata.link || '',
        category: metadata.category || 'general',
        readTime: metadata.readTime || '5 min',
        language: metadata.language || 'ja'
      }
      news.push(newsItem)
    }
  }

  return news
}

// 特定のプロジェクトの詳細データを読み込む関数
export async function loadProjectDetail(slug: string): Promise<Project | null> {
  const projectFolders = [
    'project-1-deep-learning-medical-image',
    'project-2-nlp-document-classification',
    'project-3-computer-vision-robotics',
    'project-4-data-visualization-platform',
    'project-5-blockchain-identity-management'
  ]

  for (const folder of projectFolders) {
    const metadata = await loadMetadata<any>(`/projects/${folder}/info/metadata.json`)
    if (metadata && metadata.slug === slug) {
      return {
        id: metadata.id,
        title: metadata.title.en || metadata.title.ja || metadata.title,
        slug: metadata.slug,
        status: metadata.status,
        date: metadata.date,
        tags: metadata.tags || [],
        summary: metadata.summary.en || metadata.summary.ja || metadata.summary,
        body: metadata.body || [],
        repoUrl: metadata.repoUrl || '',
        demoUrl: metadata.demoUrl || '',
        slidesUrl: metadata.slidesUrl || '',
        relatedPapers: metadata.relatedPapers || [],
        heroImage: metadata.heroImage || '',
        language: metadata.language || 'en',
        isPinned: metadata.isPinned || false
      }
    }
  }

  return null
}

// 特定の論文の詳細データを読み込む関数
export async function loadPaperDetail(id: string): Promise<Paper | null> {
  const paperFolders = [
    'paper-1-umotion',
    'paper-2-vibrotactile-feedback',
    'paper-3-medical-image-segmentation',
    'paper-4-transformer-document-classification'
  ]

  for (const folder of paperFolders) {
    const metadata = await loadMetadata<any>(`/papers/${folder}/metadata.json`)
    if (metadata && metadata.id === id) {
      return {
        id: metadata.id,
        title: metadata.title,
        venue: metadata.venue,
        year: metadata.year,
        authors: metadata.authors,
        relatedProjects: metadata.relatedProjects || [],
        language: metadata.language,
        categories: metadata.categories || {
          scope: '国際',
          type: '会議',
          peerReview: '査読付き'
        },
        doi: metadata.doi || '',
        arxiv: metadata.arxiv || '',
        slidesUrl: metadata.slidesUrl || '',
        award: metadata.award || ''
      }
    }
  }

  return null
}

// 特定のニュース記事の詳細データを読み込む関数
export async function loadNewsDetail(slug: string): Promise<NewsPost | null> {
  const newsFolders = [
    'news-1-medical-ai-lab-notes',
    'news-2-conference-retrospective',
    'news-3-tactile-display-behind-scenes',
    'news-4-collaborating-with-clinicians'
  ]

  for (const folder of newsFolders) {
    const metadata = await loadMetadata<any>(`/news/${folder}/info/metadata.json`)
    if (metadata && metadata.slug === slug) {
      // 記事本文を読み込む
      let content = ''
      try {
        const contentResponse = await fetch(`${CONTENT_BASE_PATH}/news/${folder}/content/article.md`)
        if (contentResponse.ok) {
          content = await contentResponse.text()
        }
      } catch (error) {
        console.error(`Error loading content for ${slug}:`, error)
      }

      return {
        id: metadata.id,
        title: metadata.title,
        slug: metadata.slug,
        date: metadata.date,
        content: content,
        heroImage: metadata.heroImage || '',
        readTime: metadata.readTime || '5 min',
        language: metadata.language || 'ja',
        author: metadata.author || '太田裕紀',
        category: metadata.category || 'general'
      }
    }
  }

  return null
}

// フォールバック用のモックデータ読み込み関数
export async function loadMockData() {
  // 既存のnotion.tsからモックデータをインポート
  const { mockProjects, mockPapers, mockNews } = await import('./notion')
  return {
    projects: mockProjects,
    papers: mockPapers,
    news: mockNews
  }
}
