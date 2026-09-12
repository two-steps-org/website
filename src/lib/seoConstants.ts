export type SeoEnv = 'production' | 'staging' | 'development';

export const DEFAULT_SITE_URL = 'https://twosteps.ai';
export const LOCAL_HOST_PATTERN = /^(localhost|127\.0\.0\.1|0\.0\.0\.0)$/i;

export const normalizeUrl = (value: string): string => value.replace(/\/+$/, '');

export function parseSeoEnv(value: string | undefined, fallback: SeoEnv): SeoEnv {
  const normalized = (value ?? '').trim().toLowerCase();
  if (normalized === 'production' || normalized === 'staging' || normalized === 'development') {
    return normalized;
  }
  return fallback;
}

export function getRobotsDirective(isProduction: boolean): 'index,follow' | 'noindex,nofollow' {
  return isProduction ? 'index,follow' : 'noindex,nofollow';
}

export function isLocalhostUrl(value: string): boolean {
  try {
    return LOCAL_HOST_PATTERN.test(new URL(value).hostname);
  } catch {
    return false;
  }
}
