import puppeteer from 'puppeteer';

async function readErrors(url){
  const browser = await puppeteer.launch({ headless: true, args:['--no-sandbox'] });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil:['domcontentloaded','networkidle0'] });
  const errs = await page.evaluate(()=>{
    const heading = Array.from(document.querySelectorAll('h1,h2,h3')).find(el=>/Error loading the CMS configuration/i.test(el.textContent||''));
    const pre = Array.from(document.querySelectorAll('pre, code, li, p')).map(el=>el.textContent||'').filter(t=>/Config Errors|collections|backend|media_folder|must|error|unique|object|fields|name/i.test(t)).slice(0,10);
    return { heading: heading?heading.textContent:'', snippets: pre };
  });
  await browser.close();
  return errs;
}
const r1 = await readErrors('http://localhost:3000/admin/?dev=1');
console.log(JSON.stringify({ dev1:r1 }, null, 2));
