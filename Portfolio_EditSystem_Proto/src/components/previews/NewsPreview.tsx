import React, { useState, useEffect } from 'react';
import { Badge } from '../ui/badge';
import { Calendar, Pin } from 'lucide-react';
import { cn } from '../ui/utils';
import { previewTexts, getPreviewText } from '../../lib/preview-translations';
import { NewsItem, Language } from '../../types/content';
import MarkdownIt from 'markdown-it';
import markdownItAttrs from 'markdown-it-attrs';
import { MarkdownFlowDebugger } from '@/components/debug/MarkdownFlowDebugger';

interface NewsPreviewProps {
  item: NewsItem;
  language: Language;
  theme: 'light' | 'dark';
}

const languageBadgeLabels = {
  ja: previewTexts.ja.languageBadges.ja,
  en: previewTexts.en.languageBadges.en,
};

// Initialize markdown-it with dynamic import
let md: MarkdownIt | null = null;

const initializeMarkdown = async () => {
  if (!md) {
    const { default: MarkdownIt } = await import('markdown-it');
    const { default: markdownItAttrs } = await import('markdown-it-attrs');
    
    md = new MarkdownIt({
      html: true,
      linkify: true,
      breaks: true,
    }).use(markdownItAttrs);
  }
  return md;
};

// Render markdown content using markdown-it
const renderContent = async (content: string): Promise<React.ReactNode> => {
  if (!content) return null;
  
  const markdownIt = await initializeMarkdown();
  
  // Enhanced Debug: Detailed content analysis
  console.log('=== PREVIEW RENDER DEBUG ===');
  console.log('renderContent - Input content:', content);
  console.log('renderContent - Input content length:', content.length);
  console.log('renderContent - Input content type:', typeof content);
  
  // Check if content is HTML or Markdown
  const isHtmlContent = content.includes('<') && content.includes('>');
  const hasMarkdownHeadings = /^#+\s/m.test(content);
  const hasMarkdownLists = /^[-*+]\s/m.test(content) || /^\d+\.\s/m.test(content);
  const hasMarkdownFormatting = /\*\*.*?\*\*|\*.*?\*/.test(content);
  const isLikelyMarkdown = hasMarkdownHeadings || hasMarkdownLists || hasMarkdownFormatting;
  
  console.log('Content Analysis - Is HTML content?', isHtmlContent);
  console.log('Content Analysis - Markdown Headings:', hasMarkdownHeadings);
  console.log('Content Analysis - Markdown Lists:', hasMarkdownLists);
  console.log('Content Analysis - Markdown Formatting:', hasMarkdownFormatting);
  console.log('Content Analysis - Is likely markdown?', isLikelyMarkdown);
  
  let htmlOutput: string;
  
  if (isHtmlContent && !isLikelyMarkdown) {
    // HTML content: use directly
    console.log('Processing as HTML content');
    htmlOutput = content;
  } else {
    // Markdown content: convert to HTML
    console.log('Processing as Markdown content');
    htmlOutput = markdownIt.render(content);
  }
  
  // Debug: Log the HTML output
  console.log('renderContent - HTML output:', htmlOutput);
  console.log('renderContent - HTML output length:', htmlOutput.length);
  
  // Analyze HTML output structure
  const hasHtmlHeadings = /<h[1-6][^>]*>/i.test(htmlOutput);
  const hasHtmlLists = /<(ul|ol)[^>]*>/i.test(htmlOutput);
  const hasHtmlFormatting = /<(strong|b|em|i)[^>]*>/i.test(htmlOutput);
  console.log('HTML Analysis - Headings:', hasHtmlHeadings);
  console.log('HTML Analysis - Lists:', hasHtmlLists);
  console.log('HTML Analysis - Formatting:', hasHtmlFormatting);
  
  // Debug: Test with simple markdown
  const testMarkdown = '# Test Heading\n\nThis is **bold** text.';
  const testHtml = markdownIt.render(testMarkdown);
  console.log('renderContent - Test markdown:', testMarkdown);
  console.log('renderContent - Test HTML:', testHtml);
  
  // Check if conversion was successful
  const conversionSuccessful = hasMarkdownHeadings === hasHtmlHeadings && 
                              hasMarkdownLists === hasHtmlLists && 
                              hasMarkdownFormatting === hasHtmlFormatting;
  console.log('Conversion Analysis - Successful?', conversionSuccessful);
  console.log('=== END PREVIEW RENDER DEBUG ===');
  
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
  const [debugContent, setDebugContent] = useState('');
  const [renderedContent, setRenderedContent] = useState<React.ReactNode>(null);
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

  // Handle async content rendering
  useEffect(() => {
    const body = getContent('body');
    if (!body) {
      setRenderedContent(null);
      return;
    }

    renderContent(body).then(setRenderedContent).catch((error) => {
      console.error('Error rendering content:', error);
      setRenderedContent(<div>Error rendering content</div>);
    });
  }, [item.body, language]);

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
        {renderedContent && (
          <div className="space-y-4">
            <div className="prose prose-slate max-w-none dark:prose-invert">
              {renderedContent}
            </div>
          </div>
        )}

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
      
      {/* プレビュー側デバッガー */}
      <MarkdownFlowDebugger 
        editorContent=""
        previewContent={item.body[language] || ''}
        onContentChange={(content) => setDebugContent(content)}
      />
    </div>
  );
}


