/* global console, document, getComputedStyle, window */
// Layout contract from docs/nav-layout-plan.md. Checks only what is supposed
// to be true; sections that opt out carry data-layout="free" in the markup.
import assert from 'node:assert/strict';
import process from 'node:process';
import { chromium } from 'playwright';

const baseURL = process.env.LAYOUT_TEST_URL || 'http://127.0.0.1:5180';
const browser = await chromium.launch({ headless: true });

// Layout-box left edge in document space. offsetLeft ignores transforms, so
// scroll-scrubbed headings measure where they rest, not where they are mid-move.
const measure = () => {
  const layoutLeft = (el) => {
    let x = 0;
    for (let node = el; node; node = node.offsetParent) x += node.offsetLeft;
    return x;
  };
  const logo = document.querySelector('header a[aria-label="Go to Home"]');
  // Section h2s only: the hero h1 carries a deliberate optical offset (-0.04em).
  const headings = [...document.querySelectorAll('main h2')]
    .filter((h) => h.offsetParent && getComputedStyle(h).textAlign !== 'center')
    .map((h) => ({ text: h.textContent.trim().slice(0, 40), left: layoutLeft(h) }));
  const rhythm = [...document.querySelectorAll('main .ts-section')]
    .filter((el) => el.offsetParent && !el.closest('[data-layout="free"]'))
    .map((el) => ({ id: el.id || el.querySelector('h2')?.textContent.trim().slice(0, 30), pad: `${getComputedStyle(el).paddingTop} ${getComputedStyle(el).paddingBottom}` }));
  return { logoLeft: layoutLeft(logo), headings, rhythm };
};

try {
  for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    const mobile = viewport.width < 768;
    const page = await browser.newPage({ viewport, isMobile: mobile, hasTouch: mobile });
    await page.goto(baseURL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);

    // L1 — one content edge: every left-aligned heading starts on the logo's line.
    const { logoLeft, headings, rhythm } = await page.evaluate(measure);
    assert.ok(headings.length >= 3, `expected left-aligned headings at ${viewport.width}px, found ${headings.length}`);
    for (const h of headings) {
      assert.ok(Math.abs(h.left - logoLeft) <= 1, `${viewport.width}px: "${h.text}" starts at ${h.left}px, logo at ${logoLeft}px`);
    }
    console.log(`${viewport.width}px grid: ${headings.length} headings on the logo line (${logoLeft}px)`);

    // L2 — one rhythm: chapter sections share a single padding-block.
    assert.ok(rhythm.length >= 5, `expected chapter sections at ${viewport.width}px, found ${rhythm.length}`);
    for (const r of rhythm) {
      assert.equal(r.pad, rhythm[0].pad, `${viewport.width}px: section "${r.id}" pads ${r.pad}, expected ${rhythm[0].pad}`);
    }
    console.log(`${viewport.width}px rhythm: ${rhythm.length} sections at ${rhythm[0].pad}`);

    // N1 — capsule: off over the hero, on past it, and never in the way of clicks.
    const capsule = page.locator('[data-nav-capsule]');
    assert.equal(await capsule.evaluate((el) => getComputedStyle(el).opacity), '0', `${viewport.width}px: capsule must be hidden over the hero`);
    await page.evaluate(() => window.scrollTo(0, document.getElementById('home').offsetHeight + 200));
    await page.waitForTimeout(500);
    assert.equal(await capsule.evaluate((el) => getComputedStyle(el).opacity), '1', `${viewport.width}px: capsule must show past the hero`);
    const gapHit = await page.evaluate(() => {
      const logo = document.querySelector('header a[aria-label="Go to Home"]').getBoundingClientRect();
      const hit = document.elementFromPoint(logo.right + 12, logo.top + logo.height / 2);
      return Boolean(hit?.closest('header'));
    });
    assert.equal(gapHit, false, `${viewport.width}px: the gap beside the logo must click through to the page`);
    await page.screenshot({ path: `/tmp/layout-nav-${viewport.width}.png`, clip: { x: 0, y: 0, width: viewport.width, height: 140 } });
    console.log(`${viewport.width}px nav: capsule threshold and click-through ok`);
    await page.close();
  }
  console.log('layout ok');
} finally {
  await browser.close();
}
