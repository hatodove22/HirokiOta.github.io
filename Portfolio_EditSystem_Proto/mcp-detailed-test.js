/**
 * MCPスタイルの詳細テストスクリプト
 * 
 * プランB実装の綿密なテストを実施:
 * 1. ナビゲーション機能のテスト
 * 2. エディタアクセスのテスト
 * 3. マークダウン入力とプレビューのテスト
 * 4. 変換フローの詳細テスト
 * 5. エラー検出とパフォーマンス測定
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

class MCPDetailedTester {
  constructor() {
    this.browser = null;
    this.page = null;
    this.testResults = {
      timestamp: new Date().toISOString(),
      tests: {},
      errors: [],
      performance: {},
      screenshots: []
    };
  }

  async initialize() {
    console.log('🚀 MCP詳細テスト開始');
    
    this.browser = await puppeteer.launch({
      headless: false, // 視覚的確認のため
      devtools: true,  // DevToolsを開く
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ]
    });

    this.page = await this.browser.newPage();
    
    // ページサイズを設定
    await this.page.setViewport({ width: 1920, height: 1080 });
    
    // コンソールログをキャプチャ
    this.page.on('console', msg => {
      const type = msg.type();
      const text = msg.text();
      if (type === 'error') {
        this.testResults.errors.push({
          type: 'console_error',
          message: text,
          timestamp: new Date().toISOString()
        });
      }
      console.log(`[${type.toUpperCase()}] ${text}`);
    });

    // ネットワークエラーをキャプチャ
    this.page.on('response', response => {
      if (!response.ok()) {
        this.testResults.errors.push({
          type: 'network_error',
          url: response.url(),
          status: response.status(),
          timestamp: new Date().toISOString()
        });
      }
    });

    console.log('✅ ブラウザ初期化完了');
  }

  async takeScreenshot(name) {
    const screenshotPath = path.join(__dirname, `mcp-test-${name}-${Date.now()}.png`);
    await this.page.screenshot({ 
      path: screenshotPath, 
      fullPage: true 
    });
    this.testResults.screenshots.push({
      name,
      path: screenshotPath,
      timestamp: new Date().toISOString()
    });
    console.log(`📸 スクリーンショット保存: ${name}`);
    return screenshotPath;
  }

  async testPageAccess() {
    console.log('\n🔍 テスト1: ページアクセス');
    const startTime = performance.now();
    
    try {
      await this.page.goto('http://localhost:5174', { 
        waitUntil: 'networkidle2',
        timeout: 10000 
      });
      
      const endTime = performance.now();
      this.testResults.performance.pageLoad = endTime - startTime;
      
      const title = await this.page.title();
      const url = this.page.url();
      
      this.testResults.tests.pageAccess = {
        success: true,
        title,
        url,
        loadTime: endTime - startTime
      };
      
      console.log(`✅ ページアクセス成功: ${title} (${url})`);
      console.log(`⏱️ 読み込み時間: ${(endTime - startTime).toFixed(2)}ms`);
      
      await this.takeScreenshot('page-access');
      
    } catch (error) {
      this.testResults.tests.pageAccess = {
        success: false,
        error: error.message
      };
      console.error(`❌ ページアクセス失敗: ${error.message}`);
    }
  }

  async testNavigation() {
    console.log('\n🔍 テスト2: ナビゲーション機能');
    
    try {
      // サイドバー要素の確認
      const sidebar = await this.page.$('.group.peer.text-sidebar-foreground');
      if (!sidebar) {
        throw new Error('サイドバーが見つかりません');
      }
      
      // ニュースボタンを探す（代替方法を使用）
      const buttons = await this.page.$$('button');
      let newsButtonFound = null;
      
      for (const button of buttons) {
        const text = await button.evaluate(el => el.textContent);
        if (text && text.includes('ニュース')) {
          newsButtonFound = button;
          break;
        }
      }
        
      if (!newsButtonFound) {
        throw new Error('ニュースボタンが見つかりません');
      }
      
      // ニュースボタンをクリック
      await newsButtonFound.click();
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const currentUrl = this.page.url();
      console.log(`📍 クリック後のURL: ${currentUrl}`);
      
      this.testResults.tests.navigation = {
        success: currentUrl.includes('/news'),
        currentUrl,
        method: 'text-search'
      };
      
      if (currentUrl.includes('/news')) {
        console.log('✅ ナビゲーション成功: ニュース画面に遷移');
      } else {
        console.log('⚠️ ナビゲーション部分成功: ニュース画面に遷移していない');
      }
      
      await this.takeScreenshot('navigation');
      
    } catch (error) {
      this.testResults.tests.navigation = {
        success: false,
        error: error.message
      };
      console.error(`❌ ナビゲーションテスト失敗: ${error.message}`);
    }
  }

  async testEditorAccess() {
    console.log('\n🔍 テスト3: エディタアクセス');
    
    try {
      // 新規作成ボタンを探す（代替方法を使用）
      const buttons = await this.page.$$('button');
      let newButtonFound = null;
      
      for (const button of buttons) {
        const text = await button.evaluate(el => el.textContent);
        if (text && text.includes('新規作成')) {
          newButtonFound = button;
          break;
        }
      }
      
      if (!newButtonFound) {
        throw new Error('新規作成ボタンが見つかりません');
      }
      
      await newButtonFound.click();
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const currentUrl = this.page.url();
      console.log(`📍 新規作成後のURL: ${currentUrl}`);
      
      // プレビュー表示ボタンを探してクリック
      const allButtons = await this.page.$$('button');
      let previewButtonFound = null;
      
      for (const button of allButtons) {
        const text = await button.evaluate(el => el.textContent);
        const hasEyeIcon = await button.evaluate(el => {
          const icon = el.querySelector('svg');
          return icon && (icon.innerHTML.includes('eye') || icon.innerHTML.includes('Eye'));
        });
        
        if (text && (text.includes('プレビュー') || text.includes('表示') || hasEyeIcon)) {
          previewButtonFound = button;
          break;
        }
      }
      
      if (previewButtonFound) {
        await previewButtonFound.click();
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('👁️ プレビュー表示ボタンをクリックしました');
      } else {
        console.log('⚠️ プレビュー表示ボタンが見つかりません');
      }
      
      // エディタ要素の確認
      const editor = await this.page.$('.ProseMirror[contenteditable="true"]');
      const preview = await this.page.$('.prose');
      
      this.testResults.tests.editorAccess = {
        success: !!(editor && preview),
        currentUrl,
        editorFound: !!editor,
        previewFound: !!preview
      };
      
      if (editor && preview) {
        console.log('✅ エディタアクセス成功: エディタとプレビューが見つかりました');
      } else {
        console.log('⚠️ エディタアクセス部分成功: エディタまたはプレビューが見つかりません');
        console.log(`- エディタ: ${editor ? '✅' : '❌'}`);
        console.log(`- プレビュー: ${preview ? '✅' : '❌'}`);
      }
      
      await this.takeScreenshot('editor-access');
      
    } catch (error) {
      this.testResults.tests.editorAccess = {
        success: false,
        error: error.message
      };
      console.error(`❌ エディタアクセステスト失敗: ${error.message}`);
    }
  }

  async testMarkdownInput() {
    console.log('\n🔍 テスト4: マークダウン入力とプレビュー');
    
    try {
      const editor = await this.page.$('.ProseMirror[contenteditable="true"]');
      if (!editor) {
        throw new Error('エディタが見つかりません');
      }
      
      // エディタにフォーカス
      await editor.click();
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 既存のコンテンツをクリア
      await this.page.keyboard.down('Control');
      await this.page.keyboard.press('KeyA');
      await this.page.keyboard.up('Control');
      await this.page.keyboard.press('Delete');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // テスト用マークダウンを入力
      const testMarkdown = `# テスト見出し

これは**太字**と*斜体*のテストです。

## リストテスト

- アイテム1
- アイテム2
- アイテム3

### コードブロック

\`\`\`javascript
console.log("Hello, World!");
\`\`\`

> これは引用ブロックです。

---

**テスト完了**`;

      console.log('📝 マークダウンを入力中...');
      await this.page.keyboard.type(testMarkdown);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // プレビュー内容を取得
           const previewContent = await this.page.$eval('.prose', el => el.innerHTML);
      
      // プレビュー内容の検証
      const hasH1 = previewContent.includes('<h1>テスト見出し</h1>');
      const hasH2 = previewContent.includes('<h2>リストテスト</h2>');
      const hasH3 = previewContent.includes('<h3>コードブロック</h3>');
      const hasStrong = previewContent.includes('<strong>太字</strong>');
      const hasEm = previewContent.includes('<em>斜体</em>');
      const hasUl = previewContent.includes('<ul>');
      const hasLi = previewContent.includes('<li>アイテム1</li>');
      const hasCode = previewContent.includes('<pre>');
      const hasBlockquote = previewContent.includes('<blockquote>');
      const hasHr = previewContent.includes('<hr>');
      
      const validationResults = {
        h1: hasH1,
        h2: hasH2,
        h3: hasH3,
        strong: hasStrong,
        em: hasEm,
        ul: hasUl,
        li: hasLi,
        code: hasCode,
        blockquote: hasBlockquote,
        hr: hasHr
      };
      
      const successCount = Object.values(validationResults).filter(Boolean).length;
      const totalCount = Object.keys(validationResults).length;
      const successRate = (successCount / totalCount) * 100;
      
      this.testResults.tests.markdownInput = {
        success: successRate >= 80,
        successRate,
        validationResults,
        previewContent: previewContent.substring(0, 500) + '...' // 最初の500文字のみ
      };
      
      console.log(`✅ マークダウン入力テスト完了: ${successCount}/${totalCount} (${successRate.toFixed(1)}%)`);
      
      // 詳細な検証結果を表示
      Object.entries(validationResults).forEach(([key, value]) => {
        console.log(`  - ${key}: ${value ? '✅' : '❌'}`);
      });
      
      await this.takeScreenshot('markdown-input');
      
    } catch (error) {
      this.testResults.tests.markdownInput = {
        success: false,
        error: error.message
      };
      console.error(`❌ マークダウン入力テスト失敗: ${error.message}`);
    }
  }

  async testConversionFlow() {
    console.log('\n🔍 テスト5: 変換フローの詳細テスト');
    
    try {
      // エディタの内容を取得
      const editorContent = await this.page.$eval('.ProseMirror[contenteditable="true"]', el => {
        return {
          html: el.innerHTML,
          text: el.textContent,
          json: el.getAttribute('data-json') || 'not available'
        };
      });
      
      // プレビューの内容を取得
           const previewContent = await this.page.$eval('.prose', el => el.innerHTML);
      
      // コンソールログから変換フローの情報を取得
      const consoleLogs = await this.page.evaluate(() => {
        return window.consoleLogs || [];
      });
      
      // 変換フローの検証
      const conversionTests = {
        editorHasContent: editorContent.html.length > 0,
        previewHasContent: previewContent.length > 0,
        contentMatches: editorContent.text.trim() === previewContent.replace(/<[^>]*>/g, '').trim(),
        hasMarkdownElements: previewContent.includes('<h1>') || previewContent.includes('<strong>'),
        hasProperStructure: previewContent.includes('<h1>') && previewContent.includes('<ul>')
      };
      
      const conversionSuccessCount = Object.values(conversionTests).filter(Boolean).length;
      const conversionTotalCount = Object.keys(conversionTests).length;
      const conversionSuccessRate = (conversionSuccessCount / conversionTotalCount) * 100;
      
      this.testResults.tests.conversionFlow = {
        success: conversionSuccessRate >= 80,
        successRate: conversionSuccessRate,
        conversionTests,
        editorContent: editorContent,
        previewContent: previewContent.substring(0, 500) + '...',
        consoleLogs: consoleLogs.slice(-10) // 最後の10個のログ
      };
      
      console.log(`✅ 変換フローテスト完了: ${conversionSuccessCount}/${conversionTotalCount} (${conversionSuccessRate.toFixed(1)}%)`);
      
      // 詳細な検証結果を表示
      Object.entries(conversionTests).forEach(([key, value]) => {
        console.log(`  - ${key}: ${value ? '✅' : '❌'}`);
      });
      
      await this.takeScreenshot('conversion-flow');
      
    } catch (error) {
      this.testResults.tests.conversionFlow = {
        success: false,
        error: error.message
      };
      console.error(`❌ 変換フローテスト失敗: ${error.message}`);
    }
  }

  async testErrorDetection() {
    console.log('\n🔍 テスト6: エラー検出');
    
    try {
      // コンソールエラーの確認
      const consoleErrors = this.testResults.errors.filter(e => e.type === 'console_error');
      const networkErrors = this.testResults.errors.filter(e => e.type === 'network_error');
      
      // ページのエラー状態を確認
      const pageErrors = await this.page.evaluate(() => {
        return {
          hasUncaughtErrors: window.uncaughtErrors || [],
          hasResourceErrors: window.resourceErrors || [],
          hasNetworkErrors: window.networkErrors || []
        };
      });
      
      this.testResults.tests.errorDetection = {
        success: consoleErrors.length === 0 && networkErrors.length === 0,
        consoleErrors: consoleErrors.length,
        networkErrors: networkErrors.length,
        pageErrors: pageErrors,
        totalErrors: this.testResults.errors.length
      };
      
      console.log(`✅ エラー検出テスト完了:`);
      console.log(`  - コンソールエラー: ${consoleErrors.length}個`);
      console.log(`  - ネットワークエラー: ${networkErrors.length}個`);
      console.log(`  - 総エラー数: ${this.testResults.errors.length}個`);
      
      if (this.testResults.errors.length > 0) {
        console.log('⚠️ 検出されたエラー:');
        this.testResults.errors.forEach((error, index) => {
          console.log(`  ${index + 1}. [${error.type}] ${error.message || error.url}`);
        });
      }
      
    } catch (error) {
      this.testResults.tests.errorDetection = {
        success: false,
        error: error.message
      };
      console.error(`❌ エラー検出テスト失敗: ${error.message}`);
    }
  }

  async generateReport() {
    console.log('\n📊 テストレポート生成中...');
    
    // 総合評価
    const testNames = Object.keys(this.testResults.tests);
    const successfulTests = testNames.filter(name => this.testResults.tests[name].success);
    const totalTests = testNames.length;
    const overallSuccessRate = (successfulTests.length / totalTests) * 100;
    
    this.testResults.summary = {
      totalTests,
      successfulTests: successfulTests.length,
      failedTests: totalTests - successfulTests.length,
      overallSuccessRate,
      totalErrors: this.testResults.errors.length,
      totalScreenshots: this.testResults.screenshots.length
    };
    
    // レポートをJSONファイルに保存
    const reportPath = path.join(__dirname, 'mcp-detailed-test-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(this.testResults, null, 2));
    
    console.log('\n🎯 テスト結果サマリー:');
    console.log(`📊 総合成功率: ${overallSuccessRate.toFixed(1)}% (${successfulTests.length}/${totalTests})`);
    console.log(`❌ エラー数: ${this.testResults.errors.length}個`);
    console.log(`📸 スクリーンショット: ${this.testResults.screenshots.length}枚`);
    console.log(`📄 詳細レポート: ${reportPath}`);
    
    // 各テストの結果を表示
    testNames.forEach(testName => {
      const test = this.testResults.tests[testName];
      const status = test.success ? '✅' : '❌';
      console.log(`  ${status} ${testName}: ${test.success ? '成功' : '失敗'}`);
    });
    
    return this.testResults;
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
      console.log('🧹 ブラウザを閉じました');
    }
  }
}

// メイン実行関数
async function runMCPDetailedTest() {
  const tester = new MCPDetailedTester();
  
  try {
    await tester.initialize();
    await tester.testPageAccess();
    await tester.testNavigation();
    await tester.testEditorAccess();
    await tester.testMarkdownInput();
    await tester.testConversionFlow();
    await tester.testErrorDetection();
    await tester.generateReport();
    
  } catch (error) {
    console.error('❌ テスト実行中にエラーが発生しました:', error);
  } finally {
    await tester.cleanup();
  }
}

// テスト実行
runMCPDetailedTest();
