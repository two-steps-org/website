import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import BentoGrid from './BentoGrid/BentoGrid';
import SplitText from './common/SplitText';
import Scrub from './common/Scrub';
import { services } from '../data/services';

const ServiceSection: React.FC = () => (
  <section id="services" className="ts-section relative border-t border-line">
    <div className="ts-container relative">
      <Scrub y={32} className="mb-8 md:mb-14 lg:mb-16" contentClassName="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="ts-eyebrow mb-4">Our services</p>
          <SplitText as="h2" delay={0.1} className="ts-h2 text-ink m-0 max-w-[16ch]" text="Automate Roles, Not Just Tasks" />
        </div>
        <Link
          to="/services"
          className="inline-flex items-center gap-1.5 text-[15px] font-medium text-muted transition-colors hover:text-ink"
        >
          All services
          <ArrowRight className="h-4 w-4" />
        </Link>
      </Scrub>

      <BentoGrid services={services} />
    </div>
  </section>
);

export default memo(ServiceSection);
