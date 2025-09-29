export interface ContentBase {
  id: string;
  slug: string;
  date: string;
  title: {
    ja?: string;
    en?: string;
  };
  summary: {
    ja?: string;
    en?: string;
  };
  body: {
    ja?: string;
    en?: string;
  };
  image?: string;
  alt: {
    ja?: string;
    en?: string;
  };
  tags: string[];
  published: boolean;
  // 言語公開トグルは廃止（2025-09-29）: 常に JA/EN の両言語を必須入力とする
  // 互換のため型は保持しつつ、UI では常に {ja:true,en:true} 相当で扱う
  publish?: {
    ja: boolean;
    en: boolean;
  };
  ogTitle?: {
    ja?: string;
    en?: string;
  };
  ogDescription?: {
    ja?: string;
    en?: string;
  };
}

export interface NewsItem extends ContentBase {
  pinned: boolean;
}

export interface ProjectItem extends ContentBase {
  status: 'planning' | 'in-progress' | 'completed' | 'on-hold';
  featured: boolean;
  relatedPapers: string[];
}

export interface PaperItem extends ContentBase {
  authors: string[];
  venue?: string;
  doi?: string;
  url?: string;
  arxiv?: string;
  pdf?: string;
  code?: string;
  abstract: {
    ja?: string;
    en?: string;
  };
  relatedProjects: string[];
  citationKey?: string;
}

export type ContentType = 'news' | 'projects' | 'papers';

export type ContentItem = NewsItem | ProjectItem | PaperItem;

export interface PublishingState {
  status: 'draft' | 'reviewing' | 'published';
  languages: ('ja' | 'en')[];
  scheduledDate?: string;
}

export type Language = 'ja' | 'en';
