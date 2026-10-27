/**
 * Shared blob layouts for blog covers + site ambient wallpaper.
 * Tone keys map to --tone-* in CSS and TONE_HEX for SVG generation.
 */

/** @typedef {'ember' | 'emberDeep' | 'ocean' | 'oceanDeep' | 'moss' | 'mossDeep' | 'sand' | 'sandDeep'} ToneKey */

/** @typedef {{ cx: number; cy: number; r: number; tone: ToneKey }} AccentBlob */

export const TONE_HEX = {
  ember: '#c86a3a',
  emberDeep: '#5c2a14',
  ocean: '#3f6f86',
  oceanDeep: '#12303f',
  moss: '#6f7f5a',
  mossDeep: '#2c3622',
  sand: '#d9b27c',
  sandDeep: '#7a5a2e',
};

export const TONE_CSS = {
  ember: 'var(--tone-ember)',
  emberDeep: 'var(--tone-ember-deep)',
  ocean: 'var(--tone-ocean)',
  oceanDeep: 'var(--tone-ocean-deep)',
  moss: 'var(--tone-moss)',
  mossDeep: 'var(--tone-moss-deep)',
  sand: 'var(--tone-sand)',
  sandDeep: 'var(--tone-sand-deep)',
};

/** @type {Record<string, AccentBlob[]>} */
export const BLOG_PALETTES = {
  'building-ai-systems-that-ship': [
    { cx: 22, cy: 28, r: 55, tone: 'ember' },
    { cx: 78, cy: 18, r: 48, tone: 'oceanDeep' },
    { cx: 70, cy: 72, r: 42, tone: 'emberDeep' },
  ],
  'scoping-before-models': [
    { cx: 18, cy: 55, r: 52, tone: 'ocean' },
    { cx: 82, cy: 40, r: 50, tone: 'oceanDeep' },
    { cx: 45, cy: 15, r: 28, tone: 'ember' },
  ],
  'integrations-that-outlast-pilots': [
    { cx: 30, cy: 22, r: 48, tone: 'moss' },
    { cx: 75, cy: 65, r: 55, tone: 'mossDeep' },
    { cx: 88, cy: 25, r: 32, tone: 'sand' },
  ],
  'guardrails-in-production': [
    { cx: 25, cy: 70, r: 50, tone: 'ember' },
    { cx: 60, cy: 30, r: 45, tone: 'emberDeep' },
    { cx: 85, cy: 55, r: 38, tone: 'oceanDeep' },
  ],
  'handoff-checklist-for-ai-teams': [
    { cx: 20, cy: 35, r: 46, tone: 'sand' },
    { cx: 55, cy: 75, r: 44, tone: 'sandDeep' },
    { cx: 80, cy: 20, r: 36, tone: 'ocean' },
  ],
  'when-not-to-build-custom-ai': [
    { cx: 50, cy: 50, r: 58, tone: 'oceanDeep' },
    { cx: 28, cy: 25, r: 35, tone: 'ember' },
    { cx: 72, cy: 78, r: 30, tone: 'moss' },
  ],
};

/** Static routes → palette id (key in BLOG_PALETTES or custom). */
export const ROUTE_PALETTE_ID = {
  home: 'building-ai-systems-that-ship',
  about: 'integrations-that-outlast-pilots',
  services: 'scoping-before-models',
  'case-studies': 'guardrails-in-production',
  blog: 'handoff-checklist-for-ai-teams',
};

const PALETTE_IDS = Object.keys(BLOG_PALETTES);

/** @param {string} slug */
export function paletteIdFromSlug(slug) {
  if (BLOG_PALETTES[slug]) return slug;
  let n = 0;
  for (let i = 0; i < slug.length; i += 1) n = (n + slug.charCodeAt(i)) % 997;
  return PALETTE_IDS[n % PALETTE_IDS.length];
}
