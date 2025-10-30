import React, { useState } from 'react'
import { ContentList } from '../ContentList'

interface NewsItem {
  id: string
  slug: string
  date: string
  title: { ja: string; en: string }
  summary: { ja: string; en: string }
  body: { ja: string; en: string }
  image: string
  alt: { ja: string; en: string }
  tags: string[]
  published: boolean
  publish: { ja: boolean; en: boolean }
  pinned: boolean
}

const mockNewsData: NewsItem[] = [
  {
    id: 'news-1',
    slug: 'lab-notes-update',
    date: '2024-01-15',
    title: {
      ja: '研究室ノート更新',
      en: 'Lab Notes Update'
    },
    summary: {
      ja: '最新の研究進捗と考察を共有します',
      en: 'Sharing latest research progress and insights'
    },
    body: {
      ja: '今回は、深層学習モデルの最適化について...',
      en: 'This time, we discuss optimization of deep learning models...'
    },
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400',
    alt: {
      ja: '研究室の様子',
      en: 'Lab environment'
    },
    tags: ['Research', 'Deep Learning', 'Update'],
    published: true,
    publish: { ja: true, en: false },
    pinned: true
  },
  {
    id: 'news-2',
    slug: 'conference-announcement',
    date: '2024-01-10',
    title: {
      ja: '学会発表のお知らせ',
      en: 'Conference Presentation Announced'
    },
    summary: {
      ja: 'ICML 2024での論文発表が決定しました',
      en: 'Paper accepted for presentation at ICML 2024'
    },
    body: {
      ja: 'この度、ICML 2024での論文発表が決定しました...',
      en: 'We are pleased to announce...'
    },
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400',
    alt: {
      ja: '学会会場の様子',
      en: 'Conference venue'
    },
    tags: ['Conference', 'ICML', 'Publication'],
    published: true,
    publish: { ja: true, en: false },
    pinned: false
  }
]

export const NewsSection: React.FC = () => {
  const [editingItem, setEditingItem] = useState<NewsItem | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  const handleEdit = (item: NewsItem) => {
    setEditingItem(item)
    setIsCreating(false)
  }

  const handleNew = () => {
    setEditingItem(null)
    setIsCreating(true)
  }

  const handleSave = (item: NewsItem) => {
    // 保存ロジック
    console.log('Saving news item:', item)
    setEditingItem(null)
    setIsCreating(false)
  }

  const handleCancel = () => {
    setEditingItem(null)
    setIsCreating(false)
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">ニュース管理</h2>
        <p className="text-gray-600">ニュース記事の作成・編集・管理を行います</p>
      </div>

      <ContentList
        items={mockNewsData}
        type="news"
        onEdit={handleEdit}
        onNew={handleNew}
        columns={[
          { key: 'title', label: 'タイトル' },
          { key: 'date', label: '日付' },
          { key: 'published', label: '公開' },
          { key: 'publish', label: '言語' }
        ]}
      />
    </div>
  )
}

