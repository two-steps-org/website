/* global console */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const HTML_FILES = [
  join('dist', 'index.html'),
  join('dist', 'case-studies', 'index.html'),
];

const STYLESHEET_LINK_RE =
  /<link\s+([^>]*?)rel="stylesheet"([^>]*?)href="([^"]+\.css)"([^>]*?)>/g;

function toPreloadLink(fullMatch, beforeRel, afterRel, href, trailingAttrs) {
  // Keep any existing attributes (e.g. crossorigin) while converting to non-blocking CSS loading.
  const attrs = `${beforeRel}${afterRel}${trailingAttrs}`.trim();
  const normalizedAttrs = attrs ? ` ${attrs}` : '';
  return `<link rel="preload" as="style" href="${href}"${normalizedAttrs} onload="this.onload=null;this.rel='stylesheet'"><noscript><link rel="stylesheet" href="${href}"${normalizedAttrs}></noscript>`;
}

function processHtmlFile(filePath) {
  if (!existsSync(filePath)) {
    console.log(`Skipping missing file: ${filePath}`);
    return;
  }

  const original = readFileSync(filePath, 'utf8');
  let replacements = 0;

  const transformed = original.replace(STYLESHEET_LINK_RE, (...args) => {
    replacements += 1;
    return toPreloadLink(args[0], args[1], args[2], args[3], args[4]);
  });

  if (replacements > 0) {
    writeFileSync(filePath, transformed, 'utf8');
  }

  console.log(`Optimized ${filePath}: ${replacements} stylesheet link(s) converted.`);
}

for (const htmlFile of HTML_FILES) {
  processHtmlFile(htmlFile);
}
