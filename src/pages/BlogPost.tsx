import React, { useLayoutEffect, useMemo } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { m } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { BlogPostHead } from '../components/Blog/BlogPostHead';
import { BlogPostHero } from '../components/Blog/BlogPostHero';
import { BlogMorePostsSection } from '../components/Blog/BlogMorePostsSection';
import { CaseStudyClosingCta, CaseStudyFactsRail } from '../components/CaseStudies/CaseStudyDetailSections';
import Scrub from '../components/common/Scrub';
import { formatBlogDate } from '../lib/blog/formatBlogDate';
import { getBlogPostBySlug, getPublishedBlogPosts } from '../lib/blog/posts';
import { blurIn } from '../utils/motion';

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getBlogPostBySlug(slug) : undefined;
  const isPublished = post && !post.draft;

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [slug]);

  const markdownComponents = useMemo(
    () => ({
      img: ({ src, alt }: { src?: string; alt?: string }) =>
        src ? (
          <figure className="blog-prose-figure">
            <img src={src} alt={alt ?? ''} loading="lazy" decoding="async" />
            {alt ? <figcaption>{alt}</figcaption> : null}
          </figure>
        ) : null,
    }),
    [],
  );

  if (!isPublished || !post) {
    return <Navigate to="/blog" replace />;
  }

  const date = formatBlogDate(post.publishedAt);
  const facts = [
    { label: 'Published', value: date.long },
    { label: 'Read time', value: `${post.readingTimeMinutes} min` },
    ...(post.author ? [{ label: 'Author', value: post.author }] : []),
  ];

  const others = getPublishedBlogPosts()
    .filter((entry) => entry.slug !== post.slug)
    .slice(0, 2);

  return (
    <>
      <BlogPostHead post={post} />
      <main className="relative w-full flex-1">
        <BlogPostHero post={post} />
        <CaseStudyFactsRail facts={facts} />

        <Scrub as="section" className="ts-container pt-[clamp(64px,8vw,112px)] pb-[clamp(64px,10vw,120px)]">
          <m.div {...blurIn(0.08)} className="mx-auto max-w-[65ch] ts-prose ts-prose-article">
            <ReactMarkdown components={markdownComponents}>{post.body}</ReactMarkdown>
          </m.div>
        </Scrub>

        <BlogMorePostsSection posts={others} />
        <Scrub as="section" y={24} className="ts-container pb-6 pt-2">
          <CaseStudyClosingCta embedded />
        </Scrub>
      </main>
    </>
  );
};

export default BlogPost;
