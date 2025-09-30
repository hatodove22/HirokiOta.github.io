import puppeteer from 'puppeteer';
const browser = await puppeteer.launch({headless:true,args:['--no-sandbox']});
const page = await browser.newPage();
await page.goto('http://localhost:5174',{waitUntil:['domcontentloaded','networkidle0']});
await page.screenshot({path:'tmp/proto-dashboard.png', fullPage:true});
const btn = await page.$x("//button[contains(., 'ニュース')]"); if(btn.length) await btn[0].click();
await page.waitForTimeout(600);
await page.screenshot({path:'tmp/proto-news.png', fullPage:true});
await browser.close();
