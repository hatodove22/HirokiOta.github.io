// Minimal Puppeteer script to verify sticky preview and take a screenshot
// Usage: node scripts/debug-sticky.mjs http://localhost:5187/

import puppeteer from 'puppeteer';

const url = process.argv[2] || 'http://localhost:5187/';

const outPath = 'tmp/edit-sticky.png';

const main = async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    defaultViewport: { width: 1440, height: 900 },
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

  // Try common routes for the editor inside the proto app
  const maybeGoto = async (p) => {
    try {
      await page.goto(p, { waitUntil: 'networkidle2', timeout: 45000 });
      return true;
    } catch (_) { return false; }
  };

  // If landing is a dashboard, try to go to /edit or hash routes
  const paths = [url, url.replace(/\/?$/, '/edit'), url + '#/edit'];
  for (const p of paths) {
    await maybeGoto(p);
  }

  // Ensure desktop layout
  await page.setViewport({ width: 1440, height: 900 });

  // Wait for potential preview aside; fall back to any aside
  const asideSel = 'aside';
  await page.waitForSelector(asideSel, { timeout: 20000 });

  // Evaluate computed styles
  const info = await page.evaluate((sel) => {
    const el = document.querySelector(sel);
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
  }, asideSel);

  // Scroll down and re-measure to see if sticky keeps it pinned
  await page.evaluate(() => window.scrollTo({ top: 1200, behavior: 'instant' }));
  await page.waitForTimeout(300);
  const after = await page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return { error: 'aside not found after scroll' };
    const rect = el.getBoundingClientRect();
    return { rectTop: rect.top, rectLeft: rect.left };
  }, asideSel);

  // Take screenshot
  await page.screenshot({ path: outPath, fullPage: false });

  console.log(JSON.stringify({ url: page.url(), info, after, screenshot: outPath }, null, 2));

  await browser.close();
};

main().catch((err) => {
  console.error('debug-sticky error:', err);
  process.exit(1);
});

