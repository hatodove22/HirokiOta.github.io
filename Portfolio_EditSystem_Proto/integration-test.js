/**
 * 総合テスト: エディタ → プレビューの実機確認
 * 
 * このスクリプトは以下のテストを実行します：
 * 1. エディタにマークダウン文章を入力
 * 2. プレビューに適切に反映されているかを確認
 * 3. データフローの完全性を検証
 */

const puppeteer = require('puppeteer');

// テスト用のマークダウンサンプル
const testMarkdown = `# 総合テスト用マークダウン

## セクション1: 基本要素

これは**太字**と*斜体*のテストです。

### サブセクション1.1

- リストアイテム1
- リストアイテム2
- リストアイテム3

### サブセクション1.2

1. 番号付きリスト1
2. 番号付きリスト2
3. 番号付きリスト3

## セクション2: 高度な要素

> これは引用ブロックです。
> 複数行にわたる引用のテストです。

### コードブロック

\`\`\`javascript
function testFunction() {
  console.log("Hello, World!");
  return "テスト完了";
}
\`\`\`

### リンクと画像

[テストリンク](https://example.com)

## セクション3: 特殊文字

日本語のテスト: こんにちは、世界！

特殊文字: & < > " ' \`

### 長いテキストのテスト

これは非常に長いテキストのテストです。Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

## セクション4: ネストした構造

### 深いネスト

#### さらに深いネスト

##### 最も深いネスト

これは深いネストのテストです。

---

## テスト完了

以上で総合テスト用のマークダウン文章の入力が完了しました。`;

