import { preview } from 'vite';
import process from 'process';

const routes = ['/', '/case-studies'];

async function prerender() {
  console.log('Starting Vite preview server for prerendering...');

  const previewServer = await preview({ preview: { port: 4173 } });

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
      const missingLinuxLib =
        message.includes('error while loading shared libraries') ||
        message.includes('Executable doesn\'t exist');

      if (missingLinuxLib) {
        console.error(
          'Playwright browser is installed but required Linux dependencies are missing.\n' +
            'Run: pnpm exec playwright install-deps chromium'
        );
      }

      throw launchError;
    }
    const page = await browser.newPage();

    const fs = await import('fs');
    const path = await import('path');

    for (const route of routes) {
      const url = `http://localhost:4173${route}`;
      console.log(`Prerendering: ${url}`);

      await page.goto(url, { waitUntil: 'networkidle' });
      await page.waitForTimeout(2000);

      const html = await page.content();
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
