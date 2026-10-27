import React, { useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import { m } from 'framer-motion';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { caseStudies } from '../components/CaseStudies/data';
import { CaseStudyClosingCta } from '../components/CaseStudies/CaseStudyDetailSections';
import type { CaseStudy } from '../components/CaseStudies/types';
import SplitText from '../components/common/SplitText';
import Scrub from '../components/common/Scrub';
import { enter } from '../utils/motion';
/**
 * The Before/After pair under each entry.
 *
 * Studies that carry explicit before/after copy use it; the rest fall back to
 * their first two metrics, which fit the same two-cell shape and are real data.
 * Nothing is invented to fill the grid.
 */
const EntryFacts: React.FC<{ study: CaseStudy }> = ({ study }) => {
  const pairs: Array<{ label: string; value: string; strong: boolean }> =
    study.before && study.after
      ? [
          { label: 'Before', value: study.before, strong: false },
          { label: 'After', value: study.after, strong: true },
        ]
      : Object.entries(study.metrics)
          .slice(0, 2)
          .map(([label, value]) => ({ label, value, strong: true }));

  if (!pairs.length) return null;

  return (
    <div className="grid grid-cols-2 gap-px bg-line border border-line rounded-nested overflow-hidden">
      {pairs.map((pair) => (
        <div key={pair.label} className="ts-surface border-0 p-4">
          <p className={`ts-eyebrow mb-2 ${pair.strong ? 'text-ink' : ''}`}>{pair.label}</p>
          <p className={`text-[15px] leading-[1.45] m-0 ${pair.strong ? 'text-ink' : 'text-muted'}`}>
            {pair.value}
          </p>
        </div>
      ))}
    </div>
  );
};

const CaseStudies: React.FC = () => {
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, []);

  return (
      <main className="flex-1 relative w-full min-h-screen">
        {/* ── Header ──────────────────────────────────────────────────────── */}
        <section
          className="pb-16"
          style={{ paddingTop: 'calc(var(--header-height) + 4rem)' }}
        >
          <div className="ts-container flex flex-col gap-6">
            <m.p {...enter(0)} className="ts-eyebrow">
              Selected work
            </m.p>
            <SplitText
              as="h1"
              mode="enter"
              delay={0.1}
              stagger={0.08}
              className="ts-display text-ink max-w-[13ch] m-0"
              text="Proof, not promises."
            />
            <m.p {...enter(0.3)} className="text-[clamp(17px,1.4vw,19px)] text-muted max-w-[48ch] m-0">
              Real systems, live right now. Every project below is running in production.
            </m.p>
          </div>
        </section>

        {/* ── Entries: image and text swap sides down the list ────────────── */}
        <section className="border-t border-line">
          <div className="ts-container flex flex-col">
            {caseStudies.map((study, index) => {
              const imageFirst = index % 2 === 0;
              const revealX = imageFirst ? -48 : 48;

              return (
                <article
                  key={study.title}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center py-[clamp(48px,7vw,96px)] border-b border-line"
                >
                  <Scrub
                    x={revealX}
                    y={0}
                    contentClassName="flex items-start justify-between p-6"
                    className={`relative aspect-[4/3] rounded-card overflow-hidden isolate ${
                      imageFirst ? 'lg:order-1' : 'lg:order-2'
                    }`}
                  >
                    <img
                      src={study.image}
                      alt=""
                      aria-hidden="true"
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover"
                    />

                    <span
                      className="relative inline-flex items-center h-6 px-2.5 rounded-full bg-[#F5F6F8] text-[#0A0A0C] text-[11px] font-semibold tracking-[0.08em]"
                    >
                      {study.industry}
                    </span>
                  </Scrub>

                  <Scrub
                    x={revealX}
                    y={0}
                    delay={0.05}
                    contentClassName="flex flex-col gap-6"
                    className={`${imageFirst ? 'lg:order-2' : 'lg:order-1'}`}
                  >
                    <p className="text-sm text-muted m-0">{study.client}</p>

                    <h2 className="ts-h2 text-ink max-w-[16ch] m-0">{study.title}</h2>

                    <p className="text-[17px] text-muted max-w-[48ch] m-0">{study.description}</p>

                    <EntryFacts study={study} />

                    <div className="flex gap-6 flex-wrap items-center">
                      <Link
                        to={`/case-studies/${study.slug}`}
                        className="ts-pill h-12 px-6 text-[15px]"
                      >
                        See the project
                        <ArrowRight className="w-4 h-4" />
                      </Link>

                      {study.live && (
                        <a
                          href={study.live}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-[15px] font-medium text-muted underline underline-offset-[5px] decoration-line-strong transition-colors hover:text-ink hover:decoration-current"
                        >
                          See it live
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </Scrub>
                </article>
              );
            })}
          </div>
        </section>

        <CaseStudyClosingCta />
      </main>
  );
};

export default CaseStudies;
