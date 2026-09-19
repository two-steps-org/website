/* global console, window, document, PerformanceObserver, getComputedStyle, innerHeight, innerWidth, scrollY, requestAnimationFrame, DOMMatrixReadOnly */
import assert from 'node:assert/strict';
import process from 'node:process';
import { chromium } from 'playwright';

const baseURL = process.env.MOTION_TEST_URL || 'http://127.0.0.1:5180';
const browser = await chromium.launch({ headless: true });

try {
  for (const mobile of [false, true]) {
    const page = await browser.newPage({
      viewport: mobile ? { width: 390, height: 844 } : { width: 1280, height: 800 },
      isMobile: mobile,
      hasTouch: mobile,
      reducedMotion: (process.env.MOTION_TEST_DEVICE_REDUCED === '1' || process.argv.includes('--device-reduced')) ? 'reduce' : 'no-preference',
    });
    const errors = [];
    page.on('console', message => {
      if (message.type() === 'warning' && message.text().includes('Reduced Motion')) errors.push(message.text());
    });
    page.on('pageerror', error => errors.push(error.message));
    await page.addInitScript(() => {
      window.motionLayoutShifts = [];
      new PerformanceObserver(list => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) window.motionLayoutShifts.push(entry.value);
        }
      }).observe({ type: 'layout-shift', buffered: true });
    });
    await page.goto(baseURL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1200);
    console.log(`${mobile ? 'Mobile' : 'Desktop'} loading layout shift:`, await page.evaluate(() => window.motionLayoutShifts.reduce((sum, value) => sum + value, 0)));
    await page.screenshot({ path: `/tmp/motion-${mobile ? 'mobile' : 'desktop'}.png` });
    assert.equal(await page.locator('#home svg animate').count(), 12, 'Hero animates while visible');

    if (!mobile) {
      const networkCard = page.locator('#home .absolute.z-30 > div > div').first();
      await networkCard.hover();
      await page.waitForTimeout(250);
      assert.ok(await networkCard.evaluate(el => new DOMMatrixReadOnly(getComputedStyle(el).transform).a) > 1.01,
        'Hero card hover must work after its entrance animation finishes');
      await page.mouse.move(0, 0);
    }

    const cssEntranceDuration = await page.locator('#home .absolute.z-30 > div').first().evaluate(el => parseFloat(getComputedStyle(el).animationDuration));
    assert.ok(cssEntranceDuration >= 0.2, `CSS entrances must follow the same motion setting as JS: ${JSON.stringify(await page.locator('#home .absolute.z-30 > div').first().evaluate(el => ({duration: getComputedStyle(el).animationDuration, preview: document.documentElement.dataset.motionPreview, classes: el.className, rules: [...document.styleSheets].flatMap(sheet => { try { return [...sheet.cssRules].map(rule => rule.cssText).filter(text => text.includes('0.01ms')); } catch { return []; } })})))}`);

    const serviceCard = page.getByRole('button', { name: 'Discover more about AI Chat Agents', exact: true });
    await serviceCard.evaluate(button => button.closest('[data-scroll-reveal]').scrollIntoView({ block: 'start' }));
    await page.waitForTimeout(150);
    assert.equal(await serviceCard.evaluate(button => getComputedStyle(button.parentElement).opacity), '1');
    await serviceCard.click();
    const serviceDialog = page.getByRole('dialog');
    await serviceDialog.waitFor({ state: 'visible' });
    await page.waitForTimeout(300);
    await serviceDialog.getByRole('button', { name: 'Close modal', exact: true }).click();
    assert.equal(await serviceDialog.count(), 1, 'Modal must remain mounted during its exit animation');
    await serviceDialog.waitFor({ state: 'detached' });

    const heading = page.locator('#services h2');
    await heading.evaluate(el => el.closest('[data-scroll-reveal]').scrollIntoView({ block: 'start' }));
    await page.waitForTimeout(800);
    const settled = await heading.evaluate(el => ({
      transform: getComputedStyle(el.parentElement).transform,
      visible: [...el.querySelectorAll('span span')].every(word => getComputedStyle(word).opacity === '1'),
    }));
    assert.equal(settled.transform, 'none', 'Reading content must reach its rest position');
    assert.ok(settled.visible);
    assert.equal(await page.locator('#home svg animate').count(), 0, 'Offscreen hero must stop animating');
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(600);
    assert.notDeepEqual(await heading.evaluate(el => ({
      transform: getComputedStyle(el.parentElement).transform,
      visible: [...el.querySelectorAll('span span')].every(word => getComputedStyle(word).opacity === '1'),
    })), settled, 'Scroll reveals must reverse when scrolling back above the section');

    // Scroll both ways and check the document does not change size or jump sideways.
    const heights = [];
    for (const progress of [0.2, 0.5, 0.8, 1, 0.8, 0.5, 0.2]) {
      heights.push(await page.evaluate(p => {
        window.scrollTo(0, (document.documentElement.scrollHeight - innerHeight) * p);
        return document.documentElement.scrollHeight;
      }, progress));
      await page.waitForTimeout(350);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    }
    assert.ok(Math.max(...heights) - Math.min(...heights) <= 1, 'Scrolling must not resize the document');

    const card = page.locator('article[data-top="1"]');
    await card.evaluate(el => el.scrollIntoView({ block: 'center' }));
    await page.waitForTimeout(400);
    const originalQuote = await card.textContent();
    if (mobile) {
      const cdp = await page.context().newCDPSession(page);
      const box = await card.boundingBox();
      const x = box.x + box.width / 2;
      const y = box.y + box.height / 2;
      const before = await page.evaluate(() => scrollY);
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
      for (let step = 1; step <= 10; step++) {
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y: y - step * 18 }] });
        await page.waitForTimeout(20);
      }
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
      await page.waitForTimeout(400);
      assert.ok(await page.evaluate(() => scrollY) > before + 60, 'Vertical swipe over a card must scroll the page');
      assert.equal(await card.textContent(), originalQuote, 'Vertical swipes must not discard quotes');
      await card.evaluate(el => el.scrollIntoView({ block: 'center' }));
      await page.waitForTimeout(300);
      const dragBox = await card.boundingBox();
      const dragX = dragBox.x + dragBox.width / 3;
      const dragY = dragBox.y + dragBox.height / 2;
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: dragX, y: dragY }] });
      for (let step = 1; step <= 8; step++) {
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: dragX + step * 18, y: dragY }] });
        await page.waitForTimeout(20);
      }
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    } else {
      const box = await card.boundingBox();
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      await page.mouse.move(box.x + box.width / 2 + 150, box.y + box.height / 2, { steps: 10 });
      await page.mouse.up();
    }
    await page.waitForTimeout(650);
    assert.notEqual(await card.textContent(), originalQuote, 'Horizontal drag must advance a quote');

    const faqButton = page.locator('#faq button[aria-expanded]').first();
    await faqButton.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    for (const opening of [true, false]) {
      const heights = await faqButton.evaluate(button => {
        button.click();
        return new Promise(resolve => {
          const frames = [];
          const sample = () => {
            frames.push(button.parentElement.getBoundingClientRect().height);
            if (frames.length < 24) requestAnimationFrame(sample);
            else resolve(frames);
          };
          requestAnimationFrame(sample);
        });
      });
      assert.ok(new Set(heights.map(height => Math.round(height))).size > 3, 'Accordion must animate its height, without snapping');
      assert.equal(await faqButton.getAttribute('aria-expanded'), String(opening));
    }

    await page.goto(`${baseURL}/case-studies`, { waitUntil: 'networkidle' });
    assert.ok(await page.locator('h1').isVisible());
    await page.goto(`${baseURL}/#services`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);
    assert.ok(Math.abs(await page.locator('#services').evaluate(el => el.getBoundingClientRect().top)) < 120, 'Deep links must land at the requested section');
    const top = await page.evaluate(() => scrollY);
    await page.waitForTimeout(400);
    assert.equal(await page.evaluate(() => scrollY), top, 'Deep links must remain settled');
    assert.deepEqual(errors, []);
    console.log(`${mobile ? 'Mobile' : 'Desktop'}: card entrances, modal exits, accordions, stable scroll, gestures, and routing passed.`);
    await page.close();
  }

  const reduced = await browser.newPage({ reducedMotion: 'reduce' });
  await reduced.goto(`${baseURL}/?motion=system`, { waitUntil: 'networkidle' });
  assert.equal(await reduced.locator('svg animate').count(), 0, 'Reduced motion must stop SVG animation');
  const reducedTicker = reduced.locator('[data-integration-ticker="forward"]');
  await reducedTicker.scrollIntoViewIfNeeded();
  assert.equal(await reducedTicker.evaluate(el => getComputedStyle(el).animationPlayState), 'paused', 'Reduced motion must stop the logo ticker even in view');
  assert.equal(await reduced.locator('[data-integration-ticker="reverse"]').evaluate(el => getComputedStyle(el).animationPlayState), 'paused', 'Reduced motion must stop the reverse ticker');
  assert.equal(await reduced.locator('[data-encryption-glow]').count(), 0, 'Reduced motion must stop the decorative glow');
  assert.ok(await reduced.locator('[data-scroll-accent]').evaluateAll(elements => elements.every(el =>
    getComputedStyle(el).opacity === '1' && getComputedStyle(el).transform === 'none'
  )), 'Restored icons must stay visible in reduced motion');
  assert.ok(await reduced.locator('h2').evaluateAll(headings => headings.every(el =>
    [...el.querySelectorAll('span span')].every(word => getComputedStyle(word).opacity === '1')
  )), 'Reduced motion must leave all headings readable');
  await reduced.close();
  console.log('Reduced motion: headings readable and SVG loops stopped.');
} finally {
  await browser.close();
}
