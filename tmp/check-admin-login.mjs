import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';

const outDir = path.resolve('tmp', 'admin-debug');
await fs.promises.mkdir(outDir, { recursive: true });

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox','--disable-gpu'] });
try{
  const page = await browser.newPage();
  page.setDefaultTimeout(60000);
  const url = 'http://localhost:3000/admin/#/';
  await page.goto(url, { waitUntil:['domcontentloaded','networkidle0'] });

  // Wait a bit for CMS to mount
  await new Promise(r=>setTimeout(r,1500));

  // Try to detect a Login with GitHub button or similar text
  const hadLogin = await page.evaluate(()=>{
    const text = (document.body.innerText||'').toLowerCase();
    return /login with github/.test(text);
  });

  // Click the login button to force redirect to proto
  let afterHref = null;
  if (hadLogin){
    await page.evaluate(()=>{
      const btn = Array.from(document.querySelectorAll('button,a')).find(el=>/login with github/i.test(el.textContent||''));
      if(btn && typeof (btn).click === 'function') (btn).click();
    });
    await new Promise(r=>setTimeout(r,1500));
    afterHref = await page.evaluate(()=>location.href);
  }

  await page.screenshot({ path: path.join(outDir, 'admin-login.png'), fullPage:true });
  const info = { href: url, hadLogin, afterHref };
  await fs.promises.writeFile(path.join(outDir,'admin-login.json'), JSON.stringify(info, null, 2));
  console.log('admin_login_check=tmp/admin-debug/admin-login.json');
} finally {
  await browser.close();
}
