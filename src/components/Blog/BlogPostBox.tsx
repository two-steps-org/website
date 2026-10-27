import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { BlogPost } from '../../lib/blog/types';
import { formatBlogDate } from '../../lib/blog/formatBlogDate';

function BoxCover({ post, className = '' }: { post: BlogPost; className?: string }) {
  const cover = post.coverImage?.trim();
  return (
    <div className={`relative w-full overflow-hidden bg-surface ${className}`}>
      {cover ? (
        <img
          src={cover}
          alt=""
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          loading="lazy"
        />
      ) : (
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 75% 65% at 28% 32%, var(--tone-ember), transparent 68%),
              radial-gradient(ellipse 70% 60% at 78% 68%, var(--tone-ocean-deep), transparent 70%)`,
          }}
        />
      )}
    </div>
  );
}

type BlogFeaturedCardProps = {
  post: BlogPost;
};

export function BlogFeaturedCard({ post }: BlogFeaturedCardProps) {
  const date = formatBlogDate(post.publishedAt);

  return (
    <Link
      to={`/blog/${post.slug}`}
      className="blog-card group grid grid-cols-1 overflow-hidden rounded-card border border-line bg-surface/30 shadow-sm transition-[border-color,box-shadow,background-color] duration-300 hover:border-line-strong hover:bg-surface/50 hover:shadow-md lg:grid-cols-[minmax(0,1.08fr)_minmax(0,1fr)] lg:items-stretch"
    >
      <BoxCover
        post={post}
        className="aspect-[16/10] border-b border-line lg:aspect-auto lg:min-h-[min(320px,42vh)] lg:border-b-0 lg:border-r"
      />
      <div className="flex flex-col justify-center gap-5 p-6 sm:p-8 lg:p-10">
        <p className="ts-eyebrow m-0 text-muted">Latest</p>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted">
          <time dateTime={post.publishedAt}>{date.long}</time>
          <span aria-hidden>·</span>
          <span>{post.readingTimeMinutes} min read</span>
          {post.tags[0] ? (
            <>
              <span aria-hidden className="hidden sm:inline">
                ·
              </span>
              <span className="rounded-full border border-line px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-muted">
                {post.tags[0]}
              </span>
            </>
          ) : null}
        </div>
        <h2 className="ts-display m-0 max-w-[16ch] text-[clamp(1.75rem,4vw,2.65rem)] leading-[1.06] text-ink">
          {post.title}
        </h2>
        <p className="m-0 max-w-[48ch] text-[17px] leading-[1.55] text-muted">{post.excerpt}</p>
        <span className="ts-pill-ghost mt-1 h-11 w-fit px-5 text-[15px]">
          Read article
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}

type BlogCompactCardProps = {
  post: BlogPost;
};

export function BlogCompactCard({ post }: BlogCompactCardProps) {
  const date = formatBlogDate(post.publishedAt);

  return (
    <Link
      to={`/blog/${post.slug}`}
      className="blog-card group flex h-full flex-col overflow-hidden rounded-nested border border-line bg-surface/25 transition-[border-color,box-shadow,transform,background-color] duration-300 hover:-translate-y-0.5 hover:border-line-strong hover:bg-surface/45 hover:shadow-sm"
    >
      <BoxCover post={post} className="aspect-[16/10] border-b border-line" />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center justify-between gap-2">
          <time dateTime={post.publishedAt} className="ts-eyebrow m-0 text-muted">
            {date.long}
          </time>
          <span className="text-sm tabular-nums text-muted">{post.readingTimeMinutes} min</span>
        </div>
        <h2 className="ts-h3 m-0 line-clamp-2 text-[18px] leading-[1.25] text-ink">{post.title}</h2>
        <p className="m-0 line-clamp-2 flex-1 text-[15px] leading-[1.5] text-muted">{post.excerpt}</p>
      </div>
    </Link>
  );
}
