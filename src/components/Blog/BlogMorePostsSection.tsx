import { Link } from 'react-router-dom';
import { m } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Scrub from '../common/Scrub';
import type { BlogPost } from '../../lib/blog/types';
import { BlogCompactCard } from './BlogPostBox';
import { reveal } from '../../utils/motion';

type BlogMorePostsSectionProps = {
  posts: BlogPost[];
};

export function BlogMorePostsSection({ posts }: BlogMorePostsSectionProps) {
  if (posts.length === 0) return null;

  return (
    <section className="border-t border-line">
      <div className="ts-container flex flex-col gap-8 py-[clamp(64px,9vw,112px)]">
        <m.div {...reveal()} className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="ts-h2 m-0 text-ink">Keep reading</h2>
          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 text-[15px] font-medium text-muted transition-colors hover:text-ink"
          >
            All writing
            <ArrowRight className="h-4 w-4" />
          </Link>
        </m.div>

        <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 md:grid-cols-2">
          {posts.slice(0, 2).map((post, index) => (
            <Scrub key={post.slug} effect="rise" y={16} delay={index * 0.06}>
              <li className="h-full">
                <BlogCompactCard post={post} />
              </li>
            </Scrub>
          ))}
        </ul>
      </div>
    </section>
  );
}
