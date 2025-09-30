import puppeteer from 'puppeteer';
const browser = await puppeteer.launch({headless:true,args:['--no-sandbox']});
const page = await browser.newPage();
await page.goto('http://localhost:5174',{waitUntil:['domcontentloaded','networkidle0']});
await page.evaluate(()=>{
  const btn = Array.from(document.querySelectorAll('button, a')).find(el=>/ニュース/.test(el.textContent||''));
  (btn as HTMLButtonElement | HTMLAnchorElement)?.click();
});
await new Promise(r=>setTimeout(r,600));
await page.screenshot({path:'tmp/proto-news.png', fullPage:true});
await browser.close();
