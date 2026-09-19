import React from 'react';
import { Link } from 'react-router-dom';
import { m } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { services } from '../data/services';
import { BOOK_CALL_URL } from '../data/navItems';
import { SERVICE_CARDS } from '../components/BentoGrid/BentoGrid';
import { CaseStudyClosingCta } from '../components/CaseStudies/CaseStudyDetailSections';
import Process from '../components/Process';
import SplitText from '../components/common/SplitText';
import Scrub from '../components/common/Scrub';
import { enter } from '../utils/motion';
import { usePageScrollReset } from '../utils/scroll';

const handleBookCall = () => {
  window.open(BOOK_CALL_URL, '_blank', 'noopener,noreferrer');
};

const Services: React.FC = () => {
  usePageScrollReset();

  return (
    <main className="relative w-full flex-1">
      <section className="pb-16" style={{ paddingTop: 'calc(var(--header-height) + 4rem)' }}>
        <div className="ts-container flex flex-col gap-6">
          <m.p {...enter(0)} className="ts-eyebrow">
            Services
          </m.p>
          <SplitText as="h1" mode="enter" delay={0.1} stagger={0.08} className="ts-display m-0 max-w-[14ch] text-ink" text="Automate roles, not just tasks." />
          <m.p {...enter(0.3)} className="m-0 max-w-[48ch] text-[clamp(17px,1.4vw,19px)] text-muted">
            Four services, one in-house team. Each is built around your process and shipped into the tools you already use.
          </m.p>
        </div>
      </section>

      {/* Rows alternate sides, so their headings are off the logo line by design. */}
      <section data-layout="free" className="border-t border-line">
        <div className="ts-container flex flex-col">
          {services.map((service, index) => {
            const Card = SERVICE_CARDS[service.id];
            const flip = index % 2 === 1;
            return (
              <article
                key={service.id}
                className="grid grid-cols-1 items-center gap-8 border-b border-line py-[clamp(48px,7vw,96px)] lg:grid-cols-2 lg:gap-16"
              >
                <Scrub effect="assemble" x={flip ? 72 : -72} className={`h-[clamp(260px,30vw,400px)] ${flip ? 'lg:order-2' : ''}`} contentClassName="h-full">
                  <Link to={`/services/${service.id}`} aria-label={service.title} className="block h-full">
                    {Card && <Card title={service.title} className="h-full" />}
                  </Link>
                </Scrub>

                <Scrub x={flip ? -28 : 28} y={20} contentClassName="flex flex-col gap-5">
                  <p className="ts-eyebrow m-0">{String(index + 1).padStart(2, '0')}</p>
                  <h2 className="ts-h2 m-0 text-ink">{service.title}</h2>
                  <p className="m-0 max-w-[48ch] text-[17px] leading-[1.6] text-muted">{service.description}</p>
                  <ul className="m-0 flex list-none flex-col gap-2 p-0">
                    {service.details.features.slice(0, 3).map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-[16px] text-ink">
                        <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-line-strong" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    to={`/services/${service.id}`}
                    className="ts-pill-ghost mt-2 h-12 self-start px-6 text-[15px]"
                  >
                    Explore {service.title}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Scrub>
              </article>
            );
          })}
        </div>
      </section>

      <Process />

      <CaseStudyClosingCta onBookCall={handleBookCall} />
    </main>
  );
};

export default Services;
