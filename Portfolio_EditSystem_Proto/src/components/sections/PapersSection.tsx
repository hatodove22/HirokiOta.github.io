import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ContentList } from '../ContentList';
import { PaperItem } from '../../types/content';

const mockPapersData: PaperItem[] = [
  {
    id: 'paper-1',
    slug: 'attention-mechanisms',
    date: '2024-01-01',
    title: {
      ja: 'アテンション機構の改良に関する研究',
      en: 'Improved Attention Mechanisms for Neural Networks'
    },
    summary: {
      ja: 'トランスフォーマーモデルのアテンション機構を改良',
      en: 'Enhanced attention mechanisms for transformer models'
    },
    body: {
      ja: 'この論文では...',
      en: 'This paper presents...'
    },
    alt: {
      ja: 'アテンション機構の図解',
      en: 'Attention mechanism diagram'
    },
    tags: ['Deep Learning', 'Attention', 'Transformers'],
    published: true,
    publish: { ja: true, en: true },
    authors: ['田中太郎', 'John Smith', '佐藤花子'],
    venue: 'International Conference on Machine Learning (ICML)',
    doi: '10.1000/182',
    arxiv: '2024.01234',
    abstract: {
      ja: 'この研究では、従来のアテンション機構を改良し...',
      en: 'This work improves upon traditional attention mechanisms...'
    },
    relatedProjects: ['project-1']
  }
];

export function PapersSection() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const [selectedItem, setSelectedItem] = useState<PaperItem | null>(null);

  // URLパスに基づいて表示モードを判定
  const isEditing = location.pathname.includes('/edit/') || location.pathname === '/papers/new';
  const isNew = location.pathname === '/papers/new';
  const isList = location.pathname === '/papers';

  // 編集モードの場合、アイテムを取得
  React.useEffect(() => {
    if (isEditing) {
      if (isNew) {
        // 新規作成の場合
        const newItem: PaperItem = {
          id: `paper-${Date.now()}`,
          slug: '',
          date: new Date().toISOString().split('T')[0],
          title: { ja: '', en: '' },
          summary: { ja: '', en: '' },
          body: { ja: '', en: '' },
          alt: { ja: '', en: '' },
          tags: [],
          published: false,
          publish: { ja: false, en: false },
          authors: [],
          abstract: { ja: '', en: '' },
          relatedProjects: []
        };
        setSelectedItem(newItem);
      } else if (id) {
        // 編集の場合、IDに基づいてアイテムを取得
        const item = mockPapersData.find(item => item.id === id);
        if (item) {
          setSelectedItem(item);
        } else {
          // アイテムが見つからない場合は一覧に戻る
          navigate('/papers');
        }
      }
    } else {
      setSelectedItem(null);
    }
  }, [isEditing, isNew, id, navigate]);

  const handleEdit = (item: PaperItem) => {
    navigate(`/papers/edit/${item.id}`);
  };

  const handleNew = () => {
    navigate('/papers/new');
  };

  const handleSave = (item: PaperItem) => {
    console.log('Saving paper item:', item);
    navigate('/papers');
  };

  const handleCancel = () => {
    navigate('/papers');
  };

  if (isEditing && selectedItem) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">論文編集画面</h2>
          <p className="text-muted-foreground mb-4">論文編集機能は実装中です</p>
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
        items={mockPapersData}
        type="papers"
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