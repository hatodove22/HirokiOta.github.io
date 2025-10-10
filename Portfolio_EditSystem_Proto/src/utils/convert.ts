/**
 * 変換ユーティリティ: Markdown -> HTML -> Tiptap JSON
 *
 * 公式ドキュメント準拠の実装
 * - markdown-it: Markdown -> HTML
 * - @tiptap/html: HTML -> Tiptap JSON
 * - DOMPurify: HTML サニタイズ
 */

import MarkdownIt from 'markdown-it';
import DOMPurify from 'dompurify';
import { generateJSON, generateHTML } from '@tiptap/html';
import StarterKit from '@tiptap/starter-kit';
// Conditional imports for testing environment
let lowlight: any = null;
let CodeBlockLowlight: any = null;

try {
  const lowlightModule = require('lowlight');
  lowlight = lowlightModule.lowlight;

  const CodeBlockLowlightModule = require('@tiptap/extension-code-block-lowlight');
  CodeBlockLowlight = CodeBlockLowlightModule.default;
} catch (error) {
  // Testing environment or module not available
  console.log('CodeBlockLowlight not available in this environment');
}

let md: MarkdownIt | null = null;

function getMarkdownIt(): MarkdownIt {
  if (!md) {
    md = new MarkdownIt({
      html: true,        // HTMLタグを許可
      linkify: true,     // URLを自動リンク化
      breaks: false,     // 改行を<br>に変換しない
      typographer: true, // タイポグラフィー記号の変換
      quotes: '""\'\'',  // 引用符の設定
      langPrefix: 'language-', // コードブロックの言語クラス接頭辞
    });
  }

  return md;
}// Tiptap諡｡蠑ｵ縺ｮ險ｭ螳夲ｼ医お繝・ぅ繧ｿ縺ｨ繝励Ξ繝薙Η繝ｼ縺ｧ邨ｱ荳・・
const extensions = [
  StarterKit.configure({
    // 繧ｳ繝ｼ繝峨ヶ繝ｭ繝・け縺ｯCodeBlockLowlight繧剃ｽｿ逕ｨ・亥茜逕ｨ蜿ｯ閭ｽ縺ｪ蝣ｴ蜷茨ｼ・
    codeBlock: !CodeBlockLowlight,
  }),
  // CodeBlockLowlight縺悟茜逕ｨ蜿ｯ閭ｽ縺ｪ蝣ｴ蜷医・縺ｿ霑ｽ蜉
  ...(CodeBlockLowlight ? [CodeBlockLowlight.configure({
    lowlight,
    defaultLanguage: 'plaintext',
  })] : []),
];

/**
 * 1) Markdown 竊・HTML
 * markdown-it縺ｮ蜈ｬ蠑就PI繧剃ｽｿ逕ｨ
 */
export function markdownToHTML(markdown: string): string {
  if (!markdown || markdown.trim().length === 0) {
    return '';
  }
  
  try {
    return getMarkdownIt().render(markdown);
  } catch (error) {
    console.error('markdownToHTML error:', error);
    return '';
  }
}

/**
 * 2) HTML 竊・Tiptap JSON
 * @tiptap/html縺ｮ蜈ｬ蠑上Θ繝ｼ繝・ぅ繝ｪ繝・ぅ繧剃ｽｿ逕ｨ
 */
export function htmlToTiptapJSON(html: string) {
  if (!html || html.trim().length === 0) {
    return {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: []
        }
      ]
    };
  }
  
  try {
    return generateJSON(html, extensions);
  } catch (error) {
    console.error('htmlToTiptapJSON error:', error);
    return {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: '螟画鋤繧ｨ繝ｩ繝ｼ縺檎匱逕溘＠縺ｾ縺励◆'
            }
          ]
        }
      ]
    };
  }
}

/**
 * 3) Tiptap JSON 竊・HTML・医・繝ｬ繝薙Η繝ｼ逕ｨ・・
 * @tiptap/html縺ｮ蜈ｬ蠑上Θ繝ｼ繝・ぅ繝ｪ繝・ぅ繧剃ｽｿ逕ｨ
 */
export function tiptapJSONToHTML(doc: any): string {
  if (!doc || !doc.content) {
    return '';
  }
  
  try {
    return generateHTML(doc, extensions);
  } catch (error) {
    console.error('tiptapJSONToHTML error:', error);
    return '<p>繝励Ξ繝薙Η繝ｼ逕滓・繧ｨ繝ｩ繝ｼ縺檎匱逕溘＠縺ｾ縺励◆</p>';
  }
}

