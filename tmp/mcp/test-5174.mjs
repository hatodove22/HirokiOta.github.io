import puppeteer from 'puppeteer';

const sleep = (ms)=> new Promise(r=>setTimeout(r,ms));

(async()=>{
  const b = await puppeteer.launch({headless:'new'});
  const p = await b.newPage();
  const errors=[];
  p.on('console',m=>{ if(m.type()==='error'){ const t=m.text(); if(!/favicon\.ico/.test(t)) errors.push({type:'console',text:t}) }});
  p.on('pageerror',e=>errors.push({type:'pageerror',text:e.message}));
  p.on('requestfailed',r=>{ const u=r.url(); if(!/favicon\.ico/.test(u)) errors.push({type:'request',url:u,err:r.failure()?.errorText}) });

  await p.goto('http://localhost:5174/',{waitUntil:'domcontentloaded',timeout:60000});
  await p.waitForSelector('main');

  // open News section ("ニュース")
  await p.evaluate(()=>{
    const nodes=[...document.querySelectorAll('aside [data-sidebar] span, aside button, aside a')];
    const el=nodes.find(e=> (e.textContent||'').includes('\u30cb\u30e5\u30fc\u30b9'));
    (el?.closest('button')||el)?.click();
  });
  await sleep(500);

  // click "新規" button
  await p.evaluate(()=>{ const el=[...document.querySelectorAll('button')].find(b=>/\u65b0/.test(b.innerText||b.textContent||'')); el?.click(); });
  await sleep(600);

  // wait editor appears (#title-ja)
  await p.waitForFunction(()=>document.querySelector('#title-ja'));

  // absence of "公開言語"
  const hasPublishLabel = await p.evaluate(()=>!![...document.querySelectorAll('label,div,span')].find(e=>/\u516c\u958b\u8a00\u8a9e/.test(e.textContent||'')));

  // publish button disabled before
  const publishDisabledBefore = await p.evaluate(()=>{ const b=[...document.querySelectorAll('button')].find(x=>/\u516c\u958b/.test(x.innerText||x.textContent||'')); return b? b.hasAttribute('disabled'): null; });

  // fill JA
  await p.type('#title-ja','JA_TITLE');
  await p.type('#summary-ja','JA_SUMMARY');
  await p.type('#body-ja','JA_BODY');

  // switch to EN tab and fill
  await p.evaluate(()=>{ const b=[...document.querySelectorAll('button')].find(x=>/English/.test(x.innerText||x.textContent||'')); b?.click(); });
  await sleep(300);
  await p.type('#title-en','EN_TITLE');
  await p.type('#summary-en','EN_SUMMARY');
  await p.type('#body-en','EN_BODY');

  // read preview titles when EN and JA
  const h1_en = await p.$eval('h1', e=>e.textContent||'');
  await p.evaluate(()=>{ const b=[...document.querySelectorAll('button')].find(x=>/\u65e5\u672c\u8a9e/.test(x.innerText||x.textContent||'')); b?.click(); });
  await sleep(200);
  const h1_ja = await p.$eval('h1', e=>e.textContent||'');

  // hide preview
  await p.evaluate(()=>{ const header=[...document.querySelectorAll('section .border-b')].slice(-1)[0]; const btns=header?[...header.querySelectorAll('button')]:[]; (btns.slice(-1)[0])?.click(); });
  await sleep(200);
  const previewHidden = await p.evaluate(()=>{ const header=[...document.querySelectorAll('section .border-b')].slice(-1)[0]; return !header || !(header.textContent||'').includes('\u30d7\u30ec\u30d3\u30e5\u30fc'); });

  console.log(JSON.stringify({hasPublishLabel,publishDisabledBefore,h1_en,h1_ja,previewHidden,errors},null,2));
  await b.close();
})().catch(e=>{ console.error('RUNERR',e); process.exit(1)});

