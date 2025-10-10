/**
 * 簡略化された総合テスト: エディタ → プレビューの確認
 * 
 * このスクリプトは基本的なページアクセスと要素確認を行います
 */

const puppeteer = require('puppeteer');

async function runSimpleIntegrationTest() {
  console.log('🚀 簡略化された総合テスト開始');
  
  let browser;
  try {
    // ブラウザを起動
    browser = await puppeteer.launch({
      headless: false, // 視覚的に確認
      defaultViewport: null,
      args: ['--start-maximized']
    });
    
    const page = await browser.newPage();
    
    // ページにアクセス
    console.log('📱 ページにアクセス中...');
    await page.goto('http://localhost:5174', { waitUntil: 'networkidle2' });
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // ページの基本情報を取得
    const pageInfo = await page.evaluate(() => {
      return {
        title: document.title,
        url: window.location.href,
        hasReactRoot: !!document.getElementById('root'),
        bodyText: document.body.textContent.substring(0, 200)
      };
    });
    
    console.log('📊 ページ基本情報:');
    console.log(`- タイトル: ${pageInfo.title}`);
    console.log(`- URL: ${pageInfo.url}`);
    console.log(`- React Root: ${pageInfo.hasReactRoot ? '✅' : '❌'}`);
    console.log(`- 本文プレビュー: ${pageInfo.bodyText}...`);
    
    // サイドバー要素の確認
    const sidebarInfo = await page.evaluate(() => {
      const sidebar = document.querySelector('[class*="sidebar"]');
      if (!sidebar) return null;
      
      const links = Array.from(sidebar.querySelectorAll('a, button')).map(el => ({
        text: el.textContent.trim(),
        href: el.href || el.getAttribute('href'),
        tagName: el.tagName
      }));
      
      return {
        found: true,
        linkCount: links.length,
        links: links
      };
    });
    
    console.log('\n📋 サイドバー情報:');
    if (sidebarInfo) {
      console.log(`- サイドバー発見: ✅`);
      console.log(`- リンク数: ${sidebarInfo.linkCount}`);
      console.log('- リンク一覧:');
      sidebarInfo.links.forEach((link, index) => {
        console.log(`  ${index + 1}. ${link.text} (${link.tagName}) - ${link.href}`);
      });
    } else {
      console.log('- サイドバー発見: ❌');
    }
    
    // エディタ関連要素の確認
    const editorInfo = await page.evaluate(() => {
      const editorSelectors = [
        '.ProseMirror',
        '[contenteditable="true"]',
        '.tiptap-editor',
        '.simple-editor',
        'div[role="textbox"]',
        '.editor-content'
      ];
      
      const foundElements = [];
      editorSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0) {
          foundElements.push({
            selector: selector,
            count: elements.length,
            contentEditable: elements[0].contentEditable,
            className: elements[0].className
          });
        }
      });
      
      return foundElements;
    });
    
    console.log('\n✏️ エディタ要素情報:');
    if (editorInfo.length > 0) {
      console.log(`- エディタ要素発見: ✅ (${editorInfo.length}種類)`);
      editorInfo.forEach((info, index) => {
        console.log(`  ${index + 1}. ${info.selector} (${info.count}個) - contentEditable: ${info.contentEditable}`);
      });
    } else {
      console.log('- エディタ要素発見: ❌');
    }
    
    // プレビュー関連要素の確認
    const previewInfo = await page.evaluate(() => {
      const previewSelectors = [
        '.preview-content',
        '.news-preview',
        '.preview-pane',
        '[data-testid="preview"]',
        '.preview'
      ];
      
      const foundElements = [];
      previewSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0) {
          foundElements.push({
            selector: selector,
            count: elements.length,
            hasContent: elements[0].textContent.trim().length > 0
          });
        }
      });
      
      return foundElements;
    });
    
    console.log('\n👀 プレビュー要素情報:');
    if (previewInfo.length > 0) {
      console.log(`- プレビュー要素発見: ✅ (${previewInfo.length}種類)`);
      previewInfo.forEach((info, index) => {
        console.log(`  ${index + 1}. ${info.selector} (${info.count}個) - コンテンツ: ${info.hasContent ? 'あり' : 'なし'}`);
      });
    } else {
      console.log('- プレビュー要素発見: ❌');
    }
    
    // マークダウン関連要素の確認
    const markdownInfo = await page.evaluate(() => {
      return {
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
    });
    
    console.log('\n📝 マークダウン要素情報:');
    Object.entries(markdownInfo).forEach(([tag, count]) => {
      if (count > 0) {
        console.log(`- ${tag}: ${count}個 ✅`);
      } else {
        console.log(`- ${tag}: ${count}個`);
      }
    });
    
    // テスト結果の評価
    console.log('\n🎯 テスト結果の評価:');
    
    const testResults = {
      pageAccess: pageInfo.hasReactRoot,
      sidebarFound: !!sidebarInfo,
      editorFound: editorInfo.length > 0,
      previewFound: previewInfo.length > 0,
      hasContent: markdownInfo.h1 + markdownInfo.h2 + markdownInfo.p > 0
    };
    
    Object.entries(testResults).forEach(([test, result]) => {
      console.log(`- ${test}: ${result ? '✅ 成功' : '❌ 失敗'}`);
    });
    
    const successCount = Object.values(testResults).filter(Boolean).length;
    const totalTests = Object.keys(testResults).length;
    const successRate = (successCount / totalTests * 100).toFixed(1);
    
    console.log(`\n📊 簡略化テスト結果: ${successCount}/${totalTests} (${successRate}%)`);
    
    if (successRate >= 80) {
      console.log('🎉 基本的な要素は正常に読み込まれています！');
      console.log('📝 手動テストガイド (manual-test-guide.md) を参照して、詳細なテストを実行してください。');
    } else {
      console.log('⚠️ 基本的な要素に問題があります。詳細な調査が必要です。');
    }
    
    // スクリーンショットを撮影
    console.log('\n📸 スクリーンショットを撮影中...');
    await page.screenshot({ 
      path: 'simple-integration-test-result.png', 
      fullPage: true 
    });
    console.log('✅ スクリーンショット保存完了: simple-integration-test-result.png');
    
    // 結果をJSONファイルに保存
    const testReport = {
      timestamp: new Date().toISOString(),
      pageInfo: pageInfo,
      sidebarInfo: sidebarInfo,
      editorInfo: editorInfo,
      previewInfo: previewInfo,
      markdownInfo: markdownInfo,
      testResults: testResults,
      successRate: successRate
    };
    
    const fs = require('fs');
    fs.writeFileSync('simple-integration-test-report.json', JSON.stringify(testReport, null, 2));
    console.log('✅ テストレポート保存完了: simple-integration-test-report.json');
    
    console.log('\n📋 次のステップ:');
    console.log('1. 手動テストガイド (manual-test-guide.md) を参照');
    console.log('2. ブラウザで手動でエディタにマークダウンを入力');
    console.log('3. プレビューの表示を確認');
    console.log('4. 結果を記録');
    
  } catch (error) {
    console.error('❌ 簡略化テスト中にエラーが発生しました:', error.message);
    console.error('スタックトレース:', error.stack);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// テスト実行
runSimpleIntegrationTest().catch(console.error);
