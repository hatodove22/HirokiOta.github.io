import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';

const outDir = path.resolve('tmp', 'admin-debug');
await fs.promises.mkdir(outDir, { recursive: true });

async function runCase(name, url, clickLogin){
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox','--disable-gpu'] });
  const page = await browser.newPage();
  page.setDefaultTimeout(60000);
  const logs = [];
  const reqs = [];
  page.on('console', m=>logs.push({type:m.type(), text:m.text()}));
  page.on('requestfinished', async (req)=>{ try{ const r=await req.response(); reqs.push({url:req.url(), status:r?.status(), type:req.resourceType()}); }catch{} });
  page.on('requestfailed', (req)=>reqs.push({url:req.url(), status:0, type:req.resourceType(), failure:req.failure()?.errorText}));

  await page.goto(url, { waitUntil:['domcontentloaded','networkidle0'] });
  await page.screenshot({ path: path.join(outDir, `${name}-before.png`), fullPage:true });

  if(clickLogin){
    const btnHandle = await page.evaluateHandle(()=>{
      const els = Array.from(document.querySelectorAll('button, a'));
      return els.find(el=>/login with github/i.test(el.textContent||''))||null;
    });
    const el = await btnHandle.asElement();
    if(el){ await el.click(); }
    await new Promise(r=>setTimeout(r, 2500));
  }

  // Wait for CMS UI
  await new Promise(r=>setTimeout(r, 1500));
  const info = await page.evaluate(()=>({ href:location.href, text: (document.body.innerText||'').slice(0,500) }));
  const hasCollections = /ニュース|news/i.test(info.text);
  const proxyErrors = reqs.filter(r=>/8081\/api\/v1/.test(r.url)).length;

  await page.screenshot({ path: path.join(outDir, `${name}-after.png`), fullPage:true });
  await browser.close();

  return { name, url, afterHref: info.href, hasCollections, proxyErrors, sampleRequests:reqs.slice(0,30), logs: logs.slice(0,15) };
}

const results = [];
results.push(await runCase('case1-dev0-login-click', 'http://localhost:3000/admin/?dev=0', true));
results.push(await runCase('case2-direct-dev1', 'http://localhost:3000/admin/?dev=1', false));

await fs.promises.writeFile(path.join(outDir,'mcp-like-run.json'), JSON.stringify({ when: new Date().toISOString(), results }, null, 2));
console.log('mcp_like_result=tmp/admin-debug/mcp-like-run.json');
