import fs from 'node:fs';
import path from 'node:path';
import { BLOG_PALETTES, TONE_HEX } from '../src/lib/wallpaper/palettes.mjs';

const OUT = path.join(process.cwd(), 'public', 'blog', 'covers');

function svgFor(slug, accents) {
  const blobs = accents
    .map(
      ({ cx, cy, r, tone }) =>
        `<ellipse cx="${cx}%" cy="${cy}%" rx="${r}%" ry="${r * 0.72}%" fill="${TONE_HEX[tone]}" opacity="0.85" filter="url(#blur)"/>`,
    )
    .join('\n  ');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" width="1200" height="675" role="img" aria-hidden="true">
  <defs>
    <filter id="blur" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="48"/>
    </filter>
    <radialGradient id="vig" cx="50%" cy="50%" r="70%">
      <stop offset="0.35" stop-color="#000" stop-opacity="0"/>
      <stop offset="1" stop-color="#000" stop-opacity="0.65"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="675" fill="#0a0a0c"/>
  ${blobs}
  <rect width="1200" height="675" fill="url(#vig)"/>
</svg>`;
}

fs.mkdirSync(OUT, { recursive: true });
for (const [slug, accents] of Object.entries(BLOG_PALETTES)) {
  fs.writeFileSync(path.join(OUT, `${slug}.svg`), svgFor(slug, accents));
}
console.log(`Wrote ${Object.keys(BLOG_PALETTES).length} covers to ${OUT}`);
