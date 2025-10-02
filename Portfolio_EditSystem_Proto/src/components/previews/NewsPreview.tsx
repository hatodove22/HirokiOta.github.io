import React from 'react';
import { Badge } from '../ui/badge';
import { Calendar, Pin } from 'lucide-react';
import { cn } from '../ui/utils';
import { previewTexts, getPreviewText } from '../../lib/preview-translations';
import { NewsItem, Language } from '../../types/content';
import { renderToHTMLString } from '@tiptap/static-renderer/pm/html-string';
import { StarterKit } from '@tiptap/starter-kit';
import { Image } from '@tiptap/extension-image';
import { TaskItem, TaskList } from '@tiptap/extension-list';
import { TextAlign } from '@tiptap/extension-text-align';
import { Typography } from '@tiptap/extension-typography';
import { Highlight } from '@tiptap/extension-highlight';
import { Subscript } from '@tiptap/extension-subscript';
import { Superscript } from '@tiptap/extension-superscript';
import MarkdownIt from 'markdown-it';
import markdownItAttrs from 'markdown-it-attrs';

interface NewsPreviewProps {
  item: NewsItem;
  language: Language;
  theme: 'light' | 'dark';
}

const languageBadgeLabels = {
  ja: previewTexts.ja.languageBadges.ja,
  en: previewTexts.en.languageBadges.en,
};

// Define the same extensions used in the editor
const extensions = [
  StarterKit.configure({
    horizontalRule: false,
    link: {
      openOnClick: false,
      enableClickSelection: true,
    },
  }),
  TextAlign.configure({ types: ["heading", "paragraph"] }),
  TaskList,
  TaskItem.configure({ nested: true }),
  Highlight.configure({ multicolor: true }),
  Image,
  Typography,
  Superscript,
  Subscript,
];

// Initialize markdown-it as fallback
const md = new MarkdownIt({
  html: true,           // Enable HTML tags in source
  linkify: true,        // Autoconvert URL-like text to links
  breaks: false,        // Convert '\n' in paragraphs into <br> (CommonMark compliant)
  typographer: true,    // Enable typographer features
  quotes: '""\'\'',     // Double + single quotes replacement pairs
  langPrefix: 'language-', // CSS language prefix for fenced blocks
}).use(markdownItAttrs);

// Render content using Static Renderer or markdown-it fallback
const renderContent = (content: string): React.ReactNode => {
  if (!content) return null;
  
  console.log('=== NEWSPREVIEW DEBUG START ===');
  console.log('1. Input content:', content);
  console.log('2. Input type:', typeof content);
  console.log('3. Input length:', content.length);
  console.log('4. Input content preview:', content.substring(0, 200));
  
  try {
    console.log('5. Attempting to parse as JSON...');
    // Try to parse as JSON first (Static Renderer format)
    const jsonContent = JSON.parse(content);
    console.log('6. Successfully parsed as JSON:', jsonContent);
    console.log('7. JSON content type:', typeof jsonContent);
    console.log('8. JSON content structure:', JSON.stringify(jsonContent, null, 2));
    
    // Check if it's a valid Tiptap JSON structure
    if (jsonContent && (jsonContent.type === 'doc' || jsonContent.content)) {
      console.log('9. Valid Tiptap JSON structure detected');
      console.log('10. Using Static Renderer for JSON content');
      
      try {
        // Render using Static Renderer
        const htmlOutput = renderToHTMLString({
          extensions,
          content: jsonContent,
        });
        
        console.log('11. Static Renderer HTML output:', htmlOutput);
        console.log('12. HTML output length:', htmlOutput.length);
        console.log('=== NEWSPREVIEW DEBUG END (STATIC RENDERER SUCCESS) ===');
        
        return (
          <div
            className="space-y-2 prose prose-slate max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: htmlOutput }}
            style={{
              lineHeight: '1.7',
              color: 'inherit'
            }}
          />
        );
      } catch (renderError) {
        console.error('13. Static Renderer failed:', renderError);
        console.error('14. Static Renderer error stack:', renderError.stack);
        console.log('15. Falling back to markdown-it');
      }
    } else {
      console.log('9. Invalid Tiptap JSON structure, falling back to markdown-it');
    }
  } catch (error) {
    console.log('5. Not JSON format, trying markdown-it');
    console.log('6. JSON parse error:', error.message);
  }
  
  // Fallback to markdown-it for markdown content
  console.log('7. Using markdown-it for markdown content');
  
  try {
    // Render with markdown-it
    const htmlOutput = md.render(content);
    
    console.log('8. Markdown-it HTML output:', htmlOutput);
    console.log('9. HTML output length:', htmlOutput.length);
    console.log('=== NEWSPREVIEW DEBUG END (MARKDOWN-IT SUCCESS) ===');
    
    return (
      <div
        className="space-y-2 prose prose-slate max-w-none dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: htmlOutput }}
        style={{
          lineHeight: '1.7',
          color: 'inherit'
        }}
      />
    );
  } catch (markdownError) {
    console.error('8. Markdown-it failed:', markdownError);
    console.error('9. Markdown-it error stack:', markdownError.stack);
    console.log('=== NEWSPREVIEW DEBUG END (BOTH FAILED) ===');
    
    // Ultimate fallback: display as plain text
    return (
      <div className="space-y-2 prose prose-slate max-w-none dark:prose-invert">
        <pre className="whitespace-pre-wrap text-sm text-muted-foreground">
          {content}
        </pre>
      </div>
    );
  }
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
          
          return (
            <div className="space-y-4">
              {renderContent(body)}
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


