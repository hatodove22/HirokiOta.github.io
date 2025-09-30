import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';

const outDir = path.resolve('tmp', 'admin-debug');
await fs.promises.mkdir(outDir, { recursive: true });

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox','--disable-gpu'] });
const page = await browser.newPage();
page.setDefaultTimeout(60000);

const logs = [];
page.on('console', m=>logs.push({type:m.type(), text:m.text()}));
const pageErrors = [];
page.on('pageerror', e=>pageErrors.push(String(e)));

await page.goto('http://localhost:3000/admin/?dev=1', { waitUntil:['domcontentloaded','networkidle0'] });
await new Promise(r=>setTimeout(r,1500));

const state = await page.evaluate(()=>{
  const app = document.querySelector('[data-testid="app-root"], .nc-app, body');
  const btn = Array.from(document.querySelectorAll('button,a')).find(el=>/login with github/i.test(el.textContent||''));
  const collections = Array.from(document.querySelectorAll('*')).map(el=>el.textContent||'').join('\n');
  return {
    href: location.href,
    title: document.title,
    hasCMS: !!(window).CMS,
    rootTag: app ? app.tagName : null,
    hasLogin: !!btn,
    snippet: collections.slice(0,500)
  };
});

await page.screenshot({ path: path.join(outDir,'dev1-now.png'), fullPage:true });
await browser.close();

await fs.promises.writeFile(path.join(outDir,'dev1-now.json'), JSON.stringify({state, logs: logs.slice(0,50), pageErrors}, null, 2));
console.log('dev1_now=tmp/admin-debug/dev1-now.json');
