import process from 'process';
import {
  DEFAULT_SITE_URL,
  getRobotsDirective,
  isLocalhostUrl,
  LOCAL_HOST_PATTERN,
  normalizeUrl,
  parseSeoEnv,
  type SeoEnv,
} from '../src/lib/seoConstants.ts';

export interface SeoRuntimeConfig {
  seoEnv: SeoEnv;
  isProduction: boolean;
  siteUrl: string;
  robotsDirective: 'index,follow' | 'noindex,nofollow';
}

export function resolveSeoRuntimeConfig(): SeoRuntimeConfig {
  const seoEnv = parseSeoEnv(process.env.SEO_ENV ?? process.env.VITE_SEO_ENV, 'production');
  const isProduction = seoEnv === 'production';
  const rawSiteUrl = (
    process.env.SITE_URL ??
    process.env.VITE_SITE_URL ??
    process.env.URL ??
    process.env.DEPLOY_PRIME_URL ??
    ''
  ).trim();

  if (isProduction && !rawSiteUrl && process.env.NETLIFY === 'true') {
    console.warn(
      `SEO config: missing SITE_URL/VITE_SITE_URL/URL/DEPLOY_PRIME_URL, falling back to default ${DEFAULT_SITE_URL}`
    );
  } else if (isProduction && !rawSiteUrl) {
    throw new Error(
      'Missing SITE_URL/VITE_SITE_URL/URL/DEPLOY_PRIME_URL for production SEO build. Example: VITE_SITE_URL=https://twosteps.ai'
    );
  }

  const siteUrl = normalizeUrl(rawSiteUrl || DEFAULT_SITE_URL);

  let parsed: URL;
  try {
    parsed = new URL(siteUrl);
  } catch {
    throw new Error(`Invalid SITE_URL value: "${siteUrl}". Expected absolute URL, e.g. https://twosteps.ai`);
  }

  if (!/^https?:$/.test(parsed.protocol)) {
    throw new Error(`Invalid SITE_URL protocol: "${parsed.protocol}". Use http:// or https://`);
  }

  if (isProduction && isLocalhostUrl(siteUrl)) {
    throw new Error(`Invalid production SITE_URL: "${siteUrl}". Localhost URLs are not allowed in production SEO builds.`);
  }

  const robotsDirective = getRobotsDirective(isProduction);

  return {
    seoEnv,
    isProduction,
    siteUrl,
    robotsDirective,
  };
}

export function assertAbsoluteNonLocalhostUrl(value: string, label: string): void {
  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    throw new Error(`${label} must be an absolute URL. Received: "${value}"`);
  }

  if (!/^https?:$/.test(parsed.protocol)) {
    throw new Error(`${label} must use http/https protocol. Received: "${value}"`);
  }

  if (LOCAL_HOST_PATTERN.test(parsed.hostname)) {
    throw new Error(`${label} must not use localhost/loopback. Received: "${value}"`);
  }
}
