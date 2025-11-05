import { Project, Paper, NewsItem, NewsPost, Locale, FilterParams, NotionBlock } from './types'
import { loadProjects, loadPapers, loadNews, loadProjectDetail, loadPaperDetail, loadNewsDetail, loadMockData } from './content-loader'

// Mock data for development (used when Notion API is not configured)
const mockProjects: Project[] = [
  {
    id: '1',
    title: '医療画像解析のための深層学習',
    slug: 'deep-learning-medical-image',
    status: 'Published',
    date: '2024-03-15',
    tags: ['深層学習', '医療AI', 'コンピュータビジョン'],
    summary: '自動医療画像解析のための新しい深層学習アプローチを開発し、疾患検出において95%の精度を達成しました。',
    body: [
      {
        type: 'paragraph',
        content: 'このプロジェクトでは、医療画像解析のための先進的な深層学習モデルの開発に焦点を当てています...'
      }
    ],
    repoUrl: 'https://github.com/example/medical-ai',
    demoUrl: 'https://demo.example.com',
    slidesUrl: 'https://slides.example.com',
    relatedPapers: ['paper1'],
    heroImage: 'https://images.unsplash.com/photo-1758202292826-c40e172eed1c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwQUklMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc1ODU5NjY5M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    language: 'ja',
    isPinned: true
  },
  {
    id: '2',
    title: '自然言語処理による文書分類システム',
    slug: 'nlp-document-classification',
    status: 'Published',
    date: '2024-02-10',
    tags: ['NLP', '機械学習', 'Python'],
    summary: '大規模な文書データセットを対象とした高精度な分類システムを開発し、従来手法を20%上回る性能を実現。',
    body: [
      {
        type: 'paragraph',
        content: '本研究では、Transformerベースのモデルを使用して...'
      }
    ],
    repoUrl: 'https://github.com/example/nlp-classification',
    heroImage: 'https://images.unsplash.com/photo-1620969427101-7a2bb6d83273?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXR1cmFsJTIwbGFuZ3VhZ2UlMjBwcm9jZXNzaW5nfGVufDF8fHx8MTc1ODUxMjMwN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    relatedPapers: ['paper2'],
    language: 'ja',
    isPinned: true
  },
  {
    id: '3',
    title: '自律ロボットのためのコンピュータビジョン',
    slug: 'computer-vision-robotics',
    status: 'Published',
    date: '2024-01-20',
    tags: ['コンピュータビジョン', 'ロボティクス', '深層学習'],
    summary: '先進的なコンピュータビジョン技術により、自律ロボット向けのリアルタイム物体検出・ナビゲーションを実装。',
    body: [
      {
        type: 'paragraph',
        content: '本研究は、自律移動ロボットのナビゲーションに有効な堅牢なコンピュータビジョン手法の開発に焦点を当てています...'
      }
    ],
    repoUrl: 'https://github.com/example/robotics-cv',
    demoUrl: 'https://demo.robotics.example.com',
    heroImage: 'https://images.unsplash.com/photo-1657165235722-e50bbac41584?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wdXRlciUyMHZpc2lvbiUyMHJvYm90aWNzfGVufDF8fHx8MTc1ODU5NzUwNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    relatedPapers: [],
    language: 'ja',
    isPinned: true
  },
  {
    id: '4',
    title: 'インタラクティブデータ可視化プラットフォーム',
    slug: 'data-visualization-platform',
    status: 'Published',
    date: '2023-12-05',
    tags: ['データサイエンス', '可視化', 'Web開発'],
    summary: '双方向なデータ探索・可視化を可能にする高機能なWebプラットフォームを構築。',
    body: [
      {
        type: 'paragraph',
        content: '研究者やアナリストが対話的な可視化を容易に作成できるよう設計されています...'
      }
    ],
    repoUrl: 'https://github.com/example/data-viz-platform',
    demoUrl: 'https://dataviz.example.com',
    heroImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwdmlzdWFsaXphdGlvbiUyMGRhc2hib2FyZHxlbnwxfHx8fDE3NTg1MTQ4OTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    relatedPapers: [],
    language: 'ja',
    isPinned: true
  },
  {
    id: '5',
    title: 'ブロックチェーンID管理システム',
    slug: 'blockchain-identity-management',
    status: 'Published',
    date: '2023-11-18',
    tags: ['ブロックチェーン', 'セキュリティ', '暗号技術'],
    summary: 'プライバシーとセキュリティを両立する分散型ID管理システムをブロックチェーンで実装。',
    body: [
      {
        type: 'paragraph',
        content: 'デジタルID管理の課題に対し、ブロックチェーンを活用した実装で解決を図ります...'
      }
    ],
    repoUrl: 'https://github.com/example/blockchain-identity',
    heroImage: 'https://images.unsplash.com/photo-1590286162167-70fb467846ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibG9ja2NoYWluJTIwY3J5cHRvY3VycmVuY3l8ZW58MXx8fHwxNzU4NTQ1NzkyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    relatedPapers: [],
    language: 'ja',
    isPinned: true
  },
  {
    id: '6',
    title: 'ロボット制御のためのコンピュータビジョン',
    slug: 'robotics-computer-vision-ja',
    status: 'Published',
    date: '2024-01-20',
    tags: ['コンピュータビジョン', 'ロボティクス', 'Deep Learning'],
    summary: '自律ロボットのためのリアルタイム物体検出とナビゲーションシステムを先進的なコンピュータビジョン技術で実装。',
    body: [
      {
        type: 'paragraph',
        content: '本研究では、自律ロボットナビゲーションのための堅牢なコンピュータビジョンアルゴリズムの開発に焦点を当てています...'
      }
    ],
    repoUrl: 'https://github.com/example/robotics-cv-ja',
    demoUrl: 'https://demo.robotics.example.com',
    heroImage: 'https://images.unsplash.com/photo-1657165235722-e50bbac41584?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wdXRlciUyMHZpc2lvbiUyMHJvYm90aWNzfGVufDF8fHx8MTc1ODU5NzUwNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    relatedPapers: [],
    language: 'ja',
    isPinned: true
  },
  {
    id: '7',
    title: 'インタラクティブデータ可視化プラットフォーム',
    slug: 'data-visualization-platform-ja',
    status: 'Published',
    date: '2023-12-05',
    tags: ['データサイエンス', '可視化', 'Web開発'],
    summary: '高度な解析機能を備えたインタラクティブなデータ探索・可視化のためのWebベースプラットフォームを構築。',
    body: [
      {
        type: 'paragraph',
        content: 'このプラットフォームは、研究者やアナリストがインタラクティブな可視化を作成できるようにします...'
      }
    ],
    repoUrl: 'https://github.com/example/data-viz-platform-ja',
    demoUrl: 'https://dataviz.example.com',
    heroImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwdmlzdWFsaXphdGlvbiUyMGRhc2hib2FyZHxlbnwxfHx8fDE3NTg1MTQ4OTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    relatedPapers: [],
    language: 'ja',
    isPinned: true
  },
  {
    id: '8',
    title: 'ブロックチェーンベースのID管理システム',
    slug: 'blockchain-identity-management-ja',
    status: 'Published',
    date: '2023-11-18',
    tags: ['ブロックチェーン', 'セキュリティ', '暗号化'],
    summary: 'プライバシーとセキュリティを確保するため、ブロックチェーン技術を使用した分散型ID管理システムを開発。',
    body: [
      {
        type: 'paragraph',
        content: 'このプロジェクトは、ブロックチェーンを通じてデジタルアイデンティティ管理の課題に取り組みます...'
      }
    ],
    repoUrl: 'https://github.com/example/blockchain-identity-ja',
    heroImage: 'https://images.unsplash.com/photo-1590286162167-70fb467846ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibG9ja2NoYWluJTIwY3J5cHRvY3VycmVuY3l8ZW58MXx8fHwxNzU4NTQ1NzkyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    relatedPapers: [],
    language: 'ja',
    isPinned: true
  }
]

