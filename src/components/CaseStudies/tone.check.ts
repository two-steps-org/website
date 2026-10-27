/**
 * Self-check for the metric parser.
 *
 * The case-study outcome counters animate a number while keeping its
 * surrounding glyphs fixed, so `parseMetric` has to split strings like "+70%"
 * and "-95%" correctly or the figures render wrong. Run it with:
 *
 *   node --import tsx src/components/CaseStudies/tone.check.ts
 */
import assert from 'node:assert/strict';
import { parseMetric, toneCss, TONE_CSS } from './tone';
import { caseStudies } from './data';
import { CASE_STUDY_META } from './seoMeta';
// routes.mjs is plain JavaScript shared with the prerender script.
// @ts-expect-error no declaration file for the routes module
import { CASE_STUDY_SLUGS } from '../../../scripts/routes.mjs';

// Sign is kept as a prefix so the count-up animates 0 → 70, not 0 → "+70".
assert.deepEqual(parseMetric('+70%'), { prefix: '+', value: 70, suffix: '%' });

// A leading minus belongs to the number, not the prefix, so it counts down.
assert.deepEqual(parseMetric('-95%'), { prefix: '', value: -95, suffix: '%' });

// No sign at all.
assert.deepEqual(parseMetric('80%'), { prefix: '', value: 80, suffix: '%' });

// Thousands separators must not truncate the value at the comma.
assert.deepEqual(parseMetric('18,400'), { prefix: '', value: 18400, suffix: '' });

// Decimals and a trailing unit with a space.
assert.deepEqual(parseMetric('99.9%'), { prefix: '', value: 99.9, suffix: '%' });
assert.deepEqual(parseMetric('6 h'), { prefix: '', value: 6, suffix: ' h' });

// Whitespace is tolerated.
assert.deepEqual(parseMetric('  +25% '), { prefix: '+', value: 25, suffix: '%' });

// Values with no number fall back to the raw string at the call site.
assert.equal(parseMetric('N/A'), null);
assert.equal(parseMetric(''), null);

// Every tone resolves, and an unknown one degrades to a real gradient rather
// than undefined (the value is interpolated straight into a style attribute).
for (const tone of Object.keys(TONE_CSS) as (keyof typeof TONE_CSS)[]) {
  assert.ok(toneCss(tone).startsWith('linear-gradient('), `${tone} must be a gradient`);
}

// ── Case-study slugs must agree across three places ───────────────────────
// data.ts owns the slug; routes.mjs drives prerender/sitemap/SEO-verify; and
// seoMeta.ts supplies each page's title. A mismatch means a 404, an
// unprerendered page, or a duplicated homepage title — none of which are
// obvious at a glance, so assert it.
const dataSlugs = caseStudies.map((study) => study.slug);

assert.deepEqual(
  [...dataSlugs].sort(),
  [...CASE_STUDY_SLUGS].sort(),
  'scripts/routes.mjs CASE_STUDY_SLUGS is out of sync with data.ts slugs',
);

assert.equal(new Set(dataSlugs).size, dataSlugs.length, 'case-study slugs must be unique');

for (const study of caseStudies) {
  for (const metric of study.metrics ?? []) {
    assert.ok(metric.source.trim().length > 8, `"${study.slug}" metric "${metric.label}" has no source; unsourced numbers do not ship`);
  }
  const meta = CASE_STUDY_META[study.slug];
  assert.ok(meta, `seoMeta.ts is missing an entry for "${study.slug}"`);
  assert.equal(meta.title, study.title, `seoMeta.ts title drifted for "${study.slug}"`);
  assert.ok(meta.description.length > 50, `seoMeta.ts description too short for "${study.slug}"`);
}

assert.deepEqual(
  Object.keys(CASE_STUDY_META).sort(),
  [...dataSlugs].sort(),
  'seoMeta.ts has entries for slugs that no longer exist',
);

console.log('tone.check: all assertions passed');
