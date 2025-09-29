import React, { useState } from 'react';
import { ContentList } from '../ContentList';
import { NewsEditor } from '../editors/NewsEditor';
import { NewsItem } from '../../types/content';

const mockNewsData: NewsItem[] = [
  {
    id: 'news-1',
    slug: 'ai-research-breakthrough',
    date: '2024-01-15',
    title: {
      ja: 'AI研究の新たな突破口',
      en: 'New Breakthrough in AI Research'
    },
    summary: {
      ja: '機械学習の新しいアプローチが発見されました',
      en: 'A new approach to machine learning has been discovered'
    },
    body: {
      ja: '本日、我々の研究チームは...',
      en: 'Today, our research team has...'
    },
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400',
    alt: {
      ja: 'AI研究のイメージ',
      en: 'AI research visualization'
    },
    tags: ['AI', 'Research', 'Machine Learning'],
    published: true,
    publish: { ja: true, en: true },
    pinned: true
  },
  {
    id: 'news-2',
    slug: 'conference-announcement',
    date: '2024-01-10',
    title: {
      ja: '国際会議での発表決定',
      en: 'Conference Presentation Announced'
    },
    summary: {
      ja: 'ICML 2024での論文発表が決定しました',
      en: 'Paper accepted for presentation at ICML 2024'
    },
    body: {
      ja: 'この度、ICML 2024にて...',
      en: 'We are pleased to announce...'
    },
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400',
    alt: {
      ja: '会議場の様子',
      en: 'Conference venue'
    },
    tags: ['Conference', 'ICML', 'Publication'],
    published: true,
    publish: { ja: true, en: false },
    pinned: false
  }
];

export function NewsSection() {
  const [selectedItem, setSelectedItem] = useState<NewsItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = (item: NewsItem) => {
    setSelectedItem(item);
    setIsEditing(true);
  };

  const handleNew = () => {
    const newItem: NewsItem = {
      id: `news-${Date.now()}`,
      slug: '',
      date: new Date().toISOString().split('T')[0],
      title: { ja: '', en: '' },
      summary: { ja: '', en: '' },
      body: { ja: '', en: '' },
      alt: { ja: '', en: '' },
      tags: [],
      published: false,
      publish: { ja: true, en: true },
      pinned: false
    };
    setSelectedItem(newItem);
    setIsEditing(true);
  };

  const handleSave = (item: NewsItem) => {
    // TODO: Implement save logic
    console.log('Saving news item:', item);
    setIsEditing(false);
    setSelectedItem(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSelectedItem(null);
  };

  if (isEditing && selectedItem) {
    return (
      <NewsEditor
        item={selectedItem}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <div className="w-full h-full overflow-auto">
      <ContentList
        items={mockNewsData}
        type="news"
        onEdit={handleEdit}
        onNew={handleNew}
        columns={[
          { key: 'title', label: 'タイトル' },
          { key: 'date', label: '日付' },
          { key: 'published', label: 'ステータス' },
          { key: 'publish', label: '言語' }
        ]}
      />
    </div>
  );
}
