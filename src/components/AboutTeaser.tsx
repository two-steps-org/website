import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Section from './common/Section';
import SplitText from './common/SplitText';
import Scrub from './common/Scrub';
import { slides } from './WhyUs';
import { team } from './Team';

/** Home's short version of /about: three of the six points, the faces, one button. */
const AboutTeaser: React.FC = () => (
  <Section id="about" className="border-t border-line">
    <Scrub y={32} className="mb-10 md:mb-14" contentClassName="flex flex-wrap items-end justify-between gap-6">
      <div>
        <p className="ts-eyebrow mb-4">Why us</p>
        <SplitText as="h2" delay={0.1} className="ts-h2 m-0 text-ink" text="What Sets Us Apart" />
      </div>
      <div className="flex items-center gap-4">
        <ul className="m-0 flex list-none p-0" aria-label="The team">
          {team.map((member) => (
            <li key={member.name} className="-ml-2 first:ml-0">
              {/* Plain img: ResponsiveImage wraps in an aspect-ratio box, too big for an avatar. */}
              <img
                src={member.image}
                alt={member.name}
                width={44}
                height={44}
                loading="lazy"
                decoding="async"
                className="h-11 w-11 rounded-full border-2 border-bg object-cover"
              />
            </li>
          ))}
        </ul>
        <Link to="/about" className="ts-pill-ghost h-12 px-6 text-[15px]">
          More about us
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </Scrub>

    <ul className="m-0 grid list-none grid-cols-1 border-t border-line p-0 md:grid-cols-3 md:border-l">
      {slides.slice(0, 3).map((slide, index) => (
        <Scrub as="li" key={slide.number} effect="unfold" delay={index * 0.1} className="border-b border-line md:border-r" contentClassName="flex h-full flex-col gap-4 py-8 md:p-8">
          <span className="font-tight text-[clamp(40px,4vw,56px)] font-light leading-none tracking-[-0.05em] text-muted/40">
            {slide.number}
          </span>
          <h3 className="ts-h3 m-0 text-ink">{slide.headline}</h3>
          <p className="m-0 text-[16px] leading-[1.6] text-muted">{slide.description}</p>
        </Scrub>
      ))}
    </ul>
  </Section>
);

export default AboutTeaser;