const mockPapers: Paper[] = []

const mockNews: NewsItem[] = [
  {
    id: '1',
    title: 'MICCAI 2024でBest Paper Awardを受賞',
    date: '2024-10-15',
    link: 'https://example.com/news/miccai-award',
    language: 'ja'
  },
  {
    id: '2',
    title: 'Won Best Paper Award at MICCAI 2024',
    date: '2024-10-15',
    link: 'https://example.com/news/miccai-award',
    language: 'en'
  }
]
const mockNewsPosts: NewsPost[] = [
  {
    id: 'news-1',
    title: '医療AI研究の実験メモ',
    slug: 'medical-ai-lab-notes',
    date: '2024-08-20',
    tags: ['Research', 'Medical AI'],
    summary: '最新の医療画像解析モデルで得られた知見と課題を共有します。',
    heroImage: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1080&q=80',
    readTime: '5 min',
    language: 'ja',
    body: [
      { heading: '臨床現場から得た示唆', content: '臨床現場で協力いただいた医師や技師の方々とのディスカッションを基に、実験設計と評価指標を見直しました。' },
      { heading: '改善タスクの整理', content: 'ハイパーパラメータ探索の結果と失敗事例も含めて、今後の改善方針を整理しています。' },
    ]
  },
  {
    id: 'news-2',
    title: '国際学会での発表を振り返って',
    slug: 'conference-retrospective',
    date: '2024-07-05',
    tags: ['Conference', 'Diary'],
    summary: 'MICCAIでの発表内容と得られたフィードバック、コミュニティでの交流をまとめました。',
    heroImage: 'https://images.unsplash.com/photo-1503424886308-418b744a73a3?auto=format&fit=crop&w=1080&q=80',
    readTime: '4 min',
    language: 'ja',
    body: [
      { heading: '発表準備の舞台裏', content: 'プレゼンテーション準備から本番までのプロセスと、現地で得られた気づきを共有します。' },
      { heading: '今後のアクション', content: '研究の方向性をブラッシュアップするための改善タスクも整理しました。' },
    ]
  },
  {
    id: 'news-3',
    title: 'Behind the scenes of our tactile display prototype',
    slug: 'tactile-display-behind-the-scenes',
    date: '2024-06-12',
    tags: ['Haptics', 'Hardware'],
    summary: 'A look at the design decisions and iterations that shaped our latest tactile display prototype.',
    heroImage: 'https://images.unsplash.com/photo-1582719478250-0901a3da57a7?auto=format&fit=crop&w=1080&q=80',
    readTime: '6 min',
    language: 'ja',
    body: [
      { heading: 'Iteration Diary', content: 'We share the iterations, failures, and breakthroughs that occurred while designing the latest tactile display prototype.' },
      { heading: 'Technical Notes', content: 'The article also covers material choices, control firmware, and what we plan to explore next.' },
    ]
  },
  {
    id: 'news-4',
    title: 'Notes from collaborating with clinicians',
    slug: 'collaborating-with-clinicians',
    date: '2024-05-18',
    tags: ['Collaboration', 'Healthcare'],
    summary: 'Key lessons from co-design workshops and pilot studies conducted with partner hospitals.',
    heroImage: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=1080&q=80',
    readTime: '7 min',
    language: 'ja',
    body: [
      { heading: 'Clinic Partnerships', content: 'Collaborating with clinicians taught us how to align research metrics with practical needs and constraints.' },
      { heading: 'What Comes Next', content: 'We summarise workshop outcomes, pilot study feedback, and the roadmap for integrating their requests.' },
    ]
  }
]
// Notion API integration (stub implementation)
class NotionService {
  private token: string | undefined
  private projectsDbId: string | undefined
  private papersDbId: string | undefined
  private newsDbId: string | undefined

