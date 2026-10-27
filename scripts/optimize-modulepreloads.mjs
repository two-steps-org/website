/* global console */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { DIST_HTML_PATHS } from './routes.mjs';

const HTML_FILES = DIST_HTML_PATHS;

// Keep only critical app shell preloads on first response.
const NON_CRITICAL_PRELOAD_PATTERNS = [
  /\/assets\/Footer-.*\.js/,
  /\/assets\/ParticleBackground-.*\.js/,
  /\/assets\/Services-.*\.js/,
  /\/assets\/WhyUs-.*\.js/,
  /\/assets\/Team-.*\.js/,
  /\/assets\/FAQ-.*\.js/,
  /\/assets\/Process-.*\.js/,
  /\/assets\/Section-.*\.js/,
  /\/assets\/hapticFeedback-.*\.js/,
  /\/assets\/icons-vendor-.*\.js/,
];

const MODULE_PRELOAD_RE = /<link\s+[^>]*rel="modulepreload"[^>]*href="([^"]+)"[^>]*>/g;

function shouldRemove(href) {
  return NON_CRITICAL_PRELOAD_PATTERNS.some((pattern) => pattern.test(href));
}

function optimizeHtml(filePath) {
  if (!existsSync(filePath)) {
    console.log(`Skipping missing file: ${filePath}`);
    return;
  }

  const html = readFileSync(filePath, 'utf8');
  let removed = 0;
  const transformed = html.replace(MODULE_PRELOAD_RE, (fullMatch, href) => {
    if (shouldRemove(href)) {
      removed += 1;
      return '';
    }
    return fullMatch;
  });

  writeFileSync(filePath, transformed, 'utf8');
  console.log(`Optimized ${filePath}: removed ${removed} non-critical modulepreload link(s).`);
}

for (const file of HTML_FILES) {
  optimizeHtml(file);
}
