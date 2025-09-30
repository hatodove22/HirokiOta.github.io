import puppeteer from 'puppeteer';
const browser = await puppeteer.launch({ headless: true, args:['--no-sandbox'] });
const page = await browser.newPage();
await page.goto(process.env.URL, { waitUntil:['domcontentloaded','networkidle0'] });
const ok = await page.evaluate(()=>!!document.querySelector('h1') && /Edit Mode/.test(document.body.innerText||''));
await page.screenshot({ path: 'tmp/edit-mode-page.png', fullPage:true });
await browser.close();
console.log('ok=' + ok);
