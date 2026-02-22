import type { FC } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, type Location as RouterLocation } from 'react-router-dom';

interface HeadProps {
  location?: RouterLocation;
}

const normalizeUrl = (value: string): string => value.replace(/\/+$/, '');
const runtimeOrigin =
  typeof window !== 'undefined' && window.location?.origin ? window.location.origin : 'https://example.com';
const SITE_URL = normalizeUrl(import.meta.env.VITE_SITE_URL ?? runtimeOrigin);
const SITE_NAME = 'Two Steps AI';
const SOCIAL_HANDLE = '@two-steps-org';
const DEFAULT_DESCRIPTION = 'Transforming Business Through AI';
const DEFAULT_OG_IMAGE = `${SITE_URL}/Icon - Two Steps.png`;

const getPageMetadata = (pathname: string) => {
  const path = pathname === '/' ? '/' : pathname;

  const pages: Record<string, { title: string; description: string; type: string }> = {
    '/': {
      title: 'Two Steps AI',
      description:
        'Two Steps AI - Transforming Business Through AI. We help businesses leverage artificial intelligence to automate processes, improve efficiency, and drive growth.',
      type: 'WebPage',
    },
    '/case-studies': {
      title: 'Case Studies - Two Steps AI',
      description:
        'Explore our AI case studies and see how we help businesses transform their operations with cutting-edge artificial intelligence solutions.',
      type: 'CollectionPage',
    },
  };

  return pages[path] || pages['/'];
};

const getJSONLDSchemas = (pathname: string) => {
  const pageMetadata = getPageMetadata(pathname);

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/Icon - Two Steps.png`,
    description: DEFAULT_DESCRIPTION,
    sameAs: [`https://twitter.com/${SOCIAL_HANDLE.replace('@', '')}`],
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: `${SITE_URL}/Icon - Two Steps.png`,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': pageMetadata.type,
    url: `${SITE_URL}${pathname}`,
    name: pageMetadata.title,
    description: pageMetadata.description,
    inLanguage: 'en-US',
    isPartOf: {
      '@type': 'WebSite',
      name: SITE_NAME,
      url: SITE_URL,
    },
  };

  return [organizationSchema, websiteSchema, webPageSchema];
};

const Head: FC<HeadProps> = ({ location }) => {
  const hookLocation = useLocation();
  const currentLocation = location || hookLocation;
  const { title, description } = getPageMetadata(currentLocation.pathname);
  const canonicalUrl = `${SITE_URL}${currentLocation.pathname}`;
  const schemas = getJSONLDSchemas(currentLocation.pathname);

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={DEFAULT_OG_IMAGE} />
      <meta property="og:locale" content="en_US" />
      <meta property="og:site_name" content={SITE_NAME} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={DEFAULT_OG_IMAGE} />
      <meta name="twitter:site" content={SOCIAL_HANDLE} />
      <meta name="twitter:creator" content={SOCIAL_HANDLE} />

      <meta name="author" content={SITE_NAME} />
      <meta name="publisher" content={SITE_NAME} />
      <meta
        name="keywords"
        content="AI, business transformation, automation, artificial intelligence, machine learning"
      />
      <meta name="robots" content="index,follow" />

      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </Helmet>
  );
};

export default Head;