/**
 * 4) HTML 繧ｵ繝九ち繧､繧ｺ
 * DOMPurify繧剃ｽｿ逕ｨ縺励※XSS謾ｻ謦・ｒ髦ｲ豁｢
 */
export function sanitize(html: string): string {
  if (!html || html.trim().length === 0) {
    return '';
  }
  
  try {
    return DOMPurify.sanitize(html, {
      // 險ｱ蜿ｯ縺吶ｋ繧ｿ繧ｰ縺ｨ螻樊ｧ縺ｮ險ｭ螳・
      ALLOWED_TAGS: [
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'p', 'br', 'strong', 'em', 'u', 's', 'mark',
        'ul', 'ol', 'li',
        'blockquote',
        'pre', 'code',
        'a', 'img',
        'table', 'thead', 'tbody', 'tr', 'th', 'td',
        'hr',
        'div', 'span'
      ],
      ALLOWED_ATTR: [
        'href', 'target', 'rel',
        'src', 'alt', 'title', 'width', 'height',
        'class', 'id',
        'data-*'
      ],
      // 逶ｸ蟇ｾURL繧定ｨｱ蜿ｯ
      ALLOW_DATA_ATTR: true,
      // 繝励Ο繝医さ繝ｫ蛻ｶ髯・
      ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
    });
  } catch (error) {
    console.error('sanitize error:', error);
    return '';
  }
}

/**
 * 5) 螳悟・縺ｪ螟画鋤繝輔Ο繝ｼ: Markdown 竊・HTML 竊・Tiptap JSON
 * 繧ｨ繝・ぅ繧ｿ縺ｮ蛻晄悄蛹匁凾縺ｫ菴ｿ逕ｨ
 */
export function markdownToTiptapJSON(markdown: string) {
  const html = markdownToHTML(markdown);
  return htmlToTiptapJSON(html);
}

/**
 * 6) 螳悟・縺ｪ螟画鋤繝輔Ο繝ｼ: Tiptap JSON 竊・HTML 竊・繧ｵ繝九ち繧､繧ｺ
 * 繝励Ξ繝薙Η繝ｼ陦ｨ遉ｺ譎ゅ↓菴ｿ逕ｨ
 */
export function tiptapJSONToSanitizedHTML(doc: any): string {
  const html = tiptapJSONToHTML(doc);
  return sanitize(html);
}

/**
 * 7) 繝ｩ繧ｦ繝ｳ繝峨ヨ繝ｪ繝・・繝・せ繝育畑: Markdown 竊・HTML 竊・JSON 竊・HTML
 * 螟画鋤縺ｮ謨ｴ蜷域ｧ繧堤｢ｺ隱阪☆繧九◆繧√↓菴ｿ逕ｨ
 */
export function testRoundTrip(markdown: string): {
  original: string;
  html1: string;
  json: any;
  html2: string;
  sanitized: string;
} {
  const html1 = markdownToHTML(markdown);
  const json = htmlToTiptapJSON(html1);
  const html2 = tiptapJSONToHTML(json);
  const sanitized = sanitize(html2);
  
  return {
    original: markdown,
    html1,
    json,
    html2,
    sanitized
  };
}

/**
 * 8) HTML 竊・Markdown 螟画鋤
 * 繧ｨ繝・ぅ繧ｿ縺ｮHTML蜃ｺ蜉帙ｒMarkdown縺ｫ螟画鋤
 */
