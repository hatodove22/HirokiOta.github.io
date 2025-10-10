/**
 * 変換ユーティリティのテスト
 * 
 * プランBの実装をテスト:
 * - Markdown → HTML (markdown-it)
 * - HTML → Tiptap JSON (@tiptap/html)
 * - Tiptap JSON → HTML (@tiptap/html)
 * - HTML サニタイズ (DOMPurify)
 */

// Mock markdown-it for testing
jest.mock('markdown-it', () => {
  return jest.fn().mockImplementation(() => ({
    render: jest.fn((markdown: string) => {
      // Simple mock implementation for testing
      return markdown
        .replace(/^# (.+)$/gm, '<h1>$1</h1>')
        .replace(/^## (.+)$/gm, '<h2>$1</h2>')
        .replace(/^### (.+)$/gm, '<h3>$1</h3>')
        .replace(/^- (.+)$/gm, '<li>$1</li>')
        .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/^> (.+)$/gm, '<blockquote><p>$1</p></blockquote>')
        .replace(/^```(\w+)?\n([\s\S]*?)\n```$/gm, '<pre><code class="language-$1">$2</code></pre>')
        .replace(/\n\n/g, '\n')
        .split('\n')
        .map(line => {
          if (line.startsWith('<h') || line.startsWith('<blockquote>') || line.startsWith('<pre>')) {
            return line;
          } else if (line.startsWith('<li>')) {
            return line;
          } else if (line.trim() && !line.startsWith('<')) {
            return `<p>${line.trim()}</p>`;
          }
          return '';
        })
        .filter(line => line)
        .join('\n')
        .replace(/<li>/g, '<ul><li>')
        .replace(/<\/li>/g, '</li></ul>');
    }),
    use: jest.fn().mockReturnThis(),
  }));
});

// Mock lowlight for testing
jest.mock('lowlight', () => ({
  lowlight: {
    highlight: jest.fn((code: string) => ({
      value: `<pre><code>${code}</code></pre>`
    }))
  }
}));

// Mock DOMPurify for testing
jest.mock('dompurify', () => ({
  sanitize: jest.fn((html: string) => html.replace(/<script[^>]*>.*?<\/script>/gi, ''))
}));

import {
  markdownToHTML,
  htmlToTiptapJSON,
  tiptapJSONToHTML,
  sanitize,
  markdownToTiptapJSON,
  tiptapJSONToSanitizedHTML,
  testRoundTrip,
  htmlToMarkdown,
  debugConversion
} from '../convert';

describe('Convert Utility Tests', () => {
  describe('markdownToHTML', () => {
    test('基本の見出し変換', () => {
      const markdown = '# 見出し1\n## 見出し2\n### 見出し3';
      const html = markdownToHTML(markdown);
      
      expect(html).toContain('<h1>見出し1</h1>');
      expect(html).toContain('<h2>見出し2</h2>');
      expect(html).toContain('<h3>見出し3</h3>');
    });

    test('リストの変換', () => {
      const markdown = '- アイテム1\n- アイテム2\n- アイテム3';
      const html = markdownToHTML(markdown);
      
      expect(html).toContain('<ul>');
      expect(html).toContain('<li>アイテム1</li>');
      expect(html).toContain('<li>アイテム2</li>');
      expect(html).toContain('<li>アイテム3</li>');
    });

    test('番号付きリストの変換', () => {
      const markdown = '1. アイテム1\n2. アイテム2\n3. アイテム3';
      const html = markdownToHTML(markdown);
      
      expect(html).toContain('<ol>');
      expect(html).toContain('<li>アイテム1</li>');
      expect(html).toContain('<li>アイテム2</li>');
      expect(html).toContain('<li>アイテム3</li>');
    });

    test('太字と斜体の変換', () => {
      const markdown = '**太字**と*斜体*のテスト';
      const html = markdownToHTML(markdown);
      
      expect(html).toContain('<strong>太字</strong>');
      expect(html).toContain('<em>斜体</em>');
    });

    test('コードブロックの変換', () => {
      const markdown = '```javascript\nconsole.log("Hello");\n```';
      const html = markdownToHTML(markdown);
      
      expect(html).toContain('<pre>');
      expect(html).toContain('<code');
      expect(html).toContain('console.log("Hello");');
    });

    test('引用ブロックの変換', () => {
      const markdown = '> これは引用ブロックです。';
      const html = markdownToHTML(markdown);
      
      expect(html).toContain('<blockquote>');
    });

    test('空の入力の処理', () => {
      expect(markdownToHTML('')).toBe('');
      expect(markdownToHTML('   ')).toBe('');
    });
  });

  describe('htmlToTiptapJSON', () => {
    test('基本のHTMLからTiptap JSONへの変換', () => {
      const html = '<h1>見出し1</h1><p>段落です。</p>';
      const json = htmlToTiptapJSON(html);
      
      expect(json).toHaveProperty('type', 'doc');
      expect(json).toHaveProperty('content');
      expect(json.content).toBeInstanceOf(Array);
      expect(json.content.length).toBeGreaterThan(0);
    });

    test('複雑なHTML構造の変換', () => {
      const html = '<h1>タイトル</h1><ul><li>アイテム1</li><li>アイテム2</li></ul>';
      const json = htmlToTiptapJSON(html);
      
      expect(json.type).toBe('doc');
      expect(json.content).toBeInstanceOf(Array);
    });

    test('空のHTMLの処理', () => {
      const json = htmlToTiptapJSON('');
      expect(json.type).toBe('doc');
      expect(json.content).toHaveLength(1);
      expect(json.content[0].type).toBe('paragraph');
    });
  });

  describe('tiptapJSONToHTML', () => {
    test('基本のTiptap JSONからHTMLへの変換', () => {
      const doc = {
        type: 'doc',
        content: [
          {
            type: 'heading',
            attrs: { level: 1 },
            content: [{ type: 'text', text: '見出し1' }]
          }
        ]
      };
      
      const html = tiptapJSONToHTML(doc);
      expect(html).toContain('<h1>見出し1</h1>');
    });

    test('空のドキュメントの処理', () => {
      const doc = { type: 'doc', content: [] };
      const html = tiptapJSONToHTML(doc);
      expect(html).toBe('');
    });
  });

  describe('sanitize', () => {
    test('基本的なサニタイズ', () => {
      const html = '<h1>タイトル</h1><p>段落です。</p>';
      const sanitized = sanitize(html);
      
      expect(sanitized).toContain('<h1>タイトル</h1>');
      expect(sanitized).toContain('<p>段落です。</p>');
    });

    test('XSS攻撃の防止', () => {
      const maliciousHTML = '<h1>タイトル</h1><script>alert("XSS")</script><p>段落</p>';
      const sanitized = sanitize(maliciousHTML);
      
      expect(sanitized).toContain('<h1>タイトル</h1>');
      expect(sanitized).toContain('<p>段落</p>');
      expect(sanitized).not.toContain('<script>');
    });

    test('許可された属性の保持', () => {
      const html = '<a href="https://example.com" target="_blank">リンク</a>';
      const sanitized = sanitize(html);
      
      expect(sanitized).toContain('href="https://example.com"');
      expect(sanitized).toContain('target="_blank"');
    });

    test('空の入力の処理', () => {
      expect(sanitize('')).toBe('');
      expect(sanitize('   ')).toBe('');
    });
  });

  describe('htmlToMarkdown', () => {
    test('基本のHTMLからMarkdownへの変換', () => {
      const html = '<h1>見出し1</h1><p>段落です。</p>';
      const markdown = htmlToMarkdown(html);
      
      expect(markdown).toContain('# 見出し1');
      expect(markdown).toContain('段落です。');
    });

    test('リストの変換', () => {
      const html = '<ul><li>アイテム1</li><li>アイテム2</li></ul>';
      const markdown = htmlToMarkdown(html);
      
      expect(markdown).toContain('- アイテム1');
      expect(markdown).toContain('- アイテム2');
    });

    test('太字と斜体の変換', () => {
      const html = '<p><strong>太字</strong>と<em>斜体</em>のテスト</p>';
      const markdown = htmlToMarkdown(html);
      
      expect(markdown).toContain('**太字**');
      expect(markdown).toContain('*斜体*');
    });

    test('空の入力の処理', () => {
      expect(htmlToMarkdown('')).toBe('');
      expect(htmlToMarkdown('   ')).toBe('');
    });
  });

  describe('統合テスト', () => {
    test('完全な変換フロー: Markdown → HTML → JSON → HTML', () => {
      const originalMarkdown = '# テスト\n\n**太字**と*斜体*のテストです。\n\n- リストアイテム1\n- リストアイテム2';
      
      const result = testRoundTrip(originalMarkdown);
      
      expect(result.original).toBe(originalMarkdown);
      expect(result.html1).toContain('<h1>テスト</h1>');
      expect(result.html1).toContain('<strong>太字</strong>');
      expect(result.html1).toContain('<em>斜体</em>');
      expect(result.html1).toContain('<ul>');
      
      expect(result.json).toHaveProperty('type', 'doc');
      expect(result.json).toHaveProperty('content');
      
      expect(result.html2).toContain('<h1>テスト</h1>');
      expect(result.sanitized).toContain('<h1>テスト</h1>');
    });

    test('markdownToTiptapJSON', () => {
      const markdown = '# タイトル\n\n段落です。';
      const json = markdownToTiptapJSON(markdown);
      
      expect(json).toHaveProperty('type', 'doc');
      expect(json).toHaveProperty('content');
    });

    test('tiptapJSONToSanitizedHTML', () => {
      const doc = {
        type: 'doc',
        content: [
          {
            type: 'heading',
            attrs: { level: 1 },
            content: [{ type: 'text', text: 'タイトル' }]
          },
          {
            type: 'paragraph',
            content: [{ type: 'text', text: '段落です。' }]
          }
        ]
      };
      
      const html = tiptapJSONToSanitizedHTML(doc);
      
      expect(html).toContain('<h1>タイトル</h1>');
      expect(html).toContain('<p>段落です。</p>');
    });
  });

  describe('エラーハンドリング', () => {
    test('不正なMarkdownの処理', () => {
      const invalidMarkdown = '####### 不正な見出しレベル';
      const html = markdownToHTML(invalidMarkdown);
      
      // 不正な見出しレベルは通常の段落として処理される
      expect(html).toContain('<p>');
    });

    test('不正なHTMLの処理', () => {
      const invalidHTML = '<h1>タイトル</h1><invalid-tag>コンテンツ</invalid-tag>';
      const json = htmlToTiptapJSON(invalidHTML);
      
      expect(json).toHaveProperty('type', 'doc');
    });

    test('不正なJSONの処理', () => {
      const invalidJSON = { type: 'invalid' };
      const html = tiptapJSONToHTML(invalidJSON);
      
      expect(html).toBe('<p>プレビュー生成エラーが発生しました</p>');
    });
  });

  describe('パフォーマンステスト', () => {
    test('大量データの処理', () => {
      const largeMarkdown = Array.from({ length: 100 }, (_, i) => 
        `# セクション${i + 1}\n\nこれは長い段落テキストです。`.repeat(5)
      ).join('\n\n');
      
      const startTime = performance.now();
      const result = testRoundTrip(largeMarkdown);
      const endTime = performance.now();
      
      expect(result.original).toBe(largeMarkdown);
      expect(endTime - startTime).toBeLessThan(1000); // 1秒以内
    });

    test('複雑な構造の処理', () => {
      const complexMarkdown = Array.from({ length: 50 }, (_, i) => 
        `# セクション${i + 1}\n\n- アイテムA\n- アイテムB\n\n> 引用テキスト\n\n\`\`\`javascript\nconsole.log("Hello ${i}");\n\`\`\`\n`
      ).join('\n');
      
      const startTime = performance.now();
      const result = testRoundTrip(complexMarkdown);
      const endTime = performance.now();
      
      expect(result.original).toBe(complexMarkdown);
      expect(endTime - startTime).toBeLessThan(2000); // 2秒以内
    });
  });

  describe('デバッグ機能', () => {
    test('debugConversionの動作確認', () => {
      const markdown = '# デバッグテスト\n\n**太字**のテストです。';
      
      // コンソールログをモック
      const consoleSpy = jest.spyOn(console, 'group').mockImplementation();
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
      const consoleGroupEndSpy = jest.spyOn(console, 'groupEnd').mockImplementation();
      
      const result = debugConversion(markdown, 'Test');
      
      expect(result).toHaveProperty('original');
      expect(result).toHaveProperty('html1');
      expect(result).toHaveProperty('json');
      expect(result).toHaveProperty('html2');
      expect(result).toHaveProperty('sanitized');
      
      // モックを復元
      consoleSpy.mockRestore();
      consoleLogSpy.mockRestore();
      consoleGroupEndSpy.mockRestore();
    });
  });
});
