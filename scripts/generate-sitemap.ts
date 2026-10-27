import fs from 'fs';
import path from 'path';
import process from 'process';
import { resolveSeoRuntimeConfig } from './seo-config';
import { SITE_ROUTES } from './routes.mjs';
import { getBlogLastmodBySlug, getPublishedBlogPosts } from './load-blog-posts.mjs';

const seoConfig = resolveSeoRuntimeConfig();
const SITE_URL = seoConfig.siteUrl;
const blogLastmod = getBlogLastmodBySlug();

interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: 'daily' | 'weekly' | 'monthly' | 'yearly';
  priority: number;
}

function routeMeta(route: string, index: number): Omit<SitemapUrl, 'loc'> {
  const blogMatch = /^\/blog\/(.+)$/.exec(route);
  if (blogMatch) {
    const slug = blogMatch[1];
    return {
      lastmod: blogLastmod.get(slug) ?? new Date().toISOString(),
      changefreq: 'monthly',
      priority: 0.7,
    };
  }
  if (route === '/blog') {
    return {
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: 0.75,
    };
  }
  return {
    lastmod: new Date().toISOString(),
    changefreq: 'weekly',
    priority: index === 0 ? 1.0 : 0.8,
  };
}

const routes: SitemapUrl[] = SITE_ROUTES.map((route, index) => ({
  loc: route === '/' ? `${SITE_URL}/` : `${SITE_URL}${route}`,
  ...routeMeta(route, index),
}));

function generateSitemapXml(urls: SitemapUrl[]): string {
  const urlSet = urls
    .map(
      (url) => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`,
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlSet}
</urlset>`;
}

function writeSitemap() {
  const distPath = path.join(process.cwd(), 'dist');
  const sitemapPath = path.join(distPath, 'sitemap.xml');

  if (!fs.existsSync(distPath)) {
    fs.mkdirSync(distPath, { recursive: true });
  }

  const sitemapXml = generateSitemapXml(routes);
  fs.writeFileSync(sitemapPath, sitemapXml, 'utf8');

  console.log(`✓ Sitemap generated at ${sitemapPath}`);
}

function writeRobotsTxt() {
  const distPath = path.join(process.cwd(), 'dist');
  const robotsPath = path.join(distPath, 'robots.txt');
  const crawlDirective = seoConfig.isProduction ? 'Allow: /' : 'Disallow: /';
  const robotsLines = [
    'User-agent: *',
    crawlDirective,
    '',
    'Disallow: /admin/',
    '',
    `Sitemap: ${SITE_URL}/sitemap.xml`,
  ];
  const robotsTxt = `${robotsLines.join('\n')}\n`;

  fs.writeFileSync(robotsPath, robotsTxt, 'utf8');
  console.log(`✓ robots.txt generated at ${robotsPath}`);
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function writeRssFeed() {
  const posts = getPublishedBlogPosts();
  const distPath = path.join(process.cwd(), 'dist');
  const rssPath = path.join(distPath, 'blog.xml');

  const items = posts
    .map((post) => {
      const link = `${SITE_URL}/blog/${post.slug}`;
      const pubDate = post.publishedAt
        ? new Date(`${post.publishedAt}T12:00:00Z`).toUTCString()
        : new Date().toUTCString();
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(post.excerpt)}</description>
    </item>`;
    })
    .join('\n');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Two Steps AI — Blog</title>
    <link>${SITE_URL}/blog</link>
    <description>Notes from the Two Steps studio.</description>
    <language>en-us</language>
${items}
  </channel>
</rss>
`;

  fs.writeFileSync(rssPath, rss, 'utf8');
  console.log(`✓ RSS feed generated at ${rssPath}`);
}

writeSitemap();
writeRobotsTxt();
writeRssFeed();