export function htmlToMarkdown(html: string): string {
  if (!html || html.trim().length === 0) {
    return '';
  }
  
  try {
    // Enhanced HTML to markdown conversion with better regex patterns
    let markdown = html
      // Convert headings with nested content support
      .replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, (match, content) => {
        const cleanContent = content.replace(/<[^>]*>/g, '').trim();
        return cleanContent ? `# ${cleanContent}\n\n` : '';
      })
      .replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, (match, content) => {
        const cleanContent = content.replace(/<[^>]*>/g, '').trim();
        return cleanContent ? `## ${cleanContent}\n\n` : '';
      })
      .replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, (match, content) => {
        const cleanContent = content.replace(/<[^>]*>/g, '').trim();
        return cleanContent ? `### ${cleanContent}\n\n` : '';
      })
      .replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, (match, content) => {
        const cleanContent = content.replace(/<[^>]*>/g, '').trim();
        return cleanContent ? `#### ${cleanContent}\n\n` : '';
      })
      .replace(/<h5[^>]*>([\s\S]*?)<\/h5>/gi, (match, content) => {
        const cleanContent = content.replace(/<[^>]*>/g, '').trim();
        return cleanContent ? `##### ${cleanContent}\n\n` : '';
      })
      .replace(/<h6[^>]*>([\s\S]*?)<\/h6>/gi, (match, content) => {
        const cleanContent = content.replace(/<[^>]*>/g, '').trim();
        return cleanContent ? `###### ${cleanContent}\n\n` : '';
      })
      // Convert lists with nested content support
      .replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (match, content) => {
        const items = content.match(/<li[^>]*>([\s\S]*?)<\/li>/gi);
        if (items && items.length > 0) {
          const listItems = items.map(item => {
            const cleanItem = item.replace(/<[^>]*>/g, '').trim();
            return `- ${cleanItem}`;
          }).join('\n');
          return `${listItems}\n\n`;
        }
        return '';
      })
      .replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (match, content) => {
        const items = content.match(/<li[^>]*>([\s\S]*?)<\/li>/gi);
        if (items && items.length > 0) {
          const listItems = items.map((item, index) => {
            const cleanItem = item.replace(/<[^>]*>/g, '').trim();
            return `${index + 1}. ${cleanItem}`;
          }).join('\n');
          return `${listItems}\n\n`;
        }
        return '';
      })
      // Convert bold and italic
      .replace(/<(strong|b)[^>]*>([\s\S]*?)<\/(strong|b)>/gi, '**$2**')
      .replace(/<(em|i)[^>]*>([\s\S]*?)<\/(em|i)>/gi, '*$2*')
      // Convert code blocks
      .replace(/<pre><code[^>]*>([\s\S]*?)<\/code><\/pre>/gi, (match, content) => {
        const cleanContent = content.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').trim();
        return `\`\`\`\n${cleanContent}\n\`\`\`\n\n`;
      })
      // Convert blockquotes
      .replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (match, content) => {
        const cleanContent = content.replace(/<[^>]*>/g, '').trim();
        return cleanContent ? `> ${cleanContent}\n\n` : '';
      })
      // Convert horizontal rules
      .replace(/<hr[^>]*>/gi, '---\n\n')
      // Convert links
      .replace(/<a href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi, '[$2]($1)')
      // Convert images
      .replace(/<img src="([^"]+)" alt="([^"]*)"[^>]*>/gi, '![$2]($1)')
      // Convert paragraphs (after headings and lists)
      .replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, (match, content) => {
        const cleanContent = content.replace(/<[^>]*>/g, '').trim();
        return cleanContent ? `${cleanContent}\n\n` : '';
      })
      // Convert line breaks
      .replace(/<br[^>]*>/gi, '\n')
      // Remove any remaining HTML tags
      .replace(/<[^>]*>/g, '')
      // Clean up multiple newlines
      .replace(/\n\s*\n\s*\n/g, '\n\n')
      .trim();

    return markdown;
  } catch (error) {
    console.error('htmlToMarkdown error:', error);
    return '';
  }
}

/**
 * 9) 繝・ヰ繝・げ逕ｨ: 螟画鋤邨先棡縺ｮ隧ｳ邏ｰ繝ｭ繧ｰ
 */
export function debugConversion(markdown: string, label: string = 'Conversion') {
  console.group(`剥 ${label} Debug`);
  console.log('Input Markdown:', markdown);
  
  const result = testRoundTrip(markdown);
  
  console.log('Step 1 - Markdown 竊・HTML:', result.html1);
  console.log('Step 2 - HTML 竊・JSON:', result.json);
  console.log('Step 3 - JSON 竊・HTML:', result.html2);
  console.log('Step 4 - Sanitized HTML:', result.sanitized);
  
  // 謨ｴ蜷域ｧ繝√ぉ繝・け
  const isConsistent = result.html1 === result.html2;
  console.log('Round-trip consistency:', isConsistent ? 'OK' : 'NG');
  
  console.groupEnd();
  
  return result;
}

// 蝙句ｮ夂ｾｩ縺ｮ繧ｨ繧ｯ繧ｹ繝昴・繝・
export type ConversionResult = ReturnType<typeof testRoundTrip>;
export type TiptapDocument = ReturnType<typeof htmlToTiptapJSON>;


