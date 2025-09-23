import { Project, Paper, NewsItem, Locale, FilterParams, NotionBlock } from './types'

// Mock data for development (used when Notion API is not configured)
const mockProjects: Project[] = [
  {
    id: '1',
    title: 'Deep Learning for Medical Image Analysis',
    slug: 'deep-learning-medical-image',
    status: 'Published',
    date: '2024-03-15',
    tags: ['Deep Learning', 'Medical AI', 'Computer Vision'],
    summary: 'Developed a novel deep learning approach for automated medical image analysis, achieving 95% accuracy in disease detection.',
    body: [
      {
        type: 'paragraph',
        content: 'This project focuses on developing advanced deep learning models for medical image analysis...'
      }
    ],
    repoUrl: 'https://github.com/example/medical-ai',
    demoUrl: 'https://demo.example.com',
    slidesUrl: 'https://slides.example.com',
    relatedPapers: ['paper1'],
    heroImage: 'https://images.unsplash.com/photo-1758202292826-c40e172eed1c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwQUklMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc1ODU5NjY5M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    language: 'en',
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
    title: 'Computer Vision for Autonomous Robotics',
    slug: 'computer-vision-robotics',
    status: 'Published',
    date: '2024-01-20',
    tags: ['Computer Vision', 'Robotics', 'Deep Learning'],
    summary: 'Implemented real-time object detection and navigation system for autonomous robots using advanced computer vision techniques.',
    body: [
      {
        type: 'paragraph',
        content: 'This research focuses on developing robust computer vision algorithms for autonomous robot navigation...'
      }
    ],
    repoUrl: 'https://github.com/example/robotics-cv',
    demoUrl: 'https://demo.robotics.example.com',
    heroImage: 'https://images.unsplash.com/photo-1657165235722-e50bbac41584?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wdXRlciUyMHZpc2lvbiUyMHJvYm90aWNzfGVufDF8fHx8MTc1ODU5NzUwNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    relatedPapers: [],
    language: 'en',
    isPinned: true
  },
  {
    id: '4',
    title: 'Interactive Data Visualization Platform',
    slug: 'data-visualization-platform',
    status: 'Published',
    date: '2023-12-05',
    tags: ['Data Science', 'Visualization', 'Web Development'],
    summary: 'Built a comprehensive web-based platform for interactive data exploration and visualization with advanced analytics capabilities.',
    body: [
      {
        type: 'paragraph',
        content: 'This platform enables researchers and analysts to create interactive visualizations...'
      }
    ],
    repoUrl: 'https://github.com/example/data-viz-platform',
    demoUrl: 'https://dataviz.example.com',
    heroImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwdmlzdWFsaXphdGlvbiUyMGRhc2hib2FyZHxlbnwxfHx8fDE3NTg1MTQ4OTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    relatedPapers: [],
    language: 'en',
    isPinned: true
  },
  {
    id: '5',
    title: 'Blockchain-based Identity Management',
    slug: 'blockchain-identity-management',
    status: 'Published',
    date: '2023-11-18',
    tags: ['Blockchain', 'Security', 'Cryptography'],
    summary: 'Developed a decentralized identity management system using blockchain technology to ensure privacy and security.',
    body: [
      {
        type: 'paragraph',
        content: 'This project addresses the challenges of digital identity management through blockchain...'
      }
    ],
    repoUrl: 'https://github.com/example/blockchain-identity',
    heroImage: 'https://images.unsplash.com/photo-1590286162167-70fb467846ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibG9ja2NoYWluJTIwY3J5cHRvY3VycmVuY3l8ZW58MXx8fHwxNzU4NTQ1NzkyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    relatedPapers: [],
    language: 'en',
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

const mockPapers: Paper[] = [
  {
    id: 'paper1',
    title: 'UMotion: Uncertainty-driven Human Motion Estimation from Inertial and Ultra-wideband Units',
    venue: 'CVPR',
    year: 2025,
    authors: '**Huakun Liu**, Hiroki Ota, Xin Wei, Yutaro Hirao, Monica Perusquia-Hernandez, Hideaki Uchiyama, Kiyoshi Kiyokawa',
    relatedProjects: [],
    language: 'both',
    categories: {
      scope: '国際',
      type: '会議',
      peerReview: '査読付き'
    }
  },
  {
    id: 'paper2',
    title: 'A Flexible Vibrotactile Feedback System for Rapid Prototyping',
    venue: 'IEEE Conference on Virtual Reality and 3D User Interfaces Abstracts and Workshops (VRW)',
    year: 2025,
    authors: 'Carlos Paniagua, Hiroki Ota, Yutaro Hirao, **Monica Perusquía-Hernández**, Hideaki Uchiyama, Kiyoshi Kiyokawa',
    relatedProjects: [],
    language: 'both',
    categories: {
      scope: '国際',
      type: 'ワークショップ',
      peerReview: '査読付き'
    }
  },
  {
    id: 'paper3',
    title: 'Advanced Deep Learning Techniques for Medical Image Segmentation',
    venue: 'MICCAI',
    year: 2024,
    authors: '**Ota Hiroki**, Jane Smith, John Doe',
    doi: 'https://doi.org/10.1000/example',
    arxiv: 'https://arxiv.org/abs/2024.example',
    slidesUrl: 'https://slides.example.com/miccai2024',
    award: 'Best Paper Award',
    relatedProjects: ['1'],
    language: 'en',
    categories: {
      scope: '国際',
      type: '会議',
      peerReview: '査読付き'
    }
  },
  {
    id: 'paper4',
    title: 'Transformerを用いた日本語文書分類の高精度化手法',
    venue: '人工知能学会全国大会',
    year: 2024,
    authors: '**太田裕紀**, 田中花子',
    slidesUrl: 'https://slides.example.com/jsai2024',
    relatedProjects: ['2'],
    language: 'ja',
    categories: {
      scope: '国内',
      type: '会議',
      peerReview: '査読付き'
    }
  }
]

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
    if (!this.isConfigured()) {
      return mockProjects.filter(p => p.language === locale && p.isPinned).slice(0, 4)
    }
    
    // TODO: Implement actual Notion API call
    // const response = await notion.databases.query({
    //   database_id: this.projectsDbId!,
    //   filter: {
    //     and: [
    //       { property: 'Status', select: { equals: 'Published' } },
    //       { property: 'Language', select: { equals: locale } },
    //       { property: 'Pinned', checkbox: { equals: true } }
    //     ]
    //   },
    //   sorts: [{ property: 'Date', direction: 'descending' }],
    //   page_size: 3
    // })
    
    return mockProjects.filter(p => p.language === locale && p.isPinned).slice(0, 4)
  }

  async getProjects(locale: Locale, filters: FilterParams = {}): Promise<Project[]> {
    if (!this.isConfigured()) {
      let projects = mockProjects.filter(p => p.language === locale && p.status === 'Published')
      
      if (filters.tag) {
        projects = projects.filter(p => p.tags.includes(filters.tag!))
      }
      if (filters.year) {
        projects = projects.filter(p => new Date(p.date).getFullYear() === filters.year)
      }
      
      return projects
    }
    
    // TODO: Implement actual Notion API call with filters
    return mockProjects.filter(p => p.language === locale && p.status === 'Published')
  }

  async getProjectBySlug(locale: Locale, slug: string): Promise<Project | null> {
    if (!this.isConfigured()) {
      return mockProjects.find(p => p.slug === slug && p.language === locale) || null
    }
    
    // TODO: Implement actual Notion API call
    return mockProjects.find(p => p.slug === slug && p.language === locale) || null
  }

  async getPapers(locale: Locale, filters: FilterParams = {}): Promise<Paper[]> {
    if (!this.isConfigured()) {
      let papers = mockPapers.filter(p => p.language === locale || p.language === 'both')
      
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
    
    // TODO: Implement actual Notion API call with filters
    return mockPapers.filter(p => p.language === locale || p.language === 'both').sort((a, b) => b.year - a.year)
  }

  async getLatestNews(locale: Locale, limit: number = 3): Promise<NewsItem[]> {
    if (!this.isConfigured()) {
      return mockNews
        .filter(n => n.language === locale)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, limit)
    }
    
    // TODO: Implement actual Notion API call
    return mockNews
      .filter(n => n.language === locale)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit)
  }

  async getRecentPapers(locale: Locale, limit: number = 3): Promise<Paper[]> {
    if (!this.isConfigured()) {
      return mockPapers
        .filter(p => p.language === locale || p.language === 'both')
        .sort((a, b) => b.year - a.year)
        .slice(0, limit)
    }
    
    // TODO: Implement actual Notion API call
    return mockPapers
      .filter(p => p.language === locale || p.language === 'both')
      .sort((a, b) => b.year - a.year)
      .slice(0, limit)
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
}

export const notionService = new NotionService()

// Export convenience functions
export const getPinnedProjects = (locale: Locale) => notionService.getPinnedProjects(locale)
export const getProjects = (locale: Locale, filters?: FilterParams) => notionService.getProjects(locale, filters)
export const getProjectBySlug = (locale: Locale, slug: string) => notionService.getProjectBySlug(locale, slug)
export const getPapers = (locale: Locale, filters?: FilterParams) => notionService.getPapers(locale, filters)
export const getRecentPapers = (locale: Locale, limit?: number) => notionService.getRecentPapers(locale, limit)
export const getLatestNews = (locale: Locale, limit?: number) => notionService.getLatestNews(locale, limit)