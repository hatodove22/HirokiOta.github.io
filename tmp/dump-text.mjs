import puppeteer from 'puppeteer';
const browser = await puppeteer.launch({headless:true,args:['--no-sandbox']});
const page = await browser.newPage();
await page.goto('http://localhost:3000/?page=edit-mode',{waitUntil:['domcontentloaded','networkidle0']});
const txt = await page.evaluate(()=>document.body.innerText.slice(0,500));
console.log('TEXT:\n'+txt);
await browser.close();
