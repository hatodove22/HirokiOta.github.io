import puppeteer from 'puppeteer';
const browser = await puppeteer.launch({headless:true,args:['--no-sandbox']});
const page = await browser.newPage();
page.on('console', m=>console.log('CONSOLE', m.type(), m.text()));
page.on('response', async r=>{ if(r.status()>=400) console.log('HTTP', r.status(), r.url()); });
await page.goto('http://localhost:5174',{waitUntil:['domcontentloaded','networkidle0']});
// click サイドバーの「ニュース」
await page.evaluate(()=>{
  const els = Array.from(document.querySelectorAll('*'));
  const btn = els.find(el=>/ニュース/.test((el.textContent||'').trim()) && (el.tagName==='BUTTON' || el.getAttribute('role')==='button' || el.closest('button')));
  if(btn){ (btn as any).click?.() || (btn as HTMLElement).dispatchEvent(new MouseEvent('click',{bubbles:true})); }
});
await new Promise(r=>setTimeout(r,700));
await page.screenshot({path:'tmp/proto-news-list.png', fullPage:true});
// click 「新規作成」
await page.evaluate(()=>{
  const els = Array.from(document.querySelectorAll('button,a'));
  const btn = els.find(el=>/新規作成|新規|追加|Create/i.test((el.textContent||'')));
  if(btn){ (btn as any).click?.() || (btn as HTMLElement).dispatchEvent(new MouseEvent('click',{bubbles:true})); }
});
await new Promise(r=>setTimeout(r,800));
await page.screenshot({path:'tmp/proto-news-editor.png', fullPage:true});
await browser.close();
