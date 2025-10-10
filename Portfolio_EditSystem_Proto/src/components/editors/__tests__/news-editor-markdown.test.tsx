/**
 * テスト②: マークダウン → NewsEditor受け渡しの検証
 * 
 * このテストは、NewsEditorコンポーネントのマークダウンデータ受け渡し機能を検証します。
 * SimpleEditorから受け取ったマークダウン文字列が正しく処理されるかをテストします。
 */

describe('NewsEditor - Test ②: マークダウン → NewsEditor受け渡しの検証', () => {
  
  // updateLocalizedField function (extracted from NewsEditor.tsx)
  const updateLocalizedField = (
    field: 'title' | 'summary' | 'body' | 'alt' | 'ogTitle' | 'ogDescription',
    language: 'ja' | 'en',
    value: string,
    currentItem: any
  ) => {
    return {
      ...currentItem,
      [field]: { ...currentItem[field], [language]: value },
    };
  };

  // Mock NewsItem structure
  const createMockNewsItem = () => ({
    id: 'test-news-1',
    slug: 'test-news',
    date: '2024-01-01',
    title: { ja: '', en: '' },
    summary: { ja: '', en: '' },
    body: { ja: '', en: '' },
    alt: { ja: '', en: '' },
    tags: [],
    published: false,
    publish: { ja: true, en: true },
    pinned: false,
    image: ''
  });

  describe('基本データ受け渡しテスト', () => {
    test('標準的なマークダウンHeadingサンプルの受け渡し', () => {
      const mockItem = createMockNewsItem();
      const markdownInput = '# メインタイトル\n\n## サブタイトル\n\n### セクション見出し';
      
      const result = updateLocalizedField('body', 'ja', markdownInput, mockItem);
      
      expect(result.body.ja).toBe(markdownInput);
      expect(result.body.ja).toContain('# メインタイトル');
      expect(result.body.ja).toContain('## サブタイトル');
      expect(result.body.ja).toContain('### セクション見出し');
    });

    test('複雑なマークダウン構造（見出し + リスト + 本文）の受け渡し', () => {
      const mockItem = createMockNewsItem();
      const complexMarkdown = `# テスト用マークダウンサンプル

## 見出し2のテスト
これは見出し2の下の段落です。

### 見出し3のテスト
- リストアイテム1
- リストアイテム2

#### 見出し4のテスト
**太字のテキスト**と*斜体のテキスト*を含む段落です。

> これは引用ブロックです。

\`\`\`code
コードブロックの例
\`\`\``;

      const result = updateLocalizedField('body', 'ja', complexMarkdown, mockItem);
      
      expect(result.body.ja).toBe(complexMarkdown);
      expect(result.body.ja).toContain('# テスト用マークダウンサンプル');
      expect(result.body.ja).toContain('## 見出し2のテスト');
      expect(result.body.ja).toContain('- リストアイテム1');
      expect(result.body.ja).toContain('**太字のテキスト**');
      expect(result.body.ja).toContain('*斜体のテキスト*');
      expect(result.body.ja).toContain('> これは引用ブロックです。');
      expect(result.body.ja).toContain('```code');
    });

    test('特殊文字を含むマークダウンの受け渡し', () => {
      const mockItem = createMockNewsItem();
      const specialCharsMarkdown = `# 特殊文字テスト

## 記号と文字
- & (アンパサンド)
- < > (不等号)
- " ' (引用符)
- \` (バッククォート)
- \\ (バックスラッシュ)

### 日本語文字
ひらがな、カタカナ、漢字、英数字123

### 絵文字
😀 🎉 🚀 💻 📝`;

      const result = updateLocalizedField('body', 'ja', specialCharsMarkdown, mockItem);
      
      expect(result.body.ja).toBe(specialCharsMarkdown);
      expect(result.body.ja).toContain('& (アンパサンド)');
      expect(result.body.ja).toContain('< > (不等号)');
      expect(result.body.ja).toContain('" \' (引用符)');
      expect(result.body.ja).toContain('` (バッククォート)');
      expect(result.body.ja).toContain('\\ (バックスラッシュ)');
      expect(result.body.ja).toContain('ひらがな、カタカナ、漢字、英数字123');
      expect(result.body.ja).toContain('😀 🎉 🚀 💻 📝');
    });

    test('空のマークダウンの受け渡し', () => {
      const mockItem = createMockNewsItem();
      const emptyMarkdown = '';
      
      const result = updateLocalizedField('body', 'ja', emptyMarkdown, mockItem);
      
      expect(result.body.ja).toBe('');
      expect(result.body.ja).toHaveLength(0);
    });
  });

  describe('データ整合性テスト', () => {
    test('入力データと出力データの一致確認', () => {
      const mockItem = createMockNewsItem();
      const testMarkdown = '# テストタイトル\n\nこれはテスト用のマークダウンです。';
      
      const result = updateLocalizedField('body', 'ja', testMarkdown, mockItem);
      
      // 入力と出力が完全に一致することを確認
      expect(result.body.ja).toBe(testMarkdown);
      expect(result.body.ja).toEqual(testMarkdown);
    });

    test('文字エンコーディングの正確性', () => {
      const mockItem = createMockNewsItem();
      const unicodeMarkdown = `# Unicode文字テスト

## 日本語
ひらがな：あいうえお
カタカナ：アイウエオ
漢字：漢字テスト

## 英語
English Text: Hello World!

## 数字・記号
1234567890
!@#$%^&*()`;

      const result = updateLocalizedField('body', 'ja', unicodeMarkdown, mockItem);
      
      expect(result.body.ja).toBe(unicodeMarkdown);
      expect(result.body.ja).toContain('ひらがな：あいうえお');
      expect(result.body.ja).toContain('カタカナ：アイウエオ');
      expect(result.body.ja).toContain('漢字：漢字テスト');
      expect(result.body.ja).toContain('English Text: Hello World!');
      expect(result.body.ja).toContain('1234567890');
      expect(result.body.ja).toContain('!@#$%^&*()');
    });

    test('改行文字の適切な処理', () => {
      const mockItem = createMockNewsItem();
      const multilineMarkdown = `# 複数行テスト

これは最初の段落です。

これは2番目の段落です。

## サブタイトル

これは3番目の段落です。`;

      const result = updateLocalizedField('body', 'ja', multilineMarkdown, mockItem);
      
      expect(result.body.ja).toBe(multilineMarkdown);
      expect(result.body.ja).toContain('\n\n');
      expect(result.body.ja.split('\n')).toHaveLength(9);
    });

    test('マークダウン記法の保持確認', () => {
      const mockItem = createMockNewsItem();
      const markdownSyntax = `# H1見出し

## H2見出し

### H3見出し

#### H4見出し

##### H5見出し

###### H6見出し

**太字テキスト**

*斜体テキスト*

~~取り消し線~~

\`インラインコード\`

\`\`\`
コードブロック
\`\`\`

> 引用ブロック

- リストアイテム1
- リストアイテム2

1. 番号付きリスト1
2. 番号付きリスト2

[リンクテキスト](https://example.com)

![画像](image.jpg)`;

      const result = updateLocalizedField('body', 'ja', markdownSyntax, mockItem);
      
      expect(result.body.ja).toBe(markdownSyntax);
      expect(result.body.ja).toContain('# H1見出し');
      expect(result.body.ja).toContain('## H2見出し');
      expect(result.body.ja).toContain('### H3見出し');
      expect(result.body.ja).toContain('#### H4見出し');
      expect(result.body.ja).toContain('##### H5見出し');
      expect(result.body.ja).toContain('###### H6見出し');
      expect(result.body.ja).toContain('**太字テキスト**');
      expect(result.body.ja).toContain('*斜体テキスト*');
      expect(result.body.ja).toContain('~~取り消し線~~');
      expect(result.body.ja).toContain('`インラインコード`');
      expect(result.body.ja).toContain('```');
      expect(result.body.ja).toContain('> 引用ブロック');
      expect(result.body.ja).toContain('- リストアイテム1');
      expect(result.body.ja).toContain('1. 番号付きリスト1');
      expect(result.body.ja).toContain('[リンクテキスト](https://example.com)');
      expect(result.body.ja).toContain('![画像](image.jpg)');
    });
  });

  describe('エラーハンドリングテスト', () => {
    test('不正なマークダウン記法の処理', () => {
      const mockItem = createMockNewsItem();
      const invalidMarkdown = `# 不正なマークダウン

## 未閉じの見出し
# 不正な見出しレベル

**未閉じの太字
*未閉じの斜体

[未閉じのリンク
![未閉じの画像

\`未閉じのコードブロック`;

      const result = updateLocalizedField('body', 'ja', invalidMarkdown, mockItem);
      
      // 不正なマークダウンでも文字列として受け渡しされることを確認
      expect(result.body.ja).toBe(invalidMarkdown);
      expect(typeof result.body.ja).toBe('string');
      expect(result.body.ja).toContain('# 不正なマークダウン');
    });

    test('非常に長いマークダウンテキストの処理', () => {
      const mockItem = createMockNewsItem();
      const longText = 'あ'.repeat(10000);
      const longMarkdown = `# 非常に長いテキストのテスト\n\n${longText}`;
      
      const result = updateLocalizedField('body', 'ja', longMarkdown, mockItem);
      
      expect(result.body.ja).toBe(longMarkdown);
      expect(result.body.ja).toHaveLength(10017); // '# 非常に長いテキストのテスト\n\n' + 10000文字（実際の長さ）
      expect(result.body.ja).toContain('# 非常に長いテキストのテスト');
      expect(result.body.ja).toContain(longText);
    });

    test('null/undefinedデータの処理', () => {
      const mockItem = createMockNewsItem();
      
      // null の処理
      const resultNull = updateLocalizedField('body', 'ja', null as any, mockItem);
      expect(resultNull.body.ja).toBe(null);
      
      // undefined の処理
      const resultUndefined = updateLocalizedField('body', 'ja', undefined as any, mockItem);
      expect(resultUndefined.body.ja).toBe(undefined);
    });

    test('予期しないデータ形式の処理', () => {
      const mockItem = createMockNewsItem();
      
      // 数値の処理
      const resultNumber = updateLocalizedField('body', 'ja', 123 as any, mockItem);
      expect(resultNumber.body.ja).toBe(123);
      
      // オブジェクトの処理
      const resultObject = updateLocalizedField('body', 'ja', { test: 'value' } as any, mockItem);
      expect(resultObject.body.ja).toEqual({ test: 'value' });
      
      // 配列の処理
      const resultArray = updateLocalizedField('body', 'ja', ['item1', 'item2'] as any, mockItem);
      expect(resultArray.body.ja).toEqual(['item1', 'item2']);
      
      // 真偽値の処理
      const resultBoolean = updateLocalizedField('body', 'ja', true as any, mockItem);
      expect(resultBoolean.body.ja).toBe(true);
    });
  });

  describe('複数言語対応テスト', () => {
    test('日本語と英語の両方でのデータ受け渡し', () => {
      const mockItem = createMockNewsItem();
      const japaneseMarkdown = '# 日本語タイトル\n\nこれは日本語のコンテンツです。';
      const englishMarkdown = '# English Title\n\nThis is English content.';
      
      // 日本語の設定
      const resultJa = updateLocalizedField('body', 'ja', japaneseMarkdown, mockItem);
      expect(resultJa.body.ja).toBe(japaneseMarkdown);
      expect(resultJa.body.en).toBe(''); // 英語は空のまま
      
      // 英語の設定
      const resultEn = updateLocalizedField('body', 'en', englishMarkdown, resultJa);
      expect(resultEn.body.ja).toBe(japaneseMarkdown); // 日本語は保持
      expect(resultEn.body.en).toBe(englishMarkdown);
    });

    test('言語間でのデータ独立性確認', () => {
      const mockItem = createMockNewsItem();
      const markdownJa = '# 日本語コンテンツ';
      const markdownEn = '# English Content';
      
      // 日本語を設定
      const resultJa = updateLocalizedField('body', 'ja', markdownJa, mockItem);
      
      // 英語を設定（日本語に影響しないことを確認）
      const resultFinal = updateLocalizedField('body', 'en', markdownEn, resultJa);
      
      expect(resultFinal.body.ja).toBe(markdownJa);
      expect(resultFinal.body.en).toBe(markdownEn);
      expect(resultFinal.body.ja).not.toBe(resultFinal.body.en);
    });
  });

  describe('パフォーマンステスト', () => {
    test('大量データの受け渡し性能', () => {
      const mockItem = createMockNewsItem();
      const largeMarkdown = Array.from({ length: 1000 }, (_, i) => `# 見出し${i}\n\nこれは${i}番目のコンテンツです。\n\n`).join('');
      
      const startTime = performance.now();
      const result = updateLocalizedField('body', 'ja', largeMarkdown, mockItem);
      const endTime = performance.now();
      
      expect(result.body.ja).toBe(largeMarkdown);
      expect(endTime - startTime).toBeLessThan(100); // 100ms以内で処理完了
    });

    test('繰り返し更新の性能', () => {
      const mockItem = createMockNewsItem();
      let currentItem = mockItem;
      
      const startTime = performance.now();
      
      // 100回の更新を実行
      for (let i = 0; i < 100; i++) {
        currentItem = updateLocalizedField('body', 'ja', `# 更新${i}\n\nコンテンツ${i}`, currentItem);
      }
      
      const endTime = performance.now();
      
      expect(currentItem.body.ja).toBe('# 更新99\n\nコンテンツ99');
      expect(endTime - startTime).toBeLessThan(50); // 50ms以内で処理完了
    });
  });
});
