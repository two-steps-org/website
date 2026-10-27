import { Link } from 'react-router-dom';
import { m } from 'framer-motion';
import type { BlogPost } from '../../lib/blog/types';
import { formatBlogDate } from '../../lib/blog/formatBlogDate';
import { enter, enterItem } from '../../utils/motion';

type BlogPostHeroProps = {
  post: BlogPost;
};

export function BlogPostHero({ post }: BlogPostHeroProps) {
  const cover = post.coverImage?.trim();
  const date = formatBlogDate(post.publishedAt);

  return (
    <section
      className="relative isolate flex min-h-[min(68vh,720px)] flex-col justify-end overflow-hidden pb-[clamp(48px,10vh,88px)]"
      style={{ paddingTop: 'calc(var(--header-height) + 4rem)' }}
    >
      <div aria-hidden className="absolute inset-0 -z-10">
        {cover ? (
          <img
            src={cover}
            alt=""
            className="h-full w-full scale-[1.06] object-cover blur-[6px] brightness-[0.92]"
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(ellipse 50% 45% at 22% 18%, color-mix(in srgb, var(--tone-ember) 55%, transparent), transparent 70%),
                radial-gradient(ellipse 45% 40% at 80% 70%, var(--tone-ocean-deep), transparent 72%)`,
            }}
          />
        )}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, rgba(10,10,12,0.96) 0%, rgba(10,10,12,0.5) 48%, rgba(10,10,12,0.18) 100%)',
          }}
        />
      </div>

      <div className="ts-container flex flex-col gap-[clamp(18px,3.2vw,32px)]">
        <m.nav {...enter(0)} aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2.5 text-sm text-muted">
          <Link to="/" className="transition-colors hover:text-ink">
            Home
          </Link>
          <span aria-hidden>/</span>
          <Link to="/blog" className="transition-colors hover:text-ink">
            Writing
          </Link>
          <span aria-hidden>/</span>
          <span className="text-ink">{date.long}</span>
        </m.nav>

        <m.h1
          {...enter(0.08)}
          className="ts-display m-0 max-w-[14ch] text-[clamp(2.25rem,5.5vw,4rem)] leading-[1.03] text-ink"
        >
          {post.title}
        </m.h1>

        {post.excerpt ? (
          <m.p {...enter(0.16)} className="m-0 max-w-[48ch] text-[clamp(17px,1.45vw,20px)] leading-[1.55] text-muted">
            {post.excerpt}
          </m.p>
        ) : null}

        {post.tags.length > 0 ? (
          <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
            {post.tags.map((chip, i) => (
              <m.li
                key={chip}
                {...enterItem(i, 0.28)}
                className="ts-glass inline-flex h-9 items-center rounded-full px-3.5 text-[13px] font-medium text-ink"
              >
                {chip}
              </m.li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
