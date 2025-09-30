import React from 'react';
import { Badge } from '../ui/badge';
import { Calendar, Pin } from 'lucide-react';
import { NewsItem, Language } from '../../types/content';

interface NewsPreviewProps {
  item: NewsItem;
  language: Language;
  theme: 'light' | 'dark';
}

// Simple markdown renderer for basic formatting
const renderMarkdown = (text: string): React.ReactNode => {
  if (!text) return null;

  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let currentParagraph: string[] = [];
  let key = 0;

  const flushParagraph = () => {
    if (currentParagraph.length > 0) {
      const paragraphText = currentParagraph.join('\n');
      if (paragraphText.trim()) {
        elements.push(
          <p key={key++} className="mb-4 leading-relaxed">
            {renderInlineMarkdown(paragraphText)}
          </p>
        );
      }
      currentParagraph = [];
    }
  };

  const renderInlineMarkdown = (text: string): React.ReactNode => {
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`|\[.*?\]\(.*?\))/);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('*') && part.endsWith('*') && !part.startsWith('**')) {
        return <em key={index}>{part.slice(1, -1)}</em>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={index} className="bg-muted px-1 rounded text-sm">{part.slice(1, -1)}</code>;
      }
      const linkMatch = part.match(/\[(.*?)\]\((.*?)\)/);
      if (linkMatch) {
        return <a key={index} href={linkMatch[2]} className="text-primary underline" target="_blank" rel="noopener noreferrer">{linkMatch[1]}</a>;
      }
      return part;
    });
  };

  for (const line of lines) {
    const trimmedLine = line.trim();
    
    if (trimmedLine.startsWith('# ')) {
      flushParagraph();
      elements.push(
        <h1 key={key++} className="text-3xl font-bold mb-6 mt-8 first:mt-0">
          {renderInlineMarkdown(trimmedLine.slice(2))}
        </h1>
      );
    } else if (trimmedLine.startsWith('## ')) {
      flushParagraph();
      elements.push(
        <h2 key={key++} className="text-2xl font-bold mb-4 mt-6 first:mt-0">
          {renderInlineMarkdown(trimmedLine.slice(3))}
        </h2>
      );
    } else if (trimmedLine.startsWith('### ')) {
      flushParagraph();
      elements.push(
        <h3 key={key++} className="text-xl font-bold mb-3 mt-5 first:mt-0">
          {renderInlineMarkdown(trimmedLine.slice(4))}
        </h3>
      );
    } else if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
      flushParagraph();
      const nextLines = lines.slice(lines.indexOf(line));
      const listItems: string[] = [];
      let i = 0;
      
      while (i < nextLines.length && (nextLines[i].trim().startsWith('- ') || nextLines[i].trim().startsWith('* '))) {
        listItems.push(nextLines[i].trim().slice(2));
        i++;
      }
      
      elements.push(
        <ul key={key++} className="list-disc pl-6 mb-4">
          {listItems.map((item, itemIndex) => (
            <li key={itemIndex} className="mb-1">
              {renderInlineMarkdown(item)}
            </li>
          ))}
        </ul>
      );
      
      // Skip processed lines
      for (let j = 1; j < i; j++) {
        lines.splice(lines.indexOf(line) + 1, 1);
      }
    } else if (trimmedLine.match(/^\d+\. /)) {
      flushParagraph();
      const nextLines = lines.slice(lines.indexOf(line));
      const listItems: string[] = [];
      let i = 0;
      
      while (i < nextLines.length && nextLines[i].trim().match(/^\d+\. /)) {
        listItems.push(nextLines[i].trim().replace(/^\d+\. /, ''));
        i++;
      }
      
      elements.push(
        <ol key={key++} className="list-decimal pl-6 mb-4">
          {listItems.map((item, itemIndex) => (
            <li key={itemIndex} className="mb-1">
              {renderInlineMarkdown(item)}
            </li>
          ))}
        </ol>
      );
      
      // Skip processed lines
      for (let j = 1; j < i; j++) {
        lines.splice(lines.indexOf(line) + 1, 1);
      }
    } else if (trimmedLine.startsWith('> ')) {
      flushParagraph();
      elements.push(
        <blockquote key={key++} className="border-l-4 border-muted-foreground pl-4 italic mb-4 text-muted-foreground">
          {renderInlineMarkdown(trimmedLine.slice(2))}
        </blockquote>
      );
    } else if (trimmedLine === '') {
      flushParagraph();
    } else {
      currentParagraph.push(line);
    }
  }
  
  flushParagraph();
  return <div className="space-y-2">{elements}</div>;
};

export function NewsPreview({ item, language, theme }: NewsPreviewProps) {
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
        {language === 'ja' ? 'プレビューするコンチE��チE��ありません' : 'No content to preview'}
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
                <span>{language === 'ja' ? 'ピン留め' : 'Pinned'}</span>
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
          const looksHtml = /<\w+[\s\S]*>/i.test(body);
          return (
            <div className="space-y-4">
              <div className="prose prose-slate max-w-none dark:prose-invert">
                {looksHtml ? (
                  <div dangerouslySetInnerHTML={{ __html: body }} />
                ) : (
                  renderMarkdown(body)
                )}
              </div>
            </div>
          );
        })()}

        {/* Footer */}
        <footer className="pt-6 border-t border-border">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div>
              {language === 'ja' ? 'ニュース' : 'News'}
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-xs">日本語</Badge> <Badge variant="outline" className="text-xs">English</Badge>
            </div>
          </div>
        </footer>
      </article>
    </div>
  );
}
