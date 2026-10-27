import { join } from 'node:path';
import { getPublishedBlogSlugs } from './load-blog-posts.mjs';

// Keep in sync with the `slug` field in src/components/CaseStudies/data.ts.
// src/components/CaseStudies/tone.check.ts asserts the two lists match.
export const CASE_STUDY_SLUGS = [];

// Keep in sync with the `id` field in src/data/services.ts.
export const SERVICE_SLUGS = [
  'ai-chat-agents',
  'ai-voice-agents',
  'crm-development',
  'custom-saas-solutions',
];

export const BLOG_SLUGS = getPublishedBlogSlugs();

export const SITE_ROUTES = [
  '/',
  '/services',
  ...SERVICE_SLUGS.map((slug) => `/services/${slug}`),
  '/about',
  '/case-studies',
  ...CASE_STUDY_SLUGS.map((slug) => `/case-studies/${slug}`),
  '/blog',
  ...BLOG_SLUGS.map((slug) => `/blog/${slug}`),
];

export function distHtmlPath(route) {
  if (route === '/') return join('dist', 'index.html');
  return join('dist', route.slice(1), 'index.html');
}

export const DIST_HTML_PATHS = SITE_ROUTES.map(distHtmlPath);
