import fs from 'fs';
import path from 'path';
import process from 'process';
import { JSDOM } from 'jsdom';
import { assertAbsoluteNonLocalhostUrl, resolveSeoRuntimeConfig } from './seo-config';

interface CheckResult {
  file: string;
  missing: string[];
}

const seoConfig = resolveSeoRuntimeConfig();
const distRoot = path.join(process.cwd(), 'dist');
const pages = [
  { file: 'index.html', route: '/' },
  { file: path.join('case-studies', 'index.html'), route: '/case-studies' },
];

function readHtml(file: string): string {
  const fullPath = path.join(distRoot, file);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Missing prerendered file: ${fullPath}`);
  }
  return fs.readFileSync(fullPath, 'utf8');
}

function getMetaContent(document: Document, key: string, attr: 'name' | 'property' = 'name'): string {
  const element = document.querySelector(`meta[${attr}="${key}"]`);
  return element?.getAttribute('content')?.trim() ?? '';
}

function parseJSONLDScripts(document: Document): unknown[] {
  const scripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
  const parsed: unknown[] = [];

  for (const script of scripts) {
    const raw = script.textContent?.trim();
    if (!raw) continue;
    try {
      parsed.push(JSON.parse(raw));
    } catch {
      throw new Error('Invalid JSON-LD script content: JSON parse failed');
    }
  }

  return parsed;
}

function collectUrlsFromSchema(value: unknown): string[] {
  const urls: string[] = [];
  if (!value || typeof value !== 'object') {
    return urls;
  }

  const stack: unknown[] = [value];
  while (stack.length > 0) {
    const current = stack.pop();
    if (!current || typeof current !== 'object') continue;

    if (Array.isArray(current)) {
      for (const item of current) stack.push(item);
      continue;
    }

    for (const [key, nestedValue] of Object.entries(current as Record<string, unknown>)) {
      if (key === 'url' && typeof nestedValue === 'string') {
        urls.push(nestedValue);
      }

      if ((key === 'logo' || key === 'image') && typeof nestedValue === 'string') {
        urls.push(nestedValue);
      }

      stack.push(nestedValue);
    }
  }

  return urls;
}

function validatePage(file: string, route: string, html: string): CheckResult {
  const dom = new JSDOM(html);
  const { document } = dom.window;
  const missing: string[] = [];

  const requiredSelectors = [
    ['canonical link', 'link[rel="canonical"]'],
    ['og:title', 'meta[property="og:title"]'],
    ['og:description', 'meta[property="og:description"]'],
    ['og:url', 'meta[property="og:url"]'],
    ['og:type', 'meta[property="og:type"]'],
    ['og:image', 'meta[property="og:image"]'],
    ['twitter:card', 'meta[name="twitter:card"]'],
    ['twitter:title', 'meta[name="twitter:title"]'],
    ['twitter:description', 'meta[name="twitter:description"]'],
    ['twitter:image', 'meta[name="twitter:image"]'],
    ['twitter:site', 'meta[name="twitter:site"]'],
    ['twitter:creator', 'meta[name="twitter:creator"]'],
    ['publisher meta', 'meta[name="publisher"]'],
    ['author meta', 'meta[name="author"]'],
    ['creator meta', 'meta[name="creator"]'],
    ['JSON-LD schema', 'script[type="application/ld+json"]'],
  ] as const;

  for (const [label, selector] of requiredSelectors) {
    if (!document.querySelector(selector)) {
      missing.push(label);
    }
  }

  const canonicalHref = document.querySelector('link[rel="canonical"]')?.getAttribute('href')?.trim() ?? '';
  if (canonicalHref) {
    try {
      assertAbsoluteNonLocalhostUrl(canonicalHref, `${file} canonical`);
      const expectedPrefix = route === '/' ? `${seoConfig.siteUrl}/` : `${seoConfig.siteUrl}${route}`;
      if (canonicalHref !== expectedPrefix) {
        missing.push(`canonical mismatch (expected ${expectedPrefix}, got ${canonicalHref})`);
      }
    } catch (error) {
      missing.push(error instanceof Error ? error.message : String(error));
    }
  }

  const ogUrl = getMetaContent(document, 'og:url', 'property');
  if (ogUrl) {
    try {
      assertAbsoluteNonLocalhostUrl(ogUrl, `${file} og:url`);
    } catch (error) {
      missing.push(error instanceof Error ? error.message : String(error));
    }
  }

  const urlMetaKeys: Array<{ key: string; attr?: 'name' | 'property' }> = [
    { key: 'og:image', attr: 'property' },
    { key: 'twitter:image' },
  ];
  for (const item of urlMetaKeys) {
    const value = getMetaContent(document, item.key, item.attr ?? 'name');
    if (!value) continue;
    try {
      assertAbsoluteNonLocalhostUrl(value, `${file} ${item.key}`);
    } catch (error) {
      missing.push(error instanceof Error ? error.message : String(error));
    }
  }

  const robots = getMetaContent(document, 'robots');
  if (robots !== seoConfig.robotsDirective) {
    missing.push(
      `robots meta mismatch (expected "${seoConfig.robotsDirective}", got "${robots || '<missing>'}")`
    );
  }

  let schemas: unknown[] = [];
  try {
    schemas = parseJSONLDScripts(document);
  } catch (error) {
    missing.push(error instanceof Error ? error.message : String(error));
  }

  const allowedTypes = new Set(['Organization', 'WebSite', 'WebPage', 'CollectionPage']);
  for (const schema of schemas) {
    const schemaType =
      schema && typeof schema === 'object' && !Array.isArray(schema)
        ? (schema as Record<string, unknown>)['@type']
        : undefined;
    if (typeof schemaType === 'string' && !allowedTypes.has(schemaType)) {
      missing.push(`unexpected JSON-LD @type: ${schemaType}`);
    }

    for (const value of collectUrlsFromSchema(schema)) {
      try {
        assertAbsoluteNonLocalhostUrl(value, `${file} JSON-LD URL`);
      } catch (error) {
        missing.push(error instanceof Error ? error.message : String(error));
      }
    }
  }

  if (/href=["']#["']/i.test(html)) {
    missing.push('replace href="#" placeholders with real links');
  }

  return { file, missing };
}

function verifyRobots() {
  const robotsPath = path.join(distRoot, 'robots.txt');
  if (!fs.existsSync(robotsPath)) {
    throw new Error('Missing dist/robots.txt');
  }

  const robots = fs.readFileSync(robotsPath, 'utf8');
  if (!/User-agent:\s*\*/i.test(robots)) {
    throw new Error('robots.txt missing `User-agent: *`');
  }
  if (!/Sitemap:\s*https?:\/\/\S+\/sitemap\.xml/i.test(robots)) {
    throw new Error('robots.txt sitemap must be absolute URL');
  }

  if (seoConfig.isProduction && !/Allow:\s*\//i.test(robots)) {
    throw new Error('robots.txt must include `Allow: /` for production builds');
  }

  if (!seoConfig.isProduction && !/Disallow:\s*\//i.test(robots)) {
    throw new Error('robots.txt must include `Disallow: /` for non-production builds');
  }
}

function main() {
  const results = pages.map((page) => {
    const html = readHtml(page.file);
    return validatePage(page.file, page.route, html);
  });

  const failures = results.filter((result) => result.missing.length > 0);
  verifyRobots();

  if (failures.length > 0) {
    const details = failures
      .map((failure) => `- ${failure.file}\n  ${failure.missing.map((m) => `- ${m}`).join('\n  ')}`)
      .join('\n');
    throw new Error(`SEO verification failed:\n${details}`);
  }

  console.log('✓ SEO HTML verification passed');
}

main();

