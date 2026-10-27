import { Helmet } from 'react-helmet-async';
import type { BlogPost } from '../../lib/blog/types';
import { getBlogSeo } from '../../lib/blog/posts';
import {
  DEFAULT_SITE_URL,
  getRobotsDirective,
  normalizeUrl,
  parseSeoEnv,
} from '../../lib/seoConstants';

const SITE_NAME = 'Two Steps AI';
const SOCIAL_HANDLE = '@twostepsai';
const SEO_ENV = parseSeoEnv(
  import.meta.env.VITE_SEO_ENV,
  import.meta.env.MODE === 'production' ? 'production' : 'development',
);
const IS_PRODUCTION_SEO = SEO_ENV === 'production';
const SITE_URL = normalizeUrl(import.meta.env.VITE_SITE_URL?.trim() || DEFAULT_SITE_URL);
const DEFAULT_OG_IMAGE = `${SITE_URL}/Icon - Two Steps.png`;

type BlogPostHeadProps = {
  post: BlogPost;
};

export function BlogPostHead({ post }: BlogPostHeadProps) {
  const { title, description } = getBlogSeo(post);
  const pageTitle = `${title} - Two Steps AI`;
  const canonicalUrl = `${SITE_URL}/blog/${post.slug}`;
  const ogImage = post.coverImage
    ? post.coverImage.startsWith('http')
      ? post.coverImage
      : `${SITE_URL}${post.coverImage}`
    : DEFAULT_OG_IMAGE;
  const published = post.publishedAt ? `${post.publishedAt}T12:00:00.000Z` : undefined;
  const robotsDirective = getRobotsDirective(IS_PRODUCTION_SEO);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        headline: title,
        description,
        url: canonicalUrl,
        datePublished: published,
        dateModified: published,
        author: { '@type': 'Organization', name: post.author || SITE_NAME },
        publisher: {
          '@type': 'Organization',
          name: SITE_NAME,
          logo: { '@type': 'ImageObject', url: DEFAULT_OG_IMAGE },
        },
        image: ogImage,
        mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
          { '@type': 'ListItem', position: 3, name: title, item: canonicalUrl },
        ],
      },
    ],
  };

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content="article" />
      <meta property="og:image" content={ogImage} />
      {published ? <meta property="article:published_time" content={published} /> : null}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:site" content={SOCIAL_HANDLE} />

      <meta name="robots" content={robotsDirective} />
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </Helmet>
  );
}