  constructor() {
    // Handle client-side environment where process is not defined
    const env = typeof process !== 'undefined' ? process.env : {}
    this.token = env.NOTION_TOKEN
    this.projectsDbId = env.NOTION_DB_PROJECTS
    this.papersDbId = env.NOTION_DB_PAPERS
    this.newsDbId = env.NOTION_DB_NEWS
  }

  private isConfigured(): boolean {
    return !!(this.token && this.projectsDbId && this.papersDbId)
  }

  async getPinnedProjects(locale: Locale): Promise<Project[]> {
    const projects = await loadProjects(locale)
    // 言語に依存せず全件からピン留めを抽出（表示は各ページ側でローカライズ）
    return projects.filter(p => p.isPinned).slice(0, 4)
  }

  async getProjects(locale: Locale, filters: FilterParams = {}): Promise<Project[]> {
    // 言語は除外せず、表示文字列は preferredLocale を優先して生成
    let projects = await loadProjects(locale)
    
    if (filters.tag) {
      projects = projects.filter(p => p.tags.includes(filters.tag!))
    }
    if (filters.year) {
      projects = projects.filter(p => new Date(p.date).getFullYear() === filters.year)
    }
    
    return projects
  }

  async getProjectBySlug(locale: Locale, slug: string): Promise<Project | null> {
    // 詳細は言語に依存せず取得し、タイトル/概要のみ locale 優先で整形済み
    const project = await loadProjectDetail(slug, locale)
    return project
  }

