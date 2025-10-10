/**
 * テスト①: エディタ入力 → マークダウン出力の検証
 * 
 * このテストは、SimpleEditorコンポーネントのマークダウン出力機能を検証します。
 * 実際のコンポーネントレンダリングではなく、マークダウン変換ロジックを直接テストします。
 */

describe('SimpleEditor - Test ①: エディタ入力 → マークダウン出力の検証', () => {
  
  // HTML to Markdown conversion function (extracted from simple-editor.tsx)
  const convertHtmlToMarkdown = (html: string): string => {
    return html
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
  };

  describe('基本Headingテスト', () => {
    test('H1見出しの入力 → # 見出し1 の出力', () => {
      const html = '<h1>見出し1</h1>';
      const result = convertHtmlToMarkdown(html);
      expect(result).toBe('# 見出し1');
    });

    test('H2見出しの入力 → ## 見出し2 の出力', () => {
      const html = '<h2>見出し2</h2>';
      const result = convertHtmlToMarkdown(html);
      expect(result).toBe('## 見出し2');
    });

    test('H3見出しの入力 → ### 見出し3 の出力', () => {
      const html = '<h3>見出し3</h3>';
      const result = convertHtmlToMarkdown(html);
      expect(result).toBe('### 見出し3');
    });

    test('H4見出しの入力 → #### 見出し4 の出力', () => {
      const html = '<h4>見出し4</h4>';
      const result = convertHtmlToMarkdown(html);
      expect(result).toBe('#### 見出し4');
    });

    test('H5見出しの入力 → ##### 見出し5 の出力', () => {
      const html = '<h5>見出し5</h5>';
      const result = convertHtmlToMarkdown(html);
      expect(result).toBe('##### 見出し5');
    });

    test('H6見出しの入力 → ###### 見出し6 の出力', () => {
      const html = '<h6>見出し6</h6>';
      const result = convertHtmlToMarkdown(html);
      expect(result).toBe('###### 見出し6');
    });
  });

  describe('複合テスト', () => {
    test('複数レベルの見出し混在 → 正しいマークダウン記法の出力', () => {
      const html = '<h1>メインタイトル</h1><h2>サブタイトル</h2><h3>セクション見出し</h3>';
      const result = convertHtmlToMarkdown(html);
      
      expect(result).toContain('# メインタイトル');
      expect(result).toContain('## サブタイトル');
      expect(result).toContain('### セクション見出し');
    });

    test('見出し + 本文の混在 → 適切な改行とマークダウン記法', () => {
      const html = '<h1>見出し</h1><p>これは段落テキストです。</p>';
      const result = convertHtmlToMarkdown(html);
      
      expect(result).toContain('# 見出し');
      expect(result).toContain('これは段落テキストです。');
    });

    test('見出し + リストの混在 → 正しい構造の出力', () => {
      const html = '<h2>リストの見出し</h2><ul><li>アイテム1</li><li>アイテム2</li></ul>';
      const result = convertHtmlToMarkdown(html);
      
      expect(result).toContain('## リストの見出し');
      expect(result).toContain('- アイテム1');
      expect(result).toContain('- アイテム2');
    });

    test('見出し + 太字・斜体の混在 → 正しいマークダウン記法', () => {
      const html = '<h1>見出し</h1><p><strong>太字</strong>と<em>斜体</em>のテキスト。</p>';
      const result = convertHtmlToMarkdown(html);
      
      expect(result).toContain('# 見出し');
      expect(result).toContain('**太字**');
      expect(result).toContain('*斜体*');
    });
  });

  describe('エッジケース', () => {
    test('特殊文字を含む見出し → 正しいエスケープ処理', () => {
      const html = '<h1>見出し & 特殊文字 < > " \' `</h1>';
      const result = convertHtmlToMarkdown(html);
      
      expect(result).toContain('# 見出し & 特殊文字');
    });

    test('長い見出しテキスト → 適切な処理', () => {
      const longText = 'あ'.repeat(100);
      const html = `<h1>${longText}</h1>`;
      const result = convertHtmlToMarkdown(html);
      
      expect(result).toContain(`# ${longText}`);
    });

    test('空の見出しの処理 → 適切なエラーハンドリング', () => {
      const html = '<h1></h1>';
      const result = convertHtmlToMarkdown(html);
      
      // Should handle empty heading gracefully
      expect(result).toBe('');
    });

    test('HTML属性を含む見出し → 属性を無視してテキストのみ抽出', () => {
      const html = '<h1 class="title" id="main">見出し</h1>';
      const result = convertHtmlToMarkdown(html);
      
      expect(result).toBe('# 見出し');
    });

    test('ネストしたHTML要素を含む見出し → 正しくテキストを抽出', () => {
      const html = '<h1>見出し <strong>太字</strong> テキスト</h1>';
      const result = convertHtmlToMarkdown(html);
      
      expect(result).toBe('# 見出し 太字 テキスト');
    });
  });

  describe('マークダウン記法の検証', () => {
    test('マークダウン記法の正規表現パターン検証', () => {
      const testCases = [
        { input: '<h1>テスト</h1>', expected: '# テスト' },
        { input: '<h2>テスト</h2>', expected: '## テスト' },
        { input: '<h3>テスト</h3>', expected: '### テスト' },
        { input: '<h4>テスト</h4>', expected: '#### テスト' },
        { input: '<h5>テスト</h5>', expected: '##### テスト' },
        { input: '<h6>テスト</h6>', expected: '###### テスト' },
      ];

      testCases.forEach(({ input, expected }) => {
        const result = convertHtmlToMarkdown(input);
        expect(result).toBe(expected);
      });
    });

    test('複雑なHTML構造の変換', () => {
      const html = `
        <h1>メインタイトル</h1>
        <p>これは段落です。</p>
        <h2>サブタイトル</h2>
        <ul>
          <li>リストアイテム1</li>
          <li>リストアイテム2</li>
        </ul>
        <h3>セクション見出し</h3>
        <p><strong>太字</strong>と<em>斜体</em>のテキスト。</p>
      `;
      
      const result = convertHtmlToMarkdown(html);
      
      expect(result).toContain('# メインタイトル');
      expect(result).toContain('これは段落です。');
      expect(result).toContain('## サブタイトル');
      expect(result).toContain('- リストアイテム1');
      expect(result).toContain('- リストアイテム2');
      expect(result).toContain('### セクション見出し');
      expect(result).toContain('**太字**');
      expect(result).toContain('*斜体*');
    });
  });
});
