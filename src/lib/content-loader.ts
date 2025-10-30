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
export async function loadProjects(preferredLocale?: Locale): Promise<Project[]> {
  console.log('Loading projects from content files...')
  const projects: Project[] = []
  
  // プロジェクトフォルダのリストを取得（ミドルウェアのディレクトリ一覧を優先）
  let projectFolders: string[] = []
  try {
    const res = await fetch('/__content/list/projects')
    if (res.ok) {
      const body = await res.json()
      if (Array.isArray(body.items)) projectFolders = body.items
    }
  } catch {}
  // フォールバック（固定リスト）
  if (projectFolders.length === 0) {
    projectFolders = [
      'project-1-deep-learning-medical-image',
      'project-2-nlp-document-classification',
      'project-3-computer-vision-robotics',
      'project-4-data-visualization-platform',
      'project-5-blockchain-identity-management'
    ]
  }

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
        title: preferredLocale && metadata.title && metadata.title[preferredLocale]
          ? metadata.title[preferredLocale]
          : (metadata.title.ja || metadata.title.en || metadata.title),
        slug: metadata.slug,
        status: metadata.status,
        date: metadata.date,
        tags: metadata.tags || [],
        summary: preferredLocale && metadata.summary && metadata.summary[preferredLocale]
          ? metadata.summary[preferredLocale]
          : (metadata.summary.ja || metadata.summary.en || metadata.summary),
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
    'paper-5-vr-scroll-shape-device-proposal',
    'paper-6-single-motor-scroll-haptic-device',
    'paper-7-fingertip-tilt-shape-presentation-device',
    'paper-8-virtual-key-electrical-stimulation-params',
    'paper-9-tape-tics-proposal-ieice',
    'paper-10-hap-n-roll-scroll-inspired-device',
    'paper-11-fresneldeformable-softness-pseudo-stiffness',
    'paper-12-enhancing-visuo-haptic-coherency-tilt',
    'paper-13-tape-type-vibrotactile-feedback-system-design',
    'paper-14-tape-tics-education-rapid-prototyping',
    'paper-15-mixed-hands'
  ]

  for (const folder of paperFolders) {
    // まず info/metadata.json を試し、なければ 直下の metadata.json を読む
    let metadata = await loadMetadata<any>(`/papers/${folder}/info/metadata.json`)
    if (!metadata) {
      metadata = await loadMetadata<any>(`/papers/${folder}/metadata.json`)
    }
    if (metadata) {
      const normalizedArxiv = metadata.arxiv || metadata.arXiv || metadata.arxivURL || metadata.arXivUrl || metadata.arxivUrl || ''
      // メタデータをPaper型に変換
      const paper: Paper = {
        id: metadata.id,
        title: metadata.title,
        venue: metadata.venue,
        year: metadata.year,
        authors: metadata.authors,
        url: metadata.url || '',
        pdfUrl: metadata.pdfUrl || '',
        relatedProjects: metadata.relatedProjects || [],
        language: metadata.language,
        categories: metadata.categories || {
          scope: '国際',
          type: '会議',
          peerReview: '査読付き'
        },
        doi: metadata.doi || '',
        arxiv: normalizedArxiv,
        slidesUrl: metadata.slidesUrl || '',
        posterUrl: metadata.posterUrl || '',
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

// 動的に projects フォルダ一覧を取得
async function listProjectFolders(): Promise<string[]> {
  try {
    const res = await fetch('/__content/list/projects')
    if (!res.ok) return []
    const body = await res.json()
    return Array.isArray(body.items) ? body.items : []
  } catch {
    return []
  }
}

// 特定のプロジェクトの詳細データを読み込む関数
export async function loadProjectDetail(slug: string, preferredLocale?: Locale): Promise<Project | null> {
  let projectFolders = await listProjectFolders()
  if (projectFolders.length === 0) {
    projectFolders = [
      'project-1-deep-learning-medical-image',
      'project-2-nlp-document-classification',
      'project-3-computer-vision-robotics',
      'project-4-data-visualization-platform',
      'project-5-blockchain-identity-management'
    ]
  }

  for (const folder of projectFolders) {
    const metadata = await loadMetadata<any>(`/projects/${folder}/info/metadata.json`)
    if (metadata && metadata.slug === slug) {
      // 説明本文（Markdown）を読み込み、簡易ブロックへ変換
      let bodyBlocks: { type: string; content: string; children?: any[] }[] = []
      try {
        const mdRes = await fetch(`${CONTENT_BASE_PATH}/projects/${folder}/content/description.md`)
        if (mdRes.ok) {
          let md = await mdRes.text()
          // 先頭H1を除去
          md = md.replace(/^\s*#\s+.*\n?/, '')
          // H4+ を H3 に丸める
          md = md.replace(/^(\s*)######\s/gm, '$1### ')
          md = md.replace(/^(\s*)#####\s/gm, '$1### ')
          md = md.replace(/^(\s*)####\s/gm, '$1### ')

          // 行単位パーサ（空行不要、行頭の見出しを確実に検出）
          const lines = md.split(/\r?\n/)
          const blocks: { type: string; content: string; level?: number; children?: any[] }[] = []
          let paragraphBuf: string[] = []
          const flushParagraph = () => {
            const text = paragraphBuf.join('\n').trim()
            if (text) blocks.push({ type: 'paragraph', content: text })
            paragraphBuf = []
          }
          let listBuf: string[] | null = null
          const flushList = () => {
            if (listBuf && listBuf.length) {
              blocks.push({ type: 'list', content: '', children: listBuf.map(it => ({ type: 'listItem', content: it })) })
            }
            listBuf = null
          }
          for (const rawLine of lines) {
            const line = rawLine.replace(/\s+$/,'')
            const heading = line.match(/^(#+)\s*(.*)$/)
            if (heading) {
              flushParagraph(); flushList()
              const level = Math.min(heading[1].length, 3)
              blocks.push({ type: 'heading', level, content: heading[2] })
              continue
            }
            const listMatch = line.match(/^[-*+]\s+(.*)$/)
            if (listMatch) {
              flushParagraph()
              if (!listBuf) listBuf = []
              listBuf.push(listMatch[1])
              continue
            }
            // 空行で区切り
            if (/^\s*$/.test(line)) { flushParagraph(); flushList(); continue }
            // それ以外は段落
            if (listBuf) { flushList() }
            paragraphBuf.push(line)
          }
          flushParagraph(); flushList()
          bodyBlocks = blocks
        }
      } catch (e) {
        console.warn('Failed to load project description markdown:', e)
      }
      return {
        id: metadata.id,
        title: preferredLocale && metadata.title && metadata.title[preferredLocale]
          ? metadata.title[preferredLocale]
          : (metadata.title.ja || metadata.title.en || metadata.title),
        slug: metadata.slug,
        status: metadata.status,
        date: metadata.date,
        tags: metadata.tags || [],
        summary: preferredLocale && metadata.summary && metadata.summary[preferredLocale]
          ? metadata.summary[preferredLocale]
          : (metadata.summary.ja || metadata.summary.en || metadata.summary),
        body: bodyBlocks,
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
  ]

  for (const folder of paperFolders) {
    let metadata = await loadMetadata<any>(`/papers/${folder}/info/metadata.json`)
    if (!metadata) {
      metadata = await loadMetadata<any>(`/papers/${folder}/metadata.json`)
    }
    if (metadata && metadata.id === id) {
      const normalizedArxiv = metadata.arxiv || metadata.arXiv || metadata.arxivURL || metadata.arXivUrl || metadata.arxivUrl || ''
      return {
        id: metadata.id,
        title: metadata.title,
        venue: metadata.venue,
        year: metadata.year,
        authors: metadata.authors,
        url: metadata.url || '',
        pdfUrl: metadata.pdfUrl || '',
        relatedProjects: metadata.relatedProjects || [],
        language: metadata.language,
        categories: metadata.categories || {
          scope: '国際',
          type: '会議',
          peerReview: '査読付き'
        },
        doi: metadata.doi || '',
        arxiv: normalizedArxiv,
        slidesUrl: metadata.slidesUrl || '',
        posterUrl: metadata.posterUrl || '',
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
  const mod: any = await import('./notion')
  return {
    projects: mod.mockProjects ?? [],
    papers: mod.mockPapers ?? [],
    news: mod.mockNews ?? []
  }
}
