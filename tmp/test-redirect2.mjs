import puppeteer from 'puppeteer';
const browser = await puppeteer.launch({headless:true,args:['--no-sandbox']});
const page = await browser.newPage();
await page.goto('http://localhost:3000/admin/',{waitUntil:['domcontentloaded','networkidle0']});
await page.evaluate(()=>{
  const btn = Array.from(document.querySelectorAll('button,a')).find(el=>/login with github/i.test((el.textContent||'')));
  if(btn){ btn.dispatchEvent(new MouseEvent('click',{bubbles:true})); }
});
await new Promise(r=>setTimeout(r,1200));
const url = await page.evaluate(()=>location.href);
console.log('URL='+url);
await browser.close();
