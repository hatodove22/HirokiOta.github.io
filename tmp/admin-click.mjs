import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';

const outDir = path.resolve('tmp', 'admin-debug');
await fs.promises.mkdir(outDir, { recursive: true });

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox','--disable-gpu'] });
const page = await browser.newPage();
page.setDefaultTimeout(60000);

const logs = [];
page.on('console', msg => logs.push({type: msg.type(), text: msg.text()}));
const reqs = [];
page.on('requestfinished', async (req) => { try { const r = await req.response(); reqs.push({ url: req.url(), status: r?.status(), type: r?.request()?.resourceType?.() || req.resourceType() }); } catch {} });
page.on('requestfailed', (req) => { reqs.push({ url: req.url(), status: 0, type: req.resourceType(), failure: req.failure()?.errorText }); });

await page.goto('http://localhost:3000/admin/', { waitUntil: ['domcontentloaded','networkidle0'] });
await page.screenshot({ path: path.join(outDir, 'before-click.png'), fullPage: true });

// querySelector for login button
const btn = await page.evaluateHandle(() => {
  const els = Array.from(document.querySelectorAll('button, a'));
  return els.find(el => /login with github/i.test(el.textContent || '')) || null;
});
let clicked = false;
if (btn) {
  await (await btn.asElement()).click();
  clicked = true;
}
await new Promise(r => setTimeout(r, 2000));
const href = await page.evaluate(() => location.href);
await page.screenshot({ path: path.join(outDir, 'after-click.png'), fullPage: true });
await browser.close();

const interesting = reqs.filter(r => r.url.includes('<your-netlify-site>') || r.url.includes('netlify') || r.url.includes('auth') || r.url.includes('/api/v1'));
const out = { clicked, href, logs, interesting };
await fs.promises.writeFile(path.join(outDir,'click-result.json'), JSON.stringify(out,null,2));
console.log('click_result_file=' + path.join(outDir,'click-result.json'));
