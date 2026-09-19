import React from 'react';
import { Instagram, Linkedin } from './icons/brand-icons';
import Section from './common/Section';
import ResponsiveImage from './common/ResponsiveImage';
import SplitText from './common/SplitText';
import Scrub from './common/Scrub';

const team = [
  {
    name: 'Jonathan Insell',
    role: 'CEO & Founder',
    image: '/Yoni.jpg',
    social: {
      linkedin: 'https://www.linkedin.com/in/jonathan-charles-insell/',
      instagram: 'https://www.instagram.com/twostepsai/',
    },
  },
  {
    name: 'Shay Bushary',
    role: 'Head Developer',
    image: '/Shay.jpeg',
    social: {
      linkedin: 'https://www.linkedin.com/in/shaybushary/',
      instagram: 'https://www.instagram.com/twostepsai/',
    },
  },
  {
    name: 'Ziv Edri',
    role: 'CFO',
    image: '/Ziv.jpeg',
    social: {
      linkedin: 'https://www.linkedin.com/in/ziv-edri/',
      instagram: 'https://www.instagram.com/twostepsai/',
    },
  },
  {
    name: 'Tal Sumroy',
    role: 'Head of Marketing',
    image: '/Tal.jpeg',
    social: {
      linkedin: 'https://www.linkedin.com/in/tal-sumroy/',
      instagram: 'https://www.instagram.com/twostepsai/',
    },
  },
];

const MemberSocialLinks: React.FC<{
  member: (typeof team)[number];
  iconClassName: string;
}> = ({ member, iconClassName }) => (
  <div className="flex space-x-3">
    <a
      href={member.social.linkedin}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Visit ${member.name} on LinkedIn`}
      className="ts-icon-btn touch-manipulation rounded-xl border border-line-strong bg-ink/5 p-2 text-ink hover:bg-ink/10"
    >
      <Linkedin className={iconClassName} aria-hidden />
    </a>
    <a
      href={member.social.instagram}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Visit ${member.name} on Instagram`}
      className="ts-icon-btn touch-manipulation rounded-xl border border-line-strong bg-ink/5 p-2 text-ink hover:bg-ink/10"
    >
      <Instagram className={iconClassName} aria-hidden />
    </a>
  </div>
);

const PortraitCard: React.FC<{ member: (typeof team)[number] }> = ({ member }) => (
  <div className="group relative">
    <div className="relative overflow-hidden rounded-2xl ts-card">
      <div className="relative h-[320px] overflow-hidden md:h-[350px]">
        <ResponsiveImage
          src={member.image}
          alt={member.name}
          className="h-full w-full object-cover brightness-90 transition-[transform,filter] duration-700 group-hover:scale-110 group-hover:brightness-100 group-hover:contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/30 to-transparent" />
      </div>
      <div className="relative -mt-16 p-6">
        <h3 className="ts-h3 mb-2 mt-4 text-ink">{member.name}</h3>
        <p className="mb-4 font-medium text-muted">{member.role}</p>
        <MemberSocialLinks member={member} iconClassName="h-5 w-5 text-ink" />
      </div>
    </div>
  </div>
);

const Team: React.FC = () => {
  return (
    // A light band, so the page's closing run alternates like its opening one.
    <Section id="team" data-theme="light" data-band="light" className="relative z-[1] bg-[#fafafa] text-ink">
      <Scrub y={32} className="relative mb-8 md:mb-16">
        <p className="ts-eyebrow mb-4">The Team</p>
        <SplitText as="h2" delay={0.1} className="ts-h2 mb-6 text-ink" text="We Are Ready To Provide Solutions" />
      </Scrub>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {team.map((member, index) => (
          <Scrub key={member.name} effect="portrait" x={index % 2 === 0 ? -12 : 12} delay={(index % 4) * 0.08}>
            <PortraitCard member={member} />
          </Scrub>
        ))}
      </div>
    </Section>
  );
};

export default Team;
