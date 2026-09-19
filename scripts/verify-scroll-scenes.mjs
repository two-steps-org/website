/* global console, window, document, getComputedStyle, innerHeight, innerWidth, scrollY */
import assert from 'node:assert/strict';
import process from 'node:process';
import { chromium } from 'playwright';

const baseURL = process.env.MOTION_TEST_URL || 'http://127.0.0.1:5180';
const browser = await chromium.launch({ headless: true });
try {
  for (const mobile of [false, true]) {
    const page = await browser.newPage({
      viewport: mobile ? { width: 390, height: 844 } : { width: 1440, height: 900 },
      hasTouch: mobile, isMobile: mobile,
      reducedMotion: process.argv.includes('--production') ? 'no-preference' : 'reduce',
    });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(baseURL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    const hub = page.locator('[data-hero-hub]:visible');
    assert.ok(await hub.evaluate(el => parseFloat(getComputedStyle(el).animationDuration) >= 0.3), 'Hero hub entrance must be enabled in the preview');
    // The dev preview intentionally enables motion on reduced-motion devices.
    for (const effect of ['curtain', 'assemble', 'shutter', 'focus', 'timeline', 'portrait', 'unfold']) {
      const anchors = page.locator(`${effect === 'timeline' ? '#process ' : ''}[data-scroll-reveal="${effect}"]`);
      let anchor;
      for (const candidate of await anchors.all()) {
        if (await candidate.isVisible()) { anchor = candidate; break; }
      }
      assert.ok(anchor, `Missing ${effect} scene`);
      const read = async (fraction) => {
        await anchor.evaluate((el, f) => window.scrollTo(0, el.getBoundingClientRect().top + scrollY - innerHeight * f), fraction);
        await page.waitForTimeout(120);
        return anchor.evaluate(el => {
          const style = getComputedStyle(el.querySelector('[data-scroll-motion]'));
          const rect = el.getBoundingClientRect();
          return { transform: style.transform, opacity: style.opacity, clip: style.clipPath,
            top: Math.round(rect.top + scrollY), height: rect.height, documentHeight: document.documentElement.scrollHeight };
        });
      };
      const start = await read(0.90);
      const middle = await read(0.63);
      const end = await read(0.25);
      const reverse = await read(0.63);
      assert.notEqual(JSON.stringify([start.transform, start.opacity, start.clip]), JSON.stringify([middle.transform, middle.opacity, middle.clip]), `${effect} must respond to partial scrolling`);
      assert.equal(end.opacity, '1', `${effect} must be readable at rest`);
      assert.equal(end.transform, 'none', `${effect} must stop moving at rest`);
      assert.deepEqual(reverse, middle, `${effect} must reverse to exactly the same frame without moving its anchor`);
      await page.waitForTimeout(250);
      const idle = await anchor.evaluate(el => ({ transform: getComputedStyle(el.querySelector('[data-scroll-motion]')).transform, opacity: getComputedStyle(el.querySelector('[data-scroll-motion]')).opacity }));
      assert.deepEqual(idle, { transform: middle.transform, opacity: middle.opacity }, `${effect} must not drift while scrolling is stopped`);
      await page.screenshot({ path: `/tmp/scroll-${mobile ? 'mobile' : 'desktop'}-${effect}.png` });
      console.log(`${mobile ? 'Mobile' : 'Desktop'} ${effect}: forward, reverse, stable anchor, and idle passed.`);
    }
    // Restored details must stay synchronized with their existing scroll scene.
    if (!mobile) {
      const slideshow = page.locator('[data-scroll-slideshow="why-us"]');
      assert.ok(await slideshow.count(), 'Why Us scroll slideshow must exist on desktop');
      const readSlide = async (fraction) => {
        await slideshow.evaluate((el, f) => window.scrollTo(0, el.getBoundingClientRect().top + scrollY + el.offsetHeight * f - innerHeight * 0.5), fraction);
        await page.waitForTimeout(120);
        return slideshow.evaluate(el => ({
          label: el.querySelector('[data-why-us-progress]')?.textContent?.trim() ?? '',
          headline: el.querySelector('[data-why-us-stage] h3')?.textContent?.trim() ?? '',
        }));
      };
      const start = await readSlide(0.05);
      const mid = await readSlide(0.35);
      const end = await readSlide(0.85);
      assert.notEqual(start.label, mid.label, 'Why Us slideshow must advance on scroll');
      assert.notEqual(mid.label, end.label, 'Why Us slideshow must keep advancing');
      assert.match(start.label, /^01\s\/\s06$/, 'Why Us slideshow must start at slide 01');
      assert.match(end.label, /^06\s\/\s06$/, 'Why Us slideshow must finish at slide 06');
      assert.equal((await readSlide(0.35)).label, mid.label, 'Why Us slideshow must reverse on scroll up');
      console.log('Desktop why-us scroll slideshow: forward, reverse, and labels passed.');
    }
    for (const selector of ['#services [data-scroll-accent]', '[data-band="light"] ul']) {
      const detail = page.locator(selector).first();
      const at = async fraction => {
        await detail.evaluate((el, f) => {
          const anchor = el.closest('[data-scroll-reveal]');
          window.scrollTo(0, anchor.getBoundingClientRect().top + scrollY - innerHeight * f);
        }, fraction);
        await page.waitForTimeout(120);
        return detail.evaluate(el => {
          const target = el.matches('ul') ? el.closest('[data-scroll-motion]') : el;
          const style = getComputedStyle(target);
          return [style.transform, style.opacity, style.clipPath];
        });
      };
      const partial = await at(0.7);
      const complete = await at(0.25);
      assert.notDeepEqual(partial, complete, `${selector} must animate`);
      assert.equal(complete[1], '1');
      assert.deepEqual(await at(0.7), partial, `${selector} must reverse`);
    }

    const ticker = page.locator('[data-integration-ticker="forward"]');
    await ticker.scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
    const position = () => ticker.evaluate(el => getComputedStyle(el).transform);
    const first = await position();
    await page.waitForTimeout(250);
    assert.notEqual(await position(), first, 'Logo ticker must run on both desktop and mobile');
    assert.ok(await ticker.evaluate(el => el.children[0].offsetWidth * 2 === el.offsetWidth), 'Ticker copies must form a seamless loop');
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(200);
    const pausedTime = await ticker.evaluate(el => el.getAnimations()[0].currentTime);
    const reverseTicker = page.locator('[data-integration-ticker="reverse"]');
    const reversePausedTime = await reverseTicker.evaluate(el => el.getAnimations()[0].currentTime);
    await page.waitForTimeout(250);
    assert.equal(await ticker.evaluate(el => el.getAnimations()[0].currentTime), pausedTime, 'Offscreen ticker must pause');
    assert.equal(await reverseTicker.evaluate(el => el.getAnimations()[0].currentTime), reversePausedTime, 'Reverse ticker must also pause offscreen');
    await ticker.scrollIntoViewIfNeeded();
    await page.waitForTimeout(150);
    assert.ok(await ticker.evaluate(el => el.getAnimations()[0].currentTime) > pausedTime, 'Ticker must resume without restarting');
    const glow = page.locator('[data-encryption-glow]');
    await page.locator('#services [data-scroll-accent]').first().scrollIntoViewIfNeeded();
    await glow.waitFor({ state: 'visible' });
    const glowOpacity = await glow.evaluate(el => getComputedStyle(el).opacity);
    await page.waitForTimeout(300);
    assert.notEqual(await glow.evaluate(el => getComputedStyle(el).opacity), glowOpacity, 'Encryption glow must pulse while visible');
    console.log(`${mobile ? 'Mobile' : 'Desktop'} restored icon reveals, proof grid, and seamless ticker passed.`);

    const hero = page.locator('[data-scroll-hero="scene"]');
    const heroAt = async (top) => {
      await page.evaluate(y => window.scrollTo(0, y), top);
      await page.waitForTimeout(120);
      return hero.evaluate(el => getComputedStyle(el).opacity);
    };
    const heroStart = await heroAt(0);
    const heroTravel = await hero.evaluate(el => el.closest('section').clientHeight * 0.4);
    assert.notEqual(await heroAt(heroTravel), heroStart, 'Hero must fade gently while scrolling');
    assert.equal(await heroAt(0), heroStart, 'Hero must return to its original composition');
    // Scroll reversal must not tilt, scale, or displace the hero's content.
    const geometry = () => page.locator('#home h1, #home .hero-network-node').evaluateAll(elements => elements.map(el => {
      const rect = el.getBoundingClientRect();
      return [rect.x, rect.y + scrollY, rect.width, rect.height].map(n => Math.round(n * 10) / 10);
    }));
    const restingGeometry = await geometry();
    for (const top of [40, 160, 300, 160, 40, 0]) {
      await heroAt(top);
      assert.deepEqual(await geometry(), restingGeometry, 'Hero geometry must stay fixed through scroll reversals');
    }
    await page.waitForTimeout(700);
    assert.deepEqual(await geometry(), restingGeometry, 'Hero must not bounce after scrolling stops');

    const footerTitle = page.locator('footer [data-scroll-reveal="signature"]').first();
    const footerAt = async (fraction) => {
      await footerTitle.evaluate((el, f) => window.scrollTo(0, el.getBoundingClientRect().top + scrollY + el.clientHeight * f - innerHeight), fraction);
      await page.waitForTimeout(120);
      return footerTitle.evaluate(el => getComputedStyle(el.querySelector('[data-scroll-motion]')).transform);
    };
    const folded = await footerAt(0.25);
    assert.notEqual(await footerAt(1), folded, 'Footer must unfold');
    assert.equal(await footerAt(0.25), folded, 'Footer must fold on reverse scroll');

    const deck = page.locator('[data-scroll-anchor="deck"]');
    const deckAt = async (fraction) => {
      await deck.evaluate((el, f) => window.scrollTo(0, el.getBoundingClientRect().top + scrollY - innerHeight * f), fraction);
      await page.waitForTimeout(120);
      return page.locator('[data-scroll-deck="2"]').evaluate(el => getComputedStyle(el).transform);
    };
    const closed = await deckAt(0.9);
    const opened = await deckAt(0.25);
    assert.notEqual(closed, opened);
    assert.equal(await deckAt(0.9), closed, 'Deck must close on reverse scroll');
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await page.waitForTimeout(200);
    assert.ok(await page.locator('footer [data-scroll-motion]').evaluateAll(elements => elements.every(el => getComputedStyle(el).opacity === '1')), 'Footer must fully reveal at the bottom');
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'No horizontal page overflow');
    assert.deepEqual(errors, []);
    await page.close();
  }
  console.log('All distinct scroll scenes reverse correctly on desktop and mobile.');
} finally { await browser.close(); }
