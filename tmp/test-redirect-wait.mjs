import puppeteer from 'puppeteer';
const browser = await puppeteer.launch({headless:true,args:['--no-sandbox']});
const page = await browser.newPage();
await page.goto('http://localhost:3000/admin/',{waitUntil:['domcontentloaded','networkidle0']});
await new Promise(r=>setTimeout(r,3000));
const url = await page.evaluate(()=>location.href);
await page.screenshot({path:'tmp/admin-after-redirect.png', fullPage:true});
console.log('URL='+url);
await browser.close();
