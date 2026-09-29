import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Section from './common/Section';
import SplitText from './common/SplitText';
import Scrub from './common/Scrub';
import { team } from '../data/team';

/** Home's short version of /about: the studio line, the faces, one link. */
const AboutTeaser: React.FC = () => (
  <Section id="about" className="border-t border-line">
    <Scrub y={32} contentClassName="flex flex-wrap items-end justify-between gap-8">
      <div className="flex max-w-[40ch] flex-col gap-4">
        <SplitText
          as="h2"
          delay={0.1}
          className="ts-h2 m-0 text-ink"
          text="A small studio in Tel Aviv, working worldwide."
        />
        <p className="m-0 text-[17px] leading-[1.6] text-muted">
          You work with the people who build it. That's the whole model, and it's why EY and Bulthaup called.
        </p>
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
          About the studio
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </Scrub>
  </Section>
);

export default AboutTeaser;
