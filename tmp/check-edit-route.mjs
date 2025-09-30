import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';

const outDir = path.resolve('tmp');
await fs.promises.mkdir(outDir, { recursive: true });

const url = 'http://localhost:3000/edit?page=edit-proto';

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox','--disable-gpu'] });
try {
  const page = await browser.newPage();
  page.setDefaultTimeout(60000);
  const requests = [];
  page.on('requestfinished', async (req)=>{
    try{ const r=await req.response(); requests.push({url:req.url(), status:r?.status(), type:req.resourceType()}); }catch{}
  });
  page.on('requestfailed', (req)=>requests.push({url:req.url(), status:0, type:req.resourceType(), failure:req.failure()?.errorText}));

  await page.goto(url, { waitUntil:['domcontentloaded','networkidle0'] });

  // Find iframe
  const iframeInfo = await page.evaluate(()=>{
    const el = document.querySelector('iframe');
    const header = document.querySelector('header');
    const winH = window.innerHeight;
    const winW = window.innerWidth;
    if(!el){ return { present:false, winH, winW, headerPresent: !!header } }
    const rect = el.getBoundingClientRect();
    return { present:true, src: el.getAttribute('src'), rect:{ w: rect.width, h: rect.height }, winH, winW, headerPresent: !!header };
  });

  await page.screenshot({ path: path.join(outDir, 'edit-proto-check.png'), fullPage:true });

  const result = { url, iframeInfo, sampleRequests: requests.slice(0,40) };
  await fs.promises.writeFile(path.join(outDir,'edit-proto-check.json'), JSON.stringify(result, null, 2));
  console.log('edit_proto_check=tmp/edit-proto-check.json');
} finally {
  await browser.close();
}
