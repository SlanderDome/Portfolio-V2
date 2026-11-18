const {chromium} = require(process.env.PLAYWRIGHT_MODULE || 'playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const output = fs.mkdtempSync(path.join(os.tmpdir(), 'forgedeploy-portfolio-'));
const server = http.createServer((req, res) => {
  const name = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  const file = path.resolve(root, '.' + (name === '/' ? '/index.html' : name));
  if (!file.startsWith(root + path.sep)) return res.writeHead(403).end();
  const types = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.svg':'image/svg+xml','.jpeg':'image/jpeg'};
  fs.readFile(file, (error, data) => {res.writeHead(error ? 404 : 200, {'Content-Type':types[path.extname(file)] || 'application/octet-stream'}); res.end(error ? 'Not found' : data);});
});
(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  const browser = await chromium.launch({headless:true});
  try {
    const page = await browser.newPage({viewport:{width:1440,height:900}});
    const errors = []; page.on('pageerror', error => errors.push(error.message));
    await page.goto(base + '/?ref=keep#building');
    await page.locator('.building-link').click();
    assert.equal(new URL(page.url()).searchParams.get('project'), 'forgedeploy');
    for (let slide = 1; slide <= 6; slide++) {
      assert.equal(new URL(page.url()).searchParams.get('slide'), String(slide));
      if (slide < 6) await page.locator('.fc-next').click();
    }
    assert.match(await page.locator('.fc-slide:not(.fc-outgoing)').innerText(), /Foundation|FOUNDATION/);
    await page.goBack(); assert.equal(new URL(page.url()).searchParams.get('slide'), '5');
    await page.goForward(); assert.equal(new URL(page.url()).searchParams.get('slide'), '6');
    await page.keyboard.press('Escape');
    await page.waitForFunction(() => !document.querySelector('.fc-viewer').open);
    assert.equal(await page.locator('.building-link').evaluate(el => document.activeElement === el), true);
    assert.equal(new URL(page.url()).searchParams.get('ref'), 'keep');
    for (const [width,height] of [[1440,900],[768,1024],[390,844],[320,800]]) {
      await page.setViewportSize({width,height});
      await page.goto(base + '/#building');
      await page.locator('#building').scrollIntoViewIfNeeded();
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      if (width === 1440 || width === 390) await page.screenshot({path:path.join(output, `${width}-section.png`)});
      for (let slide = 1; slide <= 6; slide++) {
        await page.goto(base + `/?project=forgedeploy&slide=${slide}#building`);
        const stage = page.locator('.fc-slide:not(.fc-outgoing)');
        const size = await stage.evaluate(el => [el.scrollWidth, el.clientWidth]);
        assert.ok(size[0] <= size[1] + 1, `slide ${slide} overflows at ${width}px`);
        if (slide === 5) {
          await stage.locator('img').waitFor({state:'visible'});
          await page.waitForFunction(() => document.querySelector('.fd-screen img')?.naturalWidth > 0);
          assert.match(await stage.locator('figcaption').innerText(), /SAMPLE DATA/);
          if (width === 390 || width === 1440) await page.screenshot({path:path.join(output, `${width}-viewer.png`)});
        }
      }
    }
    await page.emulateMedia({reducedMotion:'reduce'});
    await page.goto(base + '/#building');
    assert.equal(await page.locator('.building-trace').evaluate(el => getComputedStyle(el).animationName), 'none');
    await page.locator('.theme-toggle').click();
    assert.ok(await page.locator('body').evaluate(el => el.classList.contains('night')));
    await page.locator('#building').scrollIntoViewIfNeeded();
    await page.screenshot({path:path.join(output, '320-night-section.png')});
    assert.deepEqual(errors, []);
    console.log(`PASS: ForgeDeploy navigation, history, focus, screenshots, responsive layouts and reduced motion. Screenshots: ${output}`);
  } finally { await browser.close(); server.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
