/* global process, console */
import { readFileSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const DIST_DIR = 'dist';
const INDEX_HTML = join(DIST_DIR, 'index.html');
const MAX_PRELOAD_JS_GZIP_KB = Number.parseFloat(process.env.PERF_BUDGET_PRELOAD_GZIP_KB ?? '150');

function toKb(bytes) {
  return bytes / 1024;
}

function collectModulePreloads(indexHtml) {
  const linkRegex = /<link\s+[^>]*rel="modulepreload"[^>]*href="([^"]+\.js)"[^>]*>/g;
  const files = new Set();
  let match = linkRegex.exec(indexHtml);
  while (match) {
    const href = match[1];
    const normalized = href.startsWith('/') ? href.slice(1) : href;
    files.add(normalized);
    match = linkRegex.exec(indexHtml);
  }
  return Array.from(files);
}

function getEffectiveSize(jsPath) {
  const gzipPath = join(DIST_DIR, `${jsPath}.gz`.replace(/^dist\//, ''));
  const rawPath = join(DIST_DIR, jsPath.replace(/^dist\//, ''));

  if (existsSync(gzipPath)) {
    return { bytes: statSync(gzipPath).size, source: 'gzip' };
  }
  return { bytes: statSync(rawPath).size, source: 'raw' };
}

function main() {
  const html = readFileSync(INDEX_HTML, 'utf8');
  const preloadFiles = collectModulePreloads(html);
  const details = preloadFiles.map((file) => {
    const { bytes, source } = getEffectiveSize(file);
    return { file, bytes, source };
  });

  const totalBytes = details.reduce((sum, item) => sum + item.bytes, 0);
  const totalKb = toKb(totalBytes);

  const hasGzip = details.some((item) => item.source === 'gzip');
  const basis = hasGzip ? 'gzip' : 'raw';

  console.log(`Performance budget check (${basis})`);
  console.log(`Modulepreload JS total: ${totalKb.toFixed(2)} KB`);
  console.log(`Budget: ${MAX_PRELOAD_JS_GZIP_KB.toFixed(2)} KB`);
  for (const item of details) {
    console.log(`- ${item.file}: ${toKb(item.bytes).toFixed(2)} KB (${item.source})`);
  }

  if (totalKb > MAX_PRELOAD_JS_GZIP_KB) {
    throw new Error(
      `Performance budget exceeded: ${totalKb.toFixed(2)} KB > ${MAX_PRELOAD_JS_GZIP_KB.toFixed(2)} KB`
    );
  }
}

main();
