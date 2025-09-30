import puppeteer from 'puppeteer';
const browser = await puppeteer.launch({headless:true,args:['--no-sandbox']});
const page = await browser.newPage();
page.on('requestfailed', r=>console.log('FAILED', r.url(), r.failure()?.errorText));
page.on('response', async r=>{ if(r.status()>=400) console.log('HTTP', r.status(), r.url()); });
await page.goto('http://localhost:3000/?page=edit-mode',{waitUntil:['domcontentloaded','networkidle0']});
await new Promise(r=>setTimeout(r,1500));
await browser.close();
