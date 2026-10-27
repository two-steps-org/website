import type { FC } from 'react';
import { Helmet } from 'react-helmet-async';
import { CASE_STUDY_META } from './CaseStudies/seoMeta';
import { services } from '../data/services';
import { useLocation, type Location as RouterLocation } from 'react-router-dom';
import {
  DEFAULT_SITE_URL,
  getRobotsDirective,
  normalizeUrl,
  parseSeoEnv,
} from '../lib/seoConstants';

interface HeadProps {
  location?: RouterLocation;
}

const SITE_NAME = 'Two Steps AI';
const SOCIAL_HANDLE = '@twostepsai';
const SEO_ENV = parseSeoEnv(
  import.meta.env.VITE_SEO_ENV,
  import.meta.env.MODE === 'production' ? 'production' : 'development',
);
const IS_PRODUCTION_SEO = SEO_ENV === 'production';
const SITE_URL = normalizeUrl(import.meta.env.VITE_SITE_URL?.trim() || DEFAULT_SITE_URL);
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
        'Two Steps is an AI studio building custom systems for companies with a standard to protect. Delivered for EY and Bulthaup.',
      type: 'WebPage',
    },
    '/services': {
      title: 'Services - Two Steps AI',
      description:
        'AI chat agents, AI voice agents, custom CRM development and custom SaaS. Four services from one in-house team, built around your process.',
      type: 'CollectionPage',
    },
    '/about': {
      title: 'About - Two Steps AI',
      description:
        'Meet the Two Steps team and see how we work: custom AI solutions built for your business, integrated with your tools, and secure by design.',
      type: 'AboutPage',
    },
    '/case-studies': {
      title: 'Our Work - Two Steps AI',
      description:
        'See our work: live AI systems running in production, and how they changed the businesses they were built for.',
      type: 'CollectionPage',
    },
    '/blog': {
      title: 'Blog - Two Steps AI',
      description:
        'Notes from the Two Steps studio on custom AI, delivery, and systems built to a standard.',
      type: 'CollectionPage',
    },
  };

  const serviceMatch = /^\/services\/(.+)$/.exec(path);
  const service = serviceMatch && services.find((entry) => entry.id === serviceMatch[1]);
  if (service) {
    return { title: `${service.title} - Two Steps AI`, description: service.description, type: 'Service' };
  }

  const caseStudyMatch = /^\/case-studies\/(.+)$/.exec(path);
  if (caseStudyMatch) {
    const study = CASE_STUDY_META[caseStudyMatch[1]];
    if (study) {
      return {
        title: `${study.title} - Two Steps AI`,
        description: study.description,
        type: 'WebPage',
      };
    }
  }

  return pages[path] || pages['/'];
};

const Head: FC<HeadProps> = ({ location }) => {
  const hookLocation = useLocation();
  const currentLocation = location || hookLocation;
  const path = normalizePathname(currentLocation.pathname);
  const { title, description } = getPageMetadata(path);
  const canonicalUrl = `${SITE_URL}${path}`;
  const robotsDirective = getRobotsDirective(IS_PRODUCTION_SEO);

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
    </Helmet>
  );
};

export default Head;
