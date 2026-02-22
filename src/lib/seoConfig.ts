const DEFAULT_SITE_URL = 'https://twosteps.ai';

export type SeoEnv = 'production' | 'staging' | 'development';

const normalizeUrl = (value: string): string => value.replace(/\/+$/, '');

const parseSeoEnv = (value?: string): SeoEnv => {
  const normalized = (value ?? '').trim().toLowerCase();
  if (normalized === 'production' || normalized === 'staging' || normalized === 'development') {
    return normalized;
  }
  return import.meta.env.MODE === 'production' ? 'production' : 'development';
};

export const SEO_ENV: SeoEnv = parseSeoEnv(import.meta.env.VITE_SEO_ENV);
export const IS_PRODUCTION_SEO = SEO_ENV === 'production';

const configuredSiteUrl = import.meta.env.VITE_SITE_URL?.trim() ?? '';
export const SITE_URL = normalizeUrl(configuredSiteUrl || DEFAULT_SITE_URL);

export const getRobotsDirective = (): string => (IS_PRODUCTION_SEO ? 'index,follow' : 'noindex,nofollow');

