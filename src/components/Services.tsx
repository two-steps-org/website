import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SplitText from './common/SplitText';
import Scrub from './common/Scrub';
import { capabilities } from '../data/capabilities';

const ServiceSection: React.FC = () => (
  <section id="services" className="ts-section relative border-t border-line">
    <div className="ts-container relative">
      <Scrub y={32} className="mb-8 md:mb-14 lg:mb-16" contentClassName="flex flex-wrap items-end justify-between gap-6">
        <SplitText as="h2" delay={0.1} className="ts-h2 text-ink m-0 max-w-[16ch]" text="What we build" />
        <Link
          to="/services"
          className="inline-flex items-center gap-1.5 text-[15px] font-medium text-muted transition-colors hover:text-ink"
        >
          All services
          <ArrowRight className="h-4 w-4" />
        </Link>
      </Scrub>

      <div className="flex flex-col border-t border-line">
        {capabilities.map((capability) => (
          <article key={capability.title} className="flex flex-col gap-3 border-b border-line py-8 md:py-10">
            <h3 className="ts-h3 m-0 text-ink">{capability.title}</h3>
            <p className="m-0 max-w-[52ch] text-[17px] leading-[1.6] text-muted">{capability.body}</p>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default memo(ServiceSection);
