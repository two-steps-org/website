import type { FC } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, type Location as RouterLocation } from 'react-router-dom';
import { SITE_URL, getRobotsDirective } from '../lib/seoConfig';

interface HeadProps {
  location?: RouterLocation;
}

const SITE_NAME = 'Two Steps AI';
const SOCIAL_HANDLE = '@two-steps-org';
const DEFAULT_DESCRIPTION = 'Transforming Business Through AI';
const DEFAULT_OG_IMAGE = `${SITE_URL}/Icon - Two Steps.png`;
const normalizePathname = (pathname: string): string => {
  if (!pathname || pathname === '/') return '/';
  return pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
};

const getPageMetadata = (pathname: string) => {
  const path = normalizePathname(pathname);

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
  const normalizedPath = normalizePathname(pathname);
  const pageMetadata = getPageMetadata(normalizedPath);

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
    url: `${SITE_URL}${normalizedPath}`,
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
  const path = normalizePathname(currentLocation.pathname);
  const { title, description } = getPageMetadata(path);
  const canonicalUrl = `${SITE_URL}${path}`;
  const schemas = getJSONLDSchemas(path);
  const robotsDirective = getRobotsDirective();

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
      <meta name="creator" content={SITE_NAME} />
      <meta name="publisher" content={SITE_NAME} />
      <meta
        name="keywords"
        content="AI, business transformation, automation, artificial intelligence, machine learning"
      />
      <meta name="robots" content={robotsDirective} />

      {schemas.map((schema, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
};

export default Head;
