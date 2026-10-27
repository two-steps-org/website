import type { BlogFrontmatter, BlogPost } from './types';
import { parseFrontmatter } from './parseFrontmatter';
import { readingTimeMinutes } from './readingTime';

const modules = import.meta.glob('../../../content/blog/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

function fileSlugFromPath(path: string): string {
  const name = path.split('/').pop() ?? '';
  return name.replace(/\.md$/, '');
}

function parseRaw(path: string, raw: string): BlogPost {
  const { data, content } = parseFrontmatter(raw);
  const fileSlug = fileSlugFromPath(path);
  const fm = data as Partial<BlogFrontmatter>;
  const slug = String(fm.slug ?? fileSlug).trim();
  const body = content.trim();

  return {
    slug,
    title: String(fm.title ?? '').trim(),
    publishedAt: String(fm.publishedAt ?? '').trim(),
    excerpt: String(fm.excerpt ?? '').trim(),
    draft: Boolean(fm.draft),
    seoTitle: String(fm.seoTitle ?? '').trim(),
    seoDescription: String(fm.seoDescription ?? '').trim(),
    coverImage: String(fm.coverImage ?? '').trim(),
    author: String(fm.author ?? 'Two Steps').trim(),
    tags: Array.isArray(fm.tags) ? fm.tags.map(String) : [],
    body,
    readingTimeMinutes: readingTimeMinutes(body),
  };
}

const allPosts: BlogPost[] = Object.entries(modules)
  .map(([path, raw]) => parseRaw(path, raw))
  .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

export function getAllBlogPosts(): BlogPost[] {
  return allPosts;
}

export function getPublishedBlogPosts(): BlogPost[] {
  return allPosts.filter((post) => !post.draft && post.slug && post.title);
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return allPosts.find((post) => post.slug === slug);
}

export function getBlogSeo(post: BlogPost) {
  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
  };
}
