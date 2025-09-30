import puppeteer from 'puppeteer';
const browser = await puppeteer.launch({headless:true,args:['--no-sandbox']});
const page = await browser.newPage();
await page.goto(process.env.URL,{waitUntil:['domcontentloaded','networkidle0']});
const h1 = await page.evaluate(()=>document.querySelector('h1')?.textContent||'');
console.log('h1='+h1);
await browser.close();
