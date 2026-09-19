import React from 'react';
import { Link } from 'react-router-dom';
import { m } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Check } from 'lucide-react';
import CountUp from './CountUp';
import { parseMetric, toneCss } from './tone';
import type { CaseStudy } from './types';
import SplitText from '../common/SplitText';
import Parallax from '../common/Parallax';
import Scrub from '../common/Scrub';
import { blurIn, draw, drawY, enter, enterItem, pop, reveal, revealItem, scaleItem, slide, slideItem, stamp } from '../../utils/motion';

const SECTION = 'max-w-[1240px] mx-auto mobile-safe-px md:px-6';

const SectionHead: React.FC<{ label: string; heading: string }> = ({ label, heading }) => (
  <div className="flex flex-col gap-3">
    <p className="ts-eyebrow">{label}</p>
    <h2 className="ts-h2 text-ink max-w-[14ch] m-0">{heading}</h2>
  </div>
);

const Split: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] gap-6 md:gap-[clamp(32px,5vw,96px)] items-start">
    {children}
  </div>
);

interface CaseStudyDetailHeroProps {
  study: CaseStudy;
  ground: string;
}

export function CaseStudyDetailHero({ study, ground }: CaseStudyDetailHeroProps) {
  return (
    <section
      className="relative isolate overflow-hidden flex flex-col justify-end min-h-[min(88vh,900px)] pb-[clamp(64px,14vh,120px)] mobile-safe-px md:px-6"
      style={{ paddingTop: 'calc(var(--header-height) + 4rem)' }}
    >
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        {/* The ground lags the page as you scroll out of the hero. */}
        <Parallax distance={140} className="absolute inset-0">
          <img
            src={study.image}
            alt=""
            className="w-full h-full object-cover scale-110 blur-[6px]"
          />
        </Parallax>
        <div className="absolute inset-0 opacity-70 mix-blend-multiply" style={{ background: ground }} />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 80% 10%, rgba(255,255,255,0.16), transparent 50%), linear-gradient(to top, rgba(10,10,12,0.92) 0%, rgba(10,10,12,0.45) 45%, rgba(10,10,12,0.2) 100%)',
          }}
        />
      </div>

      <div className="max-w-[1240px] w-full mx-auto flex flex-col gap-[clamp(24px,4vw,44px)]">
        <m.nav {...enter(0)} aria-label="Breadcrumb" className="flex items-center gap-2.5 text-sm text-muted">
          <Link to="/" className="hover:text-ink transition-colors">
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <Link to="/case-studies" className="hover:text-ink transition-colors">
            Work
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-ink">{study.client}</span>
        </m.nav>

        <SplitText
          as="h1"
          mode="enter"
          delay={0.1}
          stagger={0.07}
          className="ts-display text-ink max-w-[14ch] m-0"
          text={study.before ?? study.title}
        />

        <ul className="flex flex-wrap gap-2 list-none m-0 p-0">
          {[study.deployedPlatform, study.industry].map((chip, i) => (
            <m.li
              key={chip}
              {...enterItem(i, 0.7)}
              className="ts-glass inline-flex items-center h-9 px-3.5 rounded-full text-[13px] font-medium text-ink"
            >
              {chip}
            </m.li>
          ))}
        </ul>
      </div>
    </section>
  );
}

interface CaseStudyFactsRailProps {
  facts: Array<{ label: string; value: string }>;
}

export function CaseStudyFactsRail({ facts }: CaseStudyFactsRailProps) {
  return (
    <section className={SECTION}>
      <m.dl
        {...draw()}
        className="grid grid-cols-2 md:grid-cols-[repeat(auto-fit,minmax(150px,1fr))] border-y border-line m-0"
      >
        {facts.map((fact, i) => (
          <m.div
            key={fact.label}
            {...revealItem(i, 0.3)}
            className={`flex flex-col gap-2 py-7 pr-6 ${i === 0 ? '' : 'md:pl-6'} border-line md:border-r last:border-r-0`}
          >
            <dt className="ts-eyebrow">{fact.label}</dt>
            <dd className="m-0 text-base font-medium tracking-[-0.01em] text-ink">{fact.value}</dd>
          </m.div>
        ))}
      </m.dl>
    </section>
  );
}

interface CaseStudyAboutSectionProps {
  study: CaseStudy;
}

