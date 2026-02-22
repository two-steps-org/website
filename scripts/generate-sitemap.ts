import fs from 'fs';
import path from 'path';
import process from 'process';

const SITE_URL = (process.env.SITE_URL ?? process.env.VITE_SITE_URL ?? 'https://example.com').replace(/\/+$/, '');

interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: 'daily' | 'weekly' | 'monthly' | 'yearly';
  priority: number;
}

const routes: SitemapUrl[] = [
  {
    loc: `${SITE_URL}/`,
    lastmod: new Date().toISOString(),
    changefreq: 'weekly',
    priority: 1.0
  },
  {
    loc: `${SITE_URL}/case-studies`,
    lastmod: new Date().toISOString(),
    changefreq: 'weekly',
    priority: 0.8
  }
];

function generateSitemapXml(urls: SitemapUrl[]): string {
  const urlSet = urls
    .map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`)
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlSet}
</urlset>`;
}

function writeSitemap() {
  const distPath = path.join(process.cwd(), 'dist');
  const sitemapPath = path.join(distPath, 'sitemap.xml');
  
  // Ensure dist directory exists
  if (!fs.existsSync(distPath)) {
    fs.mkdirSync(distPath, { recursive: true });
  }

  const sitemapXml = generateSitemapXml(routes);
  fs.writeFileSync(sitemapPath, sitemapXml, 'utf8');
  
  console.log(`✓ Sitemap generated at ${sitemapPath}`);
}

writeSitemap();
