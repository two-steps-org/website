# Blog (markdown) and CMS

## Public blog

- **Index:** `/blog`
- **Post:** `/blog/{slug}` — one markdown file per post in `content/blog/{slug}.md`
- **RSS:** `/blog.xml` (generated at build)
- **Drafts:** `draft: true` in frontmatter — excluded from the site, sitemap, and RSS

### Add or edit a post (no CMS)

1. Create or edit `content/blog/your-slug.md`
2. Set frontmatter `slug` to match the filename (without `.md`)
3. Set `draft: false` to publish
4. Commit, push — Netlify rebuilds (~1–2 min)

Run checks locally:

```bash
pnpm test
```

## Manager UI (Decap CMS) — optional

**URL:** `https://cms.twosteps.ai/admin/` (same Netlify site; DNS CNAME `cms` → your Netlify hostname)

The marketing site does **not** link to `/admin/`. `robots.txt` disallows `/admin/`.

### Setup (one time)

1. **DNS:** Add `cms.twosteps.ai` as CNAME to your Netlify site (Cloudflare + Netlify domain settings).
2. **GitHub:** Ensure managers have write access to `two-steps-org/website`.
3. **Decap + GitHub OAuth:** Follow [Decap GitHub backend](https://decapcms.org/docs/github-backend/) — typically Netlify Identity + Git Gateway, or a GitHub OAuth app pointing at your repo.
4. Edit [`public/admin/config.yml`](../public/admin/config.yml) if repo or branch differs.

### Local Decap (optional)

```bash
npx decap-server
```

Uncomment `local_backend: true` in `config.yml` while testing locally.

### After publishing in Decap

Decap commits markdown to `content/blog/`. Netlify builds on push to `main`. New posts appear on `/blog` after deploy completes.

## Build pipeline

Blog routes are discovered from disk (`scripts/load-blog-posts.mjs`), merged into `SITE_ROUTES`, prerendered, and included in `sitemap.xml`. No database or API is required at build time.

## Future CMS / database

If you later use Supabase or another backend, keep the public `BlogPost` shape in `src/lib/blog/types.ts` and either sync to `content/blog/` before build or replace the loader — the React pages and routes can stay the same.
