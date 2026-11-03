/* Run with PLAYWRIGHT_MODULE pointing at an installed playwright-core module. */
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || 'playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const output = fs.mkdtempSync(path.join(os.tmpdir(), 'foliage-journal-'));
const server = http.createServer((req,res) => {
  const pathname = decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  const target = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
  if (!target.startsWith(root + path.sep)) {res.writeHead(403).end();return;}
  const types = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.jpeg':'image/jpeg'};
  fs.readFile(target,(error,data) => {res.writeHead(error?404:200,{'Content-Type':types[path.extname(target)] || 'application/octet-stream'});res.end(error?'Not found':data);});
});
(async () => {
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  const browser = await chromium.launch({headless:true});
  const page = await browser.newPage({viewport:{width:1440,height:900}});
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  try {
    await page.goto(base + '/?ref=portfolio#work');
    await page.locator('[data-project="foliage"] .project-open').click();
    await page.waitForFunction(()=>document.querySelector('.fc-viewer').open);
    await page.waitForTimeout(650);
    assert.match(page.url(),/project=foliage/);assert.match(page.url(),/ref=portfolio/);assert.ok(page.url().endsWith('#work'));
    const stage = page.locator('.fc-slide:not(.fc-outgoing)');
    await page.screenshot({path:path.join(output,'desktop-opening.png')});
    for (let slide=2;slide<=7;slide++) {
      await page.locator('.fc-next').click();
      assert.equal(new URL(page.url()).searchParams.get('slide'),String(slide));
      await page.waitForTimeout(70);
      assert.equal(await stage.count(),1);
    }
    assert.ok(await page.locator('.fc-next').isDisabled());
    await page.goBack();assert.equal(new URL(page.url()).searchParams.get('slide'),'6');
    await page.goForward();assert.equal(new URL(page.url()).searchParams.get('slide'),'7');
    await page.locator('.fc-close').click();
    await page.waitForFunction(()=>!document.querySelector('.fc-viewer').open);
    assert.equal(new URL(page.url()).searchParams.get('project'),null);
    assert.equal(await page.locator('[data-project="foliage"] .project-open').evaluate(el=>el===document.activeElement),true);
    await page.goto(base+'/?ref=keep&project=foliage&slide=4#about');
    await page.locator('.fc-scan-toggle').click();
    assert.equal(await page.locator('.fc-scan-toggle').getAttribute('aria-pressed'),'true');
    assert.ok(await page.locator('.fc-inspecting').count());
    await page.waitForTimeout(500);
    assert.equal(await page.locator('.fc-region').first().evaluate(el=>getComputedStyle(el).opacity),'1');
    await page.screenshot({path:path.join(output,'desktop-evidence.png')});
    await page.keyboard.press('Escape');
    await page.waitForFunction(()=>!document.querySelector('.fc-viewer').open);
    assert.equal(new URL(page.url()).searchParams.get('ref'),'keep');assert.ok(page.url().endsWith('#about'));
    await page.goto(base+'/?project=foliage&slide=3');
    await page.locator('.fc-next').click();
    await page.keyboard.press('Escape');
    await page.waitForFunction(()=>!document.querySelector('.fc-viewer').open);
    assert.equal(new URL(page.url()).searchParams.get('project'),null,'Closing after navigating a shared link must close the deck');
    for (const input of ['99','-5','NaN','2.9']) {
      await page.goto(base+`/?project=foliage&slide=${input}`);
      assert.equal(new URL(page.url()).searchParams.get('slide'),input==='99'?'7':input==='2.9'?'2':'1');
    }
    // Rapid requests must replace in-flight animations, not queue slides.
    await page.goto(base+'/?project=foliage&slide=1');
    await page.evaluate(()=>{for(let i=0;i<6;i++)document.querySelector('.fc-next').click();});
    await page.waitForTimeout(650);
    assert.equal(new URL(page.url()).searchParams.get('slide'),'7');assert.equal(await stage.count(),1);
    for (const [width,height] of [[1440,900],[1024,768],[768,1024],[390,844],[360,800]]) {
      await page.setViewportSize({width,height});
      for(let slide=1;slide<=7;slide++) {
        await page.goto(base+`/?project=foliage&slide=${slide}`);
        await page.waitForTimeout(550);
        const metrics = await stage.evaluate(el=>({width:el.clientWidth,scroll:el.scrollWidth}));
        assert.ok(metrics.scroll<=metrics.width+1,`Horizontal overflow at ${width}px, slide ${slide}`);
        const images=await stage.locator('img').evaluateAll(elements=>elements.every(el=>el.complete&&el.naturalWidth>0));
        assert.ok(images,`Image failed at slide ${slide}`);
        if(width===390 && [1,4,5,7].includes(slide))await page.screenshot({path:path.join(output,`mobile-${slide}.png`)});
      }
    }
    await page.emulateMedia({reducedMotion:'reduce'});
    await page.goto(base+'/?project=foliage&slide=5');
    assert.equal(await page.locator('.fc-connectors path').evaluate(el=>getComputedStyle(el).animationName),'none');
    await stage.evaluate(el=>el.scrollTop=250);
    assert.equal(new URL(page.url()).searchParams.get('slide'),'5');
    await page.locator('.fc-stage').dispatchEvent('touchstart',{touches:[{identifier:1,clientX:300,clientY:300}]});
    await page.locator('.fc-stage').dispatchEvent('touchend',{changedTouches:[{identifier:1,clientX:200,clientY:305}]});
    assert.equal(new URL(page.url()).searchParams.get('slide'),'6');
    await page.locator('.fc-stage').dispatchEvent('touchstart',{touches:[{identifier:1,clientX:300,clientY:300}]});
    await page.locator('.fc-stage').dispatchEvent('touchend',{changedTouches:[{identifier:1,clientX:290,clientY:150}]});
    assert.equal(new URL(page.url()).searchParams.get('slide'),'6');
    await page.keyboard.press('Tab');
    assert.ok(await page.evaluate(()=>document.activeElement.closest('.fc-viewer')!==null));
    await page.keyboard.press('Escape');await page.waitForFunction(()=>!document.querySelector('.fc-viewer').open);
    await page.locator('[data-project="judgement"] .project-open').focus();
    await page.keyboard.press('Enter');
    assert.equal(await page.locator('#caseStudy').evaluate(el=>el.open),true);
    assert.equal(await page.locator('.fc-viewer').evaluate(el=>el.open),false);
    assert.deepEqual(errors,[]);
    console.log('PASS: seven slides, history, focus, scan interaction, rapid input, five viewport sizes, assets, reduced motion, existing Judgement case study.');
    console.log('Screenshots: '+output);
  } finally {await browser.close();server.close();}
})().catch(error=>{console.error(error);server.close();process.exitCode=1;});
