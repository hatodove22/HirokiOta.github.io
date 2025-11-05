import { Project, Paper, NewsItem, NewsPost, Locale, NotionBlock } from './types'

// コンテンツディレクトリのベースパス
const CONTENT_BASE_PATH = '/content'

const PROJECT_FALLBACK_FOLDERS = [
  'project-1-deep-learning-medical-image',
  'project-2-nlp-document-classification',
  'project-3-computer-vision-robotics',
  'project-4-data-visualization-platform',
  'project-5-blockchain-identity-management'
]

const PAPER_FALLBACK_FOLDERS = [
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

const NEWS_FALLBACK_FOLDERS = [
  'news-3-dc2-accepted',
  'news-4-france-study-abroad'
]

function parseMarkdownToBlocks(md: string): NotionBlock[] {
  const lines = md.replace(/\r\n/g, '\n').split('\n')
  const blocks: NotionBlock[] = []
  let paragraphBuf: string[] = []
  let listBuf: string[] = []
  let isOrderedList: boolean | null = null

  const flushParagraph = () => {
    const text = paragraphBuf.join('\n').trim()
    if (text) {
      blocks.push({ type: 'paragraph', content: text })
    }
    paragraphBuf = []
  }

  const flushList = () => {
    if (listBuf.length) {
      blocks.push({
        type: 'list',
        content: '',
        children: listBuf.map((item) => ({ type: 'listItem', content: item.trim() })),
        ordered: isOrderedList === true
      } as NotionBlock & { ordered: boolean })
    }
    listBuf = []
    isOrderedList = null
  }

  for (const rawLine of lines) {
    const line = rawLine.replace(/\s+$/, '')

    const heading = line.match(/^(#{1,6})\s+(.*)$/)
    if (heading) {
      flushParagraph()
      flushList()
      const level = Math.min(heading[1].length, 6) // H1-H6まで対応
      blocks.push({ type: 'heading', content: heading[2].trim(), children: [], level } as NotionBlock & { level: number })
      continue
    }

    const listMatch = line.match(/^[-*+]\s+(.*)$/)
    if (listMatch) {
      // 箇条書きリストと番号付きリストが混在している場合はフラッシュ
      if (isOrderedList === true) {
        flushList()
      }
      flushParagraph()
      isOrderedList = false
      listBuf.push(listMatch[1])
      continue
    }

    // 番号付きリスト（1. 2. など）
    const orderedListMatch = line.match(/^\d+\.\s+(.*)$/)
    if (orderedListMatch) {
      // 箇条書きリストと番号付きリストが混在している場合はフラッシュ
      if (isOrderedList === false) {
        flushList()
      }
      flushParagraph()
      isOrderedList = true
      listBuf.push(orderedListMatch[1])
      continue
    }

    if (/^\s*$/.test(line)) {
      flushParagraph()
      flushList()
      continue
    }

    if (listBuf.length) {
      flushList()
    }

    paragraphBuf.push(line)
  }

  flushParagraph()
  flushList()

  return blocks
}

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
  
  // プロジェクトフォルダのリストを取得（ビルド時に出力される静的JSONを優先）
  let projectFolders: string[] = []
  try {
    let res = await fetch('/__content/list/projects.json')
    if (!res.ok) {
      // dev ミドルウェア互換
      res = await fetch('/__content/list/projects')
    }
    if (res.ok) {
      const body = await res.json()
      if (Array.isArray(body.items)) projectFolders = body.items
    }
  } catch {}
  // フォールバック（固定リスト）
  if (projectFolders.length === 0) {
    projectFolders = PROJECT_FALLBACK_FOLDERS
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
  let paperFolders = await listPaperFolders()
  if (paperFolders.length === 0) {
    paperFolders = PAPER_FALLBACK_FOLDERS
  }

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
  let newsFolders = await listNewsFolders()
  if (newsFolders.length === 0) {
    newsFolders = NEWS_FALLBACK_FOLDERS
  } else {
    // 自動スキャンで取得されたフォルダにフォールバックフォルダをマージ（重複を除外）
    const fallbackSet = new Set(NEWS_FALLBACK_FOLDERS)
    const scannedSet = new Set(newsFolders)
    const merged = [...newsFolders, ...NEWS_FALLBACK_FOLDERS.filter(f => !scannedSet.has(f))]
    newsFolders = merged
  }

  for (const folder of newsFolders) {
    const metadata = await loadMetadata<any>(`/news/${folder}/info/metadata.json`)
    if (metadata) {
      // status が "published" の場合のみ読み込む（status が指定されていない場合は読み込む）
      if (metadata.status && metadata.status !== 'published') {
        continue
      }
      const slug = metadata.slug || folder.replace(/^news-\d+-/, '')
      // ロケールに応じたタイトルを取得（プロジェクトと同じ構造をサポート）
      // metadata.title がオブジェクト形式 { ja: string, en: string } の場合は日本語版を優先
      // 文字列形式の場合は後方互換性のためそのまま使用
      const title = (typeof metadata.title === 'object' && metadata.title !== null && metadata.title.ja)
        ? metadata.title.ja
        : (metadata.title?.ja || metadata.title?.en || metadata.title || slug)
      const language = metadata.language || 'ja'
      const newsItem: NewsItem = {
        id: metadata.id || folder,
        title,
        date: metadata.date || '',
        link: metadata.link || `#/news/${slug}`,
        category: metadata.category || 'general',
        readTime: metadata.readTime || '5 min',
        language
      }
      news.push(newsItem)
    }
  }

  return news
}

// 動的に projects フォルダ一覧を取得
async function listProjectFolders(): Promise<string[]> {
  try {
    let res = await fetch('/__content/list/projects.json')
    if (!res.ok) {
      res = await fetch('/__content/list/projects')
    }
    if (!res.ok) return []
    const body = await res.json()
    return Array.isArray(body.items) ? body.items : []
  } catch {
    return []
  }
}

async function listPaperFolders(): Promise<string[]> {
  try {
    let res = await fetch('/__content/list/papers.json')
    if (!res.ok) {
      res = await fetch('/__content/list/papers')
    }
    if (!res.ok) return []
    const body = await res.json()
    return Array.isArray(body.items) ? body.items : []
  } catch {
    return []
  }
}

async function listNewsFolders(): Promise<string[]> {
  try {
    let res = await fetch('/__content/list/news.json')
    if (!res.ok) {
      res = await fetch('/__content/list/news')
    }
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
    projectFolders = PROJECT_FALLBACK_FOLDERS
  }

  for (const folder of projectFolders) {
    const metadata = await loadMetadata<any>(`/projects/${folder}/info/metadata.json`)
    if (metadata && metadata.slug === slug) {
      // 説明本文（Markdown）を読み込み、簡易ブロックへ変換
      let bodyBlocks: NotionBlock[] = []
      try {
        // locale優先で description_<locale>.md -> 既定 description.md の順で取得
        const tryPaths: string[] = []
        if (preferredLocale) {
          tryPaths.push(`${CONTENT_BASE_PATH}/projects/${folder}/content/description_${preferredLocale}.md`)
        }
        tryPaths.push(`${CONTENT_BASE_PATH}/projects/${folder}/content/description.md`)
        let mdText: string | null = null
        for (const p of tryPaths) {
          const res = await fetch(p)
          if (res.ok) { mdText = await res.text(); break }
        }
        if (mdText !== null) {
          let md = mdText
          // 先頭H1を除去
          md = md.replace(/^\s*#\s+.*\n?/, '')
          // H4+ を H3 に丸める
          md = md.replace(/^(\s*)######\s/gm, '$1### ')
          md = md.replace(/^(\s*)#####\s/gm, '$1### ')
          md = md.replace(/^(\s*)####\s/gm, '$1### ')

          // 行単位パーサ（空行不要、行頭の見出しを確実に検出）
          bodyBlocks = parseMarkdownToBlocks(md)
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
  let paperFolders = await listPaperFolders()
  if (paperFolders.length === 0) {
    paperFolders = PAPER_FALLBACK_FOLDERS
  }

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
export async function loadNewsDetail(slug: string, locale: Locale = 'ja'): Promise<NewsPost | null> {
  console.log(`loadNewsDetail called with slug: ${slug}, locale: ${locale}`)
  let newsFolders = await listNewsFolders()
  if (newsFolders.length === 0) {
    newsFolders = NEWS_FALLBACK_FOLDERS
  } else {
    // 自動スキャンで取得されたフォルダにフォールバックフォルダをマージ（重複を除外）
    const fallbackSet = new Set(NEWS_FALLBACK_FOLDERS)
    const scannedSet = new Set(newsFolders)
    const merged = [...newsFolders, ...NEWS_FALLBACK_FOLDERS.filter(f => !scannedSet.has(f))]
    newsFolders = merged
  }
  
  console.log(`Checking ${newsFolders.length} news folders for slug: ${slug}`)

  for (const folder of newsFolders) {
    // まずロケール別のメタデータを試す
    let metadata = await loadMetadata<any>(`/news/${folder}/info/metadata_${locale}.json`)
    // ロケール別ファイルが存在しない場合は、デフォルトのメタデータを試す
    if (!metadata) {
      metadata = await loadMetadata<any>(`/news/${folder}/info/metadata.json`)
    }
    
    if (metadata) {
      console.log(`Found metadata for folder: ${folder}, slug: ${metadata.slug}, looking for: ${slug}`)
    }
    
    if (metadata && metadata.slug === slug) {
      console.log(`Matched slug! Folder: ${folder}, slug: ${slug}`)
      let content = ''
      try {
        // ロケールに応じたファイル名を生成 (article_ja.md または article_en.md)
        const articleFile = `article_${locale}.md`
        const articlePath = `${CONTENT_BASE_PATH}/news/${folder}/content/${articleFile}`
        console.log(`Attempting to load article file: ${articlePath} for slug: ${slug}, locale: ${locale}`)
        let contentResponse = await fetch(articlePath)
        
        // ロケール別ファイルが存在しない場合は、後方互換性のため article.md を試す
        if (!contentResponse.ok) {
          console.log(`Article file ${articleFile} not found for ${slug} (status: ${contentResponse.status}), trying article.md`)
          const fallbackPath = `${CONTENT_BASE_PATH}/news/${folder}/content/article.md`
          contentResponse = await fetch(fallbackPath)
          if (!contentResponse.ok) {
            console.warn(`Fallback article.md also not found for ${slug} (status: ${contentResponse.status})`)
          }
        }
        
        if (contentResponse.ok) {
          content = await contentResponse.text()
          console.log(`Successfully loaded content for ${slug} (locale: ${locale}), length: ${content.length}`)
        } else {
          console.warn(`Failed to load content for ${slug} (locale: ${locale}), status: ${contentResponse.status}, path: ${articlePath}`)
        }
      } catch (error) {
        console.error(`Error loading content for ${slug} (locale: ${locale}):`, error)
      }
      
      // コンテンツが空でも、メタデータが見つかった場合は NewsPost を返す
      // （ロケール別ファイルが存在しない場合でも、メタデータがある場合は返す）

      // ロケールに応じたタイトルとサマリーを取得（プロジェクトと同じ構造をサポート）
      // metadata.title がオブジェクト形式 { ja: string, en: string } の場合はロケールに応じた値を取得
      // 文字列形式の場合は後方互換性のためそのまま使用
      const title = (typeof metadata.title === 'object' && metadata.title !== null && metadata.title[locale])
        ? metadata.title[locale]
        : (metadata.title?.ja || metadata.title?.en || metadata.title || slug)
      
      // metadata.summary も同様に処理
      let summary = ''
      if (typeof metadata.summary === 'object' && metadata.summary !== null && metadata.summary[locale]) {
        summary = metadata.summary[locale]
      } else if (metadata.summary?.ja || metadata.summary?.en || metadata.summary) {
        summary = metadata.summary.ja || metadata.summary.en || metadata.summary
      }
      
      const tags = Array.isArray(metadata.tags) ? metadata.tags.map(tag => String(tag)) : []

      let bodyBlocks: NotionBlock[] = []
      if (content) {
        bodyBlocks = parseMarkdownToBlocks(content)
      } else if (Array.isArray(metadata.body)) {
        bodyBlocks = metadata.body as NotionBlock[]
      }

      // サマリーが空の場合、本文の最初の段落から取得
      if (!summary && bodyBlocks.length) {
        const firstParagraph = bodyBlocks.find(block => block.type === 'paragraph' && block.content)?.content
        if (firstParagraph) {
          summary = firstParagraph.split('\n')[0]
        }
      }

      // ロケールに応じて返されるコンテンツのロケールを設定
      const postLanguage = locale as Locale
      
      return {
        id: metadata.id || slug,
        title,
        slug: metadata.slug || slug,
        date: metadata.date || '',
        summary,
        tags,
        content,
        body: bodyBlocks,
        heroImage: metadata.heroImage || '',
        readTime: metadata.readTime || '5 min',
        language: postLanguage, // 読み込んだロケールを設定
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
