import process from 'process';

export type SeoEnv = 'production' | 'staging' | 'development';

const DEFAULT_SITE_URL = 'https://twosteps.ai';
const LOCAL_HOST_PATTERN = /^(localhost|127\.0\.0\.1|0\.0\.0\.0)$/i;

const normalizeUrl = (value: string): string => value.replace(/\/+$/, '');

function parseSeoEnv(value?: string): SeoEnv {
  const normalized = (value ?? '').trim().toLowerCase();
  if (normalized === 'production' || normalized === 'staging' || normalized === 'development') {
    return normalized;
  }
  return 'production';
}

function isLocalhostUrl(value: string): boolean {
  try {
    const host = new URL(value).hostname;
    return LOCAL_HOST_PATTERN.test(host);
  } catch {
    return false;
  }
}

export interface SeoRuntimeConfig {
  seoEnv: SeoEnv;
  isProduction: boolean;
  siteUrl: string;
  robotsDirective: 'index,follow' | 'noindex,nofollow';
}

export function resolveSeoRuntimeConfig(): SeoRuntimeConfig {
  const seoEnv = parseSeoEnv(process.env.SEO_ENV ?? process.env.VITE_SEO_ENV);
  const isProduction = seoEnv === 'production';
  const rawSiteUrl = (process.env.SITE_URL ?? process.env.VITE_SITE_URL ?? '').trim();

  if (isProduction && !rawSiteUrl) {
    throw new Error(
      'Missing VITE_SITE_URL/SITE_URL for production SEO build. Example: VITE_SITE_URL=https://twosteps.ai'
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

  const robotsDirective = isProduction ? 'index,follow' : 'noindex,nofollow';

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

