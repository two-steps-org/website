import type { Tone } from './types';

/**
 * Tone fields are the only place colour is allowed in the 2026 system: they
 * grade photographic surfaces (case grounds, hero panels) light → deep.
 * Headlines only ever sit on the deep end, over a scrim — white on the light
 * end of Sand is 1.8:1 and would fail contrast.
 */
export const TONE_CSS: Record<Tone, string> = {
  ember: 'linear-gradient(160deg, var(--tone-ember) 0%, var(--tone-ember-deep) 55%, #2c1a0e 100%)',
  ocean: 'linear-gradient(160deg, var(--tone-ocean) 0%, var(--tone-ocean-deep) 70%, #0a0a0c 100%)',
  sand: 'linear-gradient(160deg, var(--tone-sand) 0%, var(--tone-sand-deep) 55%, #2c1a0e 100%)',
  moss: 'linear-gradient(160deg, var(--tone-moss) 0%, var(--tone-moss-deep) 60%, #0a0a0c 100%)',
};

export const toneCss = (tone: Tone) => TONE_CSS[tone] ?? TONE_CSS.ocean;

/** Parsed shape of a metric string such as `"+70%"`, `"-95%"` or `"18,400"`. */
export interface ParsedMetric {
  readonly prefix: string;
  readonly value: number;
  readonly suffix: string;
}

/**
 * Splits a display metric into a number plus its surrounding glyphs so the
 * figure can be counted up while the `+`/`-`/`%` stay put.
 *
 * Returns null for values that carry no number (e.g. "N/A"), letting the
 * caller fall back to rendering the raw string.
 */
export const parseMetric = (raw: string): ParsedMetric | null => {
  const match = raw.trim().match(/^([^\d-]*)(-?[\d.,]+)(.*)$/);
  if (!match) return null;
  const value = Number(match[2].replace(/,/g, ''));
  if (!Number.isFinite(value)) return null;
  return { prefix: match[1], value, suffix: match[3] };
};
