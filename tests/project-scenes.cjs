const {chromium} = require(process.env.PLAYWRIGHT_MODULE || 'E:/ForgeDeploy/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const output = fs.mkdtempSync(path.join(os.tmpdir(), 'project-scenes-'));
const server = http.createServer((req,res) => {
  const pathname = decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  const target = path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));
  if (!target.startsWith(root+path.sep)) return res.writeHead(403).end();
  fs.readFile(target,(error,data)=>{
    res.writeHead(error?404:200,{'Content-Type':({'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.jpeg':'image/jpeg'})[path.extname(target)]||'application/octet-stream'});
    res.end(error?'Not found':data);
  });
});
(async()=>{
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  let browser;
  try {
    browser = await chromium.launch({headless:true});
    const page = await browser.newPage();
    const errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    await page.goto(`http://127.0.0.1:${server.address().port}`);
    await page.addStyleTag({content:'html{scroll-behavior:auto!important}'});
    assert.equal(await page.locator('.project-scene[aria-hidden="true"]').count(),3);
    for (const [width,height] of [[1440,900],[768,1024],[390,844],[360,800]]) {
      await page.setViewportSize({width,height});
      for(const key of ['foliage','judgement','reconcile']) {
        const project=page.locator(`.project[data-project="${key}"]`);
        await project.evaluate(el=>el.scrollIntoView({block:'center',behavior:'instant'}));
        await page.waitForTimeout(650);
        const result=await project.evaluate(el=>{
          const bounds=el.getBoundingClientRect();
          const layer=el.querySelector('.project-scene');
          return {opacity:Number(getComputedStyle(layer).opacity),pointer:getComputedStyle(layer).pointerEvents,
            overflow:document.documentElement.scrollWidth>innerWidth,
            edges:[...layer.querySelectorAll('.scene-edge')].map(edge=>{const r=edge.getBoundingClientRect();return {left:r.left,right:r.right,outside:r.right<=bounds.left||r.left>=bounds.right};})};
        });
        assert.ok(result.opacity>.8,`${width} ${key}: focused scene visible`);
        assert.equal(result.pointer,'none');assert.equal(result.overflow,false);
        result.edges.forEach(edge=>{assert.ok(edge.outside);assert.ok(edge.left>=0&&edge.right<=width);});
        await page.screenshot({path:path.join(output,`${key}-${width}.png`)});
      }
    }
    await page.setViewportSize({width:1440,height:900});
    const foliage=page.locator('.project[data-project="foliage"]');
    const offset=async fraction=>{
      await foliage.evaluate((el,f)=>scrollTo({top:scrollY+el.getBoundingClientRect().top-innerHeight*f,behavior:'instant'}),fraction);
      await page.waitForTimeout(120);
      return Number(await foliage.locator('.scene-draw').first().evaluate(el=>el.style.strokeDashoffset));
    };
    const entry=await offset(.8),focus=await offset(.28),reverse=await offset(.8);
    assert.ok(entry>focus);assert.ok(Math.abs(entry-reverse)<.01,'Scroll up reverses the drawing');
    await page.emulateMedia({reducedMotion:'reduce'});
    await offset(.8);
    assert.equal(await foliage.locator('.scene-draw').first().evaluate(el=>getComputedStyle(el).strokeDashoffset),'0px');
    assert.equal(await foliage.locator('.project-scene').evaluate(el=>getComputedStyle(el).opacity),'0.65');
    await offset(.28);
    assert.equal(await foliage.locator('.scene-draw').first().evaluate(el=>getComputedStyle(el).strokeDashoffset),'0px');
    await page.emulateMedia({reducedMotion:'no-preference'});
    await foliage.locator('.project-open').click();
    await page.waitForFunction(()=>document.querySelector('.fc-viewer').open);
    await page.keyboard.press('Escape');
    await page.waitForFunction(()=>!document.querySelector('.fc-viewer').open);
    await page.locator('.theme-toggle').click();
    await foliage.evaluate(el=>el.scrollIntoView({block:'center',behavior:'instant'}));
    await page.waitForTimeout(300);
    await page.screenshot({path:path.join(output,'foliage-night.png')});
    assert.deepEqual(errors,[]);
    console.log(`PASS: scenes, edge boundaries, reverse scroll, reduced motion, case study and night mode. Screenshots: ${output}`);
  } finally {if(browser) await browser.close();server.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
