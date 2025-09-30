import puppeteer from 'puppeteer';
const browser = await puppeteer.launch({headless:true,args:['--no-sandbox']});
const page = await browser.newPage();
await page.goto('http://localhost:5174',{waitUntil:['domcontentloaded','networkidle0']});
await page.evaluate(()=>{
  const els = Array.from(document.querySelectorAll('*'));
  const btn = els.find(el=>/ニュース/.test((el.textContent||'').trim()));
  if(btn){ const b = (btn.tagName==='BUTTON')?btn: (btn.closest('button')||btn); (b).dispatchEvent(new MouseEvent('click',{bubbles:true})); }
});
await new Promise(r=>setTimeout(r,700));
await page.screenshot({path:'tmp/proto-news-list.png', fullPage:true});
await page.evaluate(()=>{
  const els = Array.from(document.querySelectorAll('button,a'));
  const btn = els.find(el=>/新規作成|新規|追加|Create/i.test((el.textContent||'')));
  if(btn){ (btn).dispatchEvent(new MouseEvent('click',{bubbles:true})); }
});
await new Promise(r=>setTimeout(r,800));
await page.screenshot({path:'tmp/proto-news-editor.png', fullPage:true});
await browser.close();
