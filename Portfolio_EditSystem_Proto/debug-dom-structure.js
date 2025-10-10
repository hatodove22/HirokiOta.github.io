const puppeteer = require('puppeteer');

(async () => {
  console.log('🔍 DOM構造デバッグ開始');
  
  const browser = await puppeteer.launch({ headless: false }); // ヘッドレスモードを無効にして視覚的に確認
  const page = await browser.newPage();
  
  try {
    // ページにアクセス
    await page.goto('http://localhost:5174', { waitUntil: 'networkidle2' });
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // ニュースボタンをクリック
    const buttons = await page.$$('button');
    let newsButtonFound = null;
    
    for (const button of buttons) {
      const text = await button.evaluate(el => el.textContent);
      if (text && text.includes('ニュース')) {
        newsButtonFound = button;
        break;
      }
    }
    
    if (newsButtonFound) {
      await newsButtonFound.click();
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    // 新規作成ボタンをクリック
    const newButtons = await page.$$('button');
    let newButtonFound = null;
    
    for (const button of newButtons) {
      const text = await button.evaluate(el => el.textContent);
      if (text && text.includes('新規作成')) {
        newButtonFound = button;
        break;
      }
    }
    
    if (newButtonFound) {
      await newButtonFound.click();
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
    
    // 現在のURLを確認
    const currentUrl = page.url();
    console.log('📍 現在のURL:', currentUrl);
    
    // エディタ要素を確認
    const editor = await page.$('.ProseMirror[contenteditable="true"]');
    console.log('📝 エディタ要素:', editor ? '見つかった' : '見つからない');
    
    // プレビュー要素を複数のセレクタで確認
    const selectors = [
      '.prose',
      '[data-testid="news-preview-body"]',
      '.prose.prose-slate',
      'div[class*="prose"]',
      'article',
      'div[class*="preview"]',
      'div[class*="content"]'
    ];
    
    console.log('\n🔍 プレビュー要素の検索結果:');
    for (const selector of selectors) {
      const element = await page.$(selector);
      console.log(`  ${selector}: ${element ? '見つかった' : '見つからない'}`);
      
      if (element) {
        const text = await element.evaluate(el => el.textContent);
        const className = await element.evaluate(el => el.className);
        console.log(`    クラス名: ${className}`);
        console.log(`    テキスト内容: ${text.substring(0, 100)}...`);
      }
    }
    
    // ページ全体のHTML構造を確認
    console.log('\n📄 ページ全体のHTML構造:');
    const bodyHTML = await page.evaluate(() => {
      return document.body.innerHTML;
    });
    
    // HTMLからプレビュー関連の要素を検索
    const previewKeywords = ['prose', 'preview', 'content', 'article'];
    console.log('\n🔍 HTML内のプレビュー関連要素:');
    for (const keyword of previewKeywords) {
      const regex = new RegExp(`<[^>]*class="[^"]*${keyword}[^"]*"[^>]*>`, 'gi');
      const matches = bodyHTML.match(regex);
      if (matches) {
        console.log(`  ${keyword}: ${matches.length}個見つかった`);
        matches.slice(0, 3).forEach((match, index) => {
          console.log(`    ${index + 1}: ${match}`);
        });
      } else {
        console.log(`  ${keyword}: 見つからない`);
      }
    }
    
    // エディタにテキストを入力
    if (editor) {
      await editor.focus();
      await new Promise(resolve => setTimeout(resolve, 500));
      await page.keyboard.down('Control');
      await page.keyboard.press('KeyA');
      await page.keyboard.up('Control');
      await page.keyboard.press('Delete');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const testMarkdown = '# テスト見出し\n\nこれは**太字**のテストです。';
      await page.keyboard.type(testMarkdown);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('\n📝 エディタにテキストを入力しました');
      
      // 再度プレビュー要素を確認
      console.log('\n🔍 テキスト入力後のプレビュー要素:');
      for (const selector of selectors) {
        const element = await page.$(selector);
        if (element) {
          const text = await element.evaluate(el => el.textContent);
          const innerHTML = await element.evaluate(el => el.innerHTML);
          console.log(`  ${selector}:`);
          console.log(`    テキスト: ${text.substring(0, 100)}...`);
          console.log(`    HTML: ${innerHTML.substring(0, 200)}...`);
        }
      }
    }
    
    // スクリーンショットを撮影
    await page.screenshot({ path: 'debug-dom-structure.png', fullPage: true });
    console.log('\n📸 スクリーンショットを保存しました: debug-dom-structure.png');
    
  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
  } finally {
    await browser.close();
    console.log('🧹 ブラウザを閉じました');
  }
})();
