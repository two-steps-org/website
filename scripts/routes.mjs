import { join } from 'node:path';

// Keep in sync with the `slug` field in src/components/CaseStudies/data.ts.
// src/components/CaseStudies/tone.check.ts asserts the two lists match.
export const CASE_STUDY_SLUGS = [
  'task-automation-google-calendar',
  'ai-chat-agent-barber',
  'ai-sdr-call-agent',
  'custom-saas-logistics',
  'crm-accounting-firm',
];

export const SITE_ROUTES = [
  '/',
  '/case-studies',
  ...CASE_STUDY_SLUGS.map((slug) => `/case-studies/${slug}`),
];

export function distHtmlPath(route) {
  if (route === '/') return join('dist', 'index.html');
  return join('dist', route.slice(1), 'index.html');
}

export const DIST_HTML_PATHS = SITE_ROUTES.map(distHtmlPath);
