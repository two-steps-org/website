import React from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { m } from 'framer-motion';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { services } from '../data/services';
import { caseStudies } from '../components/CaseStudies/data';
import { useBookCall } from '../components/BookCall/useBookCall';
import {
  CaseStudyClosingCta,
  CaseStudyMoreWorkSection,
  SectionHead,
  Split,
} from '../components/CaseStudies/CaseStudyDetailSections';
import { SERVICE_CARDS } from '../components/BentoGrid/serviceCards';
import SplitText from '../components/common/SplitText';
import Scrub from '../components/common/Scrub';
import { enter, slideItem } from '../utils/motion';
import { usePageScrollReset } from '../utils/scroll';

const SECTION = 'ts-container pt-[clamp(80px,9vw,128px)]';

const BulletList: React.FC<{ items: readonly string[] }> = ({ items }) => (
  <ul className="m-0 flex list-none flex-col gap-3 p-0">
    {items.map((item, index) => (
      <m.li key={item} {...slideItem('right', index, 0.1)} className="flex items-start gap-3 text-[18px] leading-[1.5] text-ink">
        <span className="mt-3 h-1 w-1 shrink-0 rounded-full bg-line-strong" />
        <span>{item}</span>
      </m.li>
    ))}
  </ul>
);

const ServiceDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { open } = useBookCall();
  const service = services.find((entry) => entry.id === slug);

  usePageScrollReset();

  if (!service) return <Navigate to="/services" replace />;

  const Card = SERVICE_CARDS[service.id];
  const work = caseStudies.filter((study) => study.service === service.id);
  const others = services.filter((entry) => entry.id !== service.id);
  const { details } = service;

  return (
    <main className="relative w-full flex-1">
      <section style={{ paddingTop: 'calc(var(--header-height) + 4rem)' }}>
        <div className="ts-container flex flex-col gap-6">
          <m.nav {...enter(0)} aria-label="Breadcrumb" className="ts-eyebrow flex items-center gap-2">
            <Link to="/services" className="transition-colors hover:text-ink">
              Services
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-ink">{service.title}</span>
          </m.nav>
          <h2 className="ts-eyebrow m-0">{service.title}</h2>
          <SplitText as="h1" mode="enter" delay={0.1} stagger={0.08} className="ts-display m-0 max-w-[22ch] text-ink" text={service.headline} />
          <m.p {...enter(0.3)} className="m-0 max-w-[48ch] text-[clamp(17px,1.4vw,19px)] text-muted">
            {service.description}
          </m.p>
          <m.div {...enter(0.4)} className="flex flex-wrap gap-3 pt-2">
            <button type="button" onClick={open} className="ts-pill h-14 px-7 text-base">
              Start a conversation
              <ArrowRight className="h-4 w-4" />
            </button>
            {work.length > 0 && (
              <a href="#work" className="ts-pill-ghost h-14 px-7 text-base">
                See the work
              </a>
            )}
          </m.div>
        </div>
      </section>

      {/* The service's own card, large. Its internal animation belongs here. */}
      {Card && (
        <section className="ts-container pt-[clamp(48px,6vw,80px)]">
          <Scrub effect="assemble" className="h-[clamp(300px,38vw,520px)]" contentClassName="h-full">
            <Card title={service.title} className="h-full" />
          </Scrub>
        </section>
      )}

      {details.extendedDescription && (
        <Scrub as="section" className={SECTION}>
          <Split>
            <SectionHead label="The service" heading="What it is." />
            <p className="m-0 max-w-[52ch] text-[18px] leading-[1.6] text-muted">{details.extendedDescription}</p>
          </Split>
        </Scrub>
      )}

      <section className={SECTION}>
        <Split>
          <Scrub>
            <SectionHead label="Included" heading="What you get." />
          </Scrub>
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
            <BulletList items={details.features} />
            <div className="flex flex-col gap-4">
              <p className="ts-eyebrow m-0">What it changes</p>
              <BulletList items={details.benefits} />
            </div>
          </div>
        </Split>
      </section>

      <Scrub as="section" className={SECTION}>
        <Split>
          <SectionHead label="Fit" heading="Who it is for." />
          <p className="m-0 max-w-[40ch] text-[clamp(20px,1.8vw,26px)] leading-[1.4] tracking-[-0.015em] text-ink">
            {details.useCase}
          </p>
        </Split>
      </Scrub>

      {work.length > 0 && (
        <div id="work" className="scroll-mt-[var(--header-height)]">
          <CaseStudyMoreWorkSection others={work} heading="Related work" />
        </div>
      )}

      <section className={SECTION}>
        <Scrub className="mb-8">
          <h2 className="ts-h2 m-0 text-ink">Other services</h2>
        </Scrub>
        <ul className="m-0 grid list-none grid-cols-1 border-t border-line p-0 md:grid-cols-3 md:border-l">
          {others.map((other) => (
            <li key={other.id} className="border-b border-line md:border-r">
              <Link to={`/services/${other.id}`} className="group flex h-full flex-col gap-3 py-7 md:p-7">
                <span className="flex items-center justify-between gap-4">
                  <span className="ts-h3 text-ink">{other.title}</span>
                  <ArrowUpRight className="h-5 w-5 shrink-0 text-muted transition-[color,transform] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink" />
                </span>
                <span className="text-[15px] leading-[1.5] text-muted">{other.description}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <CaseStudyClosingCta />
    </main>
  );
};

export default ServiceDetail;