export function CaseStudyAboutSection({ study }: CaseStudyAboutSectionProps) {
  return (
    <Scrub as="section" className={`${SECTION} pt-[clamp(80px,9vw,128px)]`}>
      <Split>
        <p className="ts-eyebrow">About the project</p>
        <div className="flex flex-col gap-8">
          <m.p
            {...blurIn(0.1)}
            className="text-[clamp(20px,1.8vw,26px)] leading-[1.4] tracking-[-0.015em] text-ink m-0 max-w-[40ch]"
          >
            {study.description}
          </m.p>
          {study.live && (
            <a
              href={study.live}
              target="_blank"
              rel="noreferrer"
              className="ts-pill-ghost self-start h-12 px-[22px] text-[15px]"
            >
              See it live
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </Split>
    </Scrub>
  );
}

interface CaseStudyProblemSectionProps {
  study: CaseStudy;
}

export function CaseStudyProblemSection({ study }: CaseStudyProblemSectionProps) {
  if (!study.problem && !study.before) return null;

  return (
    <Scrub as="section" className={`${SECTION} pt-[clamp(80px,9vw,128px)]`}>
      <Split>
        <SectionHead label="The problem" heading={study.before ?? 'Where it started.'} />
        {study.problem && (
          <m.p {...blurIn(0.15)} className="text-[18px] leading-[1.6] text-muted m-0 max-w-[52ch]">
            {study.problem}
          </m.p>
        )}
      </Split>
    </Scrub>
  );
}

interface CaseStudyBuildSectionProps {
  study: CaseStudy;
}

export function CaseStudyBuildSection({ study }: CaseStudyBuildSectionProps) {
  return (
    <section className={`${SECTION} pt-[clamp(80px,9vw,128px)]`}>
      <div className="flex flex-col gap-12 md:gap-20">
        <Scrub contentClassName="flex flex-col gap-6">
          <SectionHead label="The build" heading="What we built." />
          <p className="text-[18px] leading-[1.6] text-muted m-0 max-w-[52ch]">{study.solution}</p>
        </Scrub>

        {study.implementation.map((step, index) => (
          <article key={step.title} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] gap-4 md:gap-[clamp(24px,4vw,96px)] items-end">
              <m.span
                {...stamp()}
                className="font-tight text-[clamp(48px,6vw,96px)] font-light tracking-[-0.05em] leading-[0.9] text-line-strong origin-bottom-left"
              >
                {String(index + 1).padStart(2, '0')}
              </m.span>
              <div className="flex flex-col gap-3">
                <m.h3
                  {...slide('right', 0.1)}
                  className="text-[clamp(26px,2.6vw,38px)] font-medium tracking-[-0.03em] leading-[1.1] text-ink m-0"
                >
                  {step.title}
                </m.h3>
                <ul className="list-none m-0 p-0 flex flex-col gap-2">
                  {step.details.map((detail, j) => (
                    <m.li
                      key={detail}
                      {...slideItem('right', j, 0.25)}
                      className="flex items-start gap-3 text-[17px] text-muted"
                    >
                      <span className="mt-2.5 w-1 h-1 rounded-full bg-line-strong shrink-0" />
                      <span>{detail}</span>
                    </m.li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

interface CaseStudyDeliveredSectionProps {
  study: CaseStudy;
}

export function CaseStudyDeliveredSection({ study }: CaseStudyDeliveredSectionProps) {
  if (!study.delivered?.length && !study.stack?.length) return null;

  return (
    <Scrub as="section" className={`${SECTION} pt-[clamp(80px,9vw,128px)]`}>
      <Split>
        <div className="flex flex-col gap-6">
          <SectionHead label="What we delivered" heading="Everything shipped, in production." />
          {study.stack && study.stack.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {study.stack.map((tool, i) => (
                <m.span key={tool} {...pop(i, 0.2)} className="ts-chip">
                  {tool}
                </m.span>
              ))}
            </div>
          )}
        </div>

        {study.delivered && study.delivered.length > 0 && (
          <ul className="list-none m-0 p-0 grid grid-cols-1 md:grid-cols-2 gap-x-8 border-t border-line">
            {study.delivered.map((item, i) => (
              <m.li
                key={item}
                {...slideItem('left', i, 0.15)}
                className="flex gap-3 items-start py-4 border-b border-line text-base text-ink"
              >
                <m.span {...pop(i, 0.35)} className="flex">
                  <Check className="w-3.5 h-3.5 mt-1.5 shrink-0 text-status-success" strokeWidth={2.5} />
                </m.span>
                <span>{item}</span>
              </m.li>
            ))}
          </ul>
        )}
      </Split>
    </Scrub>
  );
}

interface CaseStudyOutcomesSectionProps {
  study: CaseStudy;
}

export function CaseStudyOutcomesSection({ study }: CaseStudyOutcomesSectionProps) {
  const outcomes = Object.entries(study.metrics).map(([label, raw]) => ({
    label,
    raw,
    parsed: parseMetric(raw),
  }));

  return (
    <Scrub as="section" className={`${SECTION} pt-[clamp(80px,9vw,128px)]`}>
      <div className="flex flex-col gap-10">
        <SectionHead label="Outcomes" heading="What changed." />
        <dl className="m-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-px bg-line border border-line rounded-card overflow-hidden">
          {outcomes.map(({ label, raw, parsed }, i) => (
            <m.div
              key={label}
              {...scaleItem(i, 0.15)}
              className="ts-surface border-0 p-7 md:p-9 flex flex-col gap-3.5"
            >
              <dd className="ts-num m-0 text-ink whitespace-nowrap">
                {parsed ? (
                  <CountUp value={parsed.value} prefix={parsed.prefix} suffix={parsed.suffix} />
                ) : (
                  raw
                )}
              </dd>
              <dt className="text-[15px] text-muted border-t border-line pt-3.5">{label}</dt>
            </m.div>
          ))}
        </dl>
      </div>
    </Scrub>
  );
}

interface CaseStudyQuoteSectionProps {
  study: CaseStudy;
}

export function CaseStudyQuoteSection({ study }: CaseStudyQuoteSectionProps) {
  if (!study.quote) return null;

  return (
    <section className={`${SECTION} pt-[clamp(80px,9vw,128px)]`}>
      <figure className="relative m-0 max-w-[960px] flex flex-col gap-8 pl-6 md:pl-10">
        <m.span {...drawY()} aria-hidden="true" className="absolute left-0 top-0 bottom-0 w-px bg-line-strong" />
        <m.blockquote
          {...blurIn(0.2)}
          className="m-0 font-tight font-light text-[clamp(26px,3.2vw,46px)] tracking-[-0.03em] leading-[1.15] text-ink text-balance"
        >
          &ldquo;{study.quote.text}&rdquo;
        </m.blockquote>
        <m.figcaption {...reveal(0.5)} className="text-[15px] text-muted flex gap-1.5 flex-wrap">
          <span className="text-ink font-medium">{study.quote.name}</span>
          <span aria-hidden="true">·</span>
          {study.quote.role}
          <span aria-hidden="true">·</span>
          {study.client}
        </m.figcaption>
      </figure>
    </section>
  );
}

interface CaseStudyMoreWorkSectionProps {
  others: CaseStudy[];
}

export function CaseStudyMoreWorkSection({ others }: CaseStudyMoreWorkSectionProps) {
  return (
    <section className={`${SECTION} pt-[clamp(80px,9vw,128px)]`}>
      <div className="flex flex-col gap-8">
        <m.div {...reveal()} className="flex items-end justify-between gap-6 flex-wrap">
          <h2 className="ts-h2 text-ink m-0">More work</h2>
          <Link
            to="/case-studies"
            className="inline-flex items-center gap-1.5 text-[15px] font-medium text-muted hover:text-ink transition-colors"
          >
            All work
            <ArrowRight className="w-4 h-4" />
          </Link>
        </m.div>

        <ul className="list-none m-0 p-0 grid grid-cols-1 md:grid-cols-2 gap-4">
          {others.map((other, i) => (
            <m.li {...slide(i === 0 ? 'left' : 'right', i * 0.08, 56)} key={other.slug}>
              <Link
                to={`/case-studies/${other.slug}`}
                className="group relative isolate flex flex-col justify-between gap-8 aspect-[16/9] rounded-card overflow-hidden p-7 sm:p-8 transition-transform duration-500 hover:-translate-y-1"
              >
                <img
                  src={other.image}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  className="absolute inset-0 -z-10 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div
                  className="absolute inset-0 -z-10 opacity-70 mix-blend-multiply"
                  style={{ background: toneCss(other.tone) }}
                />
                <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgba(0,0,0,0.82)_0%,rgba(0,0,0,0.35)_42%,rgba(0,0,0,0.08)_68%,transparent_100%)]" />

                <span className="relative z-10 self-start inline-flex items-center h-7 px-3 rounded-full border border-white/20 bg-white/10 text-[11px] font-semibold tracking-[0.1em] uppercase text-white backdrop-blur-md">
                  {other.industry}
                </span>

                <div className="relative z-10 flex items-end justify-between gap-5">
                  <h3 className="text-[clamp(20px,2vw,28px)] font-medium tracking-[-0.03em] leading-[1.12] text-white m-0 max-w-[18ch] [text-shadow:0_2px_18px_rgba(0,0,0,0.55)]">
                    {other.title}
                  </h3>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-md transition-[background-color,color,transform] duration-300 group-hover:border-white group-hover:bg-white group-hover:text-[#0A0A0C] group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                    <ArrowUpRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            </m.li>
          ))}
        </ul>
      </div>
    </section>
  );
}

interface CaseStudyClosingCtaProps {
  onBookCall: () => void;
}

export function CaseStudyClosingCta({ onBookCall }: CaseStudyClosingCtaProps) {
  return (
    <Scrub as="section" y={24} className={`${SECTION} pt-[clamp(80px,9vw,128px)] pb-6`}>
      <div className="rounded-card bg-accent text-accent-fg p-[clamp(40px,8vw,112px)] grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-10 items-end">
        <div>
          <h2 className="ts-display text-[clamp(36px,5.5vw,80px)] max-w-[12ch] m-0">
            Tell us the <em className="sig">vision</em>. We will build it.
          </h2>
          <p className="text-[18px] opacity-75 mt-6 mb-0 max-w-[40ch]">
            One conversation is all it takes to start. No pitch decks, no pressure.
          </p>
        </div>
        <div className="md:justify-self-end">
          <button
            type="button"
            onClick={onBookCall}
            className="ts-pill inline-flex h-14 items-center gap-2 bg-bg px-7 text-base text-ink"
          >
            Book a Call
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Scrub>
  );
}
