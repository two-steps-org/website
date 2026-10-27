import Scrub from '../common/Scrub';
import type { BlogPost } from '../../lib/blog/types';
import { BlogCompactCard, BlogFeaturedCard } from './BlogPostBox';

type BlogIndexTableProps = {
  posts: BlogPost[];
};

export function BlogIndexTable({ posts }: BlogIndexTableProps) {
  const [featured, ...rest] = posts;

  return (
    <div className="flex flex-col gap-10 md:gap-12">
      {featured ? (
        <Scrub effect="rise" y={20}>
          <BlogFeaturedCard post={featured} />
        </Scrub>
      ) : null}

      {rest.length > 0 ? (
        <div className="flex flex-col gap-6 border-t border-line pt-10 md:pt-12">
          <div className="flex items-end justify-between gap-4">
            <h2 className="ts-h3 m-0 text-ink">Earlier</h2>
            <p className="ts-eyebrow m-0 text-muted">{rest.length} posts</p>
          </div>
          <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((post, index) => (
              <Scrub key={post.slug} effect="rise" y={16} delay={index * 0.04}>
                <li className="h-full">
                  <BlogCompactCard post={post} />
                </li>
              </Scrub>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
