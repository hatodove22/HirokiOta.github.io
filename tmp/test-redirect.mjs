import puppeteer from 'puppeteer';
const browser = await puppeteer.launch({headless:true,args:['--no-sandbox']});
const page = await browser.newPage();
await page.goto('http://localhost:3000/admin/',{waitUntil:['domcontentloaded','networkidle0']});
await page.evaluate(()=>{
  const btns = Array.from(document.querySelectorAll('button,a'));
  const btn = btns.find(el=>/login with github/i.test(el.textContent||''));
  if(btn){ (btn).dispatchEvent(new MouseEvent('click',{bubbles:true})); }
});
await new Promise(r=>setTimeout(r,700));
const href = await page.evaluate(()=>location.pathname);
console.log('PATH='+href);
await browser.close();