  async getPapers(locale: Locale, filters: FilterParams = {}): Promise<Paper[]> {
    try {
      // 新しいコンテンツローダーを使用
      let papers = await loadPapers()
      // 言語による除外は行わず、全件を表示（UI側の文言のみロケールに従う）
      
      if (filters.year) {
        papers = papers.filter(p => p.year === filters.year)
      }
      if (filters.venue) {
        papers = papers.filter(p => p.venue.toLowerCase().includes(filters.venue!.toLowerCase()))
      }
      if (filters.q) {
        papers = papers.filter(p => 
          p.title.toLowerCase().includes(filters.q!.toLowerCase()) ||
          p.authors.toLowerCase().includes(filters.q!.toLowerCase())
        )
      }
      
      return papers.sort((a, b) => b.year - a.year)
    } catch (error) {
      console.warn('Failed to load papers from content files, falling back to mock data:', error)
      let papers = mockPapers
      
      if (filters.year) {
        papers = papers.filter(p => p.year === filters.year)
      }
      if (filters.venue) {
        papers = papers.filter(p => p.venue.toLowerCase().includes(filters.venue!.toLowerCase()))
      }
      if (filters.q) {
        papers = papers.filter(p => 
          p.title.toLowerCase().includes(filters.q!.toLowerCase()) ||
          p.authors.toLowerCase().includes(filters.q!.toLowerCase())
        )
      }
      
      return papers.sort((a, b) => b.year - a.year)
    }
  }

