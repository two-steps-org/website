import { preview } from 'vite';
import process from 'process';
import { spawnSync } from 'node:child_process';
import { resolveSeoRuntimeConfig } from './seo-config';

import { SITE_ROUTES } from './routes.mjs';

const routes = SITE_ROUTES;

function installChromiumBrowser(): void {
  console.log('Playwright Chromium binary missing. Installing browser...');
  const result = spawnSync('pnpm', ['exec', 'playwright', 'install', 'chromium'], {
    stdio: 'inherit',
  });

  if (result.status !== 0) {
    throw new Error(
      'Failed to install Playwright Chromium browser. Run `pnpm exec playwright install chromium`.'
    );
  }
}

async function prerender() {
  // Validate production SEO inputs before creating prerendered HTML.
  resolveSeoRuntimeConfig();
  console.log('Starting Vite preview server for prerendering...');

  const previewServer = await preview({ preview: { host: '127.0.0.1', port: 4173 } });

  let browser: { close: () => Promise<void> } | null = null;

  try {
    const playwright = await import('playwright').catch(() => null);
    if (!playwright) {
      throw new Error(
        'Missing dependency: playwright. Run `pnpm install` and ensure Playwright browsers are installed.'
      );
    }

    console.log('Preview server started, launching browser...');
    try {
      browser = await playwright.chromium.launch();
    } catch (launchError) {
      const message = launchError instanceof Error ? launchError.message : String(launchError);
      const missingBrowserExecutable = message.includes('Executable doesn\'t exist');
      const missingLinuxLib = message.includes('error while loading shared libraries');

      if (missingBrowserExecutable) {
        installChromiumBrowser();
        browser = await playwright.chromium.launch();
      } else if (missingLinuxLib) {
        console.error(
          'Playwright browser is installed but required Linux dependencies are missing.\n' +
            'Run: pnpm exec playwright install-deps chromium'
        );

        throw launchError;
      } else {
        throw launchError;
      }
    }
    const page = await browser.newPage();
    // Capture the page at rest: the scroll-driven sections render their static
    // fallback layouts under reduced motion, so no mid-scroll transform or
    // unplayed entrance gets baked into the HTML.
    await page.emulateMedia({ reducedMotion: 'reduce' });

    const fs = await import('fs');
    const path = await import('path');

    for (const route of routes) {
      const url = `http://localhost:4173${route}`;
      console.log(`Prerendering: ${url}`);

      await page.goto(url, { waitUntil: 'networkidle' });
      await page.waitForTimeout(2000);

      // Crawlers get the markup; visitors must not see it flash before React
      // replaces it (createRoot, not hydration). index.html hides a marked
      // root and main.tsx clears the mark before the first render.
      await page.evaluate(() => document.getElementById('root')?.setAttribute('data-prerender', ''));
      // Vite injects modulepreload links for lazy chunks at runtime with
      // absolute hrefs, so the capture carries the preview server's origin.
      // Make them root-relative or production ships localhost URLs.
      const origin = new URL(url).origin;
      const html = (await page.content()).replaceAll(`${origin}/`, '/');
      const fileName = route === '/' ? 'index.html' : `${route.replace(/^\//, '')}/index.html`;
      const filePath = path.join('./dist', fileName);
      const dir = path.dirname(filePath);

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      fs.writeFileSync(filePath, html);
      console.log(`Saved: ${filePath}`);
    }

    console.log('Prerendering complete.');
  } finally {
    if (browser) {
      await browser.close();
    }

    await new Promise<void>((resolve) => {
      previewServer.httpServer.close(() => resolve());
    });
  }
}

prerender().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
