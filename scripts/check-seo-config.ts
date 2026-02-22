import { resolveSeoRuntimeConfig } from './seo-config';

const config = resolveSeoRuntimeConfig();
console.log(`✓ SEO config validated (${config.seoEnv}) for ${config.siteUrl}`);

