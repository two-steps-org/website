import React, { useLayoutEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { m } from 'framer-motion';
import SplitText from '../components/common/SplitText';
import Scrub from '../components/common/Scrub';
import { BlogIndexTable } from '../components/Blog/BlogIndexTable';
import { CaseStudyClosingCta } from '../components/CaseStudies/CaseStudyDetailSections';
import { enter } from '../utils/motion';
import { getPublishedBlogPosts } from '../lib/blog/posts';

const Blog: React.FC = () => {
  const posts = getPublishedBlogPosts();

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, []);

  const siteUrl = (import.meta.env.VITE_SITE_URL?.trim() || 'https://twosteps.ai').replace(/\/+$/, '');

  return (
    <>
      <Helmet>
        <link rel="alternate" type="application/rss+xml" title="Two Steps AI Blog" href={`${siteUrl}/blog.xml`} />
      </Helmet>
      <main className="relative min-h-screen w-full flex-1">
        <section className="pb-12 md:pb-16" style={{ paddingTop: 'calc(var(--header-height) + 4rem)' }}>
          <div className="ts-container flex flex-col gap-6">
            <m.p {...enter(0)} className="ts-eyebrow">
              Writing
            </m.p>
            <SplitText
              as="h1"
              mode="enter"
              delay={0.1}
              stagger={0.08}
              className="ts-display m-0 max-w-[13ch] text-ink"
              segments={[{ text: 'Field' }, { text: 'notes.', className: 'sig' }]}
            />
            <m.p {...enter(0.3)} className="m-0 max-w-[48ch] text-[clamp(17px,1.4vw,19px)] leading-[1.6] text-muted">
              Essays on building custom AI — scope, delivery, and what holds up once the demo is over.
            </m.p>
          </div>
        </section>

        <section className="border-t border-line pb-[clamp(64px,9vw,112px)] pt-[clamp(32px,5vw,56px)]">
          <div className="ts-container">
            {posts.length === 0 ? (
              <p className="py-16 m-0 text-muted">No posts yet.</p>
            ) : (
              <BlogIndexTable posts={posts} />
            )}
          </div>
        </section>

        <Scrub as="section" y={24} className="ts-container pb-6 pt-4">
          <CaseStudyClosingCta embedded />
        </Scrub>
      </main>
    </>
  );
};

export default Blog;
