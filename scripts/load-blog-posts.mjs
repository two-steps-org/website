import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

function normalizeDateField(value) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }
  return String(value ?? '').trim();
}

function readingTimeMinutes(text) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function parsePostFile(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(raw);
  const fileSlug = path.basename(filePath, '.md');
  const slug = String(data.slug ?? fileSlug).trim();

  return {
    slug,
    fileSlug,
    filePath,
    title: String(data.title ?? '').trim(),
    excerpt: String(data.excerpt ?? '').trim(),
    publishedAt: normalizeDateField(data.publishedAt),
    draft: Boolean(data.draft),
    seoTitle: String(data.seoTitle ?? '').trim(),
    seoDescription: String(data.seoDescription ?? '').trim(),
    coverImage: String(data.coverImage ?? '').trim(),
    author: String(data.author ?? 'Two Steps').trim(),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    body: content.trim(),
    readingTimeMinutes: readingTimeMinutes(content),
    lastmod: fs.statSync(filePath).mtime.toISOString(),
  };
}

export function loadAllBlogPosts() {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((name) => name.endsWith('.md'))
    .map((name) => parsePostFile(path.join(BLOG_DIR, name)))
    .sort((a, b) => (b.publishedAt || '').localeCompare(a.publishedAt || ''));
}

export function getPublishedBlogPosts() {
  return loadAllBlogPosts().filter((post) => !post.draft && post.slug && post.title);
}

export function getPublishedBlogSlugs() {
  return getPublishedBlogPosts().map((post) => post.slug);
}

/** @returns {Map<string, string>} slug → ISO lastmod */
export function getBlogLastmodBySlug() {
  const map = new Map();
  for (const post of getPublishedBlogPosts()) {
    let lastmod = post.lastmod;
    if (post.publishedAt) {
      const parsed = new Date(`${post.publishedAt}T12:00:00Z`);
      if (!Number.isNaN(parsed.getTime())) {
        lastmod = parsed.toISOString();
      }
    }
    map.set(post.slug, lastmod);
  }
  return map;
}
