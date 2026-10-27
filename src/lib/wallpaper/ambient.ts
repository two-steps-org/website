import {
  BLOG_PALETTES,
  ROUTE_PALETTE_ID,
  TONE_CSS,
  paletteIdFromSlug,
  type ToneKey,
} from './palettes.mjs';

export type AccentBlob = { cx: number; cy: number; r: number; tone: ToneKey };

/** Same soft blobs as blog cover SVGs, as CSS radials (blurred in BackgroundGradient). */
export function meshBackgroundFromAccents(accents: AccentBlob[]): string {
  return accents
    .map(({ cx, cy, r, tone }) => {
      const color = TONE_CSS[tone];
      const rx = `${r}%`;
      const ry = `${(r * 0.72).toFixed(1)}%`;
      return `radial-gradient(ellipse ${rx} ${ry} at ${cx}% ${cy}%, color-mix(in srgb, ${color} 82%, transparent) 0%, transparent 72%)`;
    })
    .join(', ');
}

export type AmbientPreset = {
  id: string;
  mesh: string;
};

export function resolveAmbientPreset(pathname: string): AmbientPreset {
  const path = pathname.replace(/\/+$/, '') || '/';
  let paletteId: string;

  if (path === '/') paletteId = ROUTE_PALETTE_ID.home;
  else if (path === '/about') paletteId = ROUTE_PALETTE_ID.about;
  else if (path === '/services') paletteId = ROUTE_PALETTE_ID.services;
  else if (path.startsWith('/services/')) paletteId = paletteIdFromSlug(path.slice('/services/'.length));
  else if (path === '/case-studies') paletteId = ROUTE_PALETTE_ID['case-studies'];
  else if (path.startsWith('/case-studies/')) paletteId = paletteIdFromSlug(path.slice('/case-studies/'.length));
  else if (path === '/blog') paletteId = ROUTE_PALETTE_ID.blog;
  else if (path.startsWith('/blog/')) paletteId = paletteIdFromSlug(path.slice('/blog/'.length));
  else paletteId = ROUTE_PALETTE_ID.home;

  const accents = BLOG_PALETTES[paletteId] ?? BLOG_PALETTES[ROUTE_PALETTE_ID.home];
  return {
    id: paletteId,
    mesh: meshBackgroundFromAccents(accents),
  };
}

export const AMBIENT_VIGNETTE =
  'radial-gradient(ellipse 85% 75% at 50% 42%, rgba(10,10,12,0) 0%, rgba(10,10,12,0.35) 55%, rgba(10,10,12,0.55) 100%)';

export const AMBIENT_FLOOR =
  'radial-gradient(ellipse 75% 50% at 50% 100%, color-mix(in srgb, var(--tone-sand) 14%, transparent), transparent 70%)';
