/* PLAYWRIGHT_MODULE may point to an existing playwright-core installation. */
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || 'playwright-core');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const os = require('node:os');
const root = path.resolve(__dirname, '..');
const out = fs.mkdtempSync(path.join(os.tmpdir(), 'portfolio-editorial-'));
const server = http.createServer((req, res) => {
  const file = path.resolve(root, '.' + (new URL(req.url, 'http://localhost').pathname === '/' ? '/index.html' : decodeURIComponent(new URL(req.url, 'http://localhost').pathname)));
  if (!file.startsWith(root + path.sep)) {res.writeHead(403).end(); return;}
  const mime = {'.html':'text/html', '.css':'text/css', '.js':'text/javascript', '.svg':'image/svg+xml', '.png':'image/png', '.jpeg':'image/jpeg', '.pdf':'application/pdf'};
  fs.readFile(file, (err, data) => {res.writeHead(err ? 404 : 200, {'Content-Type':mime[path.extname(file)] || 'application/octet-stream'});res.end(err ? 'Not found' : data);});
});
(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const browser = await chromium.launch({headless:true});
  const base = `http://127.0.0.1:${server.address().port}`;
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', err => errors.push(err.message));
  try {
    await page.goto(base);
    await page.evaluate(() => document.fonts.ready);
    await page.keyboard.press('Tab');
    assert.ok(await page.locator('.skip-link').evaluate(el => el === document.activeElement));
    await page.keyboard.press('Enter');
    assert.ok(await page.locator('#main').evaluate(el => el === document.activeElement));
    await page.locator('#main').evaluate(el => el.blur());
    for (const width of [320, 360, 390, 768, 1024, 1440]) {
      await page.setViewportSize({width, height:900});
      for (const night of [false, true]) {
        await page.evaluate(night => document.body.classList.toggle('night', night), night);
        await page.evaluate(() => scrollTo(0,0));
        const metrics = await page.evaluate(() => {
          const box = selector => document.querySelector(selector).getBoundingClientRect().toJSON();
          const h = box('.hero-heading'), art = box('.hero-preview');
          const overlap = h.left < art.right && h.right > art.left && h.top < art.bottom && h.bottom > art.top;
          const range = document.createRange(); range.selectNodeContents(document.querySelector('h1'));
          const text = range.getBoundingClientRect();
          return {width:innerWidth, scroll:document.documentElement.scrollWidth, overlap, textRight:text.right,
            images:[...document.querySelectorAll('.project-poster img')].every(img => img.naturalWidth > 0),
            annotations:[...document.querySelectorAll('.project-poster figcaption')].every(cap => {
              const c = cap.getBoundingClientRect(), p = cap.parentElement.getBoundingClientRect();
              return c.left >= p.left - 1 && c.right <= p.right + 1 && c.bottom <= p.bottom + 1;
            })};
        });
        assert.ok(metrics.scroll <= width + 1, `Overflow: ${JSON.stringify(metrics)}`);
        assert.ok(!metrics.overlap, `Hero overlaps at ${width}`);
        assert.ok(metrics.textRight <= width, `Hero text escapes at ${width}: ${metrics.textRight}`);
        assert.ok(metrics.annotations, `Annotation escapes at ${width}`);
        const contrast = await page.evaluate(() => {
          const rgb = value => value.match(/[\d.]+/g).slice(0,3).map(Number);
          const luminance = c => c.map(v => {v/=255; return v <= .04045 ? v/12.92 : ((v+.055)/1.055)**2.4;}).reduce((sum,v,i) => sum + v * [.2126,.7152,.0722][i],0);
          return ['body','.hero-bottom p','.engineering-note','.project-actions a','.poster-foliage figcaption','.poster-judgement figcaption','.poster-reconcile figcaption','.secondary','.lab-note>p:not(.eyebrow)','.contact','.contact-foot p','.round-link'].map(selector => {
            const el = document.querySelector(selector);
            let parent = el;
            while (parent.parentElement && getComputedStyle(parent).backgroundColor === 'rgba(0, 0, 0, 0)') parent = parent.parentElement;
            const fg = luminance(rgb(getComputedStyle(el).color)), bg = luminance(rgb(getComputedStyle(parent).backgroundColor));
            return {selector,ratio:(Math.max(fg,bg)+.05)/(Math.min(fg,bg)+.05)};
          });
        });
        assert.ok(contrast.every(item => item.ratio >= 4.5), `Contrast failure: ${JSON.stringify(contrast.filter(item => item.ratio < 4.5))}`);
        await page.locator('#work').scrollIntoViewIfNeeded();
        await page.waitForFunction(() => [...document.querySelectorAll('.project-poster img')].every(img => img.complete && img.naturalWidth > 0));
        for (const section of ['top', 'work', 'about', 'lab', 'contact']) {
          if ([390,768,1440].includes(width)) {
            await page.locator('#' + section).scrollIntoViewIfNeeded();
            await page.waitForTimeout(150);
            await page.screenshot({path:path.join(out, `${width}-${night ? 'night' : 'day'}-${section}.png`)});
          }
        }
        if ([390,1440].includes(width) && !night) {
          await page.evaluate(() => scrollTo(0,0));
          await page.waitForTimeout(300);
          await page.screenshot({path:path.join(out,`${width}-full.png`),fullPage:true});
        }
      }
    }
    await page.setViewportSize({width:390,height:844});
    await page.goto(base + '/?ref=keep#work');
    // Each resource opens its own destination without invoking the case viewer.
    await page.context().route(/https:\/\/(github\.com|foliagecare\.netlify\.app|judgement-x0wl\.onrender\.com|reconcilely\.netlify\.app)\//, route => route.fulfill({status:200,contentType:'text/html',body:'Resource navigation verified'}));
    for (const key of ['foliage','judgement','reconcile']) {
      const card = page.locator(`[data-project="${key}"]`);
      assert.equal(await card.locator('.project-actions a').count(), 3);
      for (const label of ['Live project', 'GitHub']) {
        const link = card.getByRole('link', {name:new RegExp(label)});
        const expected = await link.getAttribute('href');
        const popupPromise = page.waitForEvent('popup');
        await link.click();
        const popup = await popupPromise;
        await popup.waitForLoadState();
        assert.equal(popup.url(), expected);
        assert.equal(await page.locator('.fc-viewer').evaluate(el => el.open), false);
        await popup.close();
      }
      const open = card.locator('.project-open');
      await open.focus(); await page.keyboard.press('Enter');
      await page.waitForFunction(() => document.querySelector('.fc-viewer').open);
      assert.equal(new URL(page.url()).searchParams.get('project'), key);
      assert.equal(new URL(page.url()).searchParams.get('ref'), 'keep');
      await page.keyboard.press('Escape');
      await page.waitForFunction(() => !document.querySelector('.fc-viewer').open);
      assert.ok(await open.evaluate(el => el === document.activeElement));
    }
    for (const link of await page.locator('.lab-note a').all()) {
      const expected = new URL(await link.getAttribute('href'), base);
      await link.click();
      assert.equal(new URL(page.url()).searchParams.get('project'), expected.searchParams.get('project'));
      assert.equal(new URL(page.url()).searchParams.get('slide'), expected.searchParams.get('slide'));
      await page.keyboard.press('Escape');
      await page.waitForFunction(() => !document.querySelector('.fc-viewer').open);
      assert.ok(await link.evaluate(el => el === document.activeElement));
    }
    await page.locator('.theme-toggle').click();
    assert.equal(await page.locator('.theme-toggle').getAttribute('aria-label'), 'Switch to day mode');
    await page.reload();
    assert.ok(await page.locator('body').evaluate(el => el.classList.contains('night')));
    await page.emulateMedia({reducedMotion:'reduce'});
    await page.mouse.move(100,100);
    await page.waitForTimeout(100);
    assert.equal(await page.locator('.cursor-dot').evaluate(el => getComputedStyle(el).display), 'none');
    assert.ok(await page.locator('.poster-atmosphere path').evaluateAll(els => els.every(el => getComputedStyle(el).strokeDashoffset === '0px')));
    // 200% browser zoom gives a 1440px desktop a 720 CSS-pixel layout viewport.
    await page.setViewportSize({width:720,height:450});
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
    await page.screenshot({path:path.join(out,'zoom-equivalent-200.png'),fullPage:true});
    const noJs = await browser.newPage({javaScriptEnabled:false,viewport:{width:390,height:844}});
    await noJs.goto(base);
    assert.ok(await noJs.locator('h1').isVisible());
    assert.equal(await noJs.locator('.project-actions a').count(),9);
    assert.ok(await noJs.locator('.project-poster').first().isVisible());
    await noJs.close();
    assert.deepEqual(errors, []);
    console.log('PASS: six widths × two themes, hero separation, poster bounds, 12 text/surface contrast pairs, skip link, nine independent actions, three Lab Notes routes and focus restoration, theme persistence, reduced motion, 200%-zoom-equivalent viewport, and no-JS content.');
    console.log('Resource destinations were intercepted for deterministic navigation tests; external service health is not asserted.');
    console.log('Screenshots: ' + out);
  } finally {await browser.close(); server.close();}
})().catch(error => {console.error(error);server.close();process.exitCode=1;});
