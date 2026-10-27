/**
 * Validates blog markdown files: filename slug matches frontmatter, drafts excluded from publish list.
 *
 *   node --import tsx src/lib/blog/blog.check.ts
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
// @ts-expect-error routes module is plain JS
import { getPublishedBlogSlugs } from '../../../scripts/load-blog-posts.mjs';

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

assert.ok(fs.existsSync(BLOG_DIR), 'content/blog directory must exist');

const files = fs.readdirSync(BLOG_DIR).filter((name) => name.endsWith('.md'));
assert.ok(files.length > 0, 'at least one blog markdown file required');

const slugsFromFiles = new Set<string>();

for (const name of files) {
  const fileSlug = name.replace(/\.md$/, '');
  const raw = fs.readFileSync(path.join(BLOG_DIR, name), 'utf8');
  const { data } = matter(raw);
  const slug = String(data.slug ?? fileSlug).trim();
  assert.equal(
    slug,
    fileSlug,
    `slug in frontmatter must match filename (${name}): expected "${fileSlug}", got "${slug}"`,
  );
  assert.ok(!slugsFromFiles.has(slug), `duplicate slug: ${slug}`);
  slugsFromFiles.add(slug);
}

const publishedFromScript = getPublishedBlogSlugs();
for (const slug of publishedFromScript) {
  assert.ok(slugsFromFiles.has(slug), `published slug missing from files: ${slug}`);
}

const draftPath = path.join(BLOG_DIR, 'draft-studio-notes.md');
assert.ok(fs.existsSync(draftPath), 'draft sample post should exist');
const draftRaw = fs.readFileSync(draftPath, 'utf8');
assert.ok(matter(draftRaw).data.draft === true, 'draft sample must have draft: true');
assert.ok(
  !publishedFromScript.includes('draft-studio-notes'),
  'draft posts must not appear in published slug list',
);

console.log(`blog.check: ${files.length} files, ${publishedFromScript.length} published`);
