import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Plus, Newspaper, FolderOpen, GraduationCap, CheckCircle2, Circle } from 'lucide-react';

// Mock data for demonstration
const mockNewsData = [
  {
    id: '1',
    title: { ja: '新しい研究成果を発表', en: 'New Research Results Published' },
    date: '2024-03-15',
    published: true,
    tags: ['研究', 'AI']
  },
  {
    id: '2',
    title: { ja: '国際会議での発表', en: 'Presentation at International Conference' },
    date: '2024-03-10',
    published: false,
    tags: ['会議', '発表']
  },
  {
    id: '3',
    title: { ja: '新しいプロジェクトの開始', en: 'Starting New Project' },
    date: '2024-03-08',
    published: true,
    tags: ['プロジェクト']
  }
];

const mockProjectsData = [
  {
    id: '1',
    title: { ja: 'AI音声認識システム', en: 'AI Speech Recognition System' },
    date: '2024-03-12',
    published: true,
    tags: ['AI', '音声認識']
  },
  {
    id: '2',
    title: { ja: 'ウェブアプリケーション開発', en: 'Web Application Development' },
    date: '2024-03-05',
    published: false,
    tags: ['Web', '開発']
  }
];

const mockPapersData = [
  {
    id: '1',
    title: { ja: '深層学習による画像認識の改善', en: 'Improving Image Recognition with Deep Learning' },
    date: '2024-03-14',
    published: true,
    tags: ['深層学習', '画像認識']
  },
  {
    id: '2',
    title: { ja: '自然言語処理の新手法', en: 'Novel Approach to Natural Language Processing' },
    date: '2024-03-11',
    published: true,
    tags: ['NLP', '自然言語処理']
  },
  {
    id: '3',
    title: { ja: '機械学習モデルの効率化', en: 'Efficiency Improvements in Machine Learning Models' },
    date: '2024-03-09',
    published: false,
    tags: ['機械学習', '効率化']
  }
];

interface ContentTableProps {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  data: any[];
  onNewClick: () => void;
}

function ContentTable({ title, icon: Icon, data, onNewClick }: ContentTableProps) {
  const getStatusInfo = (item: any) => {
    if (!item.published) {
      return {
        label: '下書き',
        variant: 'secondary' as const,
        icon: <Circle className="w-3 h-3" />,
        className: ''
      };
    }
    
    return {
      label: '公開中',
      variant: 'default' as const,
      icon: <CheckCircle2 className="w-3 h-3" />,
      className: 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-800'
    };
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="flex items-center gap-2">
          <Icon className="w-5 h-5" />
          {title}
        </CardTitle>
        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={onNewClick}>
          <Plus className="w-4 h-4 mr-2" />
          新規作成
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto rounded-lg border bg-background">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground font-medium">Title</TableHead>
                <TableHead className="text-muted-foreground font-medium">Date</TableHead>
                <TableHead className="text-muted-foreground font-medium">Tags</TableHead>
                <TableHead className="text-muted-foreground font-medium">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.slice(0, 5).map((item) => {
                const statusInfo = getStatusInfo(item);
                
                return (
                  <TableRow 
                    key={item.id} 
                    className="border-border hover:bg-muted/70 transition-colors cursor-pointer group"
                  >
                    <TableCell>
                      <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                        {item.title.ja || item.title.en || '無題'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {new Date(item.date).toLocaleDateString('ja-JP', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit'
                        })}
                      </span>
                    </TableCell>
                    <TableCell>
                      {item.tags && item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {item.tags.slice(0, 2).map((tag: string, tagIndex: number) => (
                            <Badge key={tagIndex} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {item.tags.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{item.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={statusInfo.variant} 
                        className={`flex items-center gap-1 w-fit ${statusInfo.className || ''}`}
                      >
                        {statusInfo.icon}
                        {statusInfo.label}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        {data.length > 5 && (
          <div className="mt-3 text-center">
            <Button variant="outline" size="sm">
              すべて表示 ({data.length}件)
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function HomeSection() {
  const navigate = useNavigate();

  const handleNewNews = () => {
    navigate('/news/new');
  };

  const handleNewProject = () => {
    navigate('/projects/new');
  };

  const handleNewPaper = () => {
    navigate('/papers/new');
  };

  return (
    <div className="h-full overflow-auto">
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">ダッシュボード</h1>
          <p className="text-muted-foreground">コンテンツの概要と最近の活動を確認できます</p>
        </div>

        <div className="space-y-6">
          {/* News Section */}
          <ContentTable
            title="ニュース"
            icon={Newspaper}
            data={mockNewsData}
            onNewClick={handleNewNews}
          />

          {/* Projects Section */}
          <ContentTable
            title="プロジェクト"
            icon={FolderOpen}
            data={mockProjectsData}
            onNewClick={handleNewProject}
          />

          {/* Papers Section */}
          <ContentTable
            title="論文"
            icon={GraduationCap}
            data={mockPapersData}
            onNewClick={handleNewPaper}
          />
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Newspaper className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">ニュース記事</p>
                  <p className="text-xl font-semibold">{mockNewsData.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <FolderOpen className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">プロジェクト</p>
                  <p className="text-xl font-semibold">{mockProjectsData.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <GraduationCap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">論文</p>
                  <p className="text-xl font-semibold">{mockPapersData.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}