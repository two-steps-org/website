/**
 * Per-study SEO metadata for /case-studies/<slug>.
 *
 * Held here rather than imported from CaseStudies/data.ts so the case-study
 * records stay out of the main bundle. tone.check.ts asserts every slug in
 * data.ts has an entry here with a matching title.
 */
export const CASE_STUDY_META: Record<string, { title: string; description: string }> = {};
