// Navigate from the top page to News editor, then verify sticky preview
// Usage: node scripts/debug-sticky-nav.mjs http://localhost:5187/

import puppeteer from 'puppeteer';

const base = process.argv[2] || 'http://localhost:5187/';
const outDir = 'tmp';
const ss = (name) => `${outDir}/${name}`;

async function clickByText(page, text, { timeout = 8000 } = {}) {
  const xpath = `//*[contains(normalize-space(.), ${JSON.stringify(text)})]`;
  await page.waitForXPath(xpath, { timeout });
  const [el] = await page.$x(xpath);
  if (!el) throw new Error(`Element with text ${text} not found`);
  await el.click();
}

async function tryClickFirstCandidate(page, texts) {
  for (const t of texts) {
    try { await clickByText(page, t, { timeout: 1500 }); return t; } catch (_) {}
  }
  return null;
}

const main = async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    defaultViewport: { width: 1440, height: 900 },
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  await page.goto(base, { waitUntil: 'networkidle2', timeout: 60000 });
  await page.screenshot({ path: ss('nav-0-landing.png') });

  // Step1: サイドバー「ニュース」をクリック
  const clickedNews = await tryClickFirstCandidate(page, ['ニュース', 'News']);
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: ss('nav-1-after-news-click.png') });

  // Step2: 一覧から適当なアイテムを開く（候補文字列）
  const opened = await tryClickFirstCandidate(page, [
    '編集', 'Edit', 'AI研究', 'Conference', '詳細', '開く', 'Open'
  ]);
  await new Promise(r => setTimeout(r, 700));
  await page.screenshot({ path: ss('nav-2-after-item-click.png') });

  // Step3: 見出しが「ニュース編集」か確認、なければ候補を待つ
  let inEditor = false;
  try {
    await clickByText(page, 'ニュース編集', { timeout: 2000 });
    inEditor = true;
  } catch (_) {}
  // クリック判定の副作用を避けるため、もう一度戻しておく
  if (inEditor) await page.mouse.move(10, 10);
  await page.screenshot({ path: ss('nav-3-confirm-editor.png') });

  // Step4: aside の sticky 計測
  let info = null, after = null;
  try {
    await page.waitForSelector('aside', { timeout: 8000 });
    info = await page.evaluate(() => {
      const el = document.querySelector('aside');
      if (!el) return { error: 'aside not found' };
      const cs = getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      return {
        position: cs.position,
        top: cs.top,
        overflowY: cs.overflowY,
        rectTop: rect.top,
        rectLeft: rect.left,
        height: rect.height,
      };
    });
    await page.evaluate(() => window.scrollTo({ top: 1500, behavior: 'instant' }));
  await new Promise(r => setTimeout(r, 300));
    after = await page.evaluate(() => {
      const el = document.querySelector('aside');
      if (!el) return { error: 'aside not found after scroll' };
      const rect = el.getBoundingClientRect();
      return { rectTop: rect.top, rectLeft: rect.left };
    });
  } catch (e) {
    info = { error: String(e) };
  }
  await page.screenshot({ path: ss('nav-4-editor-sticky.png') });

  console.log(JSON.stringify({ base, clickedNews, opened, info, after, shots: [
    ss('nav-0-landing.png'),
    ss('nav-1-after-news-click.png'),
    ss('nav-2-after-item-click.png'),
    ss('nav-3-confirm-editor.png'),
    ss('nav-4-editor-sticky.png'),
  ] }, null, 2));

  await browser.close();
};

main().catch((err) => {
  console.error('debug-sticky-nav error:', err);
  process.exit(1);
});
