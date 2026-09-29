/* global console, document, getComputedStyle */
// Layout contract from docs/nav-layout-plan.md. Checks only what is supposed
// to be true; sections that opt out carry data-layout="free" in the markup.
import assert from 'node:assert/strict';
import process from 'node:process';
import { chromium } from 'playwright';
import { SITE_ROUTES } from './routes.mjs';

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
    .filter((h) => h.offsetParent && getComputedStyle(h).textAlign !== 'center' && !h.closest('[data-layout="free"]'))
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
    for (const route of ['/services', '/services/ai-voice-agents', '/about']) {
      await page.goto(baseURL + route, { waitUntil: 'networkidle' });
      await page.waitForTimeout(500);
      const sub = await page.evaluate(measure);
      assert.ok(sub.headings.length >= 1, `${route}: expected section headings`);
      for (const h of sub.headings) {
        assert.ok(Math.abs(h.left - sub.logoLeft) <= 1, `${viewport.width}px ${route}: "${h.text}" starts at ${h.left}px, logo at ${sub.logoLeft}px`);
      }
      console.log(`${viewport.width}px grid ${route}: ${sub.headings.length} headings on the logo line`);
    }
    await page.goto(baseURL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    // L2 — one rhythm: chapter sections share a single padding-block.
    assert.ok(rhythm.length >= 5, `expected chapter sections at ${viewport.width}px, found ${rhythm.length}`);
    for (const r of rhythm) {
      assert.equal(r.pad, rhythm[0].pad, `${viewport.width}px: section "${r.id}" pads ${r.pad}, expected ${rhythm[0].pad}`);
    }
    console.log(`${viewport.width}px rhythm: ${rhythm.length} sections at ${rhythm[0].pad}`);

    // N2 — nothing in the nav is marked current while the hero is on screen.
    assert.equal(await page.locator('header [aria-current]').count(), 0, `${viewport.width}px: no nav link may be active on the hero`);
    if (!mobile) assert.equal(await page.locator('header nav a:visible').count(), 5, 'desktop nav is the logo plus four links');

    await page.close();
  }
  // L7 — the first viewport, whatever its height, holds the hero's ask and
  // none of the network diagram.
  for (const viewport of [{ width: 375, height: 667 }, { width: 390, height: 844 }, { width: 430, height: 932 }]) {
    const page = await browser.newPage({ viewport, isMobile: true, hasTouch: true });
    await page.goto(baseURL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);
    const { cta, scene } = await page.evaluate(() => ({
      cta: document.querySelector('#home button.ts-pill').getBoundingClientRect().bottom,
      // Layout top in document space: the parallax transform must not count.
      scene: (() => {
        let y = 0;
        for (let node = document.querySelector('[data-scroll-hero="scene"]'); node; node = node.offsetParent) y += node.offsetTop;
        return y;
      })(),
    }));
    assert.ok(cta <= viewport.height, `${viewport.width}x${viewport.height}: Start a conversation ends at ${Math.round(cta)}px, below the fold`);
    assert.ok(scene >= viewport.height - 1, `${viewport.width}x${viewport.height}: network starts at ${scene}px, inside the first viewport`);
    await page.screenshot({ path: `/tmp/layout-hero-${viewport.width}.png` });
    console.log(`${viewport.width}x${viewport.height} hero: ask ends at ${Math.round(cta)}px, network starts at ${scene}px`);
    await page.close();
  }
  // Phase 2 — no dead ends, no orphans: every route ends in an ask and is
  // linked from some other page.
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    const linked = new Set();
    for (const route of SITE_ROUTES) {
      await page.goto(baseURL + route, { waitUntil: 'networkidle' });
      await page.waitForTimeout(300);
      const { asks, hrefs } = await page.evaluate(() => ({
        asks: [...document.querySelectorAll('main button, main a')].filter((el) => !el.closest('header, footer') && /start a conversation/i.test(el.textContent)).length,
        hrefs: [...document.querySelectorAll('a[href^="/"]')].map((a) => a.getAttribute('href').split('#')[0].replace(/(.)\/$/, '$1')),
      }));
      assert.ok(asks >= 1, `${route}: no "Start a conversation" in the page body — a dead end`);
      hrefs.filter((href) => href !== route).forEach((href) => linked.add(href));
    }
    for (const route of SITE_ROUTES) assert.ok(route === '/' || linked.has(route), `${route}: no other page links to it`);
    console.log(`${SITE_ROUTES.length} routes: each ends in an ask and is linked from another page`);
    await page.close();
  }
  console.log('layout ok');
} finally {
  await browser.close();
}
