import React from 'react';
import { Badge } from '../ui/badge';
import { Calendar, Pin } from 'lucide-react';
import { cn } from '../ui/utils';
import { previewTexts, getPreviewText } from '../../lib/preview-translations';
import { NewsItem, Language } from '../../types/content';

interface NewsPreviewProps {
  item: NewsItem;
  language: Language;
  theme: 'light' | 'dark';
}

const languageBadgeLabels = {
  ja: previewTexts.ja.languageBadges.ja,
  en: previewTexts.en.languageBadges.en,
};

// Render markdown content using markdown-it
const renderContent = (content: string): React.ReactNode => {
  if (!content) return null;
  
  // Debug: Log the content being rendered
  console.log('renderContent - Input content:', content);
  
  // Use markdown-it to render the markdown text directly
  const htmlOutput = md.render(content);
  console.log('renderContent - markdown-it output:', htmlOutput);
  
  return (
    <div 
      className="space-y-2" 
      dangerouslySetInnerHTML={{ __html: htmlOutput }} 
    />
  );
};

export function NewsPreview({ item, language, theme }: NewsPreviewProps) {
  const previewCopy = getPreviewText(language);
  const languageLabel = previewCopy.newsLabel;
  const pinnedLabel = previewCopy.pinnedLabel;
  const emptyState = previewCopy.emptyState;
  const badgeClass = theme === 'light' ? 'bg-white text-slate-700 border-slate-300' : 'bg-slate-800 text-slate-100 border-slate-500';

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return language === 'ja' 
      ? date.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })
      : date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const getContent = (field: 'title' | 'summary' | 'body') => {
    return item[field][language] || item[field][language === 'ja' ? 'en' : 'ja'] || '';
  };

  const getAltText = () => {
    return item.alt[language] || item.alt[language === 'ja' ? 'en' : 'ja'] || '';
  };

  if (!getContent('title') && !getContent('summary')) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        {emptyState}
      </div>
    );
  }

  return (
    <div className={`${theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'} rounded-lg p-6 shadow-lg`}>
      <article className="space-y-6">
        {/* Header */}
        <header className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <time dateTime={item.date}>{formatDate(item.date)}</time>
            {item.pinned && (
              <>
                <Pin className="w-4 h-4 ml-2" />
                <span>{pinnedLabel}</span>
              </>
            )}
          </div>
          
          {item.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          
          <h1 className="text-3xl font-bold leading-tight">
            {getContent('title')}
          </h1>
          
          {getContent('summary') && (
            <p className="text-lg text-muted-foreground leading-relaxed">
              {getContent('summary')}
            </p>
          )}
        </header>

        {/* Featured Image */}
        {item.image && (
          <div className="aspect-video rounded-lg overflow-hidden">
            <img
              src={item.image}
              alt={getAltText()}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Content */}
        {(() => {
          const body = getContent('body');
          if (!body) return null;
          
          // Debug: Log the content being rendered
          console.log('NewsPreview - Body content:', body);
          console.log('NewsPreview - Body type:', typeof body);
          console.log('NewsPreview - Body length:', body.length);
          
          // Tiptap editor generates HTML, so render it directly
          return (
            <div className="space-y-4">
              <div className="prose prose-slate max-w-none dark:prose-invert">
                {renderContent(body)}
              </div>
            </div>
          );
        })()}

        {/* Footer */}
        <footer className="pt-6 border-t border-border">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div>
              {languageLabel}
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className={cn('text-xs', badgeClass)}>{languageBadgeLabels.ja}</Badge>
              <Badge variant="outline" className={cn('text-xs', badgeClass)}>{languageBadgeLabels.en}</Badge>
            </div>
          </div>
        </footer>
      </article>
    </div>
  );
}


