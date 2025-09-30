import React, { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import { 
  Plus, 
  MoreHorizontal, 
  Edit, 
  Copy, 
  Eye, 
  Trash2, 
  ChevronUp, 
  ChevronDown,
  Clock,
  CheckCircle2,
  XCircle,
  Circle,
  ArrowUpDown
} from 'lucide-react';
import { ContentItem, ContentType } from '../types/content';

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
}

interface ContentListProps {
  items: ContentItem[];
  type: ContentType;
  onEdit: (item: ContentItem) => void;
  onNew: () => void;
  columns: Column[];
}

type SortField = string | null;
type SortDirection = 'asc' | 'desc';

export function ContentList({ items, type, onEdit, onNew, columns }: ContentListProps) {
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const getSectionTitle = () => {
    switch (type) {
      case 'news':
        return 'ニュース管理';
      case 'projects':
        return 'プロジェクト管理';
      case 'papers':
        return '論文管理';
      default:
        return '';
    }
  };

  const getWelcomeMessage = () => {
    switch (type) {
      case 'news':
        return 'ニュース記事の管理画面です。新しい記事を作成したり、既存の記事を編集できます。';
      case 'projects':
        return 'プロジェクトの管理画面です。研究プロジェクトを管理し、進捗を追跡できます。';
      case 'papers':
        return '論文の管理画面です。研究論文の情報を管理し、公開設定を行えます。';
      default:
        return '';
    }
  };

  const getItemId = (item: ContentItem, index: number) => {
    const prefix = type.toUpperCase();
    return `${prefix}-${String(index + 1).padStart(4, '0')}`;
  };

  const getStatusInfo = (item: ContentItem) => {
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



  const getTypeInfo = (item: ContentItem) => {
    switch (type) {
      case 'news':
        return 'News';
      case 'projects':
        return 'Project';
      case 'papers':
        return 'Paper';
      default:
        return 'Item';
    }
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: string) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? 
      <ChevronUp className="w-4 h-4 ml-1" /> : 
      <ChevronDown className="w-4 h-4 ml-1" />;
  };

  const sortedItems = [...items].sort((a, b) => {
    if (!sortField) return 0;
    
    let aValue: any;
    let bValue: any;
    
    switch (sortField) {
      case 'title':
        aValue = a.title.ja || a.title.en || '';
        bValue = b.title.ja || b.title.en || '';
        break;
      case 'date':
        aValue = new Date(a.date);
        bValue = new Date(b.date);
        break;
      case 'status':
        aValue = a.published ? 1 : 0;
        bValue = b.published ? 1 : 0;
        break;
      default:
        return 0;
    }
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div className="flex flex-col w-full h-full overflow-hidden bg-background">
      {/* Header */}
      <div className="border-b border-border">
        <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8 py-6">
          <div>
            <h1 className="text-2xl font-semibold text-foreground mb-1">
              {getSectionTitle()}
            </h1>
            <p className="text-sm text-muted-foreground">
              {getWelcomeMessage()}
            </p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto w-full">
        <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8 py-4">
          {/* 新規作成ボタン - テーブル直上に配置 */}
          <div className="flex justify-end mb-4">
            <Button onClick={onNew} size="sm" className="bg-green-600 hover:bg-green-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              新規作成
            </Button>
          </div>
          
          <div className="overflow-x-auto rounded-xl border bg-background">
            <TooltipProvider>
              <Table className="table-auto w-full">
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead 
                      className="text-muted-foreground font-medium cursor-pointer hover:text-foreground"
                      onClick={() => handleSort('title')}
                    >
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center">
                            Title
                            {getSortIcon('title')}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>行をクリックして編集画面に移動</p>
                        </TooltipContent>
                      </Tooltip>
                    </TableHead>
                    <TableHead className="text-muted-foreground font-medium">
                      <div className="flex items-center">
                        About
                        <ArrowUpDown className="w-3 h-3 ml-1 opacity-50" />
                      </div>
                    </TableHead>
                    <TableHead 
                      className="text-muted-foreground font-medium cursor-pointer hover:text-foreground"
                      onClick={() => handleSort('date')}
                    >
                      <div className="flex items-center">
                        Date
                        <ArrowUpDown className="w-3 h-3 ml-1 opacity-50" />
                        {getSortIcon('date')}
                      </div>
                    </TableHead>
                    <TableHead className="text-muted-foreground font-medium">
                      Tags
                    </TableHead>
                    <TableHead 
                      className="text-muted-foreground font-medium cursor-pointer hover:text-foreground"
                      onClick={() => handleSort('status')}
                    >
                      <div className="flex items-center">
                        Status
                        {getSortIcon('status')}
                      </div>
                    </TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedItems.map((item, index) => {
                    const statusInfo = getStatusInfo(item);
                    
                    return (
                      <TableRow 
                        key={item.id} 
                        className="border-border hover:bg-muted/70 transition-colors cursor-pointer group"
                        onClick={() => onEdit(item)}
                      >
                        <TableCell>
                          <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                            {item.title.ja || item.title.en || '無題'}
                          </span>
                        </TableCell>
                        <TableCell>
                          {item.summary && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {item.summary.ja || item.summary.en}
                            </p>
                          )}
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
                              {item.tags.slice(0, 2).map((tag, tagIndex) => (
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
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => onEdit(item)}>
                                <Edit className="w-4 h-4 mr-2" />
                                編集
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Copy className="w-4 h-4 mr-2" />
                                複製
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="w-4 h-4 mr-2" />
                                削除
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TooltipProvider>
          </div>

          {sortedItems.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="text-muted-foreground mb-4">
                {`${getSectionTitle()}がまだありません`}
              </div>
              <Button onClick={onNew} className="bg-green-600 hover:bg-green-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                新規作成
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}