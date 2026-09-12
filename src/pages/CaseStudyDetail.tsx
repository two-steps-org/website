'use client';

import React, { useLayoutEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { caseStudies } from '../components/CaseStudies/data';
import {
  CaseStudyAboutSection,
  CaseStudyBuildSection,
  CaseStudyClosingCta,
  CaseStudyDeliveredSection,
  CaseStudyDetailHero,
  CaseStudyFactsRail,
  CaseStudyMoreWorkSection,
  CaseStudyOutcomesSection,
  CaseStudyProblemSection,
  CaseStudyQuoteSection,
} from '../components/CaseStudies/CaseStudyDetailSections';
import { toneCss } from '../components/CaseStudies/tone';
import { BOOK_CALL_URL } from '../data/navItems';

const CaseStudyDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const study = caseStudies.find((entry) => entry.slug === slug);

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [slug]);

  if (!study) return <Navigate to="/case-studies" replace />;

  const ground = toneCss(study.tone);
  const others = caseStudies.filter((entry) => entry.slug !== study.slug).slice(0, 2);

  const facts = [
    { label: 'Client', value: study.client },
    { label: 'Industry', value: study.industry },
    { label: 'Deployed on', value: study.deployedPlatform },
    { label: 'Time frame', value: study.timeframe },
    { label: 'Delivered', value: study.year },
  ].filter((fact): fact is { label: string; value: string } => Boolean(fact.value));

  const handleBookCall = () => {
    window.open(BOOK_CALL_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <main className="flex-1 relative w-full">
      <CaseStudyDetailHero study={study} ground={ground} />
      <CaseStudyFactsRail facts={facts} />
      <CaseStudyAboutSection study={study} />
      <CaseStudyProblemSection study={study} />
      <CaseStudyBuildSection study={study} />
      <CaseStudyDeliveredSection study={study} />
      <CaseStudyOutcomesSection study={study} />
      <CaseStudyQuoteSection study={study} />
      <CaseStudyMoreWorkSection others={others} />
      <CaseStudyClosingCta onBookCall={handleBookCall} />
    </main>
  );
};

export default CaseStudyDetail;