  async getLatestNewsPosts(locale: Locale, limit: number = 3): Promise<NewsPost[]> {
    try {
      // 新しいコンテンツローダーを使用
      const news = await loadNews()
      const newsPosts = await Promise.all(
        news.map(async (newsItem) => {
          const newsPost = await loadNewsDetail(newsItem.link?.split('/').pop() || '', locale)
          return newsPost || {
            id: newsItem.id,
            title: newsItem.title,
            slug: newsItem.link?.split('/').pop() || '',
            date: newsItem.date,
            content: '',
            heroImage: '',
            readTime: newsItem.readTime || '5 min',
            language: newsItem.language,
            author: '太田裕紀',
            category: newsItem.category || 'general',
            tags: [],
            summary: ''
          }
        })
      )
      
      return newsPosts
        .filter(post => post.language === locale)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, limit)
    } catch (error) {
      console.warn('Failed to load news from content files, falling back to mock data:', error)
      return mockNewsPosts
        .filter(post => post.language === locale)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, limit)
    }
  }

  async getLatestNews(locale: Locale, limit: number = 3): Promise<NewsItem[]> {
    try {
      // 新しいコンテンツローダーを使用
      const news = await loadNews()
      return news
        .filter(n => n.language === locale)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, limit)
    } catch (error) {
      console.warn('Failed to load news from content files, falling back to mock data:', error)
      return mockNews
        .filter(n => n.language === locale)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, limit)
    }
  }

  async getRecentPapers(locale: Locale, limit: number = 3): Promise<Paper[]> {
    try {
      // 新しいコンテンツローダーを使用
      const papers = await loadPapers()
      return papers
        .sort((a, b) => b.year - a.year)
        .slice(0, limit)
    } catch (error) {
      console.warn('Failed to load papers from content files, falling back to mock data:', error)
      return mockPapers
        .sort((a, b) => b.year - a.year)
        .slice(0, limit)
    }
  }

  // Utility method to convert Notion blocks to our internal format
  private convertNotionBlocks(blocks: any[]): NotionBlock[] {
    // TODO: Implement Notion block conversion
    return blocks.map(block => ({
      type: block.type,
      content: block.content || '',
      children: block.children ? this.convertNotionBlocks(block.children) : undefined
    }))
  }

  async getNewsPostBySlug(locale: Locale, slug: string): Promise<NewsPost | null> {
    try {
      // 新しいコンテンツローダーを使用
      const newsPost = await loadNewsDetail(slug, locale)
      return newsPost && newsPost.language === locale ? newsPost : null
    } catch (error) {
      console.warn('Failed to load news post from content files, falling back to mock data:', error)
      return mockNewsPosts.find((post) => post.slug === slug && post.language === locale) || null
    }
  }

  async getNewsPosts(locale: Locale, filters: FilterParams = {}): Promise<NewsPost[]> {
    try {
      // 新しいコンテンツローダーを使用
      const news = await loadNews()
      const newsPosts = await Promise.all(
        news.map(async (newsItem) => {
          const slug = newsItem.link?.split('/').pop() || ''
          const newsPost = await loadNewsDetail(slug, locale)
          // loadNewsDetail が null を返した場合、ロケール別のコンテンツファイルが存在しないため null を返す
          return newsPost
        })
      )
      
      // null を除外
      const validPosts = newsPosts.filter((post): post is NewsPost => post !== null)
      
      let posts = validPosts
        .filter(post => post.language === locale)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

      if (filters.tag) {
        posts = posts.filter(post => post.tags?.includes(filters.tag!))
      }
      if (filters.year) {
        posts = posts.filter(post => new Date(post.date).getFullYear() === filters.year)
      }
      if (filters.q) {
        const query = filters.q!.toLowerCase()
        posts = posts.filter(post =>
          post.title.toLowerCase().includes(query) ||
          (post.content && post.content.toLowerCase().includes(query)) ||
          (post.tags && post.tags.some(tag => tag.toLowerCase().includes(query)))
        )
      }

      return posts
    } catch (error) {
      console.warn('Failed to load news posts from content files, falling back to mock data:', error)
      let posts = mockNewsPosts
        .filter(post => post.language === locale)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

      if (filters.tag) {
        posts = posts.filter(post => post.tags?.includes(filters.tag!))
      }
      if (filters.year) {
        posts = posts.filter(post => new Date(post.date).getFullYear() === filters.year)
      }
      if (filters.q) {
        const query = filters.q!.toLowerCase()
        posts = posts.filter(post =>
          post.title.toLowerCase().includes(query) ||
          (post.summary && post.summary.toLowerCase().includes(query)) ||
          (post.tags && post.tags.some(tag => tag.toLowerCase().includes(query)))
        )
      }

      return posts
    }
  }

}

export const notionService = new NotionService()

// Export convenience functions
export const getPinnedProjects = (locale: Locale) => notionService.getPinnedProjects(locale)
export const getProjects = (locale: Locale, filters?: FilterParams) => notionService.getProjects(locale, filters)
export const getNewsPosts = (locale: Locale, filters?: FilterParams) => notionService.getNewsPosts(locale, filters)
export const getNewsPostBySlug = (locale: Locale, slug: string) => notionService.getNewsPostBySlug(locale, slug)
export const getProjectBySlug = (locale: Locale, slug: string) => notionService.getProjectBySlug(locale, slug)
export const getPapers = (locale: Locale, filters?: FilterParams) => notionService.getPapers(locale, filters)
export const getRecentPapers = (locale: Locale, limit?: number) => notionService.getRecentPapers(locale, limit)
export const getLatestNews = (locale: Locale, limit?: number) => notionService.getLatestNews(locale, limit)
export const getLatestNewsPosts = (locale: Locale, limit?: number) => notionService.getLatestNewsPosts(locale, limit)

