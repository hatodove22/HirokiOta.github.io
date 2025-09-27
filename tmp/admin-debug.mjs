import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';

const outDir = path.resolve('tmp', 'admin-debug');
await fs.promises.mkdir(outDir, { recursive: true });

const url = process.env.TARGET_URL || 'http://localhost:3000/admin/';
const headless = process.env.HEADLESS !== 'false';

const browser = await puppeteer.launch({ headless, args: ['--no-sandbox','--disable-gpu'] });
const page = await browser.newPage();

const consoleLogs = [];
page.on('console', (msg) => { consoleLogs.push({ type: msg.type(), text: msg.text() }); });

const requests = [];
page.on('requestfinished', async (req) => {
  try { const res = await req.response(); requests.push({ url: req.url(), status: res?.status(), type: req.resourceType() }); } catch {}
});

let navOk = true;
try { await page.goto(url, { waitUntil: ['load','domcontentloaded','networkidle0'], timeout: 60000 }); } catch { navOk = false; }

await new Promise(r => setTimeout(r, 1500));

const info = await page.evaluate(() => ({
  href: location.href,
  title: document.title,
  hasCMS: !!(window).CMS,
  manualInit: (window).CMS_MANUAL_INIT === true,
  bodyText: document.body && document.body.innerText ? document.body.innerText.slice(0, 200) : '',
}));

const shotPath = path.join(outDir, 'admin.png');
await page.screenshot({ path: shotPath, fullPage: true });

await browser.close();

const summary = { url, navOk, info, console: consoleLogs, networkSample: requests.filter(r => r.url.includes('/admin/')).slice(0, 50) };
const outJson = path.join(outDir, 'summary.json');
await fs.promises.writeFile(outJson, JSON.stringify(summary, null, 2), 'utf8');
console.log('summary_file=' + outJson);
console.log('screenshot_file=' + shotPath);
