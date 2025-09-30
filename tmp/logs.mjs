import puppeteer from 'puppeteer';
const browser = await puppeteer.launch({headless:true,args:['--no-sandbox']});
const page = await browser.newPage();
page.on('console', m=>console.log('CONSOLE', m.type(), m.text()));
page.on('pageerror', e=>console.log('PAGEERROR', String(e)));
await page.goto('http://localhost:3000/?page=edit-mode',{waitUntil:['domcontentloaded','networkidle0']});
await new Promise(r=>setTimeout(r,1500));
await browser.close();