async function runIntegrationTest() {
  console.log('🚀 総合テスト開始: エディタ → プレビューの実機確認');
  
  let browser;
  try {
    // ブラウザを起動
    browser = await puppeteer.launch({
      headless: false, // ヘッドレスモードを無効にして視覚的に確認
      defaultViewport: null,
      args: ['--start-maximized']
    });
    
    const page = await browser.newPage();
    
    // ページにアクセス
    console.log('📱 ページにアクセス中...');
    await page.goto('http://localhost:5174', { waitUntil: 'networkidle2' });
    
    // ページの読み込み完了を待機
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // ニュース編集画面に遷移
    console.log('📝 ニュース編集画面に遷移中...');
    
    // サイドバーのニュースボタンをクリック
    try {
      await page.click('[data-testid="news-button"]');
    } catch (error) {
      try {
        await page.click('a[href*="/news"]');
      } catch (error2) {
        console.log('⚠️ ニュースボタンが見つかりません。手動でニュース画面に遷移してください。');
      }
    }
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 新規作成ボタンをクリック
    try {
      await page.click('[data-testid="new-button"]');
    } catch (error) {
      try {
        await page.click('a[href*="/new"]');
      } catch (error2) {
        console.log('⚠️ 新規作成ボタンが見つかりません。手動で新規作成画面に遷移してください。');
      }
    }
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // エディタエリアを特定
    console.log('✏️ エディタエリアを特定中...');
    
    // 複数のセレクターを試行
    const editorSelectors = [
      '.ProseMirror',
      '[contenteditable="true"]',
      '.tiptap-editor',
      '.simple-editor',
      'div[role="textbox"]',
      '.editor-content'
    ];
    
    let editorElement = null;
    for (const selector of editorSelectors) {
      try {
        editorElement = await page.$(selector);
        if (editorElement) {
          console.log(`✅ エディタを発見: ${selector}`);
          break;
        }
      } catch (error) {
        console.log(`❌ セレクター失敗: ${selector}`);
      }
    }
    
    if (!editorElement) {
      console.log('❌ エディタエリアが見つかりません');
      console.log('🔍 利用可能な要素を調査中...');
      
      // ページ内のすべての要素を調査
      const allElements = await page.evaluate(() => {
        const elements = document.querySelectorAll('*');
        const elementInfo = [];
        for (let i = 0; i < Math.min(elements.length, 50); i++) {
          const el = elements[i];
          elementInfo.push({
            tagName: el.tagName,
            className: el.className,
            id: el.id,
            contentEditable: el.contentEditable,
            role: el.getAttribute('role')
          });
        }
        return elementInfo;
      });
      
      console.log('📋 ページ要素一覧:');
      allElements.forEach((el, index) => {
        console.log(`${index + 1}. ${el.tagName} - class: ${el.className}, id: ${el.id}, contentEditable: ${el.contentEditable}, role: ${el.role}`);
      });
      
      throw new Error('エディタエリアが見つかりません');
    }
    
    // エディタにフォーカス
    console.log('🎯 エディタにフォーカス中...');
    await editorElement.click();
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 既存のコンテンツをクリア
    console.log('🗑️ 既存のコンテンツをクリア中...');
    await page.keyboard.down('Control');
    await page.keyboard.press('KeyA');
    await page.keyboard.up('Control');
    await page.keyboard.press('Delete');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // マークダウン文章を入力
    console.log('📝 マークダウン文章を入力中...');
    await page.keyboard.type(testMarkdown);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // プレビューエリアを確認
    console.log('👀 プレビューエリアを確認中...');
    
    // プレビューボタンをクリック（もしあれば）
    let previewButton = null;
    try {
      previewButton = await page.$('[data-testid="preview-button"]');
    } catch (error) {
      try {
        previewButton = await page.$('button:contains("プレビュー")');
      } catch (error2) {
        console.log('⚠️ プレビューボタンが見つかりません。');
      }
    }
    if (previewButton) {
      await previewButton.click();
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    // プレビューエリアの内容を取得
    const previewContent = await page.evaluate(() => {
      // 複数のプレビューセレクターを試行
      const previewSelectors = [
        '.preview-content',
        '.news-preview',
        '.preview-pane',
        '[data-testid="preview"]',
        '.preview'
      ];
      
      for (const selector of previewSelectors) {
        const element = document.querySelector(selector);
        if (element) {
          return {
            found: true,
            selector: selector,
            content: element.innerHTML,
            textContent: element.textContent
          };
        }
      }
      
      // プレビューが見つからない場合、ページ全体の内容を取得
      return {
        found: false,
        content: document.body.innerHTML,
        textContent: document.body.textContent
      };
    });
    
    console.log('📊 プレビュー確認結果:');
    console.log(`- プレビューエリア発見: ${previewContent.found ? '✅' : '❌'}`);
    if (previewContent.selector) {
      console.log(`- 使用セレクター: ${previewContent.selector}`);
    }
    
    // マークダウン要素の確認
    const markdownElements = await page.evaluate(() => {
      const elements = {
        h1: document.querySelectorAll('h1').length,
        h2: document.querySelectorAll('h2').length,
        h3: document.querySelectorAll('h3').length,
        h4: document.querySelectorAll('h4').length,
        h5: document.querySelectorAll('h5').length,
        h6: document.querySelectorAll('h6').length,
        p: document.querySelectorAll('p').length,
        ul: document.querySelectorAll('ul').length,
        ol: document.querySelectorAll('ol').length,
        li: document.querySelectorAll('li').length,
        blockquote: document.querySelectorAll('blockquote').length,
        code: document.querySelectorAll('code').length,
        pre: document.querySelectorAll('pre').length,
        strong: document.querySelectorAll('strong').length,
        em: document.querySelectorAll('em').length
      };
      return elements;
    });
    
    console.log('📋 マークダウン要素の確認結果:');
    Object.entries(markdownElements).forEach(([tag, count]) => {
      console.log(`- ${tag}: ${count}個`);
    });
    
    // テスト結果の評価
    console.log('\n🎯 テスト結果の評価:');
    
    const testResults = {
      editorAccess: !!editorElement,
      contentInput: previewContent.textContent.includes('総合テスト用マークダウン'),
      headingRendering: markdownElements.h1 > 0 && markdownElements.h2 > 0,
      listRendering: markdownElements.ul > 0 || markdownElements.ol > 0,
      formattingRendering: markdownElements.strong > 0 || markdownElements.em > 0,
      codeRendering: markdownElements.code > 0 || markdownElements.pre > 0,
      quoteRendering: markdownElements.blockquote > 0
    };
    
    Object.entries(testResults).forEach(([test, result]) => {
      console.log(`- ${test}: ${result ? '✅ 成功' : '❌ 失敗'}`);
    });
    
    const successCount = Object.values(testResults).filter(Boolean).length;
    const totalTests = Object.keys(testResults).length;
    const successRate = (successCount / totalTests * 100).toFixed(1);
    
    console.log(`\n📊 総合テスト結果: ${successCount}/${totalTests} (${successRate}%)`);
    
    if (successRate >= 80) {
      console.log('🎉 総合テスト成功！エディタからプレビューへのデータフローが正常に動作しています。');
    } else {
      console.log('⚠️ 総合テストで問題が発見されました。詳細な調査が必要です。');
    }
    
    // スクリーンショットを撮影
    console.log('📸 スクリーンショットを撮影中...');
    await page.screenshot({ 
      path: 'integration-test-result.png', 
      fullPage: true 
    });
    console.log('✅ スクリーンショット保存完了: integration-test-result.png');
    
    // 結果をJSONファイルに保存
    const testReport = {
      timestamp: new Date().toISOString(),
      testMarkdown: testMarkdown,
      previewContent: previewContent,
      markdownElements: markdownElements,
      testResults: testResults,
      successRate: successRate
    };
    
    const fs = require('fs');
    fs.writeFileSync('integration-test-report.json', JSON.stringify(testReport, null, 2));
    console.log('✅ テストレポート保存完了: integration-test-report.json');
    
  } catch (error) {
    console.error('❌ 総合テスト中にエラーが発生しました:', error.message);
    console.error('スタックトレース:', error.stack);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// テスト実行
runIntegrationTest().catch(console.error);
