import React, { useState } from 'react';
import { ContentList } from '../ContentList';
import { ProjectItem } from '../../types/content';

const mockProjectsData: ProjectItem[] = [
  {
    id: 'project-1',
    slug: 'ai-assistant',
    date: '2024-01-01',
    title: {
      ja: 'AI アシスタント開発プロジェクト',
      en: 'AI Assistant Development Project'
    },
    summary: {
      ja: '自然言語処理を活用したAIアシスタントの開発',
      en: 'Development of AI assistant utilizing natural language processing'
    },
    body: {
      ja: 'このプロジェクトでは...',
      en: 'In this project...'
    },
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400',
    alt: {
      ja: 'AI アシスタントのイメージ',
      en: 'AI assistant visualization'
    },
    tags: ['AI', 'NLP', 'Machine Learning'],
    published: true,
    publish: { ja: true, en: true },
    status: 'in-progress',
    featured: true,
    relatedPapers: ['paper-1']
  }
];

export function ProjectsSection() {
  const [selectedItem, setSelectedItem] = useState<ProjectItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = (item: ProjectItem) => {
    setSelectedItem(item);
    setIsEditing(true);
  };

  const handleNew = () => {
    const newItem: ProjectItem = {
      id: `project-${Date.now()}`,
      slug: '',
      date: new Date().toISOString().split('T')[0],
      title: { ja: '', en: '' },
      summary: { ja: '', en: '' },
      body: { ja: '', en: '' },
      alt: { ja: '', en: '' },
      tags: [],
      published: false,
      publish: { ja: false, en: false },
      status: 'planning',
      featured: false,
      relatedPapers: []
    };
    setSelectedItem(newItem);
    setIsEditing(true);
  };

  const handleSave = (item: ProjectItem) => {
    console.log('Saving project item:', item);
    setIsEditing(false);
    setSelectedItem(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSelectedItem(null);
  };

  if (isEditing && selectedItem) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">プロジェクト編集画面</h2>
          <p className="text-muted-foreground mb-4">プロジェクト編集機能は実装中です</p>
          <button 
            onClick={handleCancel}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
          >
            戻る
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <ContentList
        items={mockProjectsData}
        type="projects"
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